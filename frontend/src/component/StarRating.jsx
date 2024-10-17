import React from 'react';

const StarRating = ({ rating, onRatingChange }) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <div
          key={star}
          className="relative mx-1 cursor-pointer text-gray-400"
          style={{
            width: '24px',
            height: '24px',
          }}
          onClick={() => onRatingChange(star)}
        >
          <span
            className="block w-full h-full leading-none"
            style={{ color: star <= rating ? 'yellow' : 'gray' }}
          >
            ★
          </span>
        </div>
      ))}
    </div>
  );
};

export default StarRating;
