'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { 
  DollarSign, 
  Zap, 
  RefreshCw, 
  Trophy, 
  ShieldCheck, 
  Sparkles,
  ChevronRight,
  Split,
  Layout,
  BarChart3
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Idea {
  id: string;
  title: string;
  type: string;
  estimated_revenue: string;
  difficulty: number;
  offer_structure: string;
}

interface ABTest {
  id: string;
  test_name: string;
  hypothesis: string;
  variant_a: string;
  variant_b: string;
  status: string;
}

export default function MonetisationStudioPage() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [tests, setTests] = useState<ABTest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/monetisation');
      const data = await res.json();
      if (data.success) {
        setIdeas(data.ideas);
        setTests(data.tests);
      }
    } catch (error) {
      console.error('Failed to fetch monetisation data', error);
    } finally {
      setIsFetching(false);
    }
  };

  const analyzeRevenue = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/monetisation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'analyze' })
      });
      const data = await res.json();
      if (data.success) {
        toast.success('Revenue opportunities identified! 💰');
        fetchData();
      } else {
        toast.error(data.message || 'Analysis failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PageLayout>
      <SEO title="Monetisation Studio | ContextMatic" description="AI-powered revenue engine for creators. Identify offers and A/B test messaging." />
      
      <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-10 px-4">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold uppercase tracking-wider">
            <DollarSign className="w-3 h-3" />
            Revenue Engine
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Monetisation <span className="text-kinetic">Studio</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Turn your audience into a scalable business. We'll find the gaps in your revenue and structure irresistible offers for you.
          </p>
        </div>

        {/* Global Action */}
        <div className="max-w-xl mx-auto">
          <button 
            onClick={analyzeRevenue}
            disabled={isLoading}
            className="btn btn-primary w-full py-5 text-xl font-black gap-3 shadow-[0_0_50px_rgba(245,158,11,0.2)] hover:scale-[1.01] transition-all"
          >
            {isLoading ? <RefreshCw className="w-6 h-6 animate-spin" /> : <Zap className="w-6 h-6" />}
            {isLoading ? 'Engineering Revenue...' : 'Analyze My Monetisation (10 Credits)'}
          </button>
        </div>

        {isFetching ? (
          <div className="py-20 flex justify-center"><RefreshCw className="w-10 h-10 text-zinc-800 animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            {/* Left Column: Product Ideas */}
            <div className="lg:col-span-7 space-y-8">
              <div className="flex items-center gap-3 px-2">
                <Trophy className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-white">Revenue Opportunities</h2>
              </div>

              <div className="space-y-6">
                {ideas.map((idea) => (
                  <div key={idea.id} className="card bg-zinc-900 border-white/5 p-8 rounded-[40px] group hover:border-amber-500/20 transition-all">
                    <div className="flex justify-between items-start mb-6">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">{idea.type}</span>
                        <h3 className="text-2xl font-bold text-white tracking-tight">{idea.title}</h3>
                      </div>
                      <div className="bg-amber-500/10 border border-amber-500/20 px-4 py-2 rounded-2xl">
                         <span className="text-sm font-black text-amber-400">{idea.estimated_revenue}</span>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="p-5 rounded-2xl bg-black/40 border border-white/5 space-y-2">
                         <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                           <Layout className="w-3 h-3" /> Offer Structure
                         </span>
                         <p className="text-sm text-zinc-300 leading-relaxed font-medium">"{idea.offer_structure}"</p>
                      </div>

                      <div className="flex items-center justify-between pt-2">
                         <div className="flex items-center gap-4">
                           <div className="flex gap-1">
                             {[...Array(5)].map((_, i) => (
                               <div key={i} className={`w-1.5 h-4 rounded-full ${i < idea.difficulty ? 'bg-amber-500' : 'bg-zinc-800'}`} />
                             ))}
                           </div>
                           <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest">Difficulty {idea.difficulty}/5</span>
                         </div>
                         <button className="text-xs font-bold text-zinc-500 hover:text-white flex items-center gap-2 transition-colors">
                           Start Building <ChevronRight className="w-4 h-4" />
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
                {ideas.length === 0 && (
                   <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[40px] text-zinc-600">
                     Run an analysis to see business opportunities.
                   </div>
                )}
              </div>
            </div>

            {/* Right Column: A/B Testing Lab */}
            <div className="lg:col-span-5 space-y-8">
              <div className="flex items-center gap-3 px-2">
                <Split className="w-6 h-6 text-brand-primary" />
                <h2 className="text-2xl font-bold text-white">A/B Test Lab</h2>
              </div>

              <div className="space-y-6">
                {tests.map((test) => (
                  <div key={test.id} className="card bg-zinc-900/50 border-white/5 p-8 rounded-[40px] space-y-6">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-bold text-white truncate max-w-[200px]">{test.test_name}</h4>
                      <span className="px-3 py-1 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-[10px] font-bold text-brand-primary uppercase">Draft</span>
                    </div>

                    <div className="space-y-4">
                      {/* Variant A */}
                      <div className="bg-black/40 p-5 rounded-3xl border-l-4 border-l-brand-primary border border-white/5 space-y-2">
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-widest">Variant A: Logic</span>
                        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{test.variant_a}</p>
                      </div>

                      {/* Variant B */}
                      <div className="bg-black/40 p-5 rounded-3xl border-l-4 border-l-violet-500 border border-white/5 space-y-2">
                        <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Variant B: Emotion</span>
                        <p className="text-xs text-zinc-400 line-clamp-3 leading-relaxed">{test.variant_b}</p>
                      </div>

                      <div className="pt-4 flex flex-col gap-4">
                         <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                           <ShieldCheck className="w-4 h-4" /> Psychological Split Test Ready
                         </div>
                         <button className="btn btn-secondary w-full py-3 text-xs font-bold gap-2">
                           <BarChart3 className="w-4 h-4" /> Create Live Test
                         </button>
                      </div>
                    </div>
                  </div>
                ))}
                {tests.length === 0 && (
                   <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-[40px] text-zinc-600">
                     A/B tests will appear here.
                   </div>
                )}
              </div>

              {/* Stats Card */}
              <div className="card bg-gradient-to-br from-zinc-900 to-black border-white/10 p-8 rounded-[40px] relative overflow-hidden group">
                 <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform duration-700"><Sparkles className="w-32 h-32 text-amber-500" /></div>
                 <div className="space-y-4 relative z-10">
                    <h3 className="text-lg font-bold text-white">Revenue DNA</h3>
                    <p className="text-xs text-zinc-500">We analyze your conversion psychology to suggest the best offer structures.</p>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                       <div className="h-full bg-amber-500 w-[65%]" />
                    </div>
                    <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest">Optimization Quotient: 65%</p>
                 </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
