import React from 'react';
import { LogoStyle } from '../../types';

interface LogoStyleGridProps {
    styles: LogoStyle[];
    selectedId: string;
    onSelect: (id: string) => void;
}

export const LogoStyleGrid: React.FC<LogoStyleGridProps> = ({ styles, selectedId, onSelect }) => {
    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            {styles.map((style) => (
                <button
                    key={style.id}
                    onClick={() => onSelect(style.id)}
                    className={`relative aspect-square rounded-2xl overflow-hidden group transition-all duration-300 ${selectedId === style.id
                            ? 'ring-2 ring-blue-500 ring-offset-4 ring-offset-[var(--color-bg-primary)] scale-[0.98]'
                            : 'hover:scale-[1.02]'
                        }`}
                >
                    <img
                        src={style.image}
                        alt={style.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-opacity duration-300 ${selectedId === style.id ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'
                        }`} />
                    <div className="absolute bottom-3 left-3 right-3 text-left">
                        <span className="text-white text-xs font-bold uppercase tracking-wider">{style.name}</span>
                    </div>
                    {selectedId === style.id && (
                        <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center animate-scale-in">
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                    )}
                </button>
            ))}
        </div>
    );
};
