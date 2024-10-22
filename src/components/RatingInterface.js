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

  const criteriaDescriptions = {
    Kunnskap: "Vurder nøyaktigheten og relevansen av informasjonen som gis i svaret.",
    Hjelpsomhet: "Evaluer i hvilken grad svaret gir nyttige og praktiske råd eller støtte som kan hjelpe personen som spør.",
    Empati: "Bedøm svarets evne til å vise forståelse for pasientens følelser og bekymringer."
  };

  const handleInfoIconClick = (event) => {
    if (window.innerWidth <= 768) {  // Breakpoint for small screens
      event.preventDefault();
      event.target.classList.toggle('show-tooltip');
    }
  };

  return (
    <div className="rating-interface">
      <div className="answer-text">
        <ReactMarkdown>{answer}</ReactMarkdown>
      </div>
      {criteria.map((criterion) => (
        <div key={criterion} className="criterion">
          <p className="criterion-label">
            {criteriaTranslations[criterion] || criterion}
            <span 
              className="info-icon" 
              title={criteriaDescriptions[criterion]}
              onClick={handleInfoIconClick}
              onKeyPress={(e) => e.key === 'Enter' && handleInfoIconClick(e)}
              tabIndex="0"
              role="button"
              aria-label={`Info om ${criteriaTranslations[criterion] || criterion}`}
            >
              ⓘ
            </span>
          </p>
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
