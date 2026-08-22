import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'outline' | 'glass' | 'sepia';
  hoverable?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  hoverable = false,
  className = '',
  ...props
}) => {
  const baseStyles = 'rounded-3xl transition duration-200';

  const variantStyles = {
    default: 'bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-soft text-stone-900 dark:text-stone-100',
    elevated: 'bg-white dark:bg-stone-900 border border-stone-200/80 dark:border-stone-800 shadow-elevated text-stone-900 dark:text-stone-100',
    outline: 'bg-transparent border border-stone-200 dark:border-stone-800 text-stone-900 dark:text-stone-100',
    glass: 'bg-white/70 dark:bg-stone-950/70 backdrop-blur-xl border border-stone-200/60 dark:border-stone-800/80 shadow-2xl text-stone-900 dark:text-stone-100',
    sepia: 'bg-sepia-50 dark:bg-stone-900 border border-sepia-200 dark:border-stone-800 text-sepia-950 dark:text-stone-100 shadow-soft'
  };

  const hoverStyles = hoverable ? 'hover:-translate-y-1 hover:shadow-elevated cursor-pointer' : '';

  return (
    <div className={`${baseStyles} ${variantStyles[variant]} ${hoverStyles} ${className}`} {...props}>
      {children}
    </div>
  );
};
