import React, { useState, useContext } from 'react';
import UserContext from './UserContext';
import RatingInterface from './RatingInterface';
import { useNavigate } from 'react-router-dom';

const questions = [
  {
    questionText: 'What is the capital of France?',
    answers: ['Paris is the capital of France.', 'I believe the capital of France is Paris.'],
  },
  {
    questionText: 'Who wrote "Hamlet"?',
    answers: ['"Hamlet" was written by William Shakespeare.', 'The author of "Hamlet" is Shakespeare.'],
  },
  // Add more questions as needed
];

const QuestionPage = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [skippedQuestions, setSkippedQuestions] = useState([]);
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  const handleRatingChange = (answerIndex, criterion, value) => {
    const questionId = questions[currentQuestionIndex].questionText;
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      if (!newResponses[currentQuestionIndex]) {
        newResponses[currentQuestionIndex] = {
          questionId,
          ratings: Array(questions[currentQuestionIndex].answers.length).fill(null),
        };
      }
      if (!newResponses[currentQuestionIndex].ratings[answerIndex]) {
        newResponses[currentQuestionIndex].ratings[answerIndex] = {
          answer: questions[currentQuestionIndex].answers[answerIndex],
          criteria: {},
        };
      }
      newResponses[currentQuestionIndex].ratings[answerIndex].criteria[criterion] = value;
      return newResponses;
    });
  };

  const handleCommentsChange = (answerIndex, comments) => {
    setResponses((prevResponses) => {
      const newResponses = [...prevResponses];
      if (!newResponses[currentQuestionIndex]) {
        newResponses[currentQuestionIndex] = {
          questionId: questions[currentQuestionIndex].questionText,
          ratings: Array(questions[currentQuestionIndex].answers.length).fill(null),
        };
      }
      if (!newResponses[currentQuestionIndex].ratings[answerIndex]) {
        newResponses[currentQuestionIndex].ratings[answerIndex] = {
          answer: questions[currentQuestionIndex].answers[answerIndex],
          criteria: {},
        };
      }
      newResponses[currentQuestionIndex].ratings[answerIndex].comments = comments;
      return newResponses;
    });
  };

  const isQuestionAnswered = () => {
    const response = responses[currentQuestionIndex];
    if (!response) return false;
    // Check if all answers have been rated for all criteria
    return response.ratings.every((rating) => {
      if (!rating) return false;
      const criteriaRated = Object.keys(rating.criteria).length;
      return criteriaRated === 3; // Assuming 3 criteria: Knowledge, Correctness, Empathy
    });
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else {
      finishSurvey();
    }
  };

  const skipQuestion = () => {
    setSkippedQuestions((prevSkips) => [...prevSkips, currentQuestionIndex]);
    nextQuestion();
  };

  const finishSurvey = () => {
    // Ensure all questions are either answered or skipped
    const totalQuestions = questions.length;
    const answeredOrSkipped = responses.length + skippedQuestions.length;
    if (answeredOrSkipped < totalQuestions) {
      alert('Please complete or skip all questions before finishing the survey.');
    } else {
      console.log('Survey Complete');
      console.log('User Data:', userData);
      console.log('Responses:', responses);
      // Navigate to a summary or progress page if needed
      navigate('/progress', { state: { userData, responses } });
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <div className="question-page">
      <h1>Question {currentQuestionIndex + 1}</h1>
      <p className="question-text">{currentQuestion.questionText}</p>
      <div className="answers-container">
        {currentQuestion.answers.map((answer, idx) => (
          <RatingInterface
            key={idx}
            answer={answer}
            criteria={['Knowledge', 'Correctness', 'Empathy']}
            onRatingChange={(criterion, value) => handleRatingChange(idx, criterion, value)}
            onCommentsChange={(comments) => handleCommentsChange(idx, comments)}
          />
        ))}
      </div>
      <div className="navigation-buttons">
        {currentQuestionIndex < questions.length && (
          <button onClick={skipQuestion}>Skip Question</button>
        )}
        {currentQuestionIndex < questions.length - 1 && (
          <button
            onClick={nextQuestion}
            disabled={!isQuestionAnswered()}
          >
            Next Question
          </button>
        )}
        {currentQuestionIndex === questions.length - 1 && (
          <button
            onClick={finishSurvey}
            disabled={!isQuestionAnswered() && skippedQuestions.length + responses.length < questions.length}
          >
            Finish Survey
          </button>
        )}
      </div>
    </div>
  );
};

export default QuestionPage;