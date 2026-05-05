'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { X, Sparkles, UserPlus } from 'lucide-react';
import { useAppStore } from '@/store';

export default function UpgradeModal() {
  const [isOpen, setIsOpen] = useState(false);
  const credits = useAppStore((state) => state.credits);
  const plan = useAppStore((state) => state.plan);
  const router = useRouter();

  useEffect(() => {
    const handleUpgradeRequired = (_e: Event) => {
      setIsOpen(true);
    };

    window.addEventListener('contextmatic:upgrade-required' as any, handleUpgradeRequired);
    return () => window.removeEventListener('contextmatic:upgrade-required' as any, handleUpgradeRequired);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/80 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-md animate-in zoom-in-95 rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute right-4 top-4 rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>
        
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-500/10">
          <Sparkles className="h-6 w-6 text-indigo-400" />
        </div>

        <h2 className="mb-2 text-xl font-bold text-white">You've used all your credits</h2>
        <p className="mb-6 text-sm text-zinc-400">
          You currently have {credits} credits left on your {plan} plan. Upgrade to keep creating — or refer a friend for 50 free credits.
        </p>

        <div className="flex flex-col space-y-3">
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/pricing');
            }}
            className="flex w-full items-center justify-center space-x-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 transition"
          >
            <span>Upgrade Now</span>
          </button>
          
          <button
            onClick={() => {
              setIsOpen(false);
              router.push('/account#referrals');
            }}
            className="flex w-full items-center justify-center space-x-2 rounded-lg border border-zinc-800 bg-zinc-950 px-4 py-2.5 text-sm font-medium text-white hover:bg-zinc-800 transition"
          >
            <UserPlus className="h-4 w-4" />
            <span>Refer a friend</span>
          </button>
        </div>
      </div>
    </div>
  );
}
