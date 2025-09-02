import React from 'react';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import { CheckIcon } from '../icons/CheckIcon';

interface ToastProps {
    message: string;
    type: 'success' | 'error' | 'info';
    onDismiss: () => void;
}

const ICONS = {
    success: <CheckIcon className="w-5 h-5 text-emerald-500" />,
    error: <AlertTriangleIcon className="w-5 h-5 text-red-500" />,
    info: <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
};

const BG_COLORS = {
    success: 'bg-emerald-50 dark:bg-emerald-900/50 border-emerald-400',
    error: 'bg-red-50 dark:bg-red-900/50 border-red-400',
    info: 'bg-blue-50 dark:bg-blue-900/50 border-blue-400',
};

const Toast: React.FC<ToastProps> = ({ message, type, onDismiss }) => {
    return (
        <div className={`w-full p-4 rounded-lg shadow-lg border-l-4 flex items-start space-x-3 animate-fade-in-right ${BG_COLORS[type]}`}>
            <div className="flex-shrink-0">
                {ICONS[type]}
            </div>
            <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
                {message}
            </div>
            <button onClick={onDismiss} className="flex-shrink-0 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
        </div>
    );
};

export default Toast;
