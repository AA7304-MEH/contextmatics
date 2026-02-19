import React, { useState } from 'react';
import { getThemeIds, getTheme, CaptionStyle, AspectRatio, MusicMood, VoiceTone } from '../../services/facelessGenerator';

interface VibeInputProps {
    onGenerate: (data: any) => void;
    isGenerating: boolean;
}

type TabType = 'create' | 'clone' | 'oneclick';

const STYLES = [
    { id: 'cinematic', label: 'Cinematic', icon: '🎬', desc: 'Dark, dramatic, professional' },
    { id: 'animated', label: 'Fun & Animated', icon: '🎨', desc: 'Bright, energetic, playful' },
    { id: 'trendy', label: 'Trendy & Viral', icon: '🔥', desc: 'Fast-paced, scroll-stopping' },
    { id: 'documentary', label: 'Documentary', icon: '📹', desc: 'Informative, narrated, clean' },
    { id: 'aesthetic', label: 'Aesthetic', icon: '✨', desc: 'Moody, soft, ASMR-like' },
    { id: 'retro', label: 'Retro VHS', icon: '📼', desc: 'Nostalgic, grainy, vintage' },
];

const PURPOSES = [
    { id: 'viral', label: 'Go Viral', icon: '🚀' },
    { id: 'explain', label: 'Explain Simply', icon: '💡' },
    { id: 'sell', label: 'Sell Something', icon: '💰' },
    { id: 'educate', label: 'Educate', icon: '📚' },
    { id: 'entertain', label: 'Entertain', icon: '🎭' },
    { id: 'inspire', label: 'Inspire', icon: '🌟' },
];

const PLATFORMS = [
    { id: 'TikTok', label: 'TikTok', icon: '📱' },
    { id: 'Reels', label: 'Instagram Reels', icon: '📸' },
    { id: 'Shorts', label: 'YouTube Shorts', icon: '▶️' },
    { id: 'LinkedIn', label: 'LinkedIn', icon: '💼' },
];

const CAPTION_STYLES: { id: CaptionStyle; label: string; icon: string; desc: string }[] = [
    { id: 'mrbeast', label: 'MrBeast', icon: '💥', desc: 'Bold yellow highlights, word-by-word' },
    { id: 'hormozi', label: 'Hormozi', icon: '🎯', desc: 'White on black bar, centered' },
    { id: 'subtitle', label: 'Subtitle', icon: '💬', desc: 'Bottom positioned, clean' },
    { id: 'neon', label: 'Neon Glow', icon: '🌈', desc: 'Glowing text with pulse effect' },
];

const ASPECT_RATIOS: { id: AspectRatio; label: string; icon: string }[] = [
    { id: '9:16', label: 'Vertical (9:16)', icon: '📱' },
    { id: '16:9', label: 'Landscape (16:9)', icon: '🖥️' },
    { id: '1:1', label: 'Square (1:1)', icon: '⬜' },
];

const MUSIC_MOODS: { id: MusicMood; label: string; icon: string }[] = [
    { id: 'cinematic', label: 'Cinematic', icon: '🎬' },
    { id: 'upbeat', label: 'Upbeat', icon: '🎉' },
    { id: 'dark', label: 'Dark & Moody', icon: '🌙' },
    { id: 'ambient', label: 'Ambient', icon: '🌊' },
    { id: 'lofi', label: 'Lo-Fi', icon: '☕' },
    { id: 'epic', label: 'Epic', icon: '⚔️' },
];

const VOICE_TONES: { id: VoiceTone; label: string; icon: string }[] = [
    { id: 'dramatic', label: 'Dramatic', icon: '🎭' },
    { id: 'calm', label: 'Calm', icon: '🧘' },
    { id: 'energetic', label: 'Energetic', icon: '⚡' },
    { id: 'whisper', label: 'Whisper', icon: '🤫' },
    { id: 'authoritative', label: 'Authoritative', icon: '👔' },
];

