"use client";

import React from 'react';
import { Project } from '../../types/editor';
import {
    Save,
    Undo2,
    Redo2,
    Settings,
    Download
} from 'lucide-react';

interface HeaderProps {
    project: Project;
    undo: () => void;
    redo: () => void;
    onExport: () => void;
    isExporting?: boolean;
}

const Header: React.FC<HeaderProps> = ({ project, undo, redo, onExport, isExporting }) => {
    return (
        <header className="h-14 border-b border-white/10 bg-[#1a1a1a] px-4 flex items-center justify-between z-30">
            <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-[#00c8ff] rounded-lg flex items-center justify-center font-bold text-black text-xl">
                        C
                    </div>
                    <span className="font-bold tracking-tight text-lg hidden sm:block">ContextCut</span>
                </div>

                <div className="h-6 w-px bg-white/10 mx-2" />

                <div className="flex items-center gap-1">
                    <button onClick={undo} className="p-2 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors" title="Undo (Ctrl+Z)">
                        <Undo2 size={18} />
                    </button>
                    <button onClick={redo} className="p-2 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors" title="Redo (Ctrl+Y)">
                        <Redo2 size={18} />
                    </button>
                </div>

                <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                    <span className="text-xs text-white/50">{project.name}</span>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors text-sm">
                    <Save size={16} />
                    <span>Save</span>
                </button>

                <button
                    onClick={onExport}
                    disabled={isExporting}
                    className="flex items-center gap-2 px-4 py-1.5 bg-[#00c8ff] hover:bg-[#00b0e0] text-black rounded-lg font-bold text-sm transition-all shadow-lg shadow-[#00c8ff]/20 disabled:opacity-50 disabled:cursor-wait"
                >
                    <Download size={16} className={isExporting ? "animate-bounce" : ""} />
                    <span>{isExporting ? 'Exporting...' : 'Export'}</span>
                </button>

                <button className="p-2 hover:bg-white/5 rounded-lg text-white/70 hover:text-white transition-colors">
                    <Settings size={18} />
                </button>
            </div>
        </header>
    );
};

export default Header;
