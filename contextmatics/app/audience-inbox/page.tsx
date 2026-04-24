'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
    Users, 
    MessageSquare, 
    Sparkles, 
    Search, 
    Send, 
    MoreVertical,
    Twitter,
    Linkedin,
    Instagram,
    RefreshCw
} from 'lucide-react';
import { createBrowserClient } from '@supabase/ssr';
import { formatDistanceToNow } from 'date-fns';

export default function AudienceInbox() {
    const { user } = useAuth();
    const { showToast } = useToast();
    const [messages, setMessages] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [search, setSearch] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<any>(null);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    useEffect(() => {
        if (user) {
            loadMessages();
        }
    }, [user, filter]);

    const loadMessages = async () => {
        if (!user) return;
        setIsLoading(true);
        let query = supabase
            .from('audience_inbox')
            .select('*')
            .eq('user_id', user.id)
            .order('received_at', { ascending: false });
        
        if (filter !== 'all') {
            query = query.eq('status', filter);
        }

        const { data, error: _error } = await query;
        if (data) setMessages(data);
        setIsLoading(false);
    };

    const handleSendReply = async (msgId: string, _reply: string) => {
        try {
            // NOTE: This is a mock for sending a real reply via Ayrshare
            // In a real app, you'd call /api/inbox/reply
            showToast('Reply sent successfully! ✨', 'success');
            
            await supabase.from('audience_inbox').update({
                status: 'replied'
            }).eq('id', msgId);
            
            loadMessages();
            setSelectedMessage(null);
        } catch (err:any) {
            showToast(err.message, 'error');
        }
    };

    const getPlatformIcon = (platform: string) => {
        switch (platform.toLowerCase()) {
            case 'twitter': return <Twitter className="w-4 h-4 text-[#1DA1F2]" />;
            case 'linkedin': return <Linkedin className="w-4 h-4 text-[#0A66C2]" />;
            case 'instagram': return <Instagram className="w-4 h-4 text-[#E4405F]" />;
            default: return <MessageSquare className="w-4 h-4" />;
        }
    };

    return (
        <PageLayout>
            <SEO title="Audience Inbox" description="Unified social inbox with AI-powered engagement suggestions." />
            
            <div className="max-w-7xl mx-auto h-[calc(100vh-160px)] flex flex-col space-y-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 shrink-0">
                    <div className="space-y-1">
                        <h1 className="text-4xl font-bold tracking-tight text-white flex items-center gap-3">
                            Audience <span className="text-kinetic">Inbox</span>
                            <Users className="w-6 h-6 text-brand-primary" />
                        </h1>
                        <p className="text-text-secondary">Unified social engagement powered by AI.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search messages..."
                                className="input py-2 pl-9 pr-4 text-sm w-64"
                            />
                        </div>
                        <button onClick={loadMessages} className="btn btn-secondary p-2.5">
                            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </button>
                    </div>
                </div>

                {/* Main Inbox Interface */}
                <div className="flex-grow flex gap-6 overflow-hidden">
                    {/* Sidebar: Message List */}
                    <div className="w-full md:w-80 lg:w-96 shrink-0 flex flex-col space-y-4 overflow-hidden">
                        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                            {['all', 'unread', 'replied'].map((f) => (
                                <button
                                    key={f}
                                    onClick={() => setFilter(f)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest border transition-all whitespace-nowrap ${filter === f ? 'bg-brand-primary/10 border-brand-primary text-white' : 'bg-white/5 border-white/5 text-text-muted hover:border-white/10'}`}
                                >
                                    {f}
                                </button>
                            ))}
                        </div>

                        <div className="flex-grow overflow-y-auto space-y-2 pr-2 custom-scrollbar">
                            {isLoading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <div key={i} className="h-24 rounded-2xl bg-white/5 animate-pulse" />
                                ))
                            ) : messages.length === 0 ? (
                                <div className="py-20 text-center space-y-4 opacity-50">
                                    <MessageSquare className="w-12 h-12 mx-auto text-text-muted" />
                                    <p className="text-sm font-medium">No messages found.</p>
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <button
                                        key={msg.id}
                                        onClick={() => setSelectedMessage(msg)}
                                        className={`w-full text-left p-4 rounded-2xl border transition-all relative ${selectedMessage?.id === msg.id ? 'bg-brand-primary/10 border-brand-primary/30' : 'bg-zinc-900/50 border-white/5 hover:border-white/10'}`}
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center gap-2">
                                                {getPlatformIcon(msg.platform)}
                                                <span className="text-[10px] font-bold text-white truncate max-w-[100px]">{msg.sender_handle || msg.sender_name}</span>
                                            </div>
                                            <span className="text-[10px] text-text-muted">{formatDistanceToNow(new Date(msg.received_at))} ago</span>
                                        </div>
                                        <p className="text-xs text-text-secondary line-clamp-2 leading-relaxed">{msg.message_content}</p>
                                        {msg.status === 'unread' && (
                                            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-brand-primary"></div>
                                        )}
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Detail: Conversation & AI Replies */}
                    <div className="flex-grow glass-panel !bg-black/20 !border-white/5 rounded-3xl overflow-hidden flex flex-col">
                        {selectedMessage ? (
                            <>
                                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-brand-primary/20 flex items-center justify-center font-bold text-brand-primary uppercase">
                                            {(selectedMessage.sender_handle || 'U')[0]}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-white">{selectedMessage.sender_name || selectedMessage.sender_handle}</h3>
                                            <p className="text-[10px] text-text-secondary uppercase tracking-widest">{selectedMessage.platform}</p>
                                        </div>
                                    </div>
                                    <button className="p-2 text-text-muted hover:text-white">
                                        <MoreVertical className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="flex-grow overflow-y-auto p-6 space-y-6">
                                    {/* User Message */}
                                    <div className="flex gap-4 items-start max-w-[80%]">
                                        <div className="shrink-0 pt-1">{getPlatformIcon(selectedMessage.platform)}</div>
                                        <div className="p-4 rounded-2xl rounded-tl-none bg-white/5 border border-white/5 text-sm text-text-primary leading-relaxed">
                                            {selectedMessage.message_content}
                                        </div>
                                    </div>

                                    {/* AI Suggestion Section */}
                                    <div className="space-y-3 pt-4">
                                        <div className="flex items-center gap-2 px-2">
                                            <Sparkles className="w-4 h-4 text-brand-primary" />
                                            <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">AI Response Suggestion</span>
                                            <div className="h-px flex-grow bg-white/5"></div>
                                        </div>

                                        <div className="group relative">
                                            <div className="absolute -inset-0.5 bg-gradient-to-r from-brand-primary to-violet-500 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity blur"></div>
                                            <div className="relative p-5 rounded-2xl bg-zinc-900 border border-brand-primary/20 space-y-4">
                                                <p className="text-sm text-white italic leading-relaxed">"{selectedMessage.ai_suggested_reply}"</p>
                                                <div className="flex justify-end gap-3">
                                                    <button className="btn btn-secondary py-1.5 text-xs">Edit</button>
                                                    <button 
                                                        onClick={() => handleSendReply(selectedMessage.id, selectedMessage.ai_suggested_reply)}
                                                        className="btn btn-primary py-1.5 text-xs gap-2"
                                                    >
                                                        <Send className="w-3 h-3" /> Send Reply
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Quick Reply Bar */}
                                <div className="p-6 bg-white/[0.02] border-t border-white/5">
                                    <div className="relative">
                                        <input 
                                            type="text" 
                                            placeholder="Type a custom reply..." 
                                            className="input py-3 pr-12 text-sm"
                                        />
                                        <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-brand-primary hover:scale-110 transition-transform">
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="flex-grow flex flex-col items-center justify-center p-20 text-center space-y-6 opacity-30">
                                <MessageSquare className="w-24 h-24 text-text-muted" />
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold text-white">Select a message</h3>
                                    <p className="max-w-xs mx-auto text-sm text-text-secondary leading-relaxed">Choose a conversation from the left to view details and AI engagement suggestions.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageLayout>
    );
}
