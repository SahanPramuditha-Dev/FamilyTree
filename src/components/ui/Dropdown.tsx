import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check, Search } from 'lucide-react';

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
  fullWidth?: boolean;
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
  fullWidth = false,
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
    bottom: 'top-full mt-1.5',
    top: 'bottom-full mb-1.5'
  };

  return (
    <div className={`relative ${fullWidth ? 'w-full block' : 'inline-block text-left'}`} ref={dropdownRef}>
      <div 
        onClick={() => setOpen(!open)} 
        className={`cursor-pointer ${fullWidth ? 'w-full block' : 'inline-flex items-center'}`}
      >
        {trigger}
      </div>

      {open && (
        <div
          className={`absolute ${positionStyles[position]} ${fullWidth ? 'left-0 right-0 w-full' : `${alignStyles[align]} ${width}`} z-50 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-700/90 shadow-2xl py-1.5 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 ${className}`}
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
      : 'text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800/80 hover:text-stone-900 dark:hover:text-stone-100',
    forest: active
      ? 'bg-forest-50 dark:bg-forest-950/60 text-forest-900 dark:text-forest-200 font-semibold'
      : 'text-stone-700 dark:text-stone-300 hover:bg-forest-50/70 dark:hover:bg-forest-950/40 hover:text-forest-900 dark:hover:text-forest-200',
    danger: 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 hover:text-rose-700 dark:hover:text-rose-300'
  };

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition gap-2 rounded-xl ${variantStyles[variant]} ${
        disabled ? 'opacity-40 pointer-events-none' : ''
      } ${className}`}
    >
      <div className="flex items-center gap-2.5 min-w-0 flex-1">
        {icon && <span className="flex-shrink-0 text-stone-400 dark:text-stone-500">{icon}</span>}
        <div className="truncate flex-1">{children}</div>
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
  <div className={`h-px bg-stone-100 dark:border-stone-800 my-1.5 ${className}`} />
);

/* =========================================================
   4. SelectDropdown (Rich Custom Select UI Replacement)
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
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  menuWidth?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
}

export const SelectDropdown: React.FC<SelectDropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select option',
  icon,
  size = 'md',
  className = '',
  menuWidth = 'w-56',
  fullWidth = false,
  disabled = false,
  searchable = false,
  searchPlaceholder = 'Search...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const selected = options.find(o => o.value === value);

  // Filter options if searchable
  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) return options;
    const q = searchQuery.toLowerCase().trim();
    return options.filter(
      o => o.label.toLowerCase().includes(q) || (o.description && o.description.toLowerCase().includes(q))
    );
  }, [options, searchable, searchQuery]);

  const sizeStyles = {
    sm: 'py-1.5 px-3 text-xs rounded-xl gap-2 min-h-[32px]',
    md: 'py-2 px-3.5 text-xs rounded-xl gap-2.5 min-h-[38px]',
    lg: 'py-2.5 px-4 text-sm rounded-2xl gap-3 min-h-[44px]'
  };

  const triggerNode = (
    <div
      className={`flex items-center justify-between bg-white dark:bg-stone-900 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-900 dark:text-stone-100 border border-stone-300/80 dark:border-stone-700 font-medium transition shadow-xs select-none hover:border-forest-500 dark:hover:border-forest-600 focus-within:border-forest-600 focus-within:ring-2 focus-within:ring-forest-500/20 ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : 'inline-flex'
      } ${disabled ? 'opacity-50 pointer-events-none' : ''} ${className}`}
    >
      <div className="flex items-center gap-2 truncate">
        {icon && <span className="text-stone-400 dark:text-stone-500 flex-shrink-0">{icon}</span>}
        {selected?.icon && <span className="flex-shrink-0">{selected.icon}</span>}
        <span className={`truncate font-medium ${selected ? 'text-stone-900 dark:text-stone-100' : 'text-stone-400 dark:text-stone-500'}`}>
          {selected ? selected.label : placeholder}
        </span>
      </div>
      <ChevronDown className={`w-3.5 h-3.5 text-stone-400 transition-transform duration-200 flex-shrink-0 ml-2 ${isOpen ? 'rotate-180 text-forest-600 dark:text-forest-400' : ''}`} />
    </div>
  );

  return (
    <Dropdown
      trigger={triggerNode}
      isOpen={isOpen}
      onOpenChange={(open) => {
        setIsOpen(open);
        if (!open) setSearchQuery('');
      }}
      width={menuWidth}
      fullWidth={fullWidth}
      align="left"
    >
      {searchable && (
        <div className="p-2 border-b border-stone-100 dark:border-stone-800">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              autoFocus
              placeholder={searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 rounded-xl focus:ring-forest-500 focus:border-forest-500 shadow-xs"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      <div className="max-h-60 overflow-y-auto p-1.5 space-y-0.5 custom-scrollbar">
        {filteredOptions.length === 0 ? (
          <div className="px-3 py-3 text-center text-xs text-stone-400 dark:text-stone-500">
            No matching options
          </div>
        ) : (
          filteredOptions.map((option) => {
            const isSelected = option.value === value;
            return (
              <DropdownItem
                key={option.value}
                active={isSelected}
                variant={isSelected ? 'forest' : 'default'}
                onClick={() => {
                  onChange(option.value);
                  setIsOpen(false);
                  setSearchQuery('');
                }}
                icon={option.icon}
                badge={
                  isSelected ? (
                    <Check className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400 flex-shrink-0" />
                  ) : option.badge ? (
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 font-medium flex-shrink-0">
                      {option.badge}
                    </span>
                  ) : null
                }
              >
                <div className="text-left">
                  <div className="font-medium text-stone-900 dark:text-stone-100">{option.label}</div>
                  {option.description && (
                    <div className="text-[10px] text-stone-400 font-normal mt-0.5">{option.description}</div>
                  )}
                </div>
              </DropdownItem>
            );
          })
        )}
      </div>
    </Dropdown>
  );
};
