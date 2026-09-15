import React from 'react';
import { Star } from 'lucide-react';
import { cn } from '../lib/utils';

export default function StarRating({ rating = 5, max = 5, size = 'sm', showScore = true, className }) {
  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  return (
    <div className={cn('inline-flex items-center gap-1.5', className)}>
      <div className="flex items-center gap-0.5">
        {[...Array(max)].map((_, i) => {
          const filled = i < Math.floor(rating);
          return (
            <Star
              key={i}
              className={cn(
                starSizes[size] || starSizes.sm,
                filled ? 'fill-amber-400 text-amber-400' : 'text-muted-foreground/40'
              )}
            />
          );
        })}
      </div>
      {showScore && (
        <span className="text-xs font-semibold text-foreground/90">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  );
}
