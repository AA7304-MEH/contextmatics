'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { 
  Sparkles, 
  Trash2, 
  Plus, 
  RefreshCw, 
  CheckCircle2, 
  ChevronDown,
  BookOpen,
  MessageSquare,
  History
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/context/AuthContext';

interface Fingerprint {
  id: string;
  name: string;
  is_active: boolean;
  fingerprint_data: {
    tone: string;
    intensity: number;
    vocabulary_level: string;
    sentence_structure: string;
    signature_phrases: string[];
    formatting_style: string;
    opening_pattern: string;
    cta_style: string;
    topics: string[];
    avoid: string[];
  };
  created_at: string;
}

export default function VoiceStudioPage() {
  const { user: authUser } = useAuth();

  const [samples, setSamples] = useState<string[]>(['', '', '']);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<Fingerprint | null>(null);
  const [history, setHistory] = useState<Fingerprint[]>([]);

  useEffect(() => {
    if (authUser) {
      loadHistory();
    }
  }, [authUser]);

  const loadHistory = async () => {
    try {
      const response = await fetch('/api/voice-fingerprint');
      const data = await response.json();
      if (data.success) {
        setHistory(data.data);
        const active = data.data.find((f: Fingerprint) => f.is_active);
        if (active) setResult(active);
      }
    } catch (error) {
      console.error('Failed to load fingerprint history', error);
    }
  };

  const addSample = () => {
    if (samples.length < 10) {
      setSamples([...samples, '']);
    } else {
      toast.error('Maximum 10 samples allowed');
    }
  };

  const removeSample = (index: number) => {
    if (samples.length > 3) {
      const newSamples = [...samples];
      newSamples.splice(index, 1);
      setSamples(newSamples);
    } else {
      toast.error('Minimum 3 samples required');
    }
  };

  const updateSample = (index: number, value: string) => {
    const newSamples = [...samples];
    newSamples[index] = value;
    setSamples(newSamples);
  };

  const analyzeMyVoice = async () => {
    const filledSamples = samples.filter(s => s.trim().length >= 50);
    if (filledSamples.length < 3) {
      toast.error('Please fill at least 3 samples with 50+ characters each');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/voice-fingerprint/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ samples: filledSamples, name })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        toast.success('Voice analysis complete!');
        loadHistory();
      } else {
        toast.error(data.message || 'Analysis failed');
      }
    } catch (error) {
      toast.error('An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const setActiveFingerprint = async (id: string) => {
    try {
      const response = await fetch('/api/voice-fingerprint', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: true })
      });
      const data = await response.json();
      if (data.success) {
        setResult(data.data);
        toast.success('Active voice updated');
        loadHistory();
      }
    } catch (error) {
      toast.error('Failed to update active voice');
    }
  };

  const deleteFingerprint = async (id: string) => {
    if (!confirm('Are you sure you want to delete this fingerprint?')) return;
    try {
      const response = await fetch(`/api/voice-fingerprint?id=${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      if (data.success) {
        if (result?.id === id) setResult(null);
        toast.success('Fingerprint deleted');
        loadHistory();
      }
    } catch (error) {
      toast.error('Failed to delete fingerprint');
    }
  };

  return (
    <PageLayout>
      <SEO title="Voice Studio | ContextMatic" description="Analyze and manage your unique writing voice fingerprint." />
      
      <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-3 h-3" />
            Neural Voice Engine
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white">Voice <span className="text-kinetic">Studio</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Train ContextMatic to write exactly like you. Analyze your past posts to create a DNA-level content fingerprint.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Analysis Section */}
          <div className="lg:col-span-7 space-y-8">
            <div className="card space-y-6 bg-zinc-900/50 border-white/5 backdrop-blur-sm p-8 rounded-3xl">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                  <BookOpen className="w-6 h-6 text-brand-primary" />
                  Your Writing Samples
                </h2>
                <p className="text-sm text-text-secondary">Paste 3-10 of your best LinkedIn posts or articles (min 50 chars each).</p>
              </div>

              <div className="space-y-4">
                {samples.map((sample, index) => (
                  <div key={index} className="relative group">
                    <textarea 
                      value={sample}
                      onChange={(e) => updateSample(index, e.target.value)}
                      placeholder={`Sample #${index + 1}...`}
                      className="input min-h-[120px] w-full bg-black/40 border-white/10 focus:border-brand-primary/50 transition-all rounded-2xl p-4 text-base"
                    />
                    {samples.length > 3 && (
                      <button 
                        onClick={() => removeSample(index)}
                        className="absolute top-4 right-4 p-2 text-zinc-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                
                <button 
                  onClick={addSample}
                  disabled={samples.length >= 10}
                  className="w-full py-4 border-2 border-dashed border-white/10 rounded-2xl text-zinc-500 hover:text-white hover:border-white/20 transition-all flex items-center justify-center gap-2 font-medium"
                >
                  <Plus className="w-5 h-5" /> Add Another Post
                </button>
              </div>

              <div className="pt-6 border-t border-white/5 space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Fingerprint Name</label>
                  <input 
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. LinkedIn Professional 2024"
                    className="input w-full bg-black/40 border-white/10 rounded-xl py-3"
                  />
                </div>

                <button 
                  onClick={analyzeMyVoice}
                  disabled={isLoading}
                  className="btn btn-primary w-full py-5 text-xl font-black gap-3 shadow-[0_0_30px_rgba(59,130,246,0.3)] hover:scale-[1.01] active:scale-[0.99] transition-all"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-6 h-6 animate-spin" />
                      Analyzing your writing patterns...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-6 h-6" />
                      Analyze My Voice
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Results/History Section */}
          <div className="lg:col-span-5 space-y-8">
            {/* Active Fingerprint result */}
            {result && (
              <div className="card bg-gradient-to-br from-zinc-900 to-black border-brand-primary/20 shadow-2xl rounded-3xl overflow-hidden animate-fade-in">
                <div className="p-8 space-y-8">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-2xl font-black text-white">{result.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Active Voice</span>
                      </div>
                    </div>
                    <div className="bg-brand-primary/20 p-3 rounded-2xl">
                      <Sparkles className="w-6 h-6 text-brand-primary" />
                    </div>
                  </div>

                  {/* Intensity Gauge */}
                  <div className="space-y-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-zinc-400 font-bold uppercase tracking-widest">Tone Intensity</span>
                      <span className="text-white font-black">{result.fingerprint_data.intensity}/10</span>
                    </div>
                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-blue-600 to-violet-600 transition-all duration-1000"
                        style={{ width: `${result.fingerprint_data.intensity * 10}%` }}
                      />
                    </div>
                    <p className="text-sm text-brand-primary font-medium italic">"{result.fingerprint_data.tone}"</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Vocabulary</span>
                      <span className="text-sm font-bold text-white capitalize">{result.fingerprint_data.vocabulary_level}</span>
                    </div>
                    <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Structure</span>
                      <span className="text-sm font-bold text-white line-clamp-1">{result.fingerprint_data.sentence_structure}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block">Signature Phrases</span>
                    <div className="flex flex-wrap gap-2">
                      {result.fingerprint_data.signature_phrases.map((phrase, i) => (
                        <span key={i} className="px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-xs font-medium text-brand-primary">
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4 pt-4 border-t border-white/5">
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none text-sm font-bold text-zinc-400 uppercase tracking-widest">
                        Formatting & Patterns
                        <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" />
                      </summary>
                      <div className="pt-4 space-y-4 text-sm text-zinc-300">
                        <div>
                          <span className="font-bold text-white block mb-1">Formatting habit:</span>
                          {result.fingerprint_data.formatting_style}
                        </div>
                        <div>
                          <span className="font-bold text-white block mb-1">Common hooks:</span>
                          {result.fingerprint_data.opening_pattern}
                        </div>
                      </div>
                    </details>
                  </div>
                </div>
              </div>
            )}

            {/* History Section */}
            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-2 px-2">
                <History className="w-5 h-5 text-zinc-500" />
                <h3 className="text-sm font-bold text-zinc-500 uppercase tracking-widest">Previous Fingerprints</h3>
              </div>
              
              <div className="space-y-3">
                {history.map((fp) => (
                  <div key={fp.id} className={`group glass-panel p-5 rounded-2xl transition-all ${fp.is_active ? 'border-brand-primary/30 bg-brand-primary/5' : 'hover:border-white/20'}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <History className={`w-5 h-5 ${fp.is_active ? 'text-brand-primary' : 'text-zinc-500'}`} />
                        <div>
                          <h4 className="font-bold text-white leading-none">{fp.name}</h4>
                          <span className="text-[10px] text-zinc-500 font-medium">Analyzed on {new Date(fp.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {!fp.is_active && (
                          <button 
                            onClick={() => setActiveFingerprint(fp.id)}
                            className="bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] font-bold px-3 py-1.5 rounded-lg transition-colors"
                          >
                            Set Active
                          </button>
                        )}
                        <button 
                          onClick={() => deleteFingerprint(fp.id)}
                          className="p-2 text-zinc-600 hover:text-red-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl">
                    <MessageSquare className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                    <p className="text-zinc-500 text-sm">Analyze your first voice to see it here.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
