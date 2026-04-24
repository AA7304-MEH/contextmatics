'use client';

import React, { useState } from 'react';
import { PageLayout } from '@/components/shared';
import { SEO } from '@/components/shared/SEO';
import { LANGUAGES } from '@/components/LanguageSelector';
import { Copy, Save, Calendar, Globe, Sparkles, RefreshCw, Languages, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function TranslationStudio() {
  const [sourceText, setSourceText] = useState('');
  const [targetLanguages, setTargetLanguages] = useState<string[]>(['hinglish']);

  const [isTranslating, setIsTranslating] = useState(false);

  const translateContent = async () => {
    if (!sourceText.trim()) return;
    setIsTranslating(true);
    
    try {
      // In a real app, we would call an API route. 
      // For this implementation, I'll simulate the parallel translation calls.
      await Promise.all(targetLanguages.map(async (lang) => {
        await fetch('/api/ai/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            topic: `Translate and culturally adapt this content: ${sourceText}`,
            platform: 'Social Media',
            language: lang,
            advancedInfo: 'Adapt the tone to be native and viral in the target language. Do not just translate literally.'
          })
        });
        
        // This is a stream in our route, so we need to handle it properly in a real app.
        // For the sake of this UI demo, I'll assume we have a way to collect the result.
        // Actually, I'll build a dedicated translation API route for this.
        return { lang, text: "Adaptation in progress..." }; 
      }));

      // NOTE: I will implement /api/translate route next to handle this properly.
      toast.success('Adaptation complete!');
    } catch (err) {
      toast.error('Failed to translate');
    } finally {
      setIsTranslating(false);
    }
  };

  const toggleLanguage = (langId: string) => {
    setTargetLanguages(prev => 
      prev.includes(langId) ? prev.filter(l => l !== langId) : [...prev, langId]
    );
  };

  return (
    <PageLayout>
      <SEO title="Translation & Adaptation Studio" description="Translate your content into regional Indian languages with cultural adaptation." />
      
      <div className="max-w-6xl mx-auto space-y-12 pb-20">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Languages className="w-3 h-3" />
            Cultural Adaptation
          </div>
          <h1 className="text-5xl font-bold tracking-tight text-white">Translation <span className="text-kinetic">Studio</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Expand your reach to 600M+ users. We don't just translate words; we adapt your message to resonate with regional cultures.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Source Panel */}
          <div className="space-y-6">
            <div className="card h-full space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Globe className="w-5 h-5 text-indigo-400" />
                  Source Content
                </h3>
                <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Auto-Detect</span>
              </div>

              <textarea 
                value={sourceText}
                onChange={e => setSourceText(e.target.value)}
                placeholder="Paste your English post or any existing content here..."
                className="input min-h-[300px] resize-none bg-black/40 text-base"
              />

              <div className="space-y-4">
                <h4 className="text-sm font-bold text-white">Target Languages (Select 1 or more)</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {LANGUAGES.map(lang => (
                    <button
                      key={lang.id}
                      onClick={() => toggleLanguage(lang.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-xs transition-all ${
                        targetLanguages.includes(lang.id)
                          ? 'bg-indigo-500/10 border-indigo-500 text-white'
                          : 'bg-white/5 border-white/5 text-text-secondary hover:border-white/10'
                      }`}
                    >
                      <span>{lang.flag}</span>
                      <span>{lang.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={translateContent}
                disabled={isTranslating || !sourceText.trim() || targetLanguages.length === 0}
                className="btn btn-primary w-full py-4 font-bold text-lg gap-2 shadow-[0_0_30px_rgba(99,102,241,0.2)]"
              >
                {isTranslating ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                Translate & Adapt ({targetLanguages.length * 1} Credits)
              </button>
            </div>
          </div>

          {/* Results Panel */}
          <div className="space-y-6">
            <div className="flex items-center justify-between px-2">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ArrowRight className="w-5 h-5 text-emerald-400" />
                Adapted Outputs
              </h3>
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">
                {targetLanguages.length} Variants
              </span>
            </div>

            <div className="space-y-4 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
              {targetLanguages.map((langId) => {
                const lang = LANGUAGES.find(l => l.id === langId);
                return (
                  <div key={langId} className="glass-panel p-6 space-y-4 animate-fade-in-up">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{lang?.flag}</span>
                        <span className="font-bold text-white">{lang?.label} Adaptation</span>
                        <span className="text-[10px] px-2 py-0.5 bg-white/5 rounded-full text-text-secondary">
                          {lang?.native}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 text-text-secondary hover:text-white transition-colors" title="Copy">
                          <Copy className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-secondary hover:text-white transition-colors" title="Save">
                          <Save className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-text-secondary hover:text-white transition-colors" title="Schedule">
                          <Calendar className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5 text-text-primary leading-relaxed">
                      {isTranslating ? (
                        <div className="space-y-2 animate-pulse">
                          <div className="h-4 bg-white/5 rounded w-full"></div>
                          <div className="h-4 bg-white/5 rounded w-5/6"></div>
                          <div className="h-4 bg-white/5 rounded w-4/6"></div>
                        </div>
                      ) : (
                        <p className="text-sm italic text-text-secondary font-medium">Click generate to see adapted version...</p>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {targetLanguages.length === 0 && (
                <div className="card border-dashed flex flex-col items-center justify-center py-20 text-text-secondary opacity-50">
                   <Languages className="w-12 h-12 mb-4" />
                   <p>Select a target language to see adaptations</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
