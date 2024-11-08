import React, { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import RatingInterface from './RatingInterface';
import ReactMarkdown from 'react-markdown';

const QuestionPage = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const pageRef = useRef(null);

  const criteriaTranslations = {
    Knowledge: 'Kunnskap',
    Helpfulness: 'Hjelpsomhet',
    Empathy: 'Empati',
  };

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const response = await fetch('/api/answers');
        const data = await response.json();
        setSelectedAnswers(data);
      } catch (error) {
        console.error('Error fetching answers:', error);
      }
    };
    fetchAnswers();
  }, []);

  if (selectedAnswers.length === 0) {
    return <div className="loading">Loading answers...</div>;
  }

  const currentAnswer = selectedAnswers[currentAnswerIndex];

  const handleRatingChange = (answerId, questionId, criterion, value, responseTime) => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      const existingResponseIndex = newResponses.findIndex(r => r.answerId === answerId);
      
      if (existingResponseIndex !== -1) {
        newResponses[existingResponseIndex] = {
          ...newResponses[existingResponseIndex],
          criteria: {
            ...newResponses[existingResponseIndex].criteria,
            [criterion]: value,
          },
          responseTime: responseTime,
        };
      } else {
        newResponses.push({
          answerId: answerId,
          questionId: questionId,
          criteria: { [criterion]: value },
          responseTime: responseTime,
        });
      }
      
      return newResponses;
    });
  };

  const isCurrentAnswerFullyRated = () => {
    const currentResponse = responses.find(r => r.answerId === currentAnswer.answer_id);
    if (!currentResponse) return false;

    const allCriteriaRated = Object.keys(criteriaTranslations).every(criterion => 
      currentResponse.criteria.hasOwnProperty(criterion) && currentResponse.criteria[criterion] !== undefined
    );

    return allCriteriaRated;
  };

  const nextAnswer = () => {
    if (currentAnswerIndex < selectedAnswers.length - 1) {
      setCurrentAnswerIndex((prevIndex) => prevIndex + 1);
      // Scroll to the top of the page
      window.scrollTo({ top: 0, behavior: 'smooth' });
      // Fallback for older browsers
      setTimeout(() => {
        if (pageRef.current) {
          pageRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      finishSurvey();
    }
  };

  const finishSurvey = async () => {
    try {
      // First submit the ratings
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: userData.sessionId,
          responses,
        }),
      });

      // Then end the session
      await fetch('/api/end-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: userData.sessionId,
        }),
      });

      navigate('/progress');
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  return (
    <div className="question-page" ref={pageRef}>
      <header className="question-header">
        <h1 className="question-title">
          Spørsmål {currentAnswerIndex + 1} av {selectedAnswers.length}
        </h1>
      </header>
      <main className="question-content">
        <div className="question-text">
          <ReactMarkdown>{currentAnswer.question_text}</ReactMarkdown>
        </div>
        <div className="answer-container">
          <RatingInterface
            key={currentAnswer.answer_id}
            answer={currentAnswer.answer_text}
            answerId={currentAnswer.answer_id}
            questionId={currentAnswer.question_id}
            criteria={Object.keys(criteriaTranslations)}
            criteriaTranslations={criteriaTranslations}
            onRatingChange={handleRatingChange}
          />
        </div>
      </main>
      <footer className="question-footer">
        <div className="navigation-buttons">
          <button
            className="next-button"
            onClick={nextAnswer}
            disabled={!isCurrentAnswerFullyRated()}
          >
            {currentAnswerIndex < selectedAnswers.length - 1
              ? 'Neste svar'
              : 'Fullfør undersøkelsen'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default QuestionPage;
