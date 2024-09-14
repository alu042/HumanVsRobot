import React, { useState } from 'react';

const QuestionPage = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const questions = [
    {
      question: "What is the capital of France?",
      answers: ["Paris", "Lyon"],
    },
    {
      question: "What is 2 + 2?",
      answers: ["4", "22"],
    },
    // Add more questions as needed
  ];

  const handleNextQuestion = () => {
    setQuestionIndex((prevIndex) => prevIndex + 1);
  };

  return (
    <div>
      <h1>Question {questionIndex + 1}</h1>
      <p>{questions[questionIndex].question}</p>
      <div>
        <div>
          <h2>Answer 1</h2>
          <p>{questions[questionIndex].answers[0]}</p>
          <div>
            <label>Knowledge:</label>
            <select>
              <option value="1">Very bad</option>
              <option value="2">Bad</option>
              <option value="3">Neutral</option>
              <option value="4">Good</option>
              <option value="5">Excellent</option>
            </select>
          </div>
          <div>
            <label>Correctness:</label>
            <select>
              <option value="1">Very bad</option>
              <option value="2">Bad</option>
              <option value="3">Neutral</option>
              <option value="4">Good</option>
              <option value="5">Excellent</option>
            </select>
          </div>
          <div>
            <label>Empathy:</label>
            <select>
              <option value="1">Very bad</option>
              <option value="2">Bad</option>
              <option value="3">Neutral</option>
              <option value="4">Good</option>
              <option value="5">Excellent</option>
            </select>
          </div>
        </div>
        <div>
          <h2>Answer 2</h2>
          <p>{questions[questionIndex].answers[1]}</p>
          <div>
            <label>Knowledge:</label>
            <select>
              <option value="1">Very bad</option>
              <option value="2">Bad</option>
              <option value="3">Neutral</option>
              <option value="4">Good</option>
              <option value="5">Excellent</option>
            </select>
          </div>
          <div>
            <label>Correctness:</label>
            <select>
              <option value="1">Very bad</option>
              <option value="2">Bad</option>
              <option value="3">Neutral</option>
              <option value="4">Good</option>
              <option value="5">Excellent</option>
            </select>
          </div>
          <div>
            <label>Empathy:</label>
            <select>
              <option value="1">Very bad</option>
              <option value="2">Bad</option>
              <option value="3">Neutral</option>
              <option value="4">Good</option>
              <option value="5">Excellent</option>
            </select>
          </div>
        </div>
      </div>
      <button onClick={handleNextQuestion}>Next Question</button>
    </div>
  );
};

export default QuestionPage;
