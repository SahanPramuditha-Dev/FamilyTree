import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check, MapPin } from 'lucide-react';

export const POPULAR_LOCATIONS = [
  // Sri Lanka
  { name: 'Sri Lanka', type: 'country', flag: '🇱🇰' },
  { name: 'Colombo, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Kandy, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Galle, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Matara, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Jaffna, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Gampaha, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Negombo, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Kurunegala, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Kalutara, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Anuradhapura, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Ratnapura, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Batticaloa, Sri Lanka', type: 'city', flag: '🇱🇰' },
  { name: 'Nuwara Eliya, Sri Lanka', type: 'city', flag: '🇱🇰' },

  // United Kingdom & Europe
  { name: 'United Kingdom', type: 'country', flag: '🇬🇧' },
  { name: 'London, United Kingdom', type: 'city', flag: '🇬🇧' },
  { name: 'Edinburgh, Scotland', type: 'city', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿' },
  { name: 'Manchester, United Kingdom', type: 'city', flag: '🇬🇧' },
  { name: 'Birmingham, United Kingdom', type: 'city', flag: '🇬🇧' },
  { name: 'Paris, France', type: 'city', flag: '🇫🇷' },
  { name: 'France', type: 'country', flag: '🇫🇷' },
  { name: 'Germany', type: 'country', flag: '🇩🇪' },
  { name: 'Berlin, Germany', type: 'city', flag: '🇩🇪' },
  { name: 'Italy', type: 'country', flag: '🇮🇹' },
  { name: 'Rome, Italy', type: 'city', flag: '🇮🇹' },
  { name: 'Ireland', type: 'country', flag: '🇮🇪' },
  { name: 'Dublin, Ireland', type: 'city', flag: '🇮🇪' },
  { name: 'Switzerland', type: 'country', flag: '🇨🇭' },
  { name: 'Netherlands', type: 'country', flag: '🇳🇱' },

  // Australia & New Zealand
  { name: 'Australia', type: 'country', flag: '🇦🇺' },
  { name: 'Melbourne, Australia', type: 'city', flag: '🇦🇺' },
  { name: 'Sydney, Australia', type: 'city', flag: '🇦🇺' },
  { name: 'Brisbane, Australia', type: 'city', flag: '🇦🇺' },
  { name: 'Perth, Australia', type: 'city', flag: '🇦🇺' },
  { name: 'New Zealand', type: 'country', flag: '🇳🇿' },
  { name: 'Auckland, New Zealand', type: 'city', flag: '🇳🇿' },

  // North America
  { name: 'United States', type: 'country', flag: '🇺🇸' },
  { name: 'New York, USA', type: 'city', flag: '🇺🇸' },
  { name: 'Boston, MA, USA', type: 'city', flag: '🇺🇸' },
  { name: 'San Francisco, CA, USA', type: 'city', flag: '🇺🇸' },
  { name: 'Los Angeles, CA, USA', type: 'city', flag: '🇺🇸' },
  { name: 'Chicago, IL, USA', type: 'city', flag: '🇺🇸' },
  { name: 'Seattle, WA, USA', type: 'city', flag: '🇺🇸' },
  { name: 'Canada', type: 'country', flag: '🇨🇦' },
  { name: 'Toronto, Canada', type: 'city', flag: '🇨🇦' },
  { name: 'Vancouver, Canada', type: 'city', flag: '🇨🇦' },
  { name: 'Montreal, Canada', type: 'city', flag: '🇨🇦' },

  // Asia & Middle East
  { name: 'India', type: 'country', flag: '🇮🇳' },
  { name: 'Chennai, India', type: 'city', flag: '🇮🇳' },
  { name: 'Mumbai, India', type: 'city', flag: '🇮🇳' },
  { name: 'Delhi, India', type: 'city', flag: '🇮🇳' },
  { name: 'Bangalore, India', type: 'city', flag: '🇮🇳' },
  { name: 'Singapore', type: 'country', flag: '🇸🇬' },
  { name: 'Malaysia', type: 'country', flag: '🇲🇾' },
  { name: 'United Arab Emirates', type: 'country', flag: '🇦🇪' },
  { name: 'Dubai, UAE', type: 'city', flag: '🇦🇪' },
  { name: 'Qatar', type: 'country', flag: '🇶🇦' },
  { name: 'Japan', type: 'country', flag: '🇯🇵' },
  { name: 'Tokyo, Japan', type: 'city', flag: '🇯🇵' }
];

export interface CountrySelectProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  className?: string;
  label?: string;
  required?: boolean;
}

export const CountrySelect: React.FC<CountrySelectProps> = ({
  value,
  onChange,
  placeholder = 'Select country or type city...',
  className = '',
  label,
  required = false
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState(value);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuery(value);
  }, [value]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredLocations = POPULAR_LOCATIONS.filter(loc => 
    loc.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (name: string) => {
    setQuery(name);
    onChange(name);
    setIsOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    onChange(val);
    if (!isOpen) setIsOpen(true);
  };

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      {label && (
        <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1 flex items-center justify-between">
          <span>{label} {required && <span className="text-emerald-500">*</span>}</span>
        </label>
      )}

      <div className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          placeholder={placeholder}
          required={required}
          className="w-full text-xs rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 placeholder-stone-400 p-2.5 pr-8 shadow-sm focus:border-forest-500 focus:ring-forest-500 transition"
        />

        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 p-1 text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 transition"
          tabIndex={-1}
        >
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-2xl max-h-56 overflow-y-auto p-1.5 z-50 animate-in fade-in duration-150 divide-y divide-stone-100 dark:divide-stone-800/60">
          {filteredLocations.length === 0 ? (
            <div className="p-3 text-center text-xs text-stone-400">
              <span>Using custom location: "<strong>{query}</strong>"</span>
            </div>
          ) : (
            filteredLocations.map((loc) => {
              const isSelected = value.toLowerCase() === loc.name.toLowerCase();
              return (
                <button
                  key={loc.name}
                  type="button"
                  onClick={() => handleSelect(loc.name)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition ${
                    isSelected 
                      ? 'bg-forest-50 dark:bg-forest-950/60 text-forest-800 dark:text-forest-300 font-semibold' 
                      : 'hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-sm">{loc.flag}</span>
                    <span className="truncate">{loc.name}</span>
                    {loc.type === 'city' && (
                      <span className="text-[10px] text-stone-400 font-mono">City</span>
                    )}
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-forest-600 dark:text-forest-400 flex-shrink-0" />}
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
};
