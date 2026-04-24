'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { 
  Inbox, 
  Search, 
  MessageSquare, 
  Sparkles, 
  RefreshCw, 
  MoreVertical,
  Linkedin,
  Twitter,
  Instagram,
  User,
  Clock,
  ArrowRight,
  CheckCircle2,
  Zap
} from 'lucide-react';
import toast from 'react-hot-toast';

interface SocialMessage {
  id: string;
  platform: string;
  sender_handle: string;
  sender_name: string;
  message_text: string;
  status: 'pending' | 'replied';
  created_at: string;
}

export default function AudienceInboxPage() {
  const [messages, setMessages] = useState<SocialMessage[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<SocialMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/inbox?action=list');
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
        if (data.data.length > 0) setSelectedMessage(data.data[0]);
      }
    } catch (error) {
      console.error('Failed to fetch messages', error);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestReply = async () => {
    if (!selectedMessage) return;
    setIsSuggesting(true);
    try {
      const res = await fetch('/api/inbox?action=suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          messageId: selectedMessage.id, 
          text: selectedMessage.message_text,
          platform: selectedMessage.platform 
        })
      });
      const data = await res.json();
      if (data.success) {
        setReplyText(data.suggestion);
        toast.success('AI Suggestion Ready ✨');
      }
    } catch (error) {
      toast.error('Failed to get suggestion');
    } finally {
      setIsSuggesting(false);
    }
  };

  const handleSendReply = async () => {
    if (!selectedMessage || !replyText) return;
    try {
      const res = await fetch('/api/inbox?action=reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messageId: selectedMessage.id, replyText })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Reply sent successfully!');
        setReplyText('');
        fetchMessages(); // Refresh list
      }
    } catch (error) {
      toast.error('Failed to send reply');
    }
  };

  const PlatformIcon = ({ platform }: { platform: string }) => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return <Linkedin className="w-4 h-4 text-[#0A66C2]" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-4 h-4 text-white" />;
    return <Instagram className="w-4 h-4 text-[#E1306C]" />;
  };

  const filteredMessages = messages.filter(m => 
    m.sender_name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.message_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <PageLayout noScroll>
      <SEO title="Audience Inbox | ContextMatic" description="Manage all your social media engagement in one AI-powered dashboard." />
      
      <div className="flex h-[calc(100vh-80px)] overflow-hidden bg-black">
        {/* Sidebar: Message List */}
        <div className="w-full md:w-80 lg:w-96 border-r border-white/5 flex flex-col bg-zinc-900/40">
          <div className="p-6 space-y-4">
            <h1 className="text-xl font-bold text-white flex items-center gap-2">
              <Inbox className="w-5 h-5 text-brand-primary" />
              Audience Inbox
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
              <input 
                type="text" 
                placeholder="Search messages..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:border-brand-primary/50 transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {isLoading ? (
              <div className="p-10 flex justify-center"><RefreshCw className="w-6 h-6 text-zinc-700 animate-spin" /></div>
            ) : filteredMessages.length === 0 ? (
              <div className="p-10 text-center text-zinc-600 text-sm">No messages found.</div>
            ) : (
              filteredMessages.map(msg => (
                <button
                  key={msg.id}
                  onClick={() => setSelectedMessage(msg)}
                  className={`w-full text-left p-4 border-b border-white/5 transition-all hover:bg-white/5 flex gap-4 ${selectedMessage?.id === msg.id ? 'bg-brand-primary/10 border-r-2 border-r-brand-primary' : ''}`}
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center relative shrink-0">
                    <User className="w-6 h-6 text-zinc-500" />
                    <div className="absolute -bottom-1 -right-1 bg-black rounded-full p-1 border border-white/10">
                      <PlatformIcon platform={msg.platform} />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-1">
                      <h4 className="font-bold text-white text-sm truncate">{msg.sender_name || msg.sender_handle}</h4>
                      <span className="text-[10px] text-zinc-500 font-medium">{new Date(msg.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">{msg.message_text}</p>
                    {msg.status === 'replied' && (
                      <div className="mt-2 flex items-center gap-1 text-[10px] text-emerald-400 font-bold uppercase tracking-widest">
                        <CheckCircle2 className="w-3 h-3" /> Replied
                      </div>
                    )}
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* Main: Chat View */}
        <div className="flex-1 flex flex-col bg-black relative">
          {selectedMessage ? (
            <>
              {/* Chat Header */}
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-zinc-900/20">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                    <User className="w-5 h-5 text-zinc-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{selectedMessage.sender_name || selectedMessage.sender_handle}</h3>
                    <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                       <PlatformIcon platform={selectedMessage.platform} />
                       {selectedMessage.platform}
                    </div>
                  </div>
                </div>
                <button className="p-2 text-zinc-600 hover:text-white transition-colors"><MoreVertical className="w-5 h-5" /></button>
              </div>

              {/* Message Thread */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
                {/* User Message */}
                <div className="flex flex-col items-start max-w-2xl">
                  <div className="bg-zinc-900 border border-white/5 p-5 rounded-2xl rounded-tl-none shadow-xl text-zinc-300">
                    {selectedMessage.message_text}
                  </div>
                  <div className="mt-2 flex items-center gap-2 px-1 text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> Received 2 hours ago
                  </div>
                </div>

                {/* AI Helper Banner */}
                {selectedMessage.status === 'pending' && !replyText && (
                  <div className="p-6 bg-brand-primary/10 border border-brand-primary/20 rounded-3xl flex items-center justify-between gap-6 animate-fade-in">
                    <div className="flex items-center gap-4">
                       <div className="w-12 h-12 bg-brand-primary/20 rounded-2xl flex items-center justify-center">
                          <Sparkles className="w-6 h-6 text-brand-primary" />
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white">Let ContextMatic draft a reply</p>
                         <p className="text-xs text-zinc-500">We'll use your Voice Fingerprint to keep it authentic.</p>
                       </div>
                    </div>
                    <button 
                      onClick={suggestReply}
                      disabled={isSuggesting}
                      className="btn btn-primary px-6 py-3 text-xs font-black uppercase tracking-widest gap-2 shadow-xl shadow-brand-primary/10"
                    >
                      {isSuggesting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                      Get Suggestion
                    </button>
                  </div>
                )}
              </div>

              {/* Reply Area */}
              <div className="p-6 bg-zinc-900/40 border-t border-white/5 space-y-4">
                <div className="relative">
                  <textarea 
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder="Type your reply or use AI suggestion..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-base text-white min-h-[140px] focus:border-brand-primary/50 transition-all outline-none resize-none shadow-inner"
                  />
                  {!replyText && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none opacity-10">
                      <MessageSquare className="w-20 h-20" />
                    </div>
                  )}
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest px-2">
                    Replying to {selectedMessage.sender_name}
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => setReplyText('')}
                      className="px-6 py-3 rounded-xl text-xs font-bold text-zinc-500 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                    <button 
                      onClick={handleSendReply}
                      disabled={!replyText}
                      className="btn btn-primary px-8 py-3 text-xs font-bold uppercase tracking-widest gap-2 shadow-xl"
                    >
                      Send Reply
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-zinc-700 space-y-4">
               <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center border border-white/5">
                  <Inbox className="w-10 h-10" />
               </div>
               <p className="text-sm font-medium">Select a message to start engaging.</p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
}
