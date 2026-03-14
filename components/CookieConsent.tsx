'use client';

import React, { useState, useEffect } from 'react';

export default function CookieConsent() {
    const [show, setShow] = useState(false);

    useEffect(() => {
        const consent = localStorage.getItem('contextmatic_cookie_consent');
        if (!consent) {
            setShow(true);
        }
    }, []);

    const accept = () => {
        localStorage.setItem('contextmatic_cookie_consent', 'true');
        setShow(false);
    };

    if (!show) return null;

    return (
        <div className="fixed bottom-8 left-8 right-8 md:left-auto md:w-96 z-[100] animate-fade-in-up">
            <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl shadow-2xl backdrop-blur-xl">
                <div className="flex items-start gap-4 mb-4">
                    <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-xl">
                        🍪
                    </div>
                    <div className="flex-1">
                        <h4 className="text-white font-bold mb-1">Cookie Policy</h4>
                        <p className="text-zinc-400 text-xs leading-relaxed">
                            We use cookies to enhance your experience, analyze site traffic, and serve targeted advertisements.
                        </p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={accept}
                        className="flex-1 py-2.5 bg-white text-black text-xs font-bold rounded-xl hover:bg-zinc-200 transition-all"
                    >
                        Accept All
                    </button>
                    <button
                        onClick={() => setShow(false)}
                        className="flex-1 py-2.5 bg-white/5 text-white text-xs font-bold rounded-xl hover:bg-white/10 transition-all"
                    >
                        Manage
                    </button>
                </div>
            </div>
        </div>
    );
}
