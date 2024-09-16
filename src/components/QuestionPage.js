import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import RatingInterface from './RatingInterface';

const QuestionPage = () => {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [selectedAnswers, setSelectedAnswers] = useState([]);
  const [currentAnswerIndex, setCurrentAnswerIndex] = useState(0);
  const [responses, setResponses] = useState([]);

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
    return <div>Loading answers...</div>;
  }

  const currentAnswer = selectedAnswers[currentAnswerIndex];

  const handleRatingChange = (criterion, value) => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      newResponses[currentAnswerIndex] = {
        answerId: currentAnswer.answer_id,
        criteria: {
          ...(newResponses[currentAnswerIndex]?.criteria || {}),
          [criterion]: value,
        },
        comments: newResponses[currentAnswerIndex]?.comments || '',
      };
      return newResponses;
    });
  };

  const handleCommentsChange = (comments) => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      newResponses[currentAnswerIndex] = {
        answerId: currentAnswer.answer_id,
        criteria: newResponses[currentAnswerIndex]?.criteria || {},
        comments,
      };
      return newResponses;
    });
  };

  const isCurrentAnswerFullyRated = () => {
    const currentResponse = responses[currentAnswerIndex];
    if (!currentResponse) return false;

    const allCriteriaRated =
      Object.keys(currentResponse.criteria).length ===
      Object.keys(criteriaTranslations).length;

    return allCriteriaRated;
  };

  const nextAnswer = () => {
    if (currentAnswerIndex < selectedAnswers.length - 1) {
      setCurrentAnswerIndex((prevIndex) => prevIndex + 1);
    } else {
      finishSurvey();
    }
  };

  const finishSurvey = async () => {
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.userId,
          responses,
        }),
      });
      navigate('/progress');
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  return (
    <div className="question-page">
      <h1>
        Spørsmål {currentAnswerIndex + 1} av {selectedAnswers.length}
      </h1>
      <p className="question-text">{currentAnswer.question_text}</p>
      <div className="answer-container">
        <RatingInterface
          key={currentAnswer.answer_id}
          answer={currentAnswer.answer_text}
          answerId={currentAnswer.answer_id}
          criteria={Object.keys(criteriaTranslations)}
          criteriaTranslations={criteriaTranslations}
          onRatingChange={handleRatingChange}
          onCommentsChange={handleCommentsChange}
        />
      </div>
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
    </div>
  );
};

export default QuestionPage;