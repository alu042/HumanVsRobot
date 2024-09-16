import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [healthcareProfessionalType, setHealthcareProfessionalType] = useState('');
  const [previousParticipation, setPreviousParticipation] = useState(null);

  const handleStart = async () => {
    if (!ageGroup || !gender || !healthcareProfessionalType || previousParticipation === null) {
      alert('Vennligst fyll ut alle feltene før du starter.');
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageGroup, gender, healthcareProfessionalType, previousParticipation }),
      });
      const data = await response.json();
      setUserData({ userId: data.userId });
      navigate('/question');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="landing-page">
      <h1>Velkommen til undersøkelsen</h1>
      <div className="form-group">
        <label htmlFor="ageGroup">Aldersgruppe:</label>
        <select id="ageGroup" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
          <option value="">Velg aldersgruppe</option>
          <option value="18-24">18-24</option>
          <option value="25-34">25-34</option>
          <option value="35-44">35-44</option>
          <option value="45-54">45-54</option>
          <option value="55+">55+</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="gender">Kjønn:</label>
        <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
          <option value="">Velg kjønn</option>
          <option value="male">Mann</option>
          <option value="female">Kvinne</option>
          <option value="other">Annet</option>
        </select>
      </div>
      <div className="form-group">
        <label htmlFor="healthcareProfessionalType">Type helsepersonell:</label>
        <select id="healthcareProfessionalType" value={healthcareProfessionalType} onChange={(e) => setHealthcareProfessionalType(e.target.value)}>
          <option value="">Velg type helsepersonell</option>
          <option value="lege">Lege</option>
          <option value="medisinerstudent">Medisinerstudent</option>
          <option value="medisinerstudent_lisens">Medisinerstudent med lisens</option>
          <option value="sykepleier">Sykepleier</option>
          <option value="annet">Annet</option>
        </select>
      </div>
      <div className="form-group">
        <label>Jeg har svart på denne undersøkelsen tidligere:</label>
        <div>
          <label>
            <input
              type="radio"
              name="previousParticipation"
              value="yes"
              checked={previousParticipation === true}
              onChange={() => setPreviousParticipation(true)}
            /> Ja
          </label>
          <label>
            <input
              type="radio"
              name="previousParticipation"
              value="no"
              checked={previousParticipation === false}
              onChange={() => setPreviousParticipation(false)}
            /> Nei
          </label>
        </div>
      </div>
      <button className="start-button" onClick={handleStart}>Start undersøkelsen</button>
    </div>
  );
};

export default LandingPage;