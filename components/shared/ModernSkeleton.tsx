'use client';

import React from 'react';

export const ModernSkeleton = () => {
  return (
    <div className="min-h-screen bg-zinc-950 p-6 space-y-8 animate-pulse">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <div className="h-8 w-48 bg-white/5 rounded-lg" />
          <div className="h-4 w-32 bg-white/5 rounded-md" />
        </div>
        <div className="h-10 w-32 bg-indigo-500/10 rounded-xl" />
      </div>

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-40 bg-white/5 rounded-2xl border border-white/5" />
        ))}
      </div>

      {/* Main Content Skeleton */}
      <div className="h-[400px] bg-white/5 rounded-3xl border border-white/5 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
      </div>

      <style jsx>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};
