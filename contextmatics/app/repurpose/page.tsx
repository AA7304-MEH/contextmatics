'use client';

import React, { useState } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { 
  Youtube, 
  Mic, 
  Zap, 
  RefreshCw, 
  Copy, 
  Linkedin, 
  Twitter, 
  Mail, 
  ExternalLink,
  Play,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface RepurposeResult {
  linkedin: string[];
  twitter: string[][];
  newsletter: string[];
}

interface Metadata {
  title?: string;
  author?: string;
  thumbnail?: string;
  duration?: string;
}

export default function RepurposePage() {
  const router = useRouter();
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RepurposeResult | null>(null);
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [activeTab, setActiveTab] = useState<'linkedin' | 'twitter' | 'newsletter'>('linkedin');

  const handleRepurpose = async () => {
    if (!url) {
      toast.error('Please enter a valid URL');
      return;
    }

    setIsLoading(true);
    setResult(null);
    setMetadata(null);

    try {
      const res = await fetch('/api/repurpose', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.data.output_content);
        setMetadata(data.data.metadata);
        toast.success('Repurposed successfully! ✨');
      } else {
        toast.error(data.message || 'Repurposing failed');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  const openInStudio = (content: string) => {
    sessionStorage.setItem('template_prompt', content);
    router.push('/content-creator');
  };

  return (
    <PageLayout>
      <SEO title="Repurpose Studio | ContextMatic" description="Turn videos and podcasts into multi-platform content." />
      
      <div className="max-w-5xl mx-auto space-y-12 pb-20 pt-10 px-4">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-wider">
            <Youtube className="w-3 h-3" />
            TubeRepurpose v2
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-white">Repurpose <span className="text-kinetic">Studio</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Give us one URL. We'll give you a month's worth of viral social content.
          </p>
        </div>

        {/* Input Card */}
        <div className="max-w-3xl mx-auto">
          <div className="card p-2 bg-zinc-900 border-white/5 shadow-2xl rounded-3xl flex flex-col md:flex-row gap-2">
            <div className="flex-1 flex items-center px-6 py-4 md:py-0">
              {url.includes('youtube') ? <Youtube className="w-6 h-6 text-red-500 mr-4" /> : <Mic className="w-6 h-6 text-emerald-500 mr-4" />}
              <input 
                type="text" 
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="Paste YouTube Video or Podcast RSS URL..."
                className="bg-transparent border-none focus:ring-0 text-white w-full text-lg placeholder:text-zinc-600 outline-none"
              />
            </div>
            <button 
              onClick={handleRepurpose}
              disabled={isLoading || !url}
              className="btn btn-primary px-8 py-5 md:py-4 text-lg font-black gap-2 rounded-2xl md:rounded-2xl"
            >
              {isLoading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
              {isLoading ? 'Processing...' : 'Magic Repurpose'}
            </button>
          </div>
          <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-[0.2em] font-bold">Consumes 20 Credits per full repurpose cycle</p>
        </div>

        {isLoading && (
          <div className="space-y-8 animate-fade-in py-10">
            <div className="flex flex-col items-center gap-6">
              <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center border border-brand-primary/20 animate-pulse outline outline-4 outline-brand-primary/5 outline-offset-8">
                <Sparkles className="w-10 h-10 text-brand-primary" />
              </div>
              <div className="space-y-2 text-center">
                <p className="text-2xl font-bold text-white tracking-tight">Extracting Knowledge...</p>
                <div className="flex items-center gap-2 text-zinc-500 text-sm justify-center">
                  <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping"></span>
                  Analyzing hooks and key takeaways
                </div>
              </div>
            </div>
          </div>
        )}

        {result && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-in-up">
            {/* Metadata Sidebar */}
            <div className="lg:col-span-4 space-y-6">
              {metadata && (
                <div className="card p-0 overflow-hidden bg-zinc-900 border-white/10 rounded-[32px]">
                  {metadata.thumbnail && (
                    <div className="aspect-video relative overflow-hidden group">
                      <img src={metadata.thumbnail} alt="Source" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                         <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20">
                            <Play className="w-5 h-5 text-white fill-current" />
                         </div>
                      </div>
                    </div>
                  )}
                  <div className="p-6 space-y-4">
                    <div className="space-y-1">
                      <h3 className="font-bold text-white line-clamp-2">{metadata.title}</h3>
                      <p className="text-sm text-zinc-500 font-medium">{metadata.author}</p>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-zinc-400 font-bold uppercase tracking-widest bg-white/5 p-3 rounded-xl border border-white/5">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      Content Digested
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Results Display */}
            <div className="lg:col-span-8 space-y-6">
              {/* Tabs */}
              <div className="flex p-1 bg-zinc-900/80 backdrop-blur-md border border-white/5 rounded-2xl inline-flex">
                {[
                  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin },
                  { id: 'twitter', label: 'X (Threads)', icon: Twitter },
                  { id: 'newsletter', label: 'Newsletters', icon: Mail }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-6 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 ${
                      activeTab === tab.id ? 'bg-brand-primary text-white shadow-xl' : 'text-zinc-500 hover:text-white'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Content Cards */}
              <div className="space-y-6">
                {activeTab === 'linkedin' && result.linkedin.map((post, i) => (
                  <div key={i} className="card p-8 bg-zinc-900/40 border-white/5 rounded-[32px] hover:border-brand-primary/20 transition-all space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">LinkedIn Post #{i+1}</span>
                       <div className="flex gap-2">
                         <button onClick={() => copyToClipboard(post)} className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-lg"><Copy className="w-4 h-4" /></button>
                         <button onClick={() => openInStudio(post)} className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-lg"><ExternalLink className="w-4 h-4" /></button>
                       </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{post}</p>
                  </div>
                ))}

                {activeTab === 'twitter' && result.twitter.map((thread, i) => (
                  <div key={i} className="card p-8 bg-zinc-900/40 border-white/5 rounded-[32px] hover:border-brand-primary/20 transition-all space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">X Thread #{i+1}</span>
                       <div className="flex gap-2">
                         <button onClick={() => copyToClipboard(thread.join('\n\n'))} className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-lg"><Copy className="w-4 h-4" /></button>
                         <button onClick={() => openInStudio(thread.join('\n\n'))} className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-lg"><ExternalLink className="w-4 h-4" /></button>
                       </div>
                    </div>
                    <div className="space-y-4">
                      {thread.map((tweet, tIdx) => (
                        <div key={tIdx} className="p-4 rounded-xl bg-black/20 border border-white/5 relative">
                          <span className="absolute -left-2 -top-2 w-6 h-6 rounded-full bg-brand-primary flex items-center justify-center text-[10px] font-bold text-white shadow-lg">{tIdx + 1}</span>
                          <p className="text-zinc-300 text-sm">{tweet}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {activeTab === 'newsletter' && result.newsletter.map((content, i) => (
                  <div key={i} className="card p-8 bg-zinc-900/40 border-white/5 rounded-[32px] hover:border-brand-primary/20 transition-all space-y-6">
                    <div className="flex justify-between items-center">
                       <span className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em]">Newsletter Draft #{i+1}</span>
                       <div className="flex gap-2">
                         <button onClick={() => copyToClipboard(content)} className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-lg"><Copy className="w-4 h-4" /></button>
                         <button onClick={() => openInStudio(content)} className="p-2 text-zinc-500 hover:text-white transition-colors bg-white/5 rounded-lg"><ExternalLink className="w-4 h-4" /></button>
                       </div>
                    </div>
                    <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{content}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
