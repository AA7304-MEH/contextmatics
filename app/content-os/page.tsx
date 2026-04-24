'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { 
  Sparkles, 
  CheckCircle2, 
  RefreshCw,
  Layout,
  Zap,
  Twitter,
  Linkedin,
  Instagram,
  Globe,
  PenTool
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

interface PlanSchedule {
  day: number;
  platform: string;
  concept: string;
  hook: string;
  visual: string;
}

interface ContentPlan {
  id: string;
  plan_data: {
    niche: string;
    goals: string;
    platforms: string[];
    schedule: PlanSchedule[];
  };
  created_at: string;
}

export default function ContentOSPage() {
  const router = useRouter();
  const [plan, setPlan] = useState<ContentPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form State
  const [niche, setNiche] = useState('');
  const [goals, setGoals] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['LinkedIn', 'Twitter']);

  useEffect(() => {
    fetchPlan();
  }, []);

  const fetchPlan = async () => {
    try {
      const res = await fetch('/api/content-os');
      const data = await res.json();
      if (data.success && data.data) {
        setPlan(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch plan', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewPlan = async () => {
    if (!niche || !goals || selectedPlatforms.length === 0) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/content-os/generate-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ niche, goals, platforms: selectedPlatforms })
      });
      const data = await res.json();
      if (data.success) {
        setPlan(data.data);
        toast.success('Strategy generated! 🚀');
      } else {
        toast.error(data.message || 'Generation failed');
      }
    } catch (error) {
      toast.error('Analysis failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleGenerateDraft = (concept: string) => {
    sessionStorage.setItem('template_prompt', concept);
    router.push('/content-creator');
  };

  const PlatformIcon = ({ platform }: { platform: string }) => {
    const p = platform.toLowerCase();
    if (p.includes('linkedin')) return <Linkedin className="w-5 h-5 text-[#0A66C2]" />;
    if (p.includes('twitter') || p.includes('x')) return <Twitter className="w-5 h-5 text-white" />;
    if (p.includes('instagram')) return <Instagram className="w-5 h-5 text-[#E1306C]" />;
    return <Globe className="w-5 h-5 text-zinc-400" />;
  };

  if (isLoading) {
    return (
      <PageLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-12 h-12 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout>
      <SEO title="Content OS | ContextMatic" description="Automated 7-day content strategy for elite creators." />
      
      <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
              <RefreshCw className="w-3 h-3" />
              Fully Automated
            </div>
            <h1 className="text-5xl font-bold tracking-tight text-white">Content <span className="text-kinetic">OS</span></h1>
            <p className="text-text-secondary text-lg max-w-xl">
              Your entire week of content, architected by AI based on your goals.
            </p>
          </div>
          {plan && (
            <button 
              onClick={() => { if(confirm('Generate a new week? (5 Credits)')) setPlan(null); }}
              className="btn bg-white/5 hover:bg-white/10 text-zinc-400 border-white/5 gap-2"
            >
              <RefreshCw className="w-4 h-4" /> Reset Week
            </button>
          )}
        </div>

        {!plan ? (
          <div className="max-w-2xl mx-auto animate-fade-in-up">
            <div className="card space-y-8 bg-zinc-900/50 border-white/5 backdrop-blur-xl p-10 rounded-[32px] shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10"><Sparkles className="w-32 h-32" /></div>
              
              <div className="space-y-6 relative z-10">
                <div className="space-y-3 text-center">
                  <h2 className="text-2xl font-bold text-white">Initialize Your Engine</h2>
                  <p className="text-zinc-500">Provide your focus and we'll handle the strategy.</p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Your Niche</label>
                    <input 
                      type="text" 
                      value={niche}
                      onChange={e => setNiche(e.target.value)}
                      placeholder="e.g. Sales Coaching, Web3 Marketing, SaaS Growth..."
                      className="input w-full py-4 px-5 bg-black/40 border-white/10 rounded-2xl text-lg"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Weekly Goal</label>
                    <textarea 
                      value={goals}
                      onChange={e => setGoals(e.target.value)}
                      placeholder="e.g. Build authority in LinkedIn Ads and drive traffic to my newsletter."
                      className="input w-full h-32 p-5 bg-black/40 border-white/10 rounded-2xl text-lg resize-none"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-zinc-400 uppercase tracking-widest pl-1">Target Platforms</label>
                    <div className="flex flex-wrap gap-2">
                      {['LinkedIn', 'Twitter', 'Instagram', 'Blog'].map(p => (
                        <button
                          key={p}
                          onClick={() => {
                            if (selectedPlatforms.includes(p)) setSelectedPlatforms(selectedPlatforms.filter(i => i !== p));
                            else setSelectedPlatforms([...selectedPlatforms, p]);
                          }}
                          className={`px-6 py-3 rounded-xl border text-sm font-bold transition-all ${
                            selectedPlatforms.includes(p) 
                              ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-[0_0_20px_rgba(59,130,246,0.2)]' 
                              : 'bg-white/5 border-white/10 text-zinc-500 hover:border-white/20'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <button 
                  onClick={generateNewPlan}
                  disabled={isGenerating}
                  className="btn btn-primary w-full py-5 text-xl font-black gap-3 shadow-[0_0_50px_rgba(34,197,94,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Architecting Week...
                    </>
                  ) : (
                    <>
                      <Zap className="w-6 h-6" />
                      Build 7-Day Strategy
                    </>
                  )}
                </button>
                <p className="text-center text-[10px] text-zinc-600 uppercase tracking-[0.2em] font-bold">Costs 5 Credits</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-12 animate-fade-in">
            {/* Strategy Header Card */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Active Niche</span>
                <p className="text-white font-bold">{plan.plan_data.niche}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-1">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Main Objective</span>
                <p className="text-white font-bold line-clamp-1">{plan.plan_data.goals}</p>
              </div>
              <div className="p-6 bg-white/5 border border-white/5 rounded-2xl space-y-1 text-center md:text-right">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Cycle Ends</span>
                <p className="text-emerald-400 font-bold">Active Week</p>
              </div>
            </div>

            {/* Vertical Timeline View */}
            <div className="space-y-6">
              {plan.plan_data.schedule.map((item, idx) => (
                <div key={idx} className="group flex gap-6 items-start relative">
                  {/* Timeline track */}
                  <div className="flex flex-col items-center pt-2">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 border-brand-primary flex items-center justify-center text-sm font-black text-white z-10 shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                      {idx + 1}
                    </div>
                    {idx < plan.plan_data.schedule.length - 1 && (
                      <div className="w-0.5 h-full bg-gradient-to-b from-brand-primary to-transparent mt-2"></div>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className="flex-1 card bg-zinc-900/40 border-white/5 p-8 rounded-[32px] group-hover:border-white/20 transition-all hover:bg-zinc-900/60 flex flex-col md:flex-row gap-8">
                    <div className="flex-1 space-y-6">
                      <div className="flex items-center justify-between">
                         <div className="flex items-center gap-2">
                           <PlatformIcon platform={item.platform} />
                           <span className="text-sm font-bold text-zinc-400 uppercase tracking-[0.2em]">{item.platform}</span>
                         </div>
                         <div className="px-3 py-1 bg-white/5 rounded-full text-[10px] font-bold text-zinc-500">Day {item.day}</div>
                      </div>

                      <div className="space-y-4 text-left">
                        <h3 className="text-2xl font-bold text-white leading-tight">{item.concept}</h3>
                        
                        <div className="p-4 rounded-xl bg-black/40 border border-white/5 space-y-2">
                          <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Recommended Hook</span>
                          <p className="text-sm text-zinc-300 italic">"{item.hook}"</p>
                        </div>
                        
                        <div className="flex items-center gap-2 text-zinc-500">
                          <Layout className="w-4 h-4" />
                          <span className="text-[11px] font-medium">Visual: {item.visual}</span>
                        </div>
                      </div>
                    </div>

                    <div className="md:w-48 flex flex-col justify-end">
                      <button 
                        onClick={() => handleGenerateDraft(item.concept)}
                        className="btn btn-primary w-full py-4 text-sm font-bold gap-2 group/btn"
                      >
                         <PenTool className="w-4 h-4 group-hover/btn:rotate-12 transition-transform" />
                         Build Draft
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-12 text-center border-t border-white/5 space-y-4">
              <div className="inline-flex items-center gap-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold">Your strategy is ready to execute.</span>
              </div>
              <p className="text-zinc-500 text-sm">ContextMatic will learn from your engagement and optimize next week's plan.</p>
            </div>
          </div>
        )}
      </div>
    </PageLayout>
  );
}
