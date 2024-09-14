import React, { useState } from 'react';

const ProgressPage = () => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [ratings, setRatings] = useState([]);
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

  const handleRatingChange = (answer, criteria, value) => {
    setRatings((prevRatings) => {
      const newRatings = [...prevRatings];
      newRatings[questionIndex] = {
        ...newRatings[questionIndex],
        [answer]: {
          ...newRatings[questionIndex]?.[answer],
          [criteria]: value,
        },
      };
      return newRatings;
    });
  };

  const handleNextQuestion = () => {
    setQuestionIndex((prevIndex) => prevIndex + 1);
  };

  const handleSubmit = () => {
    // Handle submission logic here
    console.log("Ratings submitted:", ratings);
  };

  return (
    <div>
      {questionIndex < questions.length ? (
        <>
          <h1>Question {questionIndex + 1} of {questions.length}</h1>
          <p>{questions[questionIndex].question}</p>
          <div>
            {questions[questionIndex].answers.map((answer, index) => (
              <div key={index}>
                <h2>Answer {index + 1}</h2>
                <p>{answer}</p>
                <div>
                  <label>Accuracy:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    onChange={(e) => handleRatingChange(answer, 'accuracy', e.target.value)}
                  />
                </div>
                <div>
                  <label>Comprehensiveness:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    onChange={(e) => handleRatingChange(answer, 'comprehensiveness', e.target.value)}
                  />
                </div>
                <div>
                  <label>Clarity:</label>
                  <input
                    type="number"
                    min="1"
                    max="5"
                    onChange={(e) => handleRatingChange(answer, 'clarity', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleNextQuestion}>Next Question</button>
        </>
      ) : (
        <>
          <h1>Thank You!</h1>
          <p>You have completed the survey.</p>
          <button onClick={handleSubmit}>Submit</button>
        </>
      )}
    </div>
  );
};

export default ProgressPage;
