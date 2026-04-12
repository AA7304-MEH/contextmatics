'use client';

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertCircle, RefreshCw, Home, ShieldAlert } from 'lucide-react';

interface Props {
    children?: ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false
    };

    public static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error('ContextMatic Critical Exception:', error, errorInfo);
    }

    private handleReset = () => {
        this.setState({ hasError: false, error: undefined });
        window.location.reload();
    };

    public render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-[#020202] flex items-center justify-center p-6 text-center select-none overflow-hidden relative">
                    {/* Abstract background elements */}
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000" />
                    
                    <div className="max-w-xl w-full relative z-10 animate-fade-in">
                        <div className="mb-12 relative">
                            <div className="w-24 h-24 bg-red-500/10 text-red-500 rounded-[2.5rem] flex items-center justify-center mx-auto border border-red-500/20 shadow-2xl shadow-red-500/10 mb-6 group">
                                <ShieldAlert className="w-12 h-12 group-hover:scale-110 transition-transform duration-500" />
                            </div>
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
                                <span className="text-[10px] font-black text-red-500/80 uppercase tracking-[0.4em]">Internal System Exception</span>
                            </div>
                        </div>

                        <h1 className="text-5xl font-black text-white mb-6 uppercase tracking-tighter">Engine Compromised</h1>
                        <p className="text-zinc-500 text-lg font-bold mb-12 max-w-sm mx-auto leading-relaxed uppercase tracking-tight">
                            A critical runtime error has interrupted the terminal. All data partitions remain secure.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                            <button
                                onClick={this.handleReset}
                                className="group flex items-center gap-3 px-10 py-5 bg-white text-black font-black rounded-2xl hover:bg-zinc-200 transition-all shadow-2xl active:scale-95 text-xs uppercase tracking-widest"
                            >
                                <RefreshCw className="w-4 h-4 group-hover:rotate-180 transition-transform duration-700" />
                                Reboot Terminal
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="group flex items-center gap-3 px-10 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all border border-white/10 active:scale-95 text-xs uppercase tracking-widest"
                            >
                                <Home className="w-4 h-4" />
                                Abort to Hub
                            </button>
                        </div>

                        {process.env.NODE_ENV === 'development' && (
                            <div className="mt-16 text-left">
                                <div className="flex justify-between items-center mb-3">
                                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Diagnostic Trace v1.02</span>
                                    <span className="text-[10px] font-mono text-red-500/50">SEC-ALPHA-9</span>
                                </div>
                                <pre className="p-6 bg-black/50 backdrop-blur-xl border border-white/5 rounded-3xl text-[10px] font-mono text-orange-500/70 overflow-x-auto max-h-48 custom-scrollbar leading-relaxed">
                                    <span className="text-orange-500 font-bold">[CRITICAL] </span>
                                    {this.state.error?.stack || this.state.error?.toString()}
                                </pre>
                            </div>
                        )}
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
