import React from 'react';
import { ModernNav } from './ModernNav';
import { Footer } from './Footer';

export const PageLayout: React.FC<{ children: React.ReactNode; showPricing?: boolean; showSettings?: boolean }> = ({ children }) => {
    return (
        <div className="min-h-screen bg-background-primary text-text-primary font-sans selection:bg-brand-primary/30 flex flex-col">

            {/* 1. CURSOR-STYLE NAVBAR (Replaced with ModernNav) */}
            <ModernNav />

            {/* 2. MAIN CONTENT WRAPPER */}
            <main className="pt-24 pb-20 px-6 container mx-auto relative z-10 animate-fade-in flex-grow w-full">
                {children}
            </main>

            {/* 3. SHARED FOOTER */}
            <Footer />

            {/* Background Ambient (Subtle) */}
            <div className="fixed top-0 left-0 right-0 h-[500px] bg-gradient-to-b from-brand-primary/5 to-transparent pointer-events-none z-0"></div>

        </div>
    );
};


