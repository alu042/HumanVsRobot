import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

const ProgressPage = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleRestart = () => {
    navigate('/');
  };

  const handleFeedbackChange = (e) => {
    setFeedback(e.target.value);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          sessionId: userData.sessionId,
          feedback 
        }),
      });

      if (response.ok) {
        setSubmitMessage('Takk for tilbakemeldingen!');
        setFeedback('');
      } else {
        setSubmitMessage('Beklager, det oppstod en feil. Prøv igjen senere.');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
      setSubmitMessage('Beklager, det oppstod en feil. Prøv igjen senere.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="progress-page">
      <h1>Takk for at du tok deg tid!</h1>
      <p>Dine svar er registrert.</p>
      <div className="feedback-section">
        <h2>Tilbakemeldinger og kommentarer</h2>
        <textarea
          value={feedback}
          onChange={handleFeedbackChange}
          placeholder="Skriv inn dine tilbakemeldinger her..."
          rows="4"
        />
        <button onClick={handleSubmitFeedback} disabled={isSubmitting}>
          {isSubmitting ? 'Sender...' : 'Send tilbakemelding'}
        </button>
        {submitMessage && <p className="submit-message">{submitMessage}</p>}
      </div>
      <button onClick={handleRestart}>Ta undersøkelsen på nytt</button>
    </div>
  );
};

export default ProgressPage;