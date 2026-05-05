import React from 'react';

export default function Loading() {
  return (
    <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-pulse">
      {/* Header Skeleton */}
      <div className="text-center space-y-4 pt-12">
        <div className="h-6 w-32 bg-white/5 mx-auto rounded-full" />
        <div className="h-16 w-[400px] bg-white/5 mx-auto rounded-xl" />
        <div className="h-4 w-[500px] bg-white/5 mx-auto rounded-full" />
      </div>

      {/* Filters Skeleton */}
      <div className="h-20 w-full bg-white/5 border border-white/5 rounded-[2rem]" />

      {/* Grid Skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="h-64 bg-white/5 border border-white/5 rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  );
}
