import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 pt-12">
        <div className="h-6 w-32 bg-white/5 mx-auto rounded-full" />
        <div className="h-12 w-96 bg-white/5 mx-auto rounded-xl" />
        <div className="h-4 w-[500px] bg-white/5 mx-auto rounded-full" />
      </div>

      {/* Input Skeleton */}
      <div className="card h-48 w-full bg-white/5 border border-white/5" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-96 bg-white/5 border border-white/5 rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
