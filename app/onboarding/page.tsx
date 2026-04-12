'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { CheckCircle2, ChevronRight, Sparkles, Twitter, Linkedin, Instagram, Play } from 'lucide-react';
import toast from 'react-hot-toast';
import confetti from 'canvas-confetti';

const NICHES = [
  { id: 'creator', label: 'Creator/Influencer', icon: '✨' },
  { id: 'smm', label: 'Social Media Manager', icon: '📱' },
  { id: 'agency', label: 'Marketing Agency', icon: '🚀' },
  { id: 'business', label: 'Small Business', icon: '🏢' },
];

const TONES = [
  { id: 'Professional', label: 'Professional', desc: 'Authoritative, clear, and trustworthy.' },
  { id: 'Casual & Fun', label: 'Casual & Fun', desc: 'Friendly, relatable, and engaging.' },
  { id: 'Bold & Direct', label: 'Bold & Direct', desc: 'Punchy, opinionated, and confident.' },
];

const PLATFORMS = [
  { id: 'twitter', label: 'Twitter/X', icon: Twitter, color: '#1DA1F2' },
  { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: '#0A66C2' },
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#E1306C' },
];

export default function Onboarding() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [firstName, setFirstName] = useState('');
  const [niche, setNiche] = useState('');
  const [brandVoice, setBrandVoice] = useState('');
  const [brandDesc, setBrandDesc] = useState('');
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>([]);
  const [topic, setTopic] = useState('');
  const [generatedText, setGeneratedText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  );

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        const name = user.user_metadata?.full_name || user.email?.split('@')[0] || 'Creator';
        setFirstName(name);
      }
    }
    getUser();
  }, [supabase.auth]);

  const saveProfileData = async (data: any) => {
    if (userId) {
      await supabase.from('profiles').update(data).eq('id', userId);
    }
  };

  const handleNextStep1 = async () => {
    if (!niche) {
      toast.error('Please select an option');
      return;
    }
    await saveProfileData({ niche });
    setStep(2);
  };

  const handleNextStep2 = async () => {
    if (!brandVoice) {
      toast.error('Please select a tone');
      return;
    }
    await saveProfileData({ brand_voice: brandVoice, brand_description: brandDesc });
    setStep(3);
  };

  const handleConnectSocial = (platformId: string) => {
    // Simulating Ayrshare OAuth
    toast.success(`Connected to ${platformId}!`);
    if (!connectedPlatforms.includes(platformId)) {
      setConnectedPlatforms(prev => [...prev, platformId]);
    }
  };

  const generateMagicMoment = async () => {
    if (!topic) return;
    setIsGenerating(true);
    setGeneratedText('');

    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          platform: 'LinkedIn',
          tone: brandVoice,
          brandVoice: brandDesc,
          length: 'short'
        })
      });

      if (!res.ok) throw new Error('Generation failed');

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          setGeneratedText(prev => prev + chunk);
        }
      }
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const completeOnboarding = async () => {
    await saveProfileData({ onboarding_completed: true });
    
    // Call server API for referrals evaluation directly
    try {
      await fetch('/api/referrals/complete', { method: 'POST' });
    } catch(e) {}

    confetti({
      particleCount: 150,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    toast.success('Welcome to ContextMatic 🎉 You just saved 20 minutes.');
    setTimeout(() => {
      router.push('/dashboard');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background-primary flex flex-col items-center justify-center p-4">
      {/* Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-1 bg-white/10">
        <div 
          className="h-full bg-brand-primary transition-all duration-500 ease-out"
          style={{ width: `${(step / 4) * 100}%` }}
        />
      </div>

      <div className="w-full max-w-2xl animate-fade-in relative">
        {step === 1 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Welcome, {firstName}! 👋</h1>
              <p className="text-text-secondary text-lg">To personalize your experience, tell us what you do.</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {NICHES.map(item => (
                <button
                  key={item.id}
                  onClick={() => setNiche(item.id)}
                  className={`p-6 rounded-2xl border text-left flex flex-col gap-3 transition-all ${
                    niche === item.id 
                      ? 'border-brand-primary bg-brand-primary/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="text-3xl">{item.icon}</span>
                  <span className="font-semibold">{item.label}</span>
                </button>
              ))}
            </div>
            <button onClick={handleNextStep1} disabled={!niche} className="btn btn-primary w-full py-4 text-lg justify-center">
              Continue <ChevronRight className="w-5 h-5 ml-2" />
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Determine Your Voice</h1>
              <p className="text-text-secondary text-lg">How do you want to sound to your audience?</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {TONES.map(tone => (
                <button
                  key={tone.id}
                  onClick={() => setBrandVoice(tone.id)}
                  className={`p-5 rounded-2xl border text-left flex flex-col gap-2 transition-all ${
                    brandVoice === tone.id 
                      ? 'border-brand-primary bg-brand-primary/10' 
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  }`}
                >
                  <span className="font-semibold text-lg">{tone.label}</span>
                  <span className="text-sm text-text-secondary leading-relaxed">{tone.desc}</span>
                  {brandVoice === tone.id && <CheckCircle2 className="w-5 h-5 text-brand-primary absolute mt-1 ml-[calc(100%-80px)] opacity-50" />}
                </button>
              ))}
            </div>
            <div className="space-y-3">
              <label className="block text-sm font-medium text-text-primary">Describe your brand in one sentence (Optional)</label>
              <textarea 
                value={brandDesc}
                onChange={e => setBrandDesc(e.target.value)}
                placeholder="e.g. We help creators monetize their audience without burning out."
                className="input w-full p-4 min-h-[100px] text-base resize-none"
              />
            </div>
            <div className="flex gap-4">
              <button onClick={() => setStep(1)} className="btn bg-white/5 hover:bg-white/10 w-1/3 justify-center">Back</button>
              <button onClick={handleNextStep2} disabled={!brandVoice} className="btn btn-primary w-2/3 justify-center">
                Continue <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <h1 className="text-4xl font-bold tracking-tight">Connect Socials</h1>
              <p className="text-text-secondary text-lg">Link your accounts to schedule posts directly.</p>
            </div>
            <div className="space-y-3">
              {PLATFORMS.map(platform => (
                <div key={platform.id} className="flex items-center justify-between p-5 rounded-xl border border-white/5 bg-white/5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: `${platform.color}20`, color: platform.color }}>
                      <platform.icon className="w-6 h-6" />
                    </div>
                    <span className="font-semibold text-lg">{platform.label}</span>
                  </div>
                  {connectedPlatforms.includes(platform.id) ? (
                    <div className="flex items-center gap-2 text-green-500 font-medium px-4">
                      <CheckCircle2 className="w-5 h-5" /> Connected
                    </div>
                  ) : (
                    <button onClick={() => handleConnectSocial(platform.id)} className="btn bg-white text-black hover:bg-zinc-200">
                      Connect
                    </button>
                  )}
                </div>
              ))}
            </div>
            <div className="flex flex-col items-center gap-4 pt-4">
              <button onClick={() => setStep(4)} className="btn btn-primary w-full py-4 text-lg justify-center">
                {connectedPlatforms.length > 0 ? 'Continue' : 'Skip for now'} <ChevronRight className="w-5 h-5 ml-2" />
              </button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/20 text-brand-primary mb-4">
                <Sparkles className="w-8 h-8" />
              </div>
              <h1 className="text-4xl font-bold tracking-tight">Your Magic Moment</h1>
              <p className="text-text-secondary text-lg">Let's create your first post in seconds.</p>
            </div>

            {!generatedText && !isGenerating ? (
              <div className="space-y-4">
                <input 
                  type="text"
                  value={topic}
                  onChange={e => setTopic(e.target.value)}
                  placeholder="What do you want to post about today?"
                  className="input w-full p-6 text-xl rounded-2xl border-white/20 focus:border-brand-primary bg-black/40"
                  onKeyDown={e => e.key === 'Enter' && generateMagicMoment()}
                />
                <button onClick={generateMagicMoment} disabled={!topic} className="btn btn-primary w-full py-5 text-xl justify-center font-bold">
                  Generate Post <Play className="w-5 h-5 ml-2 fill-current" />
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="p-6 rounded-2xl border border-brand-primary/30 bg-brand-primary/5 min-h-[200px] whitespace-pre-wrap leading-relaxed relative">
                  {generatedText}
                  {isGenerating && <span className="inline-block w-2 h-4 bg-brand-primary animate-pulse ml-1 align-middle"></span>}
                </div>
                
                {!isGenerating && (
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3">
                      <button onClick={completeOnboarding} className="btn btn-primary flex-1 py-3 justify-center">Post Now</button>
                      <button onClick={completeOnboarding} className="btn bg-white/10 hover:bg-white/20 flex-1 py-3 justify-center">Schedule it</button>
                      <button onClick={completeOnboarding} className="btn bg-transparent border border-white/20 flex-1 py-3 justify-center">Save Draft</button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