const DURATION_PRESETS = [
    { value: 15, label: '15s', desc: 'Quick hook' },
    { value: 30, label: '30s', desc: 'Standard' },
    { value: 60, label: '60s', desc: 'Full story' },
    { value: 90, label: '90s', desc: 'Deep dive' },
];

const THEME_META: Record<string, { icon: string; desc: string }> = {
    motivational: { icon: '💪', desc: 'Inspirational quotes with cinematic nature shots' },
    horror: { icon: '👻', desc: 'Creepy narration with dark atmospheric visuals' },
    facts: { icon: '🧠', desc: 'Mind-blowing facts with cosmic imagery' },
    tech: { icon: '🤖', desc: 'AI & tech trends with futuristic visuals' },
    finance: { icon: '💰', desc: 'Money secrets with luxury minimal aesthetics' },
    cooking: { icon: '👨‍🍳', desc: 'Quick recipes with mouth-watering close-ups' },
    travel: { icon: '✈️', desc: 'Bucket list destinations with drone cinematography' },
    gaming: { icon: '🎮', desc: 'Epic gaming moments with RGB aesthetics' },
    fitness: { icon: '🏋️', desc: 'Transformation journeys with motivational energy' },
    history: { icon: '📜', desc: 'Historic moments with vintage film aesthetics' },
};

