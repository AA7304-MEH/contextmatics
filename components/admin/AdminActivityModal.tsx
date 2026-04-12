import React, { useState, useEffect } from 'react';
import { X, Clock, Activity, ExternalLink, Calendar, Zap, CreditCard } from 'lucide-react';

interface ActivityEvent {
    id: string;
    type: string;
    title: string;
    detail: string;
    date: string;
    icon: string;
}

interface AdminActivityModalProps {
    user: {
        id: string;
        username: string | null;
        full_name: string | null;
    };
    isOpen: boolean;
    onClose: () => void;
}

export const AdminActivityModal: React.FC<AdminActivityModalProps> = ({ user, isOpen, onClose }) => {
    const [events, setEvents] = useState<ActivityEvent[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isOpen && user.id) {
            setLoading(true);
            fetch(`/api/admin/users/${user.id}/activity`)
                .then(res => res.json())
                .then(data => {
                    setEvents(Array.isArray(data) ? data : []);
                })
                .catch(err => console.error("Failed to fetch user activity", err))
                .finally(() => setLoading(false));
        }
    }, [isOpen, user.id]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-background-surface border border-white/10 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl animate-scale-up">
                
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                            <Activity className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="font-black text-white uppercase tracking-tight">User Audit Log</h3>
                            <p className="text-[10px] text-text-muted font-bold uppercase tracking-widest">{user.full_name || user.username || 'System User'}</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-8 max-h-[60vh] overflow-y-auto custom-scrollbar bg-black/20">
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="w-8 h-8 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin mx-auto mb-4" />
                            <p className="text-sm text-text-muted font-bold uppercase tracking-widest">Scanning History...</p>
                        </div>
                    ) : events.length === 0 ? (
                        <div className="py-20 text-center">
                            <Clock className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                            <p className="text-text-secondary font-medium">No activity record found for this user.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {events.map((event, idx) => (
                                <div key={event.id} className="relative pl-10 group">
                                    {/* Line */}
                                    {idx !== events.length - 1 && (
                                        <div className="absolute left-[19px] top-10 bottom-[-24px] w-[2px] bg-white/5" />
                                    )}
                                    
                                    {/* Icon */}
                                    <div className="absolute left-0 top-0 w-10 h-10 rounded-xl bg-zinc-800/50 border border-white/5 flex items-center justify-center text-xl group-hover:bg-brand-primary group-hover:text-white transition-all shadow-lg">
                                        {event.icon}
                                    </div>

                                    <div className="flex flex-col text-left">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-black text-white group-hover:text-brand-primary transition-colors">
                                                {event.title}
                                            </span>
                                            <span className="text-[10px] text-text-tertiary font-mono italic">
                                                {new Date(event.date).toLocaleString()}
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-secondary line-clamp-1 italic font-medium">
                                            {event.detail}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-white/5 bg-white/[0.02] flex justify-end">
                    <button onClick={onClose} className="px-6 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest transition-all">
                        Close Terminal
                    </button>
                </div>
            </div>
        </div>
    );
};
