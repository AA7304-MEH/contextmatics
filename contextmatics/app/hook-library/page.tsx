'use client';

import React, { useState, useEffect } from 'react';
import { PageLayout, SEO } from '@/components/shared';
import { 
  Anchor, 
  Search, 
  Sparkles, 
  Copy, 
  Star, 
  Zap,
  Linkedin,
  Twitter,
  Instagram,
  ChevronRight,
  Plus
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

interface Hook {
  id: string;
  category: string;
  platform: string;
  hook_template: string;
  example_text: string;
  viral_score: number;
}

const CATEGORIES = ['All', 'Educational', 'Controversial', 'Story', 'Listicle', 'Question'];

export default function HookLibraryPage() {
  const router = useRouter();
  const [hooks, setHooks] = useState<Hook[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchHooks();
  }, [activeCategory]);

  const fetchHooks = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/hooks?category=${activeCategory}`);
      const data = await res.json();
      if (data.success) {
        setHooks(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch hooks', error);
    } finally {
      setIsLoading(false);
    }
  };

  const useHook = (template: string) => {
    sessionStorage.setItem('template_prompt', `Use this hook structure: ${template}\n\nTopic: `);
    router.push('/content-creator');
    toast.success('Hook loaded into Creator!');
  };

  const copyHook = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Template copied');
  };

  const filteredHooks = hooks.filter(h => 
    h.hook_template.toLowerCase().includes(searchTerm.toLowerCase()) || 
    h.example_text?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const PlatformIcon = ({ p }: { p: string }) => {
    const plat = p.toLowerCase();
    if (plat.includes('linkedin')) return <Linkedin className="w-4 h-4 text-[#0A66C2]" />;
    if (plat.includes('twitter') || plat.includes('x')) return <Twitter className="w-4 h-4 text-white" />;
    return <Instagram className="w-4 h-4 text-[#E1306C]" />;
  };

  return (
    <PageLayout>
      <SEO title="Viral Hook Library | ContextMatic" description="Browse proved high-performance hook structures to stop the scroll." />
      
      <div className="max-w-6xl mx-auto space-y-12 pb-20 pt-10 px-4">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Anchor className="w-3 h-3" />
            Scroll-Stop DNA
          </div>
          <h1 className="text-5xl font-black tracking-tight text-white">Viral Hook <span className="text-kinetic">Library</span></h1>
          <p className="text-text-secondary text-lg max-w-2xl mx-auto">
            Stop guessing. Start using the exact psychological structures that cause millions of impressions.
          </p>
        </div>

        {/* Filters and Search */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  activeCategory === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'bg-white/5 text-zinc-500 hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          <div className="lg:col-span-4 relative">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
             <input 
               type="text" 
               placeholder="Search hooks..."
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-zinc-900 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-sm focus:border-indigo-500/50 outline-none transition-all shadow-xl"
             />
          </div>
        </div>

        {/* Hook Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {isLoading ? (
             Array.from({ length: 6 }).map((_, i) => (
               <div key={i} className="h-64 bg-white/5 animate-pulse rounded-3xl" />
             ))
          ) : filteredHooks.length === 0 ? (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5 rounded-[40px] text-zinc-600">
               No hooks found matching your criteria.
            </div>
          ) : (
            filteredHooks.map(hook => (
              <div key={hook.id} className="card bg-zinc-900/50 border-white/5 p-8 rounded-[40px] hover:border-indigo-500/20 transition-all group flex flex-col justify-between">
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-2">
                      <PlatformIcon p={hook.platform} />
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">{hook.category}</span>
                    </div>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-amber-500">
                       <Star className="w-3 h-3 fill-current" />
                       {hook.viral_score}% Impact
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-black/40 border border-white/5 relative">
                      <Sparkles className="absolute -top-3 -right-3 w-8 h-8 text-indigo-500/20" />
                      <p className="text-sm font-bold text-white leading-relaxed italic">"{hook.hook_template}"</p>
                    </div>
                    {hook.example_text && (
                       <div className="p-4 rounded-2xl bg-white/[0.02] border border-white/5">
                          <span className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest block mb-2">Example Use</span>
                          <p className="text-xs text-zinc-500 line-clamp-3">{hook.example_text}</p>
                       </div>
                    )}
                  </div>
                </div>

                <div className="pt-8 flex gap-3">
                  <button 
                    onClick={() => useHook(hook.hook_template)}
                    className="flex-1 btn btn-primary py-3 text-xs font-bold gap-2 shadow-lg"
                  >
                    <Plus className="w-4 h-4" /> Use Hook
                  </button>
                  <button 
                    onClick={() => copyHook(hook.hook_template)}
                    className="p-3 bg-white/5 hover:bg-white/10 rounded-xl transition-colors border border-white/5"
                  >
                    <Copy className="w-4 h-4 text-zinc-500" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pro Tip Section */}
        <div className="bg-gradient-to-r from-indigo-900/40 to-violet-900/40 border border-white/10 rounded-[40px] p-10 flex flex-col md:flex-row items-center justify-between gap-8">
           <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl font-bold text-white flex items-center gap-3 justify-center md:justify-start">
                <Zap className="w-6 h-6 text-indigo-400" />
                Want Custom Daily Hooks?
              </h3>
              <p className="text-zinc-400 max-w-md">Our AI analyzed 20,000 viral posts last night. Use the Content OS to get personalized recommendations.</p>
           </div>
           <button 
             onClick={() => router.push('/content-os')}
             className="btn bg-white text-black hover:bg-zinc-200 px-8 py-4 text-sm font-black uppercase tracking-widest gap-2 flex-shrink-0"
           >
              Open Content OS
              <ChevronRight className="w-4 h-4" />
           </button>
        </div>
      </div>
    </PageLayout>
  );
}
