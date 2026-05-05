"use client";

import React from 'react';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { 
    Save, 
    Download, 
    Settings, 
    Undo2, 
    Redo2,
    ChevronLeft
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { ExportModal } from './ExportModal';
import { useAuth } from '@/context/AuthContext';
import { Sparkles } from 'lucide-react';

export const Toolbar: React.FC = () => {
    const router = useRouter();
    const { user, refreshProfile } = useAuth();
    const { duration, setDuration } = useTimelineStore();

    const [isExportModalOpen, setIsExportModalOpen] = useState(false);

    useEffect(() => {
        refreshProfile();
    }, []);

    return (
        <div className="h-16 border-b border-white/10 bg-zinc-950 flex items-center justify-between px-6 z-50">
            <div className="flex items-center gap-6">
                <button 
                    onClick={() => router.push('/projects')}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors text-zinc-400 hover:text-white"
                >
                    <ChevronLeft size={20} />
                </button>
                <div className="flex flex-col">
                    <h1 className="text-sm font-bold text-white tracking-tight">Untitled Project</h1>
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Draft • Saved 2m ago</span>
                </div>
                
                <div className="h-6 w-[1px] bg-white/5 mx-2" />
                
                <div className="flex items-center gap-1">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"><Undo2 size={16} /></button>
                    <button className="p-2 hover:bg-white/5 rounded-lg text-zinc-400 hover:text-white transition-colors"><Redo2 size={16} /></button>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase">Duration</span>
                    <input 
                        type="number" 
                        value={duration} 
                        onChange={(e) => setDuration(Number(e.target.value))}
                        className="bg-transparent text-white font-mono text-sm w-12 text-center focus:outline-none"
                    />
                    <span className="text-sm text-zinc-600">s</span>
                </div>

                <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20 group relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                    <Sparkles size={14} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                    <div className="flex flex-col">
                        <div className="flex items-center gap-1.5">
                            <span className="text-xs font-bold text-white leading-none">{user?.processingCredits ?? 0}</span>
                            <span className="text-[9px] font-bold text-indigo-400/80 uppercase tracking-tighter leading-none">Credits</span>
                        </div>
                    </div>
                    <button 
                        onClick={() => router.push('/pricing')}
                        className="ml-1 text-[9px] font-bold text-white bg-indigo-500 px-1.5 py-0.5 rounded hover:bg-indigo-400 transition-colors uppercase tracking-widest shadow-sm shadow-indigo-500/50"
                    >
                        Top up
                    </button>
                </div>

                <div className="h-6 w-[1px] bg-white/5 mx-1" />

                <button className="btn btn-secondary flex items-center gap-2 py-2 px-4 h-10 border-white/5 bg-white/5 hover:bg-white/10">
                    <Save size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Save</span>
                </button>
                
                <button 
                    onClick={() => setIsExportModalOpen(true)}
                    className="btn btn-primary flex items-center gap-3 py-2 px-6 h-10 shadow-lg shadow-blue-500/20"
                >
                    <Download size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">Export</span>
                </button>

                <div className="h-6 w-[1px] bg-white/5 mx-2" />
                
                <button className="p-2 text-zinc-400 hover:text-white transition-colors"><Settings size={20} /></button>
            </div>

            <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} />
        </div>
    );
};
