'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
    LayoutDashboard, 
    Video, 
    PenTool, 
    Youtube, 
    Anchor, 
    Calendar, 
    Inbox, 
    Users, 
    Target, 
    BarChart3, 
    DollarSign, 
    Mic, 
    Globe, 
    Settings, 
    CreditCard, 
    Gift, 
    Newspaper,
    LogOut,
    Menu,
    X,
    ChevronDown,
    ChevronRight,
    Library,
    History,
    Shield,
    Zap,
    Sparkles
} from 'lucide-react';

export const ModernNav = () => {
    const router = useRouter();
    const pathname = usePathname();
    const { user, logout } = useAuth();
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
        Create: true,
        Grow: true,
        Monetise: true,
        Manage: true,
        Account: true
    });

    const toggleMenu = (menu: string) => {
        setOpenMenus(prev => ({ ...prev, [menu]: !prev[menu] }));
    };

    const NavGroup = ({ title, items }: { title: string, items:any[] }) => (
        <div className="space-y-1">
            <button 
                onClick={() => toggleMenu(title)}
                className="w-full flex items-center justify-between px-3 py-2 text-[10px] font-bold text-text-muted uppercase tracking-widest hover:text-white transition-colors"
            >
                {title}
                {openMenus[title] ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
            {openMenus[title] && (
                <div className="space-y-0.5">
                    {items.map((item) => (
                        <button
                            key={item.path}
                            onClick={() => {
                                router.push(item.path);
                                setIsMobileOpen(false);
                            }}
                            className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-medium transition-all group ${pathname === item.path ? 'bg-brand-primary/10 text-white' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                        >
                            <item.icon className={`w-4 h-4 ${pathname === item.path ? 'text-brand-primary' : 'text-text-muted group-hover:text-brand-primary'} transition-colors`} />
                            {item.label}
                            {item.isNew && <span className="ml-auto text-[8px] font-bold bg-brand-primary/20 text-brand-primary px-1.5 py-0.5 rounded-full uppercase">New</span>}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );

    const groups = [
        {
            title: 'Create',
            items: [
                { label: 'Content Generator', path: '/content-creator', icon: PenTool },
                { label: 'Repurpose Studio', path: '/repurpose', icon: Youtube, isNew: true },
                { label: 'Hook Library', path: '/hook-library', icon: Anchor, isNew: true },
                { label: 'Video Generator', path: '/video-generator', icon: Video },
                { label: 'Logo Maker', path: '/logo-maker', icon: Shield },
            ]
        },
        {
            title: 'Grow',
            items: [
                { label: 'Content OS', path: '/content-os', icon: Zap, isNew: true },
                { label: 'Audience Inbox', path: '/inbox', icon: Inbox, isNew: true },
                { label: 'Competitor Intel', path: '/competitors', icon: Users, isNew: true },
                { label: 'A/B Test Lab', path: '/ab-testing', icon: Target, isNew: true },
                { label: 'Analytics', path: '/analytics', icon: BarChart3 }
            ]
        },
        {
            title: 'Monetise',
            items: [
                { label: 'Monetisation Studio', path: '/monetisation', icon: DollarSign, isNew: true },
                { label: 'Voice Studio', path: '/voice-studio', icon: Mic, isNew: true },
                { label: 'Translation Engine', path: '/translate', icon: Globe, isNew: true }
            ]
        },
        {
            title: 'Manage',
            items: [
                { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
                { label: 'Calendar', path: '/calendar', icon: Calendar },
                { label: 'Media Library', path: '/media-library', icon: Library },
                { label: 'Snippets', path: '/snippets', icon: Newspaper },
                { label: 'History', path: '/history', icon: History }
            ]
        },
        {
            title: 'Account',
            items: [
                { label: 'Settings', path: '/settings', icon: Settings },
                { label: 'Billing', path: '/billing', icon: CreditCard },
                { label: 'Referrals', path: '/referrals', icon: Gift },
                { label: 'What\'s New', path: '/whats-new', icon: Sparkles }
            ]
        }
    ];

    if (!user) {
        return (
            <nav className="fixed top-0 left-0 right-0 h-20 border-b border-white/5 bg-background-primary/80 backdrop-blur-xl z-[100] flex items-center justify-between px-6 md:px-12">
                <div onClick={() => router.push('/')} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">C</div>
                    <span className="text-xl font-black tracking-tighter text-white">ContextMatic</span>
                </div>
                
                <div className="hidden md:flex items-center gap-8">
                    <button onClick={() => router.push('/pricing')} className="text-sm font-bold text-text-secondary hover:text-white transition-colors uppercase tracking-widest">Pricing</button>
                    <button onClick={() => router.push('/sign-in')} className="text-sm font-bold text-text-secondary hover:text-white transition-colors uppercase tracking-widest">Sign In</button>
                    <button 
                        onClick={() => router.push('/sign-up')}
                        className="px-6 py-2.5 bg-brand-primary text-black font-black text-xs rounded-xl hover:scale-105 transition-all shadow-lg shadow-brand-primary/20 uppercase tracking-widest"
                    >
                        Get Started
                    </button>
                </div>

                <button onClick={() => router.push('/sign-in')} className="md:hidden p-2 text-white bg-white/5 rounded-lg">
                    <Menu className="w-6 h-6" />
                </button>
            </nav>
        );
    }

    return (
        <>
            {/* Desktop Sidebar Spacer to push content */}
            <div className="hidden md:block w-64 shrink-0 pointer-events-none" />

            {/* Mobile Header */}
            <div className="md:hidden fixed top-0 w-full h-16 bg-background-primary/80 backdrop-blur-xl border-b border-white/5 px-6 flex items-center justify-between z-50">
                <div onClick={() => router.push('/dashboard')} className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-bold text-black">C</div>
                    <span className="font-bold text-white">ContextMatic</span>
                </div>
                <button onClick={() => setIsMobileOpen(!isMobileOpen)} className="p-2 text-white">
                    {isMobileOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Sidebar Desktop */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-background-surface/50 border-r border-white/5 overflow-y-auto px-4 py-8 z-40 transition-transform md:translate-x-0 ${isMobileOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div onClick={() => router.push('/dashboard')} className="flex items-center gap-3 px-3 mb-10 cursor-pointer group">
                    <div className="w-10 h-10 bg-brand-primary rounded-xl flex items-center justify-center font-black text-black shadow-[0_0_20px_rgba(59,130,246,0.3)] group-hover:scale-110 transition-transform">C</div>
                    <div>
                        <span className="text-xl font-black tracking-tighter text-white">ContextMatic</span>
                        <p className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.2em]">Alpha Plus</p>
                    </div>
                </div>

                <div className="space-y-8 pb-20">
                    {groups.map((group) => (
                        <NavGroup key={group.title} title={group.title} items={group.items} />
                    ))}
                    
                    <button 
                        onClick={logout}
                        className="w-full flex items-center gap-3 px-3 py-2 text-sm font-medium text-red-400 hover:bg-red-500/5 rounded-xl transition-all"
                    >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                    </button>
                </div>
            </aside>
        </>
    );
};
