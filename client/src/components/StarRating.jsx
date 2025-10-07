import { useState } from 'react';

export function StarRating({ value, onChange, readonly = false }) {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          className={`star ${
            star <= (hover || value) ? 'filled' : 'empty'
          } ${readonly ? 'cursor-default' : ''}`}
          onClick={() => !readonly && onChange && onChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          disabled={readonly}
        >
          ★
        </button>
      ))}
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