const VibeInput: React.FC<VibeInputProps> = ({ onGenerate, isGenerating }) => {
    const [activeTab, setActiveTab] = useState<TabType>('create');
    const [topic, setTopic] = useState('');
    const [style, setStyle] = useState('cinematic');
    const [purpose, setPurpose] = useState('viral');
    const [platforms, setPlatforms] = useState<string[]>(['TikTok']);
    const [cloneUrls, setCloneUrls] = useState('');
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Advanced options
    const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('mrbeast');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('9:16');
    const [musicMood, setMusicMood] = useState<MusicMood>('cinematic');
    const [voiceTone, setVoiceTone] = useState<VoiceTone>('dramatic');
    const [targetDuration, setTargetDuration] = useState(30);

    const togglePlatform = (p: string) => {
        setPlatforms(prev =>
            prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
        );
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onGenerate({
            topic, style, purpose, platforms, activeTab, cloneUrls,
            captionStyle, aspectRatio, musicMood, voiceTone, targetDuration,
        });
    };

    const handleOneClick = (themeId: string) => {
        const theme = getTheme(themeId);
        if (theme) {
            onGenerate({
                topic: theme.title, style: 'cinematic', purpose: 'viral',
                platforms: ['TikTok', 'Reels', 'Shorts'], activeTab: 'oneclick', themeId,
                captionStyle, aspectRatio, musicMood, voiceTone, targetDuration: 30,
            });
        }
    };

    const themeIds = getThemeIds();

    // Pill-style selector helper
    const PillSelect = <T extends string>({ items, value, onChange }: {
        items: { id: T; label: string; icon: string }[];
        value: T;
        onChange: (v: T) => void;
    }) => (
        <div className="flex flex-wrap gap-2">
            {items.map(item => (
                <button
                    key={item.id}
                    type="button"
                    onClick={() => onChange(item.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold border transition-all ${value === item.id
                            ? 'border-indigo-500/50 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.1)]'
                            : 'border-white/5 bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
                        }`}
                >
                    {item.icon} {item.label}
                </button>
            ))}
        </div>
    );

    return (
        <div className="w-full max-w-3xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 mb-4">
                    <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Pro Studio v2</span>
                    <span className="text-xs text-indigo-300">⚡</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-3">
                    Faceless Video Studio
                </h1>
                <p className="text-lg text-[var(--color-text-secondary)]">
                    AI-powered faceless videos with Gemini. 10 themes. 4 caption styles. One click.
                </p>
            </div>

            {/* Tab Selector */}
            <div className="flex justify-center gap-2 mb-10">
                {(['create', 'clone', 'oneclick'] as TabType[]).map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActiveTab(tab)}
                        className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all border ${activeTab === tab
                                ? 'border-indigo-500/40 bg-indigo-500/10 text-white shadow-[0_0_15px_rgba(99,102,241,0.15)]'
                                : 'border-white/5 bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10 hover:text-white'
                            }`}
                    >
                        {tab === 'create' ? '✨ Create' : tab === 'clone' ? '🔄 Clone Style' : '⚡ One-Click'}
                    </button>
                ))}
            </div>

            {/* ── Create Tab ── */}
            {activeTab === 'create' && (
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Topic */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">What's your video about?</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="e.g. The psychology of money, AI taking over jobs..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-[var(--color-text-muted)]"
                            required
                        />
                    </div>

                    {/* Style */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">Visual Style</label>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {STYLES.map(s => (
                                <button
                                    key={s.id}
                                    type="button"
                                    onClick={() => setStyle(s.id)}
                                    className={`p-4 rounded-xl border text-left transition-all ${style === s.id
                                            ? 'border-indigo-500/50 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.1)]'
                                            : 'border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/15'
                                        }`}
                                >
                                    <span className="text-2xl block mb-2">{s.icon}</span>
                                    <p className="text-sm font-semibold text-white">{s.label}</p>
                                    <p className="text-xs text-[var(--color-text-muted)] mt-1">{s.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Purpose & Platforms row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-3">Video Goal</label>
                            <div className="flex flex-wrap gap-2">
                                {PURPOSES.map(p => (
                                    <button key={p.id} type="button" onClick={() => setPurpose(p.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${purpose === p.id
                                                ? 'border-indigo-500/50 bg-indigo-500/10 text-white'
                                                : 'border-white/5 bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
                                            }`}
                                    >{p.icon} {p.label}</button>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-semibold text-white mb-3">Target Platforms</label>
                            <div className="flex flex-wrap gap-2">
                                {PLATFORMS.map(p => (
                                    <button key={p.id} type="button" onClick={() => togglePlatform(p.id)}
                                        className={`px-4 py-2 rounded-xl text-xs font-medium border transition-all ${platforms.includes(p.id)
                                                ? 'border-cyan-500/50 bg-cyan-500/10 text-white'
                                                : 'border-white/5 bg-white/5 text-[var(--color-text-secondary)] hover:bg-white/10'
                                            }`}
                                    >{p.icon} {p.label}</button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Duration Presets */}
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">Video Length</label>
                        <div className="flex gap-3">
                            {DURATION_PRESETS.map(d => (
                                <button
                                    key={d.value}
                                    type="button"
                                    onClick={() => setTargetDuration(d.value)}
                                    className={`flex-1 py-3 rounded-xl text-center border transition-all ${targetDuration === d.value
                                            ? 'border-violet-500/50 bg-violet-500/10 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                            : 'border-white/5 bg-white/5 hover:bg-white/10'
                                        }`}
                                >
                                    <p className={`text-lg font-bold ${targetDuration === d.value ? 'text-white' : 'text-[var(--color-text-secondary)]'}`}>{d.label}</p>
                                    <p className="text-[10px] text-[var(--color-text-muted)] uppercase tracking-wider">{d.desc}</p>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Advanced Settings Toggle */}
                    <div>
                        <button
                            type="button"
                            onClick={() => setShowAdvanced(prev => !prev)}
                            className="flex items-center gap-2 text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
                        >
                            <span className={`text-xs transition-transform ${showAdvanced ? 'rotate-90' : ''}`}>▶</span>
                            Advanced Settings
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 font-bold uppercase tracking-wider">Pro</span>
                        </button>

                        {showAdvanced && (
                            <div className="mt-6 p-6 rounded-2xl border border-white/5 bg-white/[0.02] space-y-6 animate-fade-in">
                                {/* Caption Style */}
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Caption Style</label>
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {CAPTION_STYLES.map(c => (
                                            <button
                                                key={c.id}
                                                type="button"
                                                onClick={() => setCaptionStyle(c.id)}
                                                className={`p-3 rounded-xl border text-left transition-all ${captionStyle === c.id
                                                        ? 'border-indigo-500/50 bg-indigo-500/10'
                                                        : 'border-white/5 bg-white/5 hover:bg-white/10'
                                                    }`}
                                            >
                                                <span className="text-xl">{c.icon}</span>
                                                <p className="text-xs font-bold text-white mt-1">{c.label}</p>
                                                <p className="text-[10px] text-[var(--color-text-muted)] mt-0.5">{c.desc}</p>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Aspect Ratio */}
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Aspect Ratio</label>
                                    <PillSelect items={ASPECT_RATIOS} value={aspectRatio} onChange={setAspectRatio} />
                                </div>

                                {/* Music Mood */}
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Background Music</label>
                                    <PillSelect items={MUSIC_MOODS} value={musicMood} onChange={setMusicMood} />
                                </div>

                                {/* Voice Tone */}
                                <div>
                                    <label className="block text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider mb-3">Voiceover Tone</label>
                                    <PillSelect items={VOICE_TONES} value={voiceTone} onChange={setVoiceTone} />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Generate */}
                    <button
                        type="submit"
                        disabled={isGenerating || !topic.trim()}
                        className="w-full py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:from-indigo-500 hover:to-violet-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? '⏳ Generating...' : '✨ Generate Faceless Video'}
                    </button>
                </form>
            )}

            {/* ── Clone Tab ── */}
            {activeTab === 'clone' && (
                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">Paste URL of a video to clone its style</label>
                        <input
                            type="url"
                            value={cloneUrls}
                            onChange={e => setCloneUrls(e.target.value)}
                            placeholder="https://www.tiktok.com/@creator/video/..."
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-[var(--color-text-muted)]"
                            required
                        />
                        <p className="text-xs text-[var(--color-text-muted)] mt-2">
                            We'll analyze the video's pacing, editing style, hook patterns, and recreate them for your topic.
                        </p>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-white mb-3">Your Topic</label>
                        <input
                            type="text"
                            value={topic}
                            onChange={e => setTopic(e.target.value)}
                            placeholder="What should the new video be about?"
                            className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-[var(--color-text-muted)]"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={isGenerating || !cloneUrls.trim() || !topic.trim()}
                        className="w-full py-4 rounded-xl text-lg font-bold bg-gradient-to-r from-indigo-600 to-violet-600 text-white border-none shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/40 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? '⏳ Cloning...' : '🔄 Clone & Generate'}
                    </button>
                </form>
            )}

            {/* ── One-Click Tab ── */}
            {activeTab === 'oneclick' && (
                <div className="space-y-6">
                    <p className="text-sm text-[var(--color-text-secondary)] text-center mb-4">
                        Pick a theme and get a complete faceless video instantly — no prompt required.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {themeIds.map(id => {
                            const theme = getTheme(id);
                            const meta = THEME_META[id] || { icon: '🎞️', desc: '' };
                            return (
                                <button
                                    key={id}
                                    onClick={() => handleOneClick(id)}
                                    disabled={isGenerating}
                                    className="p-5 rounded-2xl border border-white/5 bg-[var(--color-background-surface)]/50 text-left hover:border-indigo-500/30 hover:bg-white/5 transition-all duration-300 group disabled:opacity-50"
                                >
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="text-2xl">{meta.icon}</span>
                                        <div>
                                            <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">{theme?.title || id}</p>
                                            <p className="text-[10px] text-[var(--color-text-muted)] capitalize">{id}</p>
                                        </div>
                                    </div>
                                    <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{meta.desc}</p>
                                    <div className="mt-2 text-[10px] text-indigo-400 font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Click to generate →
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VibeInput;
