import React, { useState, useEffect, useContext } from 'react';
import UserContext from './UserContext';
import RatingInterface from './RatingInterface';
import { useNavigate } from 'react-router-dom';

const QuestionPage = () => {
  const [allQuestions, setAllQuestions] = useState([]);
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  const criteriaTranslations = {
    'Knowledge': 'Kunnskap',
    'Helpfulness': 'Hjelpsomhet',
    'Empathy': 'Empati'
  };

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch('/api/questions');
        const data = await response.json();
        setAllQuestions(data);
        selectRandomQuestions(data);
      } catch (error) {
        console.error('Error fetching questions:', error);
      }
    };
    fetchQuestions();
  }, []);

  const selectRandomQuestions = (questions) => {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    setSelectedQuestions(shuffled.slice(0, 10));
  };

  const handleRatingChange = (answerIndex, criterion, value) => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      const questionResponse = newResponses[currentQuestionIndex] || { 
        questionId: selectedQuestions[currentQuestionIndex].question_id, 
        ratings: []
      };
      
      // Get the answerId
      const answerId = selectedQuestions[currentQuestionIndex].answers[answerIndex].answer_id;
      
      // Find existing rating or create new one
      let answerRating = questionResponse.ratings.find(r => r.answerId === answerId);
      if (!answerRating) {
        answerRating = { 
          answerId, 
          criteria: {}, 
          comments: '' 
        };
        questionResponse.ratings.push(answerRating);
      }
      
      // Update the criteria
      answerRating.criteria[criterion] = value;
      
      // Update the questionResponse and responses
      newResponses[currentQuestionIndex] = questionResponse;
      return newResponses;
    });
  };

  const handleCommentsChange = (answerIndex, comments) => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      const questionResponse = newResponses[currentQuestionIndex] || { 
        questionId: selectedQuestions[currentQuestionIndex].question_id, 
        ratings: []
      };
      
      // Get the answerId
      const answerId = selectedQuestions[currentQuestionIndex].answers[answerIndex].answer_id;
      
      // Find existing rating or create new one
      let answerRating = questionResponse.ratings.find(r => r.answerId === answerId);
      if (!answerRating) {
        answerRating = { 
          answerId, 
          criteria: {}, 
          comments: '' 
        };
        questionResponse.ratings.push(answerRating);
      }
      
      // Update the comments
      answerRating.comments = comments;
      
      // Update the questionResponse and responses
      newResponses[currentQuestionIndex] = questionResponse;
      return newResponses;
    });
  };

  const isCurrentQuestionFullyRated = () => {
    const currentResponse = responses[currentQuestionIndex];
    if (!currentResponse) return false;
    
    // Ensure ratings array doesn't contain undefined or null values
    const allRatingsAreValid = currentResponse.ratings.every(rating => rating && rating.criteria);
    
    if (!allRatingsAreValid) return false;
    
    const allCriteriaRated = currentResponse.ratings.every(rating => 
      Object.keys(rating.criteria).length === Object.keys(criteriaTranslations).length
    );
    
    return currentResponse.ratings.length === selectedQuestions[currentQuestionIndex].answers.length && allCriteriaRated;
  };

  const nextQuestion = () => {
    setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const skipQuestion = () => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      newResponses[currentQuestionIndex] = null;
      return newResponses;
    });

    // Check if this is the last question
    if (currentQuestionIndex === selectedQuestions.length - 1) {
      finishSurvey();
    } else {
      nextQuestion();
    }
  };

  const finishSurvey = async () => {
    const filteredResponses = responses.filter(response => response !== null);
    console.log('Survey Complete', JSON.stringify(filteredResponses, null, 2));
    try {
      await fetch('/api/ratings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: userData.userId,
          responses: filteredResponses,
        }),
      });
      navigate('/progress');
    } catch (error) {
      console.error('Error submitting survey:', error);
    }
  };

  if (selectedQuestions.length === 0) {
    return <div>Loading questions...</div>;
  }

  const currentQuestion = selectedQuestions[currentQuestionIndex];

  return (
    <div className="question-page">
      <h1>Spørsmål {currentQuestionIndex + 1} av 10</h1>
      <p className="question-text">{currentQuestion.question_text}</p>
      <div className="answers-container">
        {currentQuestion.answers.map((answer, idx) => (
          <RatingInterface
            key={`${currentQuestionIndex}-${answer.answer_id}`}
            answer={answer.answer_text}
            answerId={answer.answer_id}
            criteria={Object.keys(criteriaTranslations)}
            criteriaTranslations={criteriaTranslations}
            onRatingChange={(criterion, value) => handleRatingChange(idx, criterion, value)}
            onCommentsChange={(comments) => handleCommentsChange(idx, comments)}
          />
        ))}
      </div>
      <div className="navigation-buttons">
        <button className="skip-button" onClick={skipQuestion}>
          {currentQuestionIndex === selectedQuestions.length - 1 ? 'Fullfør undersøkelsen' : 'Hopp over spørsmål'}
        </button>
        {currentQuestionIndex < selectedQuestions.length - 1 ? (
          <button 
            className="next-button" 
            onClick={nextQuestion} 
            disabled={!isCurrentQuestionFullyRated()}
          >
            Neste spørsmål
          </button>
        ) : (
          <button 
            className="finish-button" 
            onClick={finishSurvey} 
            disabled={!isCurrentQuestionFullyRated()}
          >
            Fullfør undersøkelsen
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;