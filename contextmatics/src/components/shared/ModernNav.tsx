import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ModernNavProps {
    showPricing?: boolean;
    showSettings?: boolean;
}

export const ModernNav: React.FC<ModernNavProps> = ({
    showPricing = true,
    showSettings = false
}) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location]);

    const navLinks = [
        { label: 'Dashboard', path: '/dashboard', show: !!user },
        { label: 'Create', path: '/content-creator', show: !!user },
        { label: 'Videos', path: '/video-generator', show: true },
        { label: 'Faceless Studio', path: '/faceless-studio', show: !!user },
        { label: 'Templates', path: '/templates', show: !!user },
        { label: 'Analytics', path: '/analytics', show: !!user },
        { label: 'Pricing', path: '/pricing', show: showPricing && !user },
        { label: 'Settings', path: '/settings', show: showSettings },
    ].filter(link => link.show);

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-[var(--color-bg-primary)]/80 backdrop-blur-xl border-b border-[var(--color-border-subtle)]' : 'bg-transparent border-transparent'}`}>
            <div className="max-w-7xl mx-auto px-6">
                <div className="flex justify-between items-center h-20">
                    {/* Logo */}
                    <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
                        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                            <span className="text-white font-bold text-lg">C</span>
                        </div>
                        <span className="text-xl font-bold tracking-tight text-[var(--color-text-primary)] group-hover:text-white transition-colors">ContextMatic</span>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <button
                                key={link.path}
                                onClick={() => navigate(link.path)}
                                className={`text-sm font-medium transition-colors ${location.pathname === link.path ? 'text-white' : 'text-[var(--color-text-secondary)] hover:text-white'}`}
                            >
                                {link.label}
                            </button>
                        ))}

                        <div className="flex items-center gap-4 pl-8 border-l border-[var(--color-border-subtle)]">
                            {user && (
                                <div className="hidden lg:flex flex-col items-end">
                                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">
                                        {user.plan} Plan
                                    </span>
                                </div>
                            )}
                            <button
                                onClick={user ? logout : () => navigate('/auth')}
                                className={user
                                    ? "px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium border border-white/10 transition-all"
                                    : "px-5 py-2 rounded-lg bg-white text-black text-sm font-bold hover:bg-gray-100 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)]"}
                            >
                                {user ? 'Logout' : 'Sign In'}
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 text-[var(--color-text-secondary)] hover:text-white"
                        aria-label="Toggle menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
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
                                    <p className="text-xl font-bold text-white">{user.processingCredits}</p>
                                    <p className="text-xs text-gray-500">Credits</p>
                                </div>
                            </div>
                        )}

                        <div className="flex flex-col gap-2">
                            {navLinks.map((link) => (
                                <button
                                    key={link.path}
                                    onClick={() => navigate(link.path)}
                                    className="w-full text-left px-4 py-3 rounded-lg hover:bg-white/5 font-medium text-[var(--color-text-secondary)] hover:text-white transition-colors"
                                >
                                    {link.label}
                                </button>
                            ))}
                            <button
                                onClick={user ? logout : () => navigate('/auth')}
                                className={`w-full text-left px-4 py-3 rounded-lg font-medium transition-colors ${user ? 'text-red-400 hover:bg-red-500/10' : 'text-blue-400 hover:bg-blue-500/10'}`}
                            >
                                {user ? 'Logout' : 'Sign In'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default ModernNav;
