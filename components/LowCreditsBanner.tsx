'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { X, AlertTriangle } from 'lucide-react';
import { useAppStore } from '@/store';

export default function LowCreditsBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const credits = useAppStore((state) => state.credits);

  useEffect(() => {
    const bannerDismissed = sessionStorage.getItem('contextmatic_credits_dismissed');
    if (!bannerDismissed && credits > 0 && credits < 20) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [credits]);

  const handleDismiss = () => {
    sessionStorage.setItem('contextmatic_credits_dismissed', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="bg-amber-500/10 border-b border-amber-500/20 px-4 py-3 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-center justify-between">
        <div className="flex w-0 flex-1 items-center">
          <span className="flex rounded-lg bg-amber-500 p-2">
            <AlertTriangle className="h-5 w-5 text-white" aria-hidden="true" />
          </span>
          <p className="ml-3 truncate font-medium text-amber-500">
            <span className="md:hidden">Running low on credits! ({credits} left)</span>
            <span className="hidden md:inline">You are running low on credits — you have {credits} remaining. Upgrade to keep creating uninterrupted.</span>
          </p>
        </div>
        <div className="order-3 mt-2 w-full flex-shrink-0 sm:order-2 sm:mt-0 sm:w-auto">
          <Link
            href="/pricing"
            className="flex items-center justify-center rounded-md border border-transparent bg-amber-500 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-amber-400"
          >
            Upgrade Now
          </Link>
        </div>
        <div className="order-2 flex flex-shrink-0 sm:order-3 sm:ml-3">
          <button
            type="button"
            className="-mr-1 flex rounded-md p-2 hover:bg-amber-500/20 focus:outline-none focus:ring-2 focus:ring-amber-500 sm:-mr-2 transition-colors"
            onClick={handleDismiss}
          >
            <span className="sr-only">Dismiss</span>
            <X className="h-5 w-5 text-amber-500" aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
