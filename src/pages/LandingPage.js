import React, { useState } from 'react';

const LandingPage = () => {
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');

  const handleAgeGroupChange = (e) => {
    setAgeGroup(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
  };

  return (
    <div>
      <h1>Welcome to the Survey</h1>
      <p>The purpose of this survey is to collect user ratings on various questions, comparing two different answers based on three criteria: accuracy, comprehensiveness, and clarity.</p>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Age Group:</label>
          <select value={ageGroup} onChange={handleAgeGroupChange}>
            <option value="">Select Age Group</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46-60">46-60</option>
            <option value="60+">60+</option>
          </select>
        </div>
        <div>
          <label>Gender:</label>
          <select value={gender} onChange={handleGenderChange}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
        <div>
          <h2>How the Rating Process Works</h2>
          <p>You will be presented with a series of questions. For each question, you will see two different answers. You need to rate each answer based on three criteria: accuracy, comprehensiveness, and clarity. Use the provided rating scale to give your ratings. Optionally, you can provide additional comments or feedback.</p>
        </div>
        <button type="submit">Start Survey</button>
      </form>
    </div>
  );
};

export default LandingPage;
