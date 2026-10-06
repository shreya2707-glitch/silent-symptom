import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

type PasswordInputProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  ariaLabel: string;
  describedBy?: string;
  autoComplete?: string;
  minLength?: number;
  required?: boolean;
};

export function PasswordInput({
  value,
  onChange,
  placeholder = '••••••••',
  ariaLabel,
  describedBy,
  autoComplete = 'current-password',
  minLength,
  required = true,
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel}
        aria-describedby={describedBy}
        autoComplete={autoComplete}
        minLength={minLength}
        required={required}
        className="input-field pr-11"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? 'Hide password' : 'Show password'}
        aria-pressed={visible}
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors duration-150"
      >
        {visible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}
