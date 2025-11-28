import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ModernNavProps {
    showPricing?: boolean;
    showSettings?: boolean;
    showHistory?: boolean;
}

export const ModernNav: React.FC<ModernNavProps> = ({
    showPricing = true,
    showSettings = false,
    showHistory = false
}) => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav style={{
            position: 'fixed',
            top: 0,
            width: '100%',
            zIndex: 50,
            backgroundColor: scrolled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(20px)',
            boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
            transition: 'all 0.3s',
            borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
            <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button
                        onClick={() => navigate('/')}
                        style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
                    >
                        <div style={{
                            width: '44px',
                            height: '44px',
                            background: 'linear-gradient(to bottom right, #4f46e5, #9333ea)',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                        }}>
                            <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>C</span>
                        </div>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827' }}>ContextMatics</span>
                    </button>

                    {showPricing && (
                        <button
                            onClick={() => navigate('/pricing')}
                            style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
                        >
                            Pricing
                        </button>
                    )}

                    {showSettings && (
                        <button
                            onClick={() => navigate('/settings')}
                            style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
                        >
                            Settings
                        </button>
                    )}

                    {showHistory && (
                        <button
                            onClick={() => navigate('/history')}
                            style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                            onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                            onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
                        >
                            History
                        </button>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        {user && (
                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                marginRight: '1rem'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    fontWeight: '600',
                                    color: '#4f46e5',
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.05em'
                                }}>
                                    {user.plan === 'free' ? 'Free Plan' :
                                        user.plan === 'pro' ? 'Pro Plan' :
                                            user.plan === 'business' ? 'Business Plan' : 'Enterprise'}
                                </span>
                                <span style={{
                                    fontSize: '0.875rem',
                                    color: '#6b7280'
                                }}>
                                    {user.processingCredits} Credits
                                </span>
                            </div>
                        )}
                        <button
                            onClick={logout}
                            style={{
                                backgroundColor: 'white',
                                color: '#dc2626',
                                fontSize: '1rem',
                                fontWeight: '600',
                                border: '2px solid #fecaca',
                                padding: '0.625rem 1.5rem',
                                borderRadius: '12px',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.backgroundColor = '#fef2f2';
                                e.currentTarget.style.borderColor = '#fca5a5';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                                e.currentTarget.style.borderColor = '#fecaca';
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default ModernNav;
