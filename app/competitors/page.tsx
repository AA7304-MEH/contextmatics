'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { 
  Users, 
  Search, 
  Zap, 
  RefreshCw, 
  ShieldAlert, 
  Target, 
  BarChart, 
  ChevronRight,
  Linkedin,
  Twitter,
  Instagram,
  Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Competitor {
  id: string;
  handle: string;
  platform: string;
  analysis_data: {
    strengths: string[];
    content_strategy: string;
    hook_patterns: string[];
    estimated_engagement: string;
    monetization_clues: string[];
    opportunity: string;
  };
  last_analyzed_at: string;
}

export default function CompetitorIntelPage() {
  const [handle, setHandle] = useState('');
  const [platform, setPlatform] = useState('LinkedIn');
  const [competitors, setCompetitors] = useState<Competitor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchCompetitors();
  }, []);

  const fetchCompetitors = async () => {
    try {
      const res = await fetch('/api/competitors');
      const data = await res.json();
      if (data.success) {
        setCompetitors(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch competitors', error);
    } finally {
      setIsFetching(false);
    }
  };

  const analyzeCompetitor = async () => {
    if (!handle) {
      toast.error('Please enter a handle or URL');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/competitors?action=analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ competitorHandle: handle, platform })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Market intelligence extracted! 🕵️‍♂️');
        setHandle('');
        fetchCompetitors();
      } else {
        toast.error(data.message || 'Analysis failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const PlatformIcon = ({ p }: { p: string }) => {
    const plat = p.toLowerCase();
    if (plat.includes('linkedin')) return <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
    if (plat.includes('twitter') || plat.includes('x')) return <Twitter className="w-5 h-5 text-white" />;
    return <Instagram className="w-5 h-5 text-[#E1306C]" />;
  };

  return (
    <PageLayout>
      <SEO title="Competitor Intel | ContextMatic" description="Reverse-engineer your competition's content strategy with AI." />
      
      <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-bold uppercase tracking-wider">
            <Users className="w-3 h-3" />
            Creator Intelligence
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Competitor <span className="text-kinetic">Intel</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Spy on growth strategies. Reverse-engineer viral hooks. Dominate your niche by knowing exactly what works for them.
          </p>
        </div>

        {/* Action Bar */}
        <div className="max-w-4xl mx-auto">
          <div className="card p-4 bg-zinc-900 border-white/5 shadow-2xl rounded-3xl flex flex-col md:flex-row gap-4">
            <div className="flex-[2] flex items-center px-4">
              <Search className="w-5 h-5 text-zinc-500 mr-4" />
              <input 
                type="text" 
                value={handle}
                onChange={e => setHandle(e.target.value)}
                placeholder="Competitor handle or profile URL..."
                className="bg-transparent border-none focus:ring-0 text-white w-full text-base placeholder:text-zinc-600 outline-none"
              />
            </div>
            <div className="flex-1">
              <select 
                value={platform} 
                onChange={e => setPlatform(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-2xl py-3 px-4 text-sm text-white outline-none focus:border-brand-primary"
              >
                <option value="LinkedIn">LinkedIn</option>
                <option value="Twitter">Twitter/X</option>
                <option value="Instagram">Instagram</option>
              </select>
            </div>
            <button 
              onClick={analyzeCompetitor}
              disabled={isLoading || !handle}
              className="btn btn-primary px-8 py-4 text-sm font-black uppercase tracking-widest gap-2"
            >
              {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
              Spy Now
            </button>
          </div>
          <p className="text-center text-[10px] text-zinc-600 mt-4 uppercase tracking-[0.2em] font-bold">Consumes 5 Credits per profile analysis</p>
        </div>

        {/* Competitor Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {isFetching ? (
            <div className="col-span-full py-20 flex justify-center"><RefreshCw className="w-10 h-10 text-zinc-800 animate-spin" /></div>
          ) : competitors.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] space-y-4">
               <ShieldAlert className="w-12 h-12 text-zinc-800 mx-auto" />
               <p className="text-zinc-500 font-medium text-lg">Your intelligence board is empty. Start by spying on your first competitor.</p>
            </div>
          ) : (
            competitors.map(comp => (
              <div key={comp.id} className="card bg-zinc-900/40 border-white/5 rounded-[40px] p-8 space-y-8 hover:border-violet-500/20 transition-all group relative overflow-hidden">
                {/* Background Glow */}
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-violet-600/5 rounded-full blur-[60px] group-hover:bg-violet-600/10 transition-colors"></div>
                
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center border border-white/5">
                      <PlatformIcon p={comp.platform} />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">{comp.handle}</h3>
                      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Last Intel: {new Date(comp.last_analyzed_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-violet-500/10 border border-violet-500/20 rounded-full text-[10px] font-bold text-violet-400 uppercase tracking-widest">
                    <BarChart className="w-3 h-3" />
                    {comp.analysis_data.estimated_engagement} Engagement
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                      <Target className="w-3 h-3 text-brand-primary" /> Strategy Extract
                    </span>
                    <p className="text-sm text-zinc-300 leading-relaxed font-medium">
                      {comp.analysis_data.content_strategy}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Signature Hooks</span>
                      <div className="flex flex-col gap-2">
                        {comp.analysis_data.hook_patterns.slice(0, 2).map((h, i) => (
                          <div key={i} className="text-xs text-zinc-400 bg-white/5 p-2 rounded-lg border border-white/5 truncate">
                            "{h}"
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Core Strengths</span>
                      <div className="flex flex-wrap gap-2">
                        {comp.analysis_data.strengths.slice(0, 2).map((s, i) => (
                          <span key={i} className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 space-y-1">
                    <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest flex items-center gap-2">
                      <Zap className="w-3 h-3" /> Growth Opportunity
                    </span>
                    <p className="text-xs text-brand-primary font-bold">
                      {comp.analysis_data.opportunity}
                    </p>
                  </div>
                </div>

                <div className="pt-2 flex justify-between items-center relative z-10">
                  <button className="text-xs font-bold text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
                    View Full Intel Brief <ChevronRight className="w-3 h-3" />
                  </button>
                  <button className="p-2 text-zinc-700 hover:text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
}
