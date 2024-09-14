import React, { useState } from 'react';
import PropTypes from 'prop-types';

const RatingInterface = ({ answer, criteria, onRatingChange, onCommentsChange }) => {
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState('');

  const handleRatingChange = (criterion, value) => {
    setRatings((prevRatings) => ({
      ...prevRatings,
      [criterion]: value,
    }));
    onRatingChange(criterion, value);
  };

  const handleCommentsChange = (event) => {
    const value = event.target.value;
    setComments(value);
    onCommentsChange(value);
  };

  return (
    <div className="rating-interface">
      <h2>Answer:</h2>
      <p>{answer}</p>
      {criteria.map((criterion) => (
        <div key={criterion} className="criterion">
          <p>{criterion}:</p>
          <div className="rating-options">
            {[1, 2, 3, 4, 5].map((value) => (
              <label key={value}>
                <input
                  type="radio"
                  name={`${criterion}-rating-${answer}`}
                  value={value}
                  checked={ratings[criterion] === value}
                  onChange={() => handleRatingChange(criterion, value)}
                />
                {value}
              </label>
            ))}
          </div>
        </div>
      ))}
      <div className="comments-section">
        <label htmlFor={`comments-${answer}`}>Comments:</label>
        <textarea
          id={`comments-${answer}`}
          value={comments}
          onChange={handleCommentsChange}
        />
      </div>
    </div>
  );
};

RatingInterface.propTypes = {
  answer: PropTypes.string.isRequired,
  criteria: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRatingChange: PropTypes.func.isRequired,
  onCommentsChange: PropTypes.func.isRequired,
};

export default RatingInterface;