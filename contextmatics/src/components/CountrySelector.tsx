import React from 'react';

interface CountrySelectorProps {
    value: string;
    onChange: (countryCode: string) => void;
    className?: string;
}

export const CountrySelector: React.FC<CountrySelectorProps> = ({ value, onChange, className }) => {
    return (
        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm ${className}`}
            style={{
                padding: '0.5rem',
                border: '1px solid #d1d5db',
                borderRadius: '0.375rem',
                backgroundColor: 'white',
                color: '#111827'
            }}
        >
            <option value="US">🇺🇸 United States (International)</option>
            <option value="IN">🇮🇳 India</option>
            <option value="GB">🇬🇧 United Kingdom</option>
            <option value="CA">🇨🇦 Canada</option>
            <option value="AU">🇦🇺 Australia</option>
            <option value="DE">🇩🇪 Germany</option>
            <option value="FR">🇫🇷 France</option>
            <option value="JP">🇯🇵 Japan</option>
            <option value="BR">🇧🇷 Brazil</option>
            <option value="other">🌍 Other</option>
        </select>
    );
};
