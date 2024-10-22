import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';

const RatingInterface = ({
  answer,
  answerId,
  questionId,
  criteria,
  criteriaTranslations,
  onRatingChange,
}) => {
  const [ratings, setRatings] = useState({});
  const [startTime, setStartTime] = useState(Date.now());

  useEffect(() => {
    setRatings({});
    setStartTime(Date.now()); // Reset startTime
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
    onRatingChange(answerId, questionId, criterion, value, responseTime);
  };

  return (
    <div className="rating-interface">
      <div className="answer-text">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
      {criteria.map((criterion) => (
        <div key={criterion} className="criterion">
          <p className="criterion-label">{criteriaTranslations[criterion] || criterion}</p>
          <div className="rating-options" role="radiogroup" aria-labelledby={`${criterion}-label`}>
            {likertOptions.map((option) => (
              <label key={option.value} className="rating-option">
                <input
                  type="radio"
                  name={`${criterion}-rating-${answerId}`}
                  value={option.value}
                  checked={ratings[criterion] === option.value}
                  onChange={() => handleRatingChange(criterion, option.value)}
                  aria-label={`${option.label} for ${criteriaTranslations[criterion] || criterion}`}
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
  questionId: PropTypes.number.isRequired, 
  criteria: PropTypes.arrayOf(PropTypes.string).isRequired,
  criteriaTranslations: PropTypes.object.isRequired,
  onRatingChange: PropTypes.func.isRequired,
};

export default RatingInterface;
