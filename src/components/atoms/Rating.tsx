"use client";

import React from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
}

const Rating: React.FC<RatingProps> = ({ value, size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-5 h-5'
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base'
  };

  return (
    <div className="flex items-center gap-1">
      <Star className={`${sizeClasses[size]} text-yellow-400 fill-current`} />
      <span className={`${textSizes[size]} font-medium`}>{value}</span>
    </div>
  );
};

export default Rating;