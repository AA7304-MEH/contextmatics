'use client';

import React, { useState, useEffect } from 'react';
import { Drawer } from 'vaul';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, ShieldAlert, Sparkles } from 'lucide-react';

export const InsufficientCreditsModal = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [details, setDetails] = useState({ remaining: 0, upgradeUrl: '/pricing' });
    const router = useRouter();

    useEffect(() => {
        const handleInsufficientCredits = (e:any) => {
            setDetails(e.detail);
            setIsOpen(true);
        };

        window.addEventListener('insufficient-credits', handleInsufficientCredits);
        return () => window.removeEventListener('insufficient-credits', handleInsufficientCredits);
    }, []);

    return (
        <Drawer.Root open={isOpen} onOpenChange={setIsOpen}>
            <Drawer.Portal>
                <Drawer.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100]" />
                <Drawer.Content className="bg-[#09090b] border-t border-white/10 flex flex-col rounded-t-[40px] h-auto max-h-[85vh] fixed bottom-0 left-0 right-0 z-[101] outline-none shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
                    <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-white/10 mt-4 mb-8" />
                    
                    <div className="max-w-md mx-auto w-full p-8 pb-12 space-y-8">
                        <div className="relative w-24 h-24 mx-auto">
                            <div className="absolute inset-0 bg-brand-primary/20 rounded-full blur-2xl animate-pulse" />
                            <div className="relative w-full h-full bg-gradient-to-br from-brand-primary to-violet-600 rounded-3xl flex items-center justify-center shadow-2xl rotate-3">
                                <Zap className="w-12 h-12 text-white fill-current" />
                            </div>
                        </div>

                        <div className="text-center space-y-3">
                            <h2 className="text-3xl font-black text-white tracking-tight">Credits Exhausted</h2>
                            <p className="text-text-secondary leading-relaxed">
                                You currently have <span className="text-white font-bold">{details.remaining}</span> credits. Scale your content engine to keep creating magic.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            <button 
                                onClick={() => {
                                    setIsOpen(false);
                                    router.push(details.upgradeUrl);
                                }}
                                className="btn btn-primary w-full py-5 text-lg font-bold flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.02] transition-transform"
                            >
                                Upgrade Account <ArrowRight className="w-5 h-5" />
                            </button>
                            
                            <div className="flex items-center justify-center gap-6 pt-4">
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-emerald-400">
                                        <Sparkles className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">Instant Top-up</span>
                                </div>
                                <div className="flex flex-col items-center gap-1">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-blue-400">
                                        <ShieldAlert className="w-5 h-5" />
                                    </div>
                                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">No Hidden Fees</span>
                                </div>
                            </div>
                        </div>

                        <p className="text-center text-[10px] text-text-muted/50 uppercase tracking-[0.2em] font-medium leading-loose pt-4">
                            Early adopter discount applied <br/> for all Phase 2 upgrades.
                        </p>
                    </div>
                </Drawer.Content>
            </Drawer.Portal>
        </Drawer.Root>
    );
};
