"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

interface ModernNavProps {
    showPricing?: boolean;
    showSettings?: boolean;
}

export const ModernNav: React.FC<ModernNavProps> = ({
    showPricing = true,
    showSettings = true
}) => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Check if we are on the home page for anchor links
    const isHome = pathname === '/';

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>, id: string) => {
        if (!isHome) {
            e.preventDefault();
            router.push('/');
            setTimeout(() => {
                const element = document.getElementById(id);
                if (element) element.scrollIntoView({ behavior: 'smooth' });
            }, 100);
            return;
        }
        e.preventDefault();
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleLogout = async () => {
        await logout();
        router.push('/');
    };

    const navLinks = [
        { label: 'Dashboard', path: '/dashboard', show: !!user },
        { label: 'Admin', path: '/admin/dashboard', show: !!user && user.role === 'admin' },
        { label: 'Creator', path: '/content-creator', show: !!user },
        { label: 'AI Video', path: '/video-generator', show: !!user },
        { label: 'Editor', path: '/video-editor', show: !!user },
        { label: 'History', path: '/history', show: !!user },
        { label: 'Video Templates', path: '/video-templates', show: !!user },
        { label: 'Logo Maker', path: '/logo-maker', show: !!user },
        { label: 'Analytics', path: '/analytics', show: !!user },
        { label: 'Settings', path: '/settings', show: showSettings && !!user },
        { label: 'Pricing', path: '/pricing', show: showPricing && !user },
    ].filter(link => link.show);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled || isMobileMenuOpen ? 'bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-b border-[var(--color-border-subtle)]' : 'bg-transparent border-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <button id="nav-logo" onClick={() => router.push(user ? '/dashboard' : '/')} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] group-hover:text-white transition-colors">ContextMatic</span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {!user && (
                            <>
                                <button
                                    onClick={(e) => handleAnchorClick(e, 'features')}
                                    className="text-sm font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors"
                                >
                                    Features
                                </button>
                            </>
                        )}
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                id={`nav${link.path.replace(/\//g, '-')}`}
                                onClick={() => router.push(link.path)}
                                className={`text-sm font-medium transition-colors ${pathname === link.path ? 'text-white' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
                            >
                                {link.label}
                            </button>
                        ))}

                        <div className="flex items-center gap-4 pl-8 border-l border-[var(--color-border-subtle)]">
                            {user && (
                                <div className="hidden lg:flex flex-col items-end mr-2">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                                        {user.plan} Plan
                                    </span>
                                    <span className="text-[10px] text-gray-500 truncate max-w-[100px]">{user.email?.split('@')[0]}</span>
                                </div>
                            )}
                            <button
                                onClick={user ? handleLogout : () => router.push('/sign-in')}
                                className={user
                                    ? "px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-all hover:text-red-400"
                                    : "px-5 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"}
                            >
                                {user ? 'Sign Out' : 'Sign In'}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-white"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute w-full left-0 top-20 bg-[var(--color-bg-primary)] border-b border-[var(--color-border-subtle)] shadow-2xl animate-fade-in-up">
                    <div className="px-6 py-6 space-y-4">
                        {user && (
                            <div className="p-4 rounded-xl bg-white/5 border border-white/10 mb-6 flex justify-between items-center">
                                <div>
                                    <p className="text-xs font-bold text-blue-400 uppercase tracking-wider">{user.plan} Plan</p>
                                    <p className="text-sm text-gray-400 truncate max-w-[150px]">{user.email}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xl font-bold text-white">{user.processingCredits || 0}</p>
                                    <p className="text-xs text-gray-500">Credits</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            {!user && (
                                <>
                                    <button onClick={(e) => { handleAnchorClick(e, 'features'); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors">Features</button>
                                    <button onClick={(e) => { handleAnchorClick(e, 'pricing'); setIsMobileMenuOpen(false); }} className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors">Pricing</button>
                                </>
                            )}
                            {navLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => router.push(link.path)}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <button
                                onClick={user ? handleLogout : () => router.push('/sign-in')}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${user ? 'text-red-400 hover:bg-red-500/10' : 'text-blue-400 hover:bg-blue-500/10'}`}
                            >
                                {user ? 'Sign Out' : 'Sign In'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default ModernNav;
