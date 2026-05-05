import React from 'react';

export default function ContentOSLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 pt-12">
        <div className="h-6 w-40 bg-white/5 rounded-full mx-auto" />
        <div className="h-14 w-64 bg-white/10 rounded-2xl mx-auto" />
        <div className="h-4 w-96 bg-white/5 rounded-full mx-auto" />
      </div>

      {/* OS Card Skeleton */}
      <div className="card h-[400px] bg-[#121214] border-white/5 rounded-[3rem] shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent opacity-10" />
        <div className="p-12 space-y-8 flex flex-col items-center">
            <div className="w-20 h-20 bg-white/10 rounded-3xl" />
            <div className="space-y-3 w-full max-w-md">
                <div className="h-8 w-48 bg-white/10 rounded-lg mx-auto" />
                <div className="h-4 w-full bg-white/5 rounded-full" />
            </div>
            <div className="w-full max-w-md h-16 bg-white/5 rounded-2xl" />
            <div className="flex gap-4 w-full max-w-md">
                <div className="h-16 w-32 bg-white/5 rounded-2xl" />
                <div className="h-16 flex-1 bg-white/10 rounded-2xl" />
            </div>
        </div>
      </div>
    </div>
  );
}
