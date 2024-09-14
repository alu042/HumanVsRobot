import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();

  const handleAgeGroupChange = (e) => {
    setAgeGroup(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted', { ageGroup, gender });
    // Here you might want to save the user data or perform any other necessary actions
    navigate('/question', { state: { ageGroup, gender } });
  };

  return (
    <div className="landing-page">
      <h1>Welcome to the Survey</h1>
      <p>This survey collects user ratings on various questions, comparing two different answers based on three criteria: knowledge, correctness, and empathy.</p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ageGroup">Age Group:</label>
          <select id="ageGroup" value={ageGroup} onChange={handleAgeGroupChange} required>
            <option value="">Select Age Group</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46-60">46-60</option>
            <option value="60+">60+</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="gender">Gender:</label>
          <select id="gender" value={gender} onChange={handleGenderChange} required>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        <div className="instructions">
          <h2>How the Rating Process Works</h2>
          <p>You will be presented with a series of questions. For each question, you will see two different answers. Rate each answer based on three criteria:</p>
          <ul>
            <li>Knowledge: How well-informed does the answer seem?</li>
            <li>Correctness: How accurate and factual is the answer?</li>
            <li>Empathy: How well does the answer address the emotional or human aspect of the question?</li>
          </ul>
          <p>Use the provided rating scale for each criterion. You can also provide additional comments or feedback if you wish.</p>
        </div>
        <button type="submit" className="start-button">Start Survey</button>
      </form>
    </div>
  );
};

export default LandingPage;