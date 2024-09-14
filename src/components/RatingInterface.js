import React, { useState } from 'react';

const RatingInterface = ({ answer, criteria, onRatingChange }) => {
  const [ratings, setRatings] = useState({
    Knowledge: 0,
    Correctness: 0,
    Empathy: 0,
    comments: '',
  });

  const handleRatingChange = (criteria, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [criteria]: value,
    }));
    onRatingChange(answer, criteria, value);
  };

  const handleCommentsChange = (event) => {
    const { value } = event.target;
    setRatings((prevRatings) => ({
      ...prevRatings,
      comments: value,
    }));
    onRatingChange(answer, 'comments', value);
  };

  return (
    <div>
      <h2>{answer}</h2>
      {['Knowledge', 'Correctness', 'Empathy'].map((criterion) => (
        <div key={criterion}>
          <label>{criterion}:</label>
          <select
            value={ratings[criterion]}
            onChange={(e) => handleRatingChange(criterion, e.target.value)}
          >
            <option value="1">Very bad</option>
            <option value="2">Bad</option>
            <option value="3">Neutral</option>
            <option value="4">Good</option>
            <option value="5">Excellent</option>
          </select>
        </div>
      ))}
      <div>
        <label>Comments:</label>
        <textarea
          value={ratings.comments}
          onChange={handleCommentsChange}
        />
      </div>
    </div>
  );
};

export default RatingInterface;
