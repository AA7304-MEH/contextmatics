"use client";

import React, { createContext, useContext, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    return { showToast: (message: string, type: ToastType = 'info') => {
        if (type === 'success') toast.success(message);
        else if (type === 'error') toast.error(message);
        else toast(message);
    }};
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    switch (type) {
        case 'success': toast.success(message); break;
        case 'error': toast.error(message); break;
        case 'warning': toast(message, { icon: '⚠️' }); break;
        case 'info': toast(message, { icon: 'ℹ️' }); break;
        default: toast(message);
    }
  }, []);

  // Listen for global app-toast events from service layer
  useEffect(() => {
    const handler = (e: Event) => {
      const { message, type } = (e as CustomEvent).detail;
      showToast(message, type || 'info');
    };
    window.addEventListener('app-toast', handler);
    return () => window.removeEventListener('app-toast', handler);
  }, [showToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export default ToastContext;