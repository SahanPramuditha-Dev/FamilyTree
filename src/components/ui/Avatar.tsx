import React from 'react';
import { User } from 'lucide-react';
import { Gender } from '../../types';

export interface AvatarProps {
  src?: string;
  name?: string;
  gender?: Gender;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  isLiving?: boolean;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name = '',
  gender = 'male',
  size = 'md',
  isLiving,
  className = ''
}) => {
  const sizeStyles = {
    xs: 'w-6 h-6 text-[10px] rounded-lg',
    sm: 'w-8 h-8 text-xs rounded-xl',
    md: 'w-11 h-11 text-sm rounded-2xl',
    lg: 'w-16 h-16 text-lg rounded-2xl',
    xl: 'w-24 h-24 text-2xl rounded-3xl',
    '2xl': 'w-32 h-32 text-4xl rounded-3xl'
  };

  const initial = name.trim() ? name.trim().charAt(0).toUpperCase() : '';

  return (
    <div className={`relative inline-block flex-shrink-0 select-none ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name}
          className={`${sizeStyles[size]} object-cover border border-stone-200 dark:border-stone-700 shadow-sm`}
        />
      ) : (
        <div
          className={`${sizeStyles[size]} bg-forest-100 dark:bg-forest-950 text-forest-800 dark:text-forest-300 font-serif font-bold flex items-center justify-center border border-forest-200 dark:border-forest-800 shadow-sm`}
        >
          {initial || <User className="w-1/2 h-1/2 opacity-70" />}
        </div>
      )}

      {/* Gender indicator dot if needed */}
      {gender && size !== 'xs' && (
        <span
          className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full ring-2 ring-white dark:ring-stone-900 ${
            gender === 'female' ? 'bg-pink-500' : 'bg-blue-500'
          }`}
          title={gender}
        />
      )}
    </div>
  );
};
