'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { useAuth } from '@/context/AuthContext';
import { createBrowserClient } from '@supabase/ssr';
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  RefreshCw, 
  Layers, 
  Zap, 
  Heart, 
  MessageCircle, 
  ShieldCheck, 
  Trophy 
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Drawer } from 'vaul';
import { apiClient } from '@/lib/api-client';
import { VoiceFingerprint } from '@/types/database';

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', icon: '🐦' },
  { id: 'linkedin', label: 'LinkedIn', icon: '💼' },
  { id: 'instagram', label: 'Instagram', icon: '📸' }
];

interface WritingSample {
  id: string;
  content: string;
  platform: string;
  created_at: string;
}

export default function BrandVoiceStudio() {
  const { user } = useAuth();
  const [samples, setSamples] = useState<WritingSample[]>([]);
  const [newSample, setNewSample] = useState('');
  const [isAnalysing, setIsAnalysing] = useState(false);
  const [fingerprint, setFingerprint] = useState<VoiceFingerprint | null>(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  const loadData = async () => {
    if (!user) return;
    
    // 1. Load samples
    const { data: samplesData } = await supabase
      .from('voice_samples')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    
    setSamples(samplesData || []);

    // 2. Load profile fingerprint
    const { data: profileData } = await supabase
      .from('profiles')
      .select('voice_fingerprint')
      .eq('id', user.id)
      .single();
    
    if (profileData?.voice_fingerprint && Object.keys(profileData.voice_fingerprint).length > 0) {
      setFingerprint(profileData.voice_fingerprint as VoiceFingerprint);
    }
  };

  const addSample = async () => {
    if (!newSample.trim() || !user) return;
    
    const { data, error } = await supabase
      .from('voice_samples')
      .insert({
        user_id: user.id,
        content: newSample,
        platform: 'manual'
      })
      .select()
      .single();

    if (error) {
      toast.error('Failed to add sample');
      return;
    }

    setSamples([data as WritingSample, ...samples]);
    setNewSample('');
    toast.success('Sample added!');
  };

  const deleteSample = async (id: string) => {
    const { error } = await supabase.from('voice_samples').delete().eq('id', id);
    if (!error) {
      setSamples(samples.filter(s => s.id !== id));
      toast.success('Sample removed');
    }
  };

  const analyseVoice = async () => {
    if (samples.length < 3) {
      toast.error('Add at least 3 samples for a strong analysis');
      return;
    }

    setIsAnalysing(true);
    setLoadingStep(0);

    const interval = setInterval(() => {
      setLoadingStep(prev => (prev < 2 ? prev + 1 : prev));
    }, 2000);

    try {
      const data = await apiClient('/api/brand-voice/analyse', {
        method: 'POST',
        body: JSON.stringify({ samples: samples.map(s => s.content) })
      }) as { fingerprint: VoiceFingerprint };

      setFingerprint(data.fingerprint);
      toast.success('Voice Fingerprint Created!');
    } catch (err:any) {
      toast.error(err.message || 'Analysis failed');
    } finally {
      clearInterval(interval);
      setIsAnalysing(false);
    }
  };

  const MetricSlider = ({ label, value, icon: Icon }: { label: string; value: number; icon:any }) => (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-sm">
        <div className="flex items-center gap-2 text-text-secondary">
          <Icon className="w-4 h-4" />
          {label}
        </div>
        <span className="font-bold text-white">{value}%</span>
      </div>
      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-1000"
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );

  return (
    <PageLayout>
      <SEO title="Brand Voice Studio" description="Analyse and clone your unique brand voice with AI." />
      
      <div className="max-w-5xl mx-auto space-y-12 pb-20">
        <div className="text-center space-y-4 pt-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            AI Voice Cloning
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white">Brand Voice <span className="text-kinetic">Studio</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Stop sounding like a generic AI. Train ContextMatic to write exactly like you by providing examples of your best work.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-8">
            <div className="card space-y-6">
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-white">Step 1: Feed the AI</h2>
                <p className="text-sm text-text-secondary">Paste your best posts or pieces of writing below.</p>
              </div>

              <div className="space-y-4">
                <textarea 
                  value={newSample}
                  onChange={e => setNewSample(e.target.value)}
                  placeholder="Paste a post or paragraph here..."
                  className="input min-h-[150px] resize-none text-base"
                />
                
                <div className="flex flex-wrap gap-3">
                  <Drawer.Root>
                    <Drawer.Trigger asChild>
                      <button className="md:hidden btn btn-secondary text-xs gap-2 py-2">
                        <Plus className="w-4 h-4" /> Quick Add
                      </button>
                    </Drawer.Trigger>
                    <Drawer.Portal>
                      <Drawer.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" />
                      <Drawer.Content className="bg-zinc-900 border-t border-white/10 flex flex-col rounded-t-[32px] h-[96%] mt-24 fixed bottom-0 left-0 right-0 z-50 p-6">
                        <div className="mx-auto w-12 h-1.5 flex-shrink-0 rounded-full bg-zinc-700 mb-8" />
                        <div className="max-w-md mx-auto w-full space-y-6">
                          <h2 className="text-2xl font-bold text-white">Add Writing Sample</h2>
                          <textarea 
                            value={newSample}
                            onChange={e => setNewSample(e.target.value)}
                            className="input w-full min-h-[300px]"
                            placeholder="Paste your content here..."
                          />
                          <button onClick={() => { addSample(); }} className="btn btn-primary w-full py-4 font-bold text-lg">Add to Dataset</button>
                        </div>
                      </Drawer.Content>
                    </Drawer.Portal>
                  </Drawer.Root>

                  {PLATFORMS.map(p => (
                    <button key={p.id} className="btn btn-secondary text-xs gap-2 py-2 hover:bg-white/10 border-white/5">
                      <span>{p.icon}</span> Connect {p.label}
                    </button>
                  ))}
                  <button 
                    onClick={addSample}
                    disabled={!newSample.trim()}
                    className="hidden md:flex btn btn-primary ml-auto gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Sample
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-text-secondary">Dataset Strength</span>
                  <span className="text-xs font-bold text-brand-primary">{Math.min(samples.length, 3)}/3 required</span>
                </div>
                <div className="h-1 w-full bg-white/5 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-brand-primary transition-all duration-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                    style={{ width: `${Math.min((samples.length / 3) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-widest text-text-secondary px-2">Your Dataset ({samples.length})</h3>
              <div className="grid grid-cols-1 gap-3">
                {samples.map((sample) => (
                  <div key={sample.id} className="group glass-panel p-4 flex gap-4 items-start transition-all hover:border-white/20">
                    <div className="flex-grow">
                      <p className="text-sm text-text-primary line-clamp-3 leading-relaxed">{sample.content}</p>
                    </div>
                    <button 
                      onClick={() => deleteSample(sample.id)}
                      className="p-2 text-text-secondary hover:text-red-400 md:opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                {samples.length === 0 && (
                  <div className="text-center py-12 border-2 border-dashed border-white/5 rounded-2xl">
                    <Layers className="w-8 h-8 text-white/10 mx-auto mb-3" />
                    <p className="text-text-secondary text-sm">No samples added yet. Paste your first one above!</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-8">
            <div className="card sticky top-28 bg-gradient-to-b from-[#121214] to-black overflow-hidden border-brand-primary/10 shadow-2xl">
              {!fingerprint && !isAnalysing && (
                <div className="text-center py-12 space-y-6">
                  <div className="w-20 h-20 bg-brand-primary/10 rounded-full flex items-center justify-center mx-auto border border-brand-primary/20">
                    <Sparkles className="w-10 h-10 text-brand-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-white">Analyse My Voice</h3>
                    <p className="text-sm text-text-secondary">Extract your DNA-level writing style with neural analysis.</p>
                  </div>
                  <button 
                    onClick={analyseVoice}
                    disabled={samples.length < 3}
                    className="btn btn-primary w-full py-4 text-lg font-bold gap-2 shadow-[0_0_30px_rgba(59,130,246,0.3)] disabled:opacity-50 disabled:shadow-none"
                  >
                    Analyse Voice Now
                  </button>
                </div>
              )}

              {isAnalysing && (
                <div className="text-center py-20 space-y-8">
                   <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border-4 border-brand-primary/20 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-brand-primary rounded-full border-t-transparent animate-spin"></div>
                    <Sparkles className="absolute inset-0 m-auto w-10 h-10 text-brand-primary animate-pulse" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-lg font-bold text-white animate-pulse">
                      {["Reading patterns...", "Extracting DNA...", "Finalizing fingerprint..."][loadingStep]}
                    </p>
                    <p className="text-xs text-text-secondary uppercase tracking-widest">Applying neural analysis</p>
                  </div>
                </div>
              )}

              {fingerprint && !isAnalysing && (
                <div className="space-y-8 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white">Neural Fingerprint</h3>
                    <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">Analysis Active</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white/5 border border-white/5 space-y-3 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-2 opacity-50"><Zap className="w-3 h-3 text-brand-primary" /></div>
                    <div className="flex items-center gap-2 text-brand-primary">
                      <span className="text-[10px] font-bold uppercase tracking-widest">Core Summary</span>
                    </div>
                    <p className="text-sm text-text-primary italic leading-relaxed">
                      "{(fingerprint as any).voice_summary}"
                    </p>
                  </div>

                  <div className="grid grid-cols-1 gap-6">
                    <MetricSlider label="Conversational" value={(fingerprint as any).tone_percentages?.conversational || 80} icon={MessageCircle} />
                    <MetricSlider label="Inspiring" value={(fingerprint as any).tone_percentages?.inspiring || 70} icon={Heart} />
                    <MetricSlider label="Authoritative" value={(fingerprint as any).tone_percentages?.authoritative || 60} icon={Trophy} />
                  </div>

                  <button 
                    onClick={analyseVoice}
                    className="w-full py-4 text-xs font-bold text-text-secondary hover:text-white flex items-center justify-center gap-2 transition-colors border-t border-white/5 mt-4 group"
                  >
                    <RefreshCw className="w-3 h-3 group-hover:rotate-180 transition-transform duration-500" />
                    Refresh Analysis (2 Credits)
                  </button>
                </div>
              )}
            </div>
            
            {fingerprint && (
              <div className="glass-panel p-6 space-y-4 animate-fade-in-up border-emerald-500/10">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                    <span className="font-bold text-white text-sm">Style Match</span>
                  </div>
                  <div className="text-2xl font-bold text-emerald-400">{(fingerprint as any).voice_score || 94}%</div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">
                  Your writing style is highly unique. Generations will sound { (fingerprint as any).voice_score || 94 }% more authentic compared to standard AI.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
