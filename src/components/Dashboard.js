import React, { useState, useEffect } from 'react';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [wsConnected, setWsConnected] = useState(false);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const response = await fetch('/api/dashboard-stats');
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText} - ${text}`);
        }
        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchDashboardStats();

    // Set up WebSocket connection
    const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const ws = new WebSocket(`${wsProtocol}://${window.location.host}/ws`);

    ws.onopen = () => {
      console.log('WebSocket connected');
      setWsConnected(true);
    };

    ws.onmessage = (event) => {
      const newStats = JSON.parse(event.data);
      setStats(newStats);
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setWsConnected(false);
    };

    // Clean up WebSocket connection on component unmount
    return () => {
      ws.close();
    };
  }, []);

  if (!stats) {
    return <div>Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <h1>Real-time Dashboard</h1>
      <div className="connection-status">
        WebSocket Status: {wsConnected ? 'Connected' : 'Disconnected'}
      </div>
      <div className="stats">
        <p>Total Responses: {stats.total_responses}</p>
        <p>Average Response Time: {stats.avg_response_time.toFixed(2)} ms</p>
        <p>Average Knowledge Rating: {stats.avg_knowledge.toFixed(2)}</p>
        <p>Average Helpfulness Rating: {stats.avg_helpfulness.toFixed(2)}</p>
        <p>Average Empathy Rating: {stats.avg_empathy.toFixed(2)}</p>
        <p>Last Updated: {new Date(stats.last_updated).toLocaleString()}</p>
      </div>
    </div>
  );
}

export default Dashboard;