import { useState } from 'react';

export function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);

  const handleClick = (star, isHalf) => {
    if (readonly || !onChange) return;
    const newValue = isHalf ? star - 0.5 : star;
    onChange(newValue);
  };

  const handleMouseMove = (star, e) => {
    if (readonly) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const isLeftHalf = x < rect.width / 2;
    setHover(isLeftHalf ? star - 0.5 : star);
  };

  const getStarClass = (star, currentValue) => {
    if (star <= currentValue) return 'filled';
    if (star - 0.5 === currentValue) return 'half-filled';
    return 'empty';
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => {
        const displayValue = hover || value;
        const starClass = getStarClass(star, displayValue);

        return (
          <button
            key={star}
            type="button"
            className={`star-wrapper ${readonly ? 'cursor-default' : ''}`}
            onClick={(e) => {
              if (readonly) return;
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const isLeftHalf = x < rect.width / 2;
              handleClick(star, isLeftHalf);
            }}
            onMouseMove={(e) => handleMouseMove(star, e)}
            onMouseLeave={() => !readonly && setHover(0)}
            disabled={readonly}
          >
            <span className={`star ${starClass}`}>★</span>
          </button>
        );
      })}
    </div>
  );
}

export function StarDisplay({ value }) {
  return (
    <div className="flex items-center gap-2">
      <div className="star-rating">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`star cursor-default ${
              star <= Math.round(value) ? 'filled' : 'empty'
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <span className="text-sm text-gray-600 dark:text-gray-400">
        {value?.toFixed(1) || 'N/A'}
      </span>
    </div>
  );
}
