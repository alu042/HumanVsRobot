import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

const LandingPage = () => {
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);

  const handleAgeGroupChange = (e) => {
    setAgeGroup(e.target.value);
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted', { ageGroup, gender });
    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageGroup, gender }),
      });
      const data = await response.json();
      setUserData({ userId: data.userId, ageGroup, gender });
      navigate('/question');
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <div className="landing-page">
      <h1>Velkommen!</h1>
      <p>
    Spørreundersøkelsen samler inn dine vurderinger av svar på hvert spørsmål. 
    Du gir dine vurderinger i henhold til tre kriterier: kunnskap, hjelpsomhet og empati.
  </p>

      <p>
        Hva vi er ute etter. 
        Hvem står bak undersø
      </p>

      <p>
        Til undersøkelsen trenger vi litt informasjon om deg.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="ageGroup">Aldersgruppe:</label>
          <select id="ageGroup" value={ageGroup} onChange={handleAgeGroupChange} required>
            <option value="">Din aldersgruppe</option>
            <option value="18-25">18-25</option>
            <option value="26-35">26-35</option>
            <option value="36-45">36-45</option>
            <option value="46-60">46-60</option>
            <option value="60+">60+</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="gender">Kjønn:</label>
          <select id="gender" value={gender} onChange={handleGenderChange} required>
            <option value="">Ditt kjønn</option>
            <option value="male">Mann</option>
            <option value="female">Kvinne</option>
            <option value="other">Annet</option>
            <option value="prefer-not-to-say">Ønsker ikke å oppgi kjønn</option>
          </select>
        </div>
        <div className="instructions">
          <h2>Hvordan fungerer undersøkelsen?</h2>
          <p>
            Du vil bli presentert med en serie spørsmål. For hvert spørsmål vil du se to
            mulige svar. Vurder hvert svar ut fra tre kriterier:
          </p>
          <ul>
            <li>Kunnskap: Hvor kunnskapsrikt er svaret?</li>
            <li>Hjelpsomhet: Hvor hjelpsomt er svaret?</li>
            <li>Empati: Hvor godt svaret tar hensyn til de emosjonelle eller 
              menneskelige aspektene i spørsmålet?</li>
          </ul>
          <p>
            Bruk den tilhørende vurderingsskalaen for hvert kriterium. 
            Du kan også gi tilbakemelding på hvert spørsmål hvis du ønsker det.
          </p>
        </div>
        <button type="submit" className="start-button">Start</button>
      </form>
    </div>
  );
};

export default LandingPage;