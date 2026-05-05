import React from 'react';
import { ModernNav } from './ModernNav';
import { Footer } from './Footer';
import { InsufficientCreditsModal } from './InsufficientCreditsModal';

export const PageLayout: React.FC<{ children: React.ReactNode; showPricing?: boolean; showSettings?: boolean; noScroll?: boolean }> = ({ children, noScroll }) => {
    return (
        <div className={`min-h-screen bg-background-primary text-text-primary font-sans selection:bg-brand-primary/30 flex overflow-x-hidden ${noScroll ? 'h-screen overflow-hidden' : ''}`}>

            {/* Global Modals/Drawers */}
            <InsufficientCreditsModal />

            {/* Sidebar Navigation */}
            <ModernNav />

            {/* MAIN CONTENT WRAPPER */}
            <div className="flex-grow flex flex-col min-w-0">
                <main className="pt-24 md:pt-12 pb-20 px-6 container mx-auto relative z-10 animate-fade-in flex-grow w-full md:ml-64 transition-all">
                    {children}
                </main>

                <div className="md:ml-64">
                    <Footer />
                </div>
            </div>

            {/* Background Ambient (Subtle) */}
            <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none z-0"></div>
        </div>
    );
};


