import React from 'react';

export default function VoiceStudioLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 p-8 pt-12">
      {/* Header Skeleton */}
      <div className="text-center space-y-4">
        <div className="h-6 w-32 bg-white/5 mx-auto rounded-full animate-pulse" />
        <div className="h-12 w-64 bg-white/5 mx-auto rounded-xl animate-pulse" />
        <div className="h-4 w-96 bg-white/5 mx-auto rounded-md animate-pulse" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Samples Section Skeleton */}
        <div className="lg:col-span-7 space-y-6">
          <div className="card h-96 bg-white/5 animate-pulse rounded-2xl" />
          <div className="h-12 w-full bg-white/5 animate-pulse rounded-xl" />
        </div>

        {/* Result/Side Section Skeleton */}
        <div className="lg:col-span-5 space-y-6">
          <div className="card h-[500px] bg-white/5 animate-pulse rounded-3xl" />
          <div className="card h-32 bg-white/5 animate-pulse rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
