'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Video, 
  Youtube, 
  PenTool, 
  Settings,
  Plus
} from 'lucide-react';

export const MobileNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const items = [
    { label: 'Dash', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Studio', path: '/repurpose', icon: Youtube },
    { label: 'Write', path: '/content-creator', icon: PenTool },
    { label: 'Video', path: '/video-generator', icon: Video },
    { label: 'Labs', path: '/monetisation', icon: Settings },
  ];

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-900/80 backdrop-blur-xl border-t border-white/5 flex items-center justify-around px-2 z-50">
      {items.map((item) => (
        <button
          key={item.path}
          onClick={() => router.push(item.path)}
          className={`flex flex-col items-center gap-1 transition-all ${pathname === item.path ? 'text-indigo-400' : 'text-zinc-500 hover:text-white'}`}
        >
          <item.icon className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
        </button>
      ))}
      <button 
        onClick={() => router.push('/content-creator')}
        className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center -mt-8 shadow-xl border-4 border-zinc-950 text-white"
      >
        <Plus className="w-6 h-6" />
      </button>
    </div>
  );
};
