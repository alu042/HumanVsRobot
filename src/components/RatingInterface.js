import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const RatingInterface = ({ answer, answerId, criteria, criteriaTranslations, onRatingChange }) => {
  const [ratings, setRatings] = useState({});
  const [startTime] = useState(Date.now());

  useEffect(() => {
    // Reset ratings and startTime when the answer changes
    setRatings({});
  }, [answerId]);

  const likertOptions = [
    { value: 1, label: 'Veldig dårlig' },
    { value: 2, label: 'Dårlig' },
    { value: 3, label: 'Middels' },
    { value: 4, label: 'Bra' },
    { value: 5, label: 'Veldig bra' },
  ];

  const handleRatingChange = (criterion, value) => {
    const responseTime = Date.now() - startTime;
    setRatings((prevRatings) => ({
      ...prevRatings,
      [criterion]: value,
    }));
    onRatingChange(answerId, criterion, value, responseTime);
  };

  return (
    <div className="rating-interface">
      <div className="answer-text">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
      {criteria.map((criterion) => (
        <div key={criterion} className="criterion">
          <p className="criterion-label"><strong>{criteriaTranslations[criterion] || criterion}</strong>:</p>
          <div className="rating-options">
            {likertOptions.map((option) => (
              <label key={option.value} className="rating-option">
                <input
                  type="radio"
                  name={`${criterion}-rating-${answerId}`}
                  value={option.value}
                  checked={ratings[criterion] === option.value}
                  onChange={() => handleRatingChange(criterion, option.value)}
                />
                <span className="option-label">{option.label}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

RatingInterface.propTypes = {
  answer: PropTypes.string.isRequired,
  answerId: PropTypes.number.isRequired,
  criteria: PropTypes.arrayOf(PropTypes.string).isRequired,
  criteriaTranslations: PropTypes.object.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

export default RatingInterface;