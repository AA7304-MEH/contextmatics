'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { 
  Loader2, 
  CheckCircle2, 
  Wand2, 
  Sparkles, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Instagram, 
  ArrowRight,
  Zap,
  Layout,
  Target,
  DollarSign,
  Anchor
} from 'lucide-react';
import confetti from 'canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';

interface Niche {
  id: string;
  title: string;
  icon: React.ReactNode;
  desc: string;
}

const NICHES: Niche[] = [
  { id: 'creator', title: 'Creator/Influencer', icon: '📸', desc: 'Growing a personal brand' },
  { id: 'smm', title: 'Social Media Manager', icon: '📱', desc: 'Managing multiple accounts' },
  { id: 'agency', title: 'Marketing Agency', icon: '🏢', desc: 'Handling client content' },
  { id: 'business', title: 'Small Business', icon: '🏪', desc: 'Selling products/services' },
];

const TONES = [
  { id: 'professional', title: 'Professional', desc: 'Clear and authoritative' },
  { id: 'casual', title: 'Casual & Fun', desc: 'Relatable and enthusiast' },
  { id: 'bold', title: 'Bold & Direct', desc: 'Punchy and opinionated' },
];

const LANGUAGES = [
  'English', 'Hinglish', 'Hindi', 'Spanish', 'French', 
  'German', 'Portuguese', 'Japanese', 'Korean', 'Arabic'
];

interface FeatureCard {
  icon: React.ReactNode;
  title: string;
  desc: string;
}

