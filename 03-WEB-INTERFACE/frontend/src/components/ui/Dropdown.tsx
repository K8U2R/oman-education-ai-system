import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { clsx } from 'clsx';

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}

interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  trigger?: React.ReactNode;
  className?: string;
  position?: 'left' | 'right';
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  placeholder = 'اختر...',
  onChange,
  trigger,
  className,
  position = 'right',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.value === value);

  const handleSelect = (option: DropdownOption) => {
    if (option.disabled) return;
    if (onChange) {
      onChange(option.value);
    }
    if (option.onClick) {
      option.onClick();
    }
    setIsOpen(false);
  };

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {trigger ? (
        <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>
      ) : (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full px-4 py-2 rounded-md bg-ide-bg border border-ide-border text-ide-text flex items-center justify-between hover:bg-ide-border transition-colors"
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          <ChevronDown
            className={clsx('w-4 h-4 transition-transform', isOpen && 'transform rotate-180')}
          />
        </button>
      )}
      {isOpen && (
        <div
          className={clsx(
            'absolute z-50 mt-2 w-full bg-ide-surface border border-ide-border rounded-md shadow-lg overflow-hidden',
            position === 'left' ? 'right-0' : 'left-0'
          )}
        >
          {options.map((option) => (
            <button
              key={option.value}
              onClick={() => handleSelect(option)}
              disabled={option.disabled}
              className={clsx(
                'w-full px-4 py-2 text-right flex items-center gap-2 hover:bg-ide-border transition-colors',
                option.disabled && 'opacity-50 cursor-not-allowed',
                value === option.value && 'bg-ide-accent/10'
              )}
            >
              {option.icon && <span>{option.icon}</span>}
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;

