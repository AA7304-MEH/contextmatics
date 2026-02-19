import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ModernNav = () => {
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { user, logout } = useAuth();

    // Check if we are on the home page for anchor links
    const isHome = location.pathname === '/';

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
        if (!isHome) {
            e.preventDefault();
            navigate('/');
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
        navigate('/');
    };

    const NavLink = ({ to, label, active }: { to: string, label: string, active?: boolean }) => (
        <button
            onClick={() => navigate(to)}
            className={`text-sm font-medium transition-colors ${active || location.pathname === to
                ? 'text-white'
                : 'text-text-secondary hover:text-white'
                }`}
        >
            {label}
        </button>
    );

    return (
        <nav className={`fixed top-0 w-full h-16 z-50 transition-all duration-300 ${scrolled || mobileMenuOpen ? 'bg-background-primary/80 backdrop-blur-xl border-b border-white/5' : 'bg-transparent border-transparent'
            }`}>
            <div className="container mx-auto px-6 h-full flex items-center justify-between">
                {/* Logo */}
                <div
                    className="font-bold text-xl tracking-tight text-white cursor-pointer flex items-center gap-2"
                    onClick={() => navigate(user ? '/dashboard' : '/')}
                >
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-primary to-blue-600 flex items-center justify-center text-white text-xs">
                        C
                    </div>
                    ContextMatic
                </div>

                {/* Desktop Nav */}
                <div className="hidden md:flex items-center gap-8">
                    {user ? (
                        <>
                            <NavLink to="/dashboard" label="Dashboard" />
                            <NavLink to="/content-creator" label="Creator" />
                            <NavLink to="/video-generator" label="AI Video" />
                            <NavLink to="/video-editor" label="Editor" />
                            <NavLink to="/history" label="History" />
                            {user?.role === 'admin' && (
                                <NavLink to="/admin" label="Admin" />
                            )}
                        </>
                    ) : (
                        <>
                            <a
                                href="#features"
                                onClick={(e) => handleAnchorClick(e, 'features')}
                                className="text-text-secondary hover:text-white transition-colors text-sm font-medium"
                            >
                                Features
                            </a>
                            <a
                                href="#pricing"
                                onClick={(e) => handleAnchorClick(e, 'pricing')}
                                className="text-text-secondary hover:text-white transition-colors text-sm font-medium"
                            >
                                Pricing
                            </a>
                        </>
                    )}
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-3">
                    {user ? (
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex flex-col items-end mr-2">
                                <span className="text-xs font-medium text-white leading-none">{user.email?.split('@')[0]}</span>
                                <span className="text-[10px] text-brand-primary uppercase font-bold tracking-wider">{user.plan}</span>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="btn btn-secondary text-xs py-1.5 px-3 border-white/10 hover:bg-white/5 hover:text-red-400"
                            >
                                Sign Out
                            </button>
                        </div>
                    ) : (
                        <>
                            <button
                                onClick={() => navigate('/auth')}
                                className="btn btn-secondary text-sm py-2 px-4 border-none hover:bg-white/5"
                            >
                                Sign In
                            </button>
                            <button
                                onClick={() => navigate('/auth')}
                                className="btn btn-primary text-sm py-2 px-4 shadow-lg shadow-brand-primary/20"
                            >
                                Get Started
                            </button>
                        </>
                    )}

                    {/* Mobile Menu Button (Simple implementation) */}
                    <button
                        className="md:hidden text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {mobileMenuOpen && (
                <div className="md:hidden absolute top-16 left-0 w-full bg-background-primary/95 backdrop-blur-xl border-b border-white/10 p-4 flex flex-col gap-4 shadow-2xl animate-fade-in-up">
                    {user ? (
                        <>
                            <button onClick={() => { navigate('/dashboard'); setMobileMenuOpen(false); }} className="text-left text-white py-2 px-2 hover:bg-white/5 rounded-lg">Dashboard</button>
                            <button onClick={() => { navigate('/content-creator'); setMobileMenuOpen(false); }} className="text-left text-white py-2 px-2 hover:bg-white/5 rounded-lg">Content Creator</button>
                            <button onClick={() => { navigate('/video-generator'); setMobileMenuOpen(false); }} className="text-left text-white py-2 px-2 hover:bg-white/5 rounded-lg">AI Video</button>
                            <button onClick={() => { navigate('/video-editor'); setMobileMenuOpen(false); }} className="text-left text-white py-2 px-2 hover:bg-white/5 rounded-lg">Video Editor</button>
                            <button onClick={() => { navigate('/history'); setMobileMenuOpen(false); }} className="text-left text-white py-2 px-2 hover:bg-white/5 rounded-lg">History</button>
                            {user?.role === 'admin' && (
                                <button onClick={() => { navigate('/admin'); setMobileMenuOpen(false); }} className="text-left text-red-400 py-2 px-2 hover:bg-white/5 rounded-lg font-bold">Admin Console</button>
                            )}
                            <div className="h-px bg-white/10 my-1"></div>
                            <button onClick={handleLogout} className="text-left text-red-400 py-2 px-2 hover:bg-white/5 rounded-lg">Sign Out</button>
                        </>
                    ) : (
                        <>
                            <a href="#features" onClick={(e) => { handleAnchorClick(e, 'features'); setMobileMenuOpen(false); }} className="text-left text-text-secondary py-2">Features</a>
                            <a href="#pricing" onClick={(e) => { handleAnchorClick(e, 'pricing'); setMobileMenuOpen(false); }} className="text-left text-text-secondary py-2">Pricing</a>
                        </>
                    )}
                </div>
            )}
        </nav>
    );
};
