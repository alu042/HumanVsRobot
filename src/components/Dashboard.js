import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please try again later.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div>Loading dashboard...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      {dashboardData && (
        <div>
          <p>Total Users: {dashboardData.userCount}</p>
          <p>Total Responses: {dashboardData.total_responses}</p>
          <p>Average Response Time: {dashboardData.avg_response_time.toFixed(2)} seconds</p>
          <p>Average Knowledge Rating: {dashboardData.avg_knowledge.toFixed(2)}</p>
          <p>Average Helpfulness Rating: {dashboardData.avg_helpfulness.toFixed(2)}</p>
          <p>Average Empathy Rating: {dashboardData.avg_empathy.toFixed(2)}</p>
          <p>Last Updated: {new Date(dashboardData.last_updated).toLocaleString()}</p>
        </div>
      )}
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default Dashboard;
