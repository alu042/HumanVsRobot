import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProgressPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userData, responses } = location.state || {};

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="progress-page">
      <h1>Survey Complete</h1>
      <p>Thank you for completing the survey!</p>
      {/* Display user data and responses if needed */}
      <button onClick={handleRestart}>Restart Survey</button>
    </div>
  );
};

export default ProgressPage;