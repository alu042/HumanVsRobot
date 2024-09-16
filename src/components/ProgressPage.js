import React from 'react';
import { useNavigate } from 'react-router-dom';

const ProgressPage = () => {
  const navigate = useNavigate();

  const handleRestart = () => {
    navigate('/');
  };

  return (
    <div className="progress-page">
      <h1>Takk for at du tok deg tid!</h1>
      <p>Dine svar er registrert.</p>
      <button onClick={handleRestart}>Ta undersøkelsen på nytt</button>
    </div>
  );
};

export default ProgressPage;