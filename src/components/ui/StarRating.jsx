import React, { useState } from 'react'
import { Star } from 'lucide-react'

/**
 * StarRating
 * Props:
 *   rating       {number}   current rating (0–5)
 *   onRate       {function} called with new rating when a star is clicked
 *   readOnly     {boolean}  if true, renders a static display only
 *   size         {string}   tailwind size class e.g. 'w-5 h-5' (default)
 */
const StarRating = ({ rating = 0, onRate, readOnly = false, size = 'w-5 h-5' }) => {
  const [hovered, setHovered] = useState(0)

  const effective = hovered || rating

  if (readOnly) {
    return (
      <div className='flex items-center gap-0.5'>
        {[1, 2, 3, 4, 5].map(star => (
          <Star
            key={star}
            className={`${size} ${star <= rating ? 'text-[#FFB900] fill-[#FFB900]' : 'text-[#CBD5E1]'}`}
          />
        ))}
        <span className='ml-1.5 text-sm text-[#314158] font-medium'>{rating}/5</span>
      </div>
    )
  }

  return (
    <div
      className='flex items-center gap-0.5'
      onMouseLeave={() => setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          type='button'
          onMouseEnter={() => setHovered(star)}
          onClick={() => onRate && onRate(star)}
          className='cursor-pointer focus:outline-none'
          aria-label={`Rate ${star} out of 5`}
        >
          <Star
            className={`${size} transition-colors duration-100 ${
              star <= effective
                ? 'text-[#FFB900] fill-[#FFB900]'
                : 'text-[#CBD5E1] hover:text-[#FFD666]'
            }`}
          />
        </button>
      ))}
      {rating > 0 && (
        <span className='ml-1.5 text-sm text-[#314158] font-medium'>{rating}/5</span>
      )}
    </div>
  )
}

export default StarRating