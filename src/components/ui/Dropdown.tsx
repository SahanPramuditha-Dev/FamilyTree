import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

/* =========================================================
   1. Base Dropdown & Menu
   ========================================================= */

export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  position?: 'bottom' | 'top';
  className?: string;
  width?: string;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export const Dropdown: React.FC<DropdownProps> = ({
  trigger,
  children,
  align = 'right',
  position = 'bottom',
  className = '',
  width = 'w-56',
  isOpen: controlledIsOpen,
  onOpenChange
}) => {
  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isControlled = controlledIsOpen !== undefined;
  const open = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setUncontrolledIsOpen(newOpen);
    }
    onOpenChange?.(newOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const alignStyles = {
    left: 'left-0',
    right: 'right-0',
    center: 'left-1/2 -translate-x-1/2'
  };

  const positionStyles = {
    bottom: 'top-full mt-2',
    top: 'bottom-full mb-2'
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div 
        onClick={() => setOpen(!open)} 
        className="cursor-pointer inline-flex items-center"
      >
        {trigger}
      </div>

      {open && (
        <div
          className={`absolute ${positionStyles[position]} ${alignStyles[align]} ${width} z-50 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-xl border border-stone-200/80 dark:border-stone-800 shadow-2xl py-2 animate-in fade-in zoom-in-95 duration-150 ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

/* =========================================================
   2. Dropdown Item
   ========================================================= */

export interface DropdownItemProps {
  children: React.ReactNode;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'forest';
  disabled?: boolean;
  active?: boolean;
  className?: string;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({
  children,
  icon,
  badge,
  onClick,
  variant = 'default',
  disabled = false,
  active = false,
  className = ''
}) => {
  const variantStyles = {
    default: active
      ? 'bg-stone-100 dark:bg-stone-800 text-stone-900 dark:text-stone-100 font-semibold'
      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/70 hover:text-stone-900 dark:hover:text-stone-100',
    forest: active
      ? 'bg-forest-50 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 font-semibold'
      : 'text-stone-700 dark:text-stone-300 hover:bg-forest-50 dark:hover:bg-forest-950/40 hover:text-forest-800 dark:hover:text-forest-300',
    danger: 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-300'
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition gap-2.5 rounded-xl mx-auto ${variantStyles[variant]} ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {icon && <span className="flex-shrink-0 text-stone-400 dark:text-stone-500">{icon}</span>}
        <span className="truncate">{children}</span>
      </div>
      {badge && <span className="flex-shrink-0">{badge}</span>}
    </button>
  );
};

/* =========================================================
   3. Dropdown Header & Divider
   ========================================================= */

export const DropdownHeader: React.FC<{ children: React.ReactNode; subtitle?: string; className?: string }> = ({
  children,
  subtitle,
  className = ''
}) => (
  <div className={`px-3.5 py-2 border-b border-stone-100 dark:border-stone-800 ${className}`}>
    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 truncate">{children}</div>
    {subtitle && <div className="text-[11px] text-stone-500 dark:text-stone-400 truncate mt-0.5">{subtitle}</div>}
  </div>
);

export const DropdownDivider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`h-px bg-stone-100 dark:bg-stone-800 my-1.5 ${className}`} />
);

/* =========================================================
   4. SelectDropdown (Rich Select Replacement)
   ========================================================= */

export interface SelectOption {
  value: string;
  label: string;
  badge?: string;
  icon?: React.ReactNode;
  description?: string;
}

export interface SelectDropdownProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  icon?: React.ReactNode;
  size?: 'sm' | 'md';
  className?: string;
  menuWidth?: string;
  disabled?: boolean;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  icon,
  size = 'sm',
  className = '',
  menuWidth = 'w-56',
  disabled = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const selected = options.find(o => o.value === value);

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-xs rounded-xl gap-2',
    md: 'py-2 px-3.5 text-xs rounded-xl gap-2.5'
  };

  const triggerNode = (
    <div
      className={`inline-flex items-center justify-between bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 border border-stone-200 dark:border-stone-700 font-medium transition shadow-xs select-none ${sizeStyles[size]} ${
        disabled ? 'opacity-50 pointer-events-none' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2 truncate">
        {icon && <span className="text-stone-400 dark:text-stone-500">{icon}</span>}
        {selected?.icon && <span>{selected.icon}</span>}
        <span className="truncate">{selected ? selected.label : placeholder}</span>
      </div>
      <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
    </div>
  );

  return (
    <Dropdown
      trigger={triggerNode}
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      width={menuWidth}
      align="left"
    >
      <div className="max-h-60 overflow-y-auto p-1 space-y-0.5">
        {options.map((option) => {
          const isSelected = option.value === value;
          return (
            <DropdownItem
              key={option.value}
              active={isSelected}
              variant={isSelected ? 'forest' : 'default'}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              icon={option.icon}
              badge={
                isSelected ? (
                  <Check className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400" />
                ) : option.badge ? (
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300">
                    {option.badge}
                  </span>
                ) : null
              }
            >
              <div>
                <div className="font-semibold">{option.label}</div>
                {option.description && (
                  <div className="text-[10px] text-stone-400 font-normal">{option.description}</div>
                )}
              </div>
            </DropdownItem>
          );
        })}
      </div>
    </Dropdown>
  );
};
