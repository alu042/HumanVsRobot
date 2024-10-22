import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Dashboard = ({ setIsAuthenticated }) => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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

  const handleLogout = () => {
    setIsAuthenticated(false);
    navigate('/dashboard-login');
  };

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
          <p>Total Users: {dashboardData.userCount || 'N/A'}</p>
          <p>Total Responses: {dashboardData.total_responses || 'N/A'}</p>
          {dashboardData.avg_response_time !== undefined && (
            <p>Average Response Time: {dashboardData.avg_response_time.toFixed(2)} seconds</p>
          )}
          {dashboardData.avg_knowledge !== undefined && (
            <p>Average Knowledge Rating: {dashboardData.avg_knowledge.toFixed(2)}</p>
          )}
          {dashboardData.avg_helpfulness !== undefined && (
            <p>Average Helpfulness Rating: {dashboardData.avg_helpfulness.toFixed(2)}</p>
          )}
          {dashboardData.avg_empathy !== undefined && (
            <p>Average Empathy Rating: {dashboardData.avg_empathy.toFixed(2)}</p>
          )}
          {dashboardData.last_updated && (
            <p>Last Updated: {new Date(dashboardData.last_updated).toLocaleString()}</p>
          )}
        </div>
      )}
      <button onClick={handleLogout}>Logout</button>
      <br />
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default Dashboard;