const FEATURES: FeatureCard[] = [
  { icon: <Zap className="w-5 h-5 text-amber-400" />, title: 'Voice Studio', desc: 'AI that sounds like you.' },
  { icon: <Youtube className="w-5 h-5 text-red-500" />, title: 'Repurpose', desc: 'Video to 10+ posts.' },
  { icon: <Layout className="w-5 h-5 text-blue-500" />, title: 'Content OS', desc: '7-day automated plans.' },
  { icon: <Target className="w-5 h-5 text-emerald-500" />, title: 'Intel', desc: 'Spy on competitors.' },
  { icon: <DollarSign className="w-5 h-5 text-purple-500" />, title: 'Monetize', desc: 'Analyze revenue gaps.' },
  { icon: <Anchor className="w-5 h-5 text-sky-500" />, title: 'Hook Lab', desc: 'Proven viral structures.' },
];

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState('');

  // Step 1: Niche
  const [niche, setNiche] = useState('');
  
  // Step 2: Voice & Language
  const [brandVoice, setBrandVoice] = useState('professional');
  const [language, setLanguage] = useState('English');
  const [brandDesc, setBrandDesc] = useState('');

  // Step 3: Connections
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);

  // Step 4: Magic Generation
  const [prompt, setPrompt] = useState('');
  const [generationOutput, setGenerationOutput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  useEffect(() => {
    async function checkUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/sign-in');
        return;
      }
      setUserId(user.id);
      const name = user.user_metadata?.full_name?.split(' ')[0] || user.user_metadata?.name?.split(' ')[0] || 'there';
      setFirstName(name);
    }
    checkUser();
  }, [router, supabase]);

  const handleNext = () => {
    if (step < 4) setStep(s => s + 1);
  };

  const connectPlatform = (id: string) => {
    if (connectedPlatforms.includes(id)) {
      setConnectedPlatforms(prev => prev.filter(p => p !== id));
    } else {
      setConnectedPlatforms(prev => [...prev, id]);
      toast.success(`Connected to ${id}!`);
    }
  };

  const startGeneration = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenerationOutput('');
    
    try {
      const response = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          topic: prompt,
          language,
          platform: 'LinkedIn',
          tone: brandVoice,
          brandVoice: brandDesc,
          useBrandVoice: !!brandDesc
        }),
      });

      if (!response.ok) throw new Error('Generation failed');

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        let done = false;
        while (!done) {
          const { value, done: doneReading } = await reader.read();
          done = doneReading;
          const chunkValue = decoder.decode(value);
          
          // AI SDK streaming format: 0:"text"
          const lines = chunkValue.split('\n');
          for (const line of lines) {
            if (line.startsWith('0:')) {
              try {
                const text = JSON.parse(line.substring(2));
                setGenerationOutput(prev => prev + text);
              } catch {
                // Ignore parse errors for partial chunks
              }
            }
          }
        }
      }
      setHasGenerated(true);
    } catch (error) {
       toast.error('Magic failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const finishOnboarding = async () => {
    if (!userId) return;
    setIsLoading(true);
    
    try {
      const { error } = await supabase.from('profiles').update({
        niche,
        brand_voice: brandVoice,
        brand_description: brandDesc,
        preferred_language: language.toLowerCase(),
        onboarding_completed: true,
      }).eq('id', userId);

      if (error) throw error;

      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6366f1', '#10b981', '#f59e0b']
      });

      toast.success('Onboarding complete! 🚀');
      
      setTimeout(() => {
        router.push('/dashboard');
        router.refresh();
      }, 2000);

    } catch (error) {
      toast.error('Failed to save settings.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-start pt-12 px-4 pb-20">
      <Toaster position="top-center" />
      
      <div className="w-full max-w-2xl bg-zinc-900/40 border border-zinc-800 rounded-3xl p-6 md:p-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-zinc-800">
          <div 
            className="h-full bg-indigo-500 transition-all duration-500 ease-out shadow-[0_0_10px_#6366f1]" 
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Header Section */}
        <div className="mb-10 text-center sm:text-left pt-4">
          <div className="flex items-center gap-2 mb-2 justify-center sm:justify-start">
             <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center font-bold text-black">C</div>
             <span className="font-bold tracking-tight text-zinc-400">Step {step} of 4</span>
          </div>
          {step === 1 && <h1 className="text-3xl font-bold tracking-tight">Tell us about you, {firstName}</h1>}
          {step === 2 && <h1 className="text-3xl font-bold tracking-tight">Define your signature style</h1>}
          {step === 3 && <h1 className="text-3xl font-bold tracking-tight">Connect your channels</h1>}
          {step === 4 && <h1 className="text-3xl font-bold tracking-tight">Witness the magic 🪄</h1>}
        </div>

        {/* Step 1: Niche */}
        {step === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {NICHES.map(n => (
                <button
                  key={n.id}
                  onClick={() => setNiche(n.id)}
                  className={`flex items-start p-5 rounded-[20px] border text-left transition-all ${niche === n.id ? 'border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.1)]' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}
                >
                  <span className="text-3xl mr-4">{n.icon}</span>
                  <div>
                    <h3 className="font-bold text-zinc-100">{n.title}</h3>
                    <p className="text-xs text-zinc-500 mt-1">{n.desc}</p>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleNext}
              disabled={!niche}
              className="w-full py-4 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Step 2: Tone & Voice */}
        {step === 2 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Primary Tone</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {TONES.map(t => (
                  <button
                    key={t.id}
                    onClick={() => setBrandVoice(t.id)}
                    className={`p-4 rounded-2xl border text-left transition-all ${brandVoice === t.id ? 'border-indigo-500 bg-indigo-500/10' : 'border-zinc-800 bg-zinc-900/50 hover:border-zinc-700'}`}
                  >
                    <h3 className="text-sm font-bold text-zinc-100">{t.title}</h3>
                    <p className="text-[10px] text-zinc-500 mt-1">{t.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Output Language</label>
              <select 
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm focus:border-indigo-500 outline-none appearance-none"
              >
                {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="space-y-4">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">Describe your brand (Optional)</label>
               <textarea 
                  value={brandDesc}
                  onChange={(e) => setBrandDesc(e.target.value)}
                  placeholder="e.g. A web3 newsletter focused on decentralised finance for beginners."
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-4 text-sm min-h-[100px] focus:border-indigo-500 outline-none resize-none"
               />
            </div>

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(1)} 
                className="px-6 py-4 rounded-xl border border-zinc-800 font-bold hover:bg-zinc-800 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleNext}
                className="flex-1 py-4 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 flex items-center justify-center gap-2"
              >
                Continue <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Social Connectivity */}
        {step === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'linkedin', label: 'LinkedIn', icon: <Linkedin className="w-5 h-5 text-[#0A66C2]" /> },
                  { id: 'twitter', label: 'Twitter / X', icon: <Twitter className="w-5 h-5 text-white" /> },
                  { id: 'instagram', label: 'Instagram', icon: <Instagram className="w-5 h-5 text-[#E1306C]" /> },
                ].map(platform => (
                  <div key={platform.id} className="flex items-center justify-between p-4 bg-zinc-900/50 border border-zinc-800 rounded-2xl">
                     <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800">
                           {platform.icon}
                        </div>
                        <span className="font-bold text-zinc-200">{platform.label}</span>
                     </div>
                     {connectedPlatforms.includes(platform.id) ? (
                        <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                           <CheckCircle2 className="w-4 h-4" /> Linked
                        </div>
                     ) : (
                        <button 
                           onClick={() => connectPlatform(platform.id)}
                           className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold hover:bg-indigo-500/20 transition-all"
                        >
                           Connect
                        </button>
                     )}
                  </div>
                ))}
             </div>

             <div className="flex items-center justify-between pt-6 border-t border-zinc-800">
                <button onClick={handleNext} className="text-zinc-500 hover:text-white text-xs font-bold transition-all underline underline-offset-4">Skip for now</button>
                <button
                  onClick={handleNext}
                  className="px-8 py-4 rounded-xl bg-white text-zinc-950 font-bold hover:bg-zinc-200 flex items-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </button>
             </div>
          </div>
        )}

        {/* Step 4: Magic Generation */}
        {step === 4 && (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
             <div className="space-y-4">
               <label className="text-xs font-bold text-zinc-500 uppercase tracking-widest pl-1">What should we write about?</label>
               <div className="relative">
                 <textarea 
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. 5 ways AI is changing social media marketing in 2024..."
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-2xl p-5 text-sm min-h-[120px] focus:border-indigo-500 outline-none resize-none pr-14"
                 />
                 <button
                   onClick={startGeneration}
                   disabled={isGenerating || !prompt.trim()}
                   className="absolute bottom-4 right-4 bg-indigo-600 p-3 rounded-xl hover:bg-indigo-500 disabled:opacity-20 transition-all"
                 >
                    {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5 text-white" />}
                 </button>
               </div>
             </div>

             {generationOutput && (
               <div className="p-6 bg-zinc-950 border border-zinc-800 rounded-2xl text-sm leading-relaxed text-zinc-300 max-h-[300px] overflow-y-auto custom-scrollbar whitespace-pre-wrap relative shadow-inner">
                  <div className="absolute top-4 right-4">
                     <Sparkles className="w-4 h-4 text-indigo-500 animate-pulse" />
                  </div>
                  {generationOutput}
                  {isGenerating && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-500 animate-pulse" />}
               </div>
             )}

             {hasGenerated && (
               <div className="space-y-8 animate-in fade-in duration-1000">
                  {/* Feature Discovery Carousel */}
                  <div className="space-y-4">
                    <h3 className="text-xs font-black text-indigo-500 uppercase tracking-[0.2em] flex items-center gap-2">
                       <Sparkles className="w-3 h-3" /> Explore Your Studio
                    </h3>
                    <div className="flex gap-4 overflow-x-auto pb-4 px-1 -mx-1 snap-x no-scrollbar">
                       {FEATURES.map((feat, idx) => (
                         <div key={idx} className="snap-start shrink-0 w-48 bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                            <div className="w-10 h-10 bg-zinc-950 rounded-xl flex items-center justify-center border border-zinc-800 shadow-sm">
                               {feat.icon}
                            </div>
                            <div className="space-y-1">
                               <h4 className="text-sm font-bold text-zinc-100">{feat.title}</h4>
                               <p className="text-[10px] text-zinc-500 leading-relaxed font-medium">{feat.desc}</p>
                            </div>
                         </div>
                       ))}
                    </div>
                  </div>

                  <button
                    onClick={finishOnboarding}
                    disabled={isLoading}
                    className="w-full py-5 rounded-2xl bg-indigo-600 text-white font-black hover:bg-indigo-500 transition-all shadow-[0_0_30px_rgba(99,102,241,0.3)] flex items-center justify-center gap-3 uppercase tracking-wider text-sm"
                  >
                    {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Enter Private Dashboard <ArrowRight className="w-4 h-4" /></>}
                  </button>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
}
