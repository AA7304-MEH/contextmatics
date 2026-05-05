import React from 'react';

export default function BrandVoiceLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-12 pb-20 animate-pulse">
      <div className="text-center space-y-4 pt-12">
        <div className="h-6 w-32 bg-white/5 rounded-full mx-auto" />
        <div className="h-12 w-64 bg-white/10 rounded-xl mx-auto" />
        <div className="h-4 w-96 bg-white/5 rounded-full mx-auto" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          <div className="card h-64 bg-white/5 border-white/5 rounded-[2rem]" />
          <div className="space-y-4">
             <div className="h-4 w-32 bg-white/5 rounded-full" />
             <div className="space-y-3">
               {[1, 2, 3].map(i => (
                 <div key={i} className="h-24 bg-white/5 border border-white/5 rounded-2xl" />
               ))}
             </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
          <div className="card h-96 bg-gradient-to-b from-white/5 to-transparent border-white/5 rounded-[2rem]" />
          <div className="h-32 bg-white/5 border border-white/5 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
