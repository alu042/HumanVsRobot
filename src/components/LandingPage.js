import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import UserContext from './UserContext';

const LandingPage = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const [ageGroup, setAgeGroup] = useState('');
  const [gender, setGender] = useState('');
  const [isHealthcarePersonnel, setIsHealthcarePersonnel] = useState('');
  const [healthcareProfessionalType, setHealthcareProfessionalType] = useState('');
  const [hasDiabetes, setHasDiabetes] = useState('');
  const [educationLevel, setEducationLevel] = useState('');
  const [previousParticipation, setPreviousParticipation] = useState(null);

  const handleStart = async () => {
    if (!ageGroup || !gender || !isHealthcarePersonnel || !hasDiabetes || !educationLevel || previousParticipation === null) {
      alert('Vennligst fyll ut alle påkrevde felt før du starter.');
      return;
    }
  
    try {
      const response = await fetch('/api/start-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          ageGroup, 
          gender, 
          isHealthcarePersonnel, 
          healthcareProfessionalType, 
          hasDiabetes,
          educationLevel,
          previousParticipation 
        }),
      });

      const data = await response.json();
      setUserData({ userId: data.userId, sessionId: data.sessionId });
      navigate('/question');
    } catch (error) {
      console.error('Error starting session:', error);
      alert('Det oppstod en feil ved start av undersøkelsen. Vennligst prøv igjen senere.');
    }
  };

  return (
    <div className="landing-page">
      <h1>Velkommen til DiaGuideLLM!</h1>
      <p>En undersøkelse av kunstig intelligens brukt i helseveiledning til personer med diabetes.</p>
      
      <div className="landing-content">
        <section className="survey-info">
          <h2>Om undersøkelsen</h2>
          <p>Undersøkelsen tar omtrent 10 minutter å fullføre.</p>
          <p>Denne undersøkelsen handler om å vurdere svar på medisinske spørsmål. Du vil bli presentert for 10 spørsmål der du skal vurdere kvaliteten på svarene som er gitt av helsepersonell eller en KI-basert modell.</p>
          <p>Vi ønsker at du skal vurdere følgende aspekter i svarene:</p>
          <ul>
            <li><strong>Kunnskap:</strong> Vurder nøyaktigheten og relevansen av informasjonen som gis i svaret.</li>
            <li><strong>Hjelpsomhet:</strong> Evaluer i hvilken grad svaret gir nyttige og praktiske råd eller støtte som kan hjelpe personen som spør.</li>
            <li><strong>Empati:</strong> Bedøm svarets evne til å vise forståelse for pasientens følelser og bekymringer.</li>
          </ul>
          <p>Dine svar er anonyme og vil bli brukt til forskningsformål. Ved å 
            gjennomføre undersøkelsen samtykker du til at vi lagrer og bruker dine svar til forskningsformål.
          </p>
          <p>Spørsmålene vises i tilfeldig rekkefølge 
            og du får ikke vite om svaret er gitt av en KI-basert modell eller en helsepersonell</p>
          <p>Kontakt oss på <a href="mailto:dia.guide.llm@gmail.com">dia.guide.llm@gmail.com</a> for spørsmål om undersøkelsen.</p>
        </section>

        <section className="user-questions">
          <h2>Informasjon om deg</h2>
          <p>Vennligst fyll ut informasjonen nedenfor før du starter undersøkelsen.</p>
          
          <div className="form-group">
            <label htmlFor="ageGroup">Aldersgruppe:</label>
            <select id="ageGroup" value={ageGroup} onChange={(e) => setAgeGroup(e.target.value)}>
              <option value="">Velg aldersgruppe</option>
              <option value="0-19">0-19</option>
              <option value="20-29">20-29</option>
              <option value="30-39">30-39</option>
              <option value="40-49">40-49</option>
              <option value="50-59">50-59</option>
              <option value="60+">60+</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="gender">Kjønn:</label>
            <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)}>
              <option value="">Velg kjønn</option>
              <option value="male">Mann</option>
              <option value="female">Kvinne</option>
              <option value="other">Annet</option>
              <option value="prefer_not_to_say">Ønsker ikke å oppgi</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="hasDiabetes">Har du diabetes?</label>
            <select
              id="hasDiabetes"
              value={hasDiabetes}
              onChange={(e) => setHasDiabetes(e.target.value)}
            >
              <option value="">Velg et alternativ</option>
              <option value="yes">Ja</option>
              <option value="no">Nei</option>
              <option value="prefer_not_to_say">Ønsker ikke å oppgi</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="isHealthcarePersonnel">Er du helsepersonell?</label>
            <select
              id="isHealthcarePersonnel"
              value={isHealthcarePersonnel}
              onChange={(e) => setIsHealthcarePersonnel(e.target.value)}
            >
              <option value="">Velg et alternativ</option>
              <option value="yes">Ja</option>
              <option value="no">Nei</option>
            </select>
          </div>
          {isHealthcarePersonnel === 'yes' && (
            <div className="form-group">
              <label htmlFor="healthcareProfessionalType">Type helsepersonell (valgfritt):</label>
              <select 
                id="healthcareProfessionalType" 
                value={healthcareProfessionalType} 
                onChange={(e) => setHealthcareProfessionalType(e.target.value)}
              >
                <option value="">Velg type helsepersonell</option>
                <option value="lege">Lege</option>
                <option value="medisinerstudent">Medisinerstudent</option>
                <option value="medisinerstudent_lisens">Medisinerstudent med lisens</option>
                <option value="sykepleier">Sykepleier</option>
                <option value="annet">Annet</option>
              </select>
            </div>
          )}
          <div className="form-group">
            <label htmlFor="educationLevel">Utdanning:</label>
            <select
              id="educationLevel"
              value={educationLevel}
              onChange={(e) => setEducationLevel(e.target.value)}
            >
              <option value="">Velg utdanningsnivå</option>
              <option value="grunnskole">Grunnskole/Folkeskole/Videregående skole/Yrkesskole</option>
              <option value="hoyere_1_3">1-3 år ved universitet/høyskole (eller annen tilsvarende nivå ved annen instans)</option>
              <option value="hoyere_4_5">4-5 år ved universitet/høyskole (eller annen tilsvarende nivå ved annen instans)</option>
              <option value="hoyere_6_pluss">6 år eller mer ved universitet/høyskole (eller annen tilsvarende nivå ved annen instans)</option>
              <option value="doktorgrad">Doktorgrad/spesialistgrad på høyere nivå universitet/høyskole</option>
              <option value="prefer_not_to_say">Ønsker ikke å oppgi</option>
            </select>
          </div>
          <div className="form-group">
            <label>Jeg har svart på denne undersøkelsen tidligere:</label>
            <div className="radio-group">
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
        </section>
      </div>

      <button className="start-button" onClick={handleStart}>Start undersøkelsen</button>
    
    </div>
  );
};

export default LandingPage;
