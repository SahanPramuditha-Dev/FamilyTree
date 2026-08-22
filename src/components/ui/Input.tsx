import React, { forwardRef } from 'react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className="w-full space-y-1.5">
      {label && (
        <label htmlFor={inputId} className="block text-xs font-semibold text-stone-700 dark:text-stone-300">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3 text-stone-400 dark:text-stone-500 pointer-events-none">
            {leftIcon}
          </div>
        )}

        <input
          id={inputId}
          ref={ref}
          className={`w-full text-xs rounded-xl border transition bg-white dark:bg-stone-900/90 text-stone-900 dark:text-stone-100 placeholder:text-stone-400 dark:placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-forest-500/50 p-2.5 shadow-sm ${
            leftIcon ? 'pl-9' : ''
          } ${rightIcon ? 'pr-9' : ''} ${
            error
              ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20'
              : 'border-stone-300 dark:border-stone-700 focus:border-forest-500 dark:focus:border-forest-400'
          } ${className}`}
          {...props}
        />

        {rightIcon && (
          <div className="absolute right-3 text-stone-400 dark:text-stone-500">
            {rightIcon}
          </div>
        )}
      </div>

      {error && (
        <p className="text-[11px] font-medium text-rose-500 dark:text-rose-400">{error}</p>
      )}

      {helperText && !error && (
        <p className="text-[11px] text-stone-500 dark:text-stone-400">{helperText}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
