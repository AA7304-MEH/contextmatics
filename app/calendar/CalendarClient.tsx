"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale/en-US';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';

import { PageLayout } from '@/components/shared';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { createBrowserClient } from '@supabase/ssr';
import { Twitter, Linkedin, Mail, Clock, CheckCircle, AlertCircle, X, ExternalLink, Calendar as CalendarIcon, Move } from 'lucide-react';

const locales = {
    'en-US': enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    content: string;
    platforms: string[];
    status: 'scheduled' | 'published' | 'failed';
    type: 'internal' | 'external';
}

export default function CalendarClient() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [events, setEvents] = useState<CalendarEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (user) {
            fetchData();
        }
    }, [user]);

    const fetchData = async () => {
        setLoading(true);
        try {
            // 1. Fetch from Supabase
            const { data: supabaseData, error: supabaseError } = await supabase
                .from('scheduled_posts')
                .select('*')
                .eq('user_id', user!.id);

            if (supabaseError) throw supabaseError;

            const internalEvents: CalendarEvent[] = (supabaseData || []).map(post => ({
                id: post.id,
                title: post.content.substring(0, 30) + '...',
                start: new Date(post.scheduled_at),
                end: new Date(new Date(post.scheduled_at).getTime() + 30 * 60000), // 30 min duration
                content: post.content,
                platforms: post.platforms || [],
                status: post.status as any,
                type: 'internal'
            }));

            // 2. Fetch from Ayrshare (Optional)
            let externalEvents: CalendarEvent[] = [];
            try {
                const res = await fetch('/api/social/history');
                if (res.ok) {
                    const history = await res.json();
                    if (Array.isArray(history)) {
                        externalEvents = history.map((item: any) => ({
                            id: item.id || Math.random().toString(),
                            title: (item.post || 'Social Post').substring(0, 30) + '...',
                            start: new Date(item.created || item.scheduleDate),
                            end: new Date(new Date(item.created || item.scheduleDate).getTime() + 30 * 60000),
                            content: item.post,
                            platforms: item.platforms || [],
                            status: item.status === 'success' ? 'published' : 'failed',
                            type: 'external'
                        }));
                    }
                }
            } catch (err) {
                console.warn("Ayrshare fetch failed - likely no API key configured");
            }

            setEvents([...internalEvents, ...externalEvents]);
        } catch (error: any) {
            console.error(error);
            showToast('Failed to load calendar data', 'error');
        } finally {
            setLoading(false);
        }
    };

    const onEventDrop = useCallback(async ({ event, start, end }: any) => {
        if (event.type === 'external' || event.status === 'published') {
            showToast('Cannot reschedule published posts', 'error');
            return;
        }

        const originalEvents = [...events];
        
        // Optimistic Update
        const updatedEvents = events.map(ev => 
            ev.id === event.id ? { ...ev, start, end } : ev
        );
        setEvents(updatedEvents);

        try {
            const { error } = await supabase
                .from('scheduled_posts')
                .update({ scheduled_at: start.toISOString() })
                .eq('id', event.id);

            if (error) throw error;
            showToast('Post rescheduled successfully', 'success');
        } catch (err: any) {
            setEvents(originalEvents);
            showToast('Failed to reschedule post', 'error');
        }
    }, [events, supabase, showToast]);

    const onEventResize = useCallback(async ({ event, start, end }: any) => {
        if (event.type === 'external') return;
        
        // Similar to drop but just updating start/end in state (usually duration doesn't matter for posts)
        setEvents(prev => prev.map(ev => 
            ev.id === event.id ? { ...ev, start, end } : ev
        ));
    }, []);

    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = '#3b82f6'; // blue-500
        if (event.status === 'published') backgroundColor = '#10b981'; // emerald-500
        if (event.status === 'failed') backgroundColor = '#ef4444'; // red-500
        
        return {
            style: {
                backgroundColor,
                borderRadius: '12px',
                opacity: 0.85,
                color: 'white',
                border: 'none',
                display: 'block',
                fontSize: '11px',
                fontWeight: '700',
                padding: '4px 10px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
            }
        };
    };

    return (
        <PageLayout>
            <div className="container mx-auto px-6 py-12 flex flex-col h-[calc(100vh-100px)]">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 animate-fade-in">
                    <div className="text-left">
                        <div className="flex items-center gap-3 mb-2">
                             <CalendarIcon className="w-5 h-5 text-brand-primary" />
                             <span className="text-sm font-bold text-brand-primary uppercase tracking-[0.2em]">Strategy Central</span>
                        </div>
                        <h1 className="text-4xl font-black tracking-tight text-white mb-2">Omnichannel Calendar</h1>
                        <p className="text-md text-text-secondary">Drag and drop to optimize your multi-platform distribution strategy.</p>
                    </div>
                    
                    <div className="flex gap-4">
                         <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-text-muted">
                            <Move className="w-3.5 h-3.5" /> Drag Any Scheduled Item
                         </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0 bg-background-surface/30 backdrop-blur-3xl border border-white/5 rounded-[2.5rem] p-8 shadow-2xl relative overflow-hidden animate-fade-in-up">
                    <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10"></div>

                    {loading ? (
                        <div className="h-full flex flex-col items-center justify-center gap-4">
                            <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin"></div>
                            <p className="text-sm font-bold text-text-muted animate-pulse uppercase tracking-widest">Synchronizing Campaign Data...</p>
                        </div>
                    ) : (
                        <div className="h-full calendar-container">
                            <DnDCalendar
                                localizer={localizer}
                                events={events}
                                startAccessor="start"
                                endAccessor="end"
                                style={{ height: '100%' }}
                                eventPropGetter={eventStyleGetter}
                                onSelectEvent={(event) => setSelectedEvent(event as CalendarEvent)}
                                onEventDrop={onEventDrop}
                                onEventResize={onEventResize}
                                resizable
                                draggableAccessor={(event: any) => event.status !== 'published'}
                                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                                className="custom-calendar-ui"
                            />
                        </div>
                    )}
                </div>

                {/* Event Modal */}
                {selectedEvent && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
                        <div className="bg-background-surface border border-white/10 w-full max-w-xl rounded-[2.5rem] overflow-hidden shadow-2xl animate-scale-up">
                            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-white/[0.03]">
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-[1rem] flex items-center justify-center ${selectedEvent.status === 'published' ? 'bg-emerald-500/20' : selectedEvent.status === 'failed' ? 'bg-red-500/20' : 'bg-blue-500/20'}`}>
                                        {selectedEvent.status === 'published' ? <CheckCircle className="w-6 h-6 text-emerald-400" /> : selectedEvent.status === 'failed' ? <AlertCircle className="w-6 h-6 text-red-400" /> : <Clock className="w-6 h-6 text-blue-400" />}
                                    </div>
                                    <div className="text-left">
                                        <h3 className="font-black text-white uppercase text-xs tracking-[0.2em] mb-1">{selectedEvent.status}</h3>
                                        <p className="text-sm text-text-secondary font-medium">{format(selectedEvent.start, 'PPPP • p')}</p>
                                    </div>
                                </div>
                                <button onClick={() => setSelectedEvent(null)} className="p-2 hover:bg-white/10 rounded-full transition-colors text-text-muted hover:text-white">
                                    <X className="w-6 h-6" />
                                </button>
                            </div>
                            <div className="p-8 text-left">
                                <div className="mb-8">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-black block mb-4">Target Channels</label>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedEvent.platforms.map(p => (
                                            <div key={p} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-xs text-white font-bold group hover:border-brand-primary transition-all">
                                                {p.toLowerCase() === 'twitter' && <Twitter className="w-4 h-4 text-sky-400" />}
                                                {p.toLowerCase() === 'linkedin' && <Linkedin className="w-4 h-4 text-blue-500" />}
                                                {p.toLowerCase() === 'email' && <Mail className="w-4 h-4 text-emerald-400" />}
                                                {p}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="mb-10">
                                    <label className="text-[10px] uppercase tracking-[0.2em] text-text-muted font-black block mb-4">Optimized Content Output</label>
                                    <div className="bg-black/60 border border-white/5 rounded-[1.5rem] p-6 text-sm text-text-primary whitespace-pre-wrap font-sans leading-[1.8] max-h-[300px] overflow-y-auto custom-scrollbar italic text-white/80">
                                        "{selectedEvent.content}"
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => { navigator.clipboard.writeText(selectedEvent.content); showToast('Copied to clipboard!', 'success'); }} className="btn btn-secondary flex-1 py-4 text-xs font-black uppercase tracking-widest">Copy to Clipboard</button>
                                    {selectedEvent.type === 'external' ? (
                                        <button className="btn btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest gap-2">
                                            <ExternalLink className="w-4 h-4" /> View Original
                                        </button>
                                    ) : (
                                        <button onClick={() => setSelectedEvent(null)} className="btn btn-primary flex-1 py-4 text-xs font-black uppercase tracking-widest">Edit Campaign</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <style jsx global>{`
                .calendar-container .rbc-calendar {
                    border: none;
                    background: transparent;
                    font-family: inherit;
                }
                .rbc-month-view, .rbc-time-view {
                    border: none !important;
                }
                .rbc-header {
                    padding: 15px !important;
                    font-size: 10px;
                    text-transform: uppercase;
                    letter-spacing: 2px;
                    font-weight: 900;
                    color: rgba(255,255,255,0.3);
                    border-bottom: 2px solid rgba(255,255,255,0.03) !important;
                }
                .rbc-month-row {
                    border-top: 1px solid rgba(255,255,255,0.03) !important;
                }
                .rbc-off-range-bg {
                    background: rgba(0,0,0,0.15) !important;
                }
                .rbc-day-bg {
                    border-left: 1px solid rgba(255,255,255,0.05) !important;
                    transition: background 0.3s;
                }
                .rbc-day-bg:hover {
                    background: rgba(255,255,255,0.02);
                }
                .rbc-today {
                    background: rgba(99,102,241,0.05) !important;
                }
                .rbc-event {
                    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }
                .rbc-event:hover {
                    transform: scale(1.02) translateY(-2px);
                    filter: brightness(1.1);
                    box-shadow: 0 10px 20px rgba(0,0,0,0.2) !important;
                }
                .rbc-show-more {
                    color: #6366f1;
                    font-weight: 900;
                    font-size: 10px;
                    text-transform: uppercase;
                    margin-top: 4px;
                }
                .rbc-toolbar button {
                    color: white !important;
                    border: 1px solid rgba(255,255,255,0.1) !important;
                    background: rgba(255,255,255,0.03) !important;
                    padding: 10px 20px !important;
                    border-radius: 14px !important;
                    margin: 0 4px !important;
                    font-size: 11px !important;
                    font-weight: 800 !important;
                    text-transform: uppercase !important;
                    letter-spacing: 1px !important;
                    transition: all 0.2s !important;
                }
                .rbc-toolbar button:hover {
                    background: rgba(255,255,255,0.1) !important;
                    border-color: rgba(255,255,255,0.2) !important;
                }
                .rbc-toolbar button.rbc-active {
                    background: #6366f1 !important;
                    border-color: #6366f1 !important;
                    box-shadow: 0 8px 16px rgba(99,102,241,0.3) !important;
                }
                .rbc-toolbar-label {
                    font-weight: 900 !important;
                    font-size: 22px !important;
                    letter-spacing: -0.02em !important;
                }
                .rbc-addons-dnd-dragged-event {
                    opacity: 0.4 !important;
                }
                .rbc-addons-dnd-drag-preview {
                    border-radius: 12px !important;
                    background-color: #6366f1 !important;
                }
            `}</style>
        </PageLayout>
    );
}
