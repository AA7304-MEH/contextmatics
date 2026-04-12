import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useHistory } from '../../context/HistoryContext';
import { PageLayout, SEO } from '../shared';
import VibeInput from './VibeInput';
import {
    VideoScript, Scene, CaptionStyle, ShotType, MotionIntent, VFXType,
} from '../../services/facelessGenerator';
import { FacelessRequest, PipelineUpdate, runFacelessPipeline } from '../../services/facelessPipeline';

// ══════════════════════════════════════════════════════════════════
// CSS-Only Faceless Video Preview — 4 Caption Styles
// ══════════════════════════════════════════════════════════════════

const FacelessPreview: React.FC<{
    scenes: Scene[]; colorGrade?: string; captionStyle: CaptionStyle; aspectRatio: string;
}> = ({ scenes, colorGrade, captionStyle, aspectRatio }) => {
    const [activeScene, setActiveScene] = useState(0);
    const [wordIndex, setWordIndex] = useState(0);
    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    useEffect(() => {
        if (scenes.length === 0) return;
        const scene = scenes[activeScene];
        const words = scene.text.split(' ');
        const wordDuration = Math.max(200, (scene.duration * 1000) / words.length);

        timerRef.current = setInterval(() => {
            setWordIndex(prev => {
                if (prev >= words.length - 1) {
                    setActiveScene(s => (s + 1) % scenes.length);
                    return 0;
                }
                return prev + 1;
            });
        }, wordDuration);

        return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }, [activeScene, scenes]);

    if (scenes.length === 0) return null;

    const scene = scenes[activeScene];
    const words = scene.text.split(' ');
    const ar = aspectRatio === '16:9' ? 'aspect-[16/9]' : aspectRatio === '1:1' ? 'aspect-square' : 'aspect-[9/16]';

    // Motion → CSS
    const motionStyle: React.CSSProperties = {};
    const m = scene.motionIntent;
    if (m === 'Slow zoom in') motionStyle.animation = 'fZoomIn 8s ease-out forwards';
    else if (m === 'Quick pan') motionStyle.animation = 'fPanRight 6s ease-in-out infinite';
    else if (m === 'Parallax scroll') motionStyle.animation = 'fParallax 10s ease-in-out infinite';
    else if (m === 'Dolly out') motionStyle.animation = 'fDollyOut 8s ease-in forwards';
    else if (m === 'Tilt up') motionStyle.animation = 'fTiltUp 7s ease-in-out infinite';
    else if (m === 'Orbit') motionStyle.animation = 'fOrbit 12s linear infinite';

    const colorFilter = colorGrade === 'Film Bloom' ? 'contrast(1.1) saturate(1.1) brightness(1.05)' : 'none';

    // VFX layers
    const vfxLayer = (() => {
        switch (scene.vfx) {
            case 'light leaks': return <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent animate-pulse pointer-events-none" />;
            case 'particle burst': return <div className="absolute inset-0 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[size:20px_20px] opacity-10 pointer-events-none" />;
            case 'glitch': return <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,0,0,0.1) 2px, rgba(255,0,0,0.1) 4px)', animation: 'fGlitch 0.3s steps(4) infinite' }} />;
            case 'film grain': return <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")' }} />;
            case 'chromatic aberration': return <div className="absolute inset-0 pointer-events-none" style={{ boxShadow: 'inset -2px 0 4px rgba(255,0,0,0.1), inset 2px 0 4px rgba(0,0,255,0.1)' }} />;
            default: return null;
        }
    })();

    // Caption rendering per style
    const renderCaptions = () => {
        switch (captionStyle) {
            case 'hormozi':
                return (
                    <div className="absolute bottom-16 left-0 right-0 flex justify-center z-10 px-4">
                        <div className="bg-black/90 px-6 py-3 rounded-lg">
                            <p className="text-white text-xl md:text-2xl font-black text-center uppercase tracking-tight">
                                {words.slice(0, wordIndex + 1).join(' ')}
                            </p>
                        </div>
                    </div>
                );

            case 'subtitle':
                return (
                    <div className="absolute bottom-16 left-0 right-0 flex justify-center z-10 px-6">
                        <div className="bg-black/60 backdrop-blur-sm px-5 py-2 rounded-md">
                            <p className="text-white text-base md:text-lg font-medium text-center">
                                {scene.text}
                            </p>
                        </div>
                    </div>
                );

            case 'neon':
                return (
                    <div className="absolute inset-0 flex items-center justify-center px-6 z-10">
                        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                            {words.map((word, i) => (
                                <span
                                    key={`${activeScene}-${i}`}
                                    className={`text-2xl md:text-3xl font-black uppercase transition-all duration-150 ${i === wordIndex ? 'scale-110' : i < wordIndex ? 'opacity-80' : 'opacity-30'
                                        }`}
                                    style={{
                                        color: i === wordIndex ? '#00ffff' : i < wordIndex ? '#e0e0ff' : '#444',
                                        textShadow: i === wordIndex
                                            ? '0 0 15px #00ffff, 0 0 40px #0088ff, 0 0 60px #0044ff'
                                            : '1px 1px 0px #000',
                                        display: 'inline-block',
                                    }}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                );

            case 'mrbeast':
            default:
                return (
                    <div className="absolute inset-0 flex items-center justify-center px-6 z-10">
                        <div className="flex flex-wrap justify-center gap-x-2 gap-y-1">
                            {words.map((word, i) => (
                                <span
                                    key={`${activeScene}-${i}`}
                                    className={`text-3xl md:text-4xl font-black uppercase transition-all duration-100 ${i === wordIndex ? 'text-yellow-400 scale-125 rotate-1'
                                        : i < wordIndex ? 'text-white/90' : 'text-white/40'
                                        }`}
                                    style={{
                                        textShadow: i === wordIndex
                                            ? '0 0 20px rgba(234, 179, 8, 0.5), 3px 3px 0px #000'
                                            : '2px 2px 0px #000',
                                        display: 'inline-block',
                                    }}
                                >
                                    {word}
                                </span>
                            ))}
                        </div>
                    </div>
                );
        }
    };

    return (
        <div className={`relative w-full ${ar} max-h-[550px] rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl shadow-indigo-500/10`}>
            <div className="absolute inset-0" style={{ filter: colorFilter, ...motionStyle }}>
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/80 via-zinc-900 to-black" />
                <div className="absolute top-4 right-4 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-mono text-indigo-300 border border-white/10">{scene.visualMotif}</div>
            </div>
            {vfxLayer}
            {renderCaptions()}
            <div className="absolute bottom-4 left-4 right-4 flex gap-1 z-10">
                {scenes.map((_, i) => (
                    <div key={i} className={`h-1 flex-1 rounded-full transition-all ${i === activeScene ? 'bg-indigo-400' : i < activeScene ? 'bg-white/30' : 'bg-white/10'}`} />
                ))}
            </div>
            <div className="absolute bottom-12 left-4 px-2 py-1 rounded-md bg-black/50 backdrop-blur-sm text-[10px] font-mono text-cyan-300 border border-white/10 uppercase tracking-wider z-10">
                {scene.shotType} · {scene.motionIntent}
            </div>
            <style>{`
        @keyframes fZoomIn { from { transform: scale(1); } to { transform: scale(1.15); } }
        @keyframes fPanRight { 0%,100% { transform: translateX(0) scale(1.1); } 50% { transform: translateX(30px) scale(1.1); } }
        @keyframes fParallax { 0%,100% { transform: translateY(0) scale(1.15); } 50% { transform: translateY(-25px) scale(1.15); } }
        @keyframes fDollyOut { from { transform: scale(1.2); } to { transform: scale(1); } }
        @keyframes fTiltUp { 0%,100% { transform: translateY(10px); } 50% { transform: translateY(-20px); } }
        @keyframes fOrbit { from { transform: rotate(0deg) scale(1.1); } to { transform: rotate(360deg) scale(1.1); } }
        @keyframes fGlitch { 0% { transform: translate(0); } 25% { transform: translate(-2px, 1px); } 50% { transform: translate(2px, -1px); } 75% { transform: translate(-1px, 2px); } 100% { transform: translate(0); } }
      `}</style>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════
// Scene Editor
// ══════════════════════════════════════════════════════════════════

const SHOT_TYPES: ShotType[] = ['Close-up', 'Wide', 'Establishing', 'Dynamic', 'Overhead', 'POV', 'Tracking'];
const MOTION_INTENTS: MotionIntent[] = ['Slow zoom in', 'Quick pan', 'Parallax scroll', 'Static', 'Dolly out', 'Tilt up', 'Orbit'];
const VFX_TYPES: VFXType[] = ['none', 'light leaks', 'particle burst', 'glitch', 'film grain', 'chromatic aberration'];

const SceneEditor: React.FC<{
    scenes: Scene[];
    onChange: (scenes: Scene[]) => void;
}> = ({ scenes, onChange }) => {
    const [editingId, setEditingId] = useState<string | null>(null);

    const updateScene = (id: string, updates: Partial<Scene>) => {
        onChange(scenes.map(s => s.id === id ? { ...s, ...updates } : s));
    };

    const moveScene = (index: number, dir: -1 | 1) => {
        const newScenes = [...scenes];
        const target = index + dir;
        if (target < 0 || target >= newScenes.length) return;
        [newScenes[index], newScenes[target]] = [newScenes[target], newScenes[index]];
        onChange(newScenes);
    };

    const duplicateScene = (scene: Scene) => {
        const newScene = { ...scene, id: `scene-dup-${Date.now()}` };
        onChange([...scenes, newScene]);
    };

    const deleteScene = (id: string) => {
        if (scenes.length <= 1) return;
        onChange(scenes.filter(s => s.id !== id));
    };

    const addScene = () => {
        const newScene: Scene = {
            id: `scene-new-${Date.now()}`,
            text: 'New scene — edit me!',
            visualDescription: 'Cinematic B-roll footage',
            duration: 4,
            shotType: 'Dynamic',
            motionIntent: 'Static',
            vfx: 'none',
            visualMotif: 'Custom',
        };
        onChange([...scenes, newScene]);
    };

    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                    ✏️ Scene Editor <span className="text-[10px] font-normal text-[var(--color-text-muted)]">(click to edit)</span>
                </h3>
                <button
                    onClick={addScene}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 transition-all"
                >
                    + Add Scene
                </button>
            </div>

            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1">
                {scenes.map((scene, i) => (
                    <div
                        key={scene.id}
                        className={`rounded-2xl border transition-all ${editingId === scene.id ? 'border-indigo-500/30 bg-indigo-500/5' : 'border-white/5 bg-white/5 hover:bg-white/10'}`}
                    >
                        {/* Scene Header */}
                        <button
                            onClick={() => setEditingId(editingId === scene.id ? null : scene.id)}
                            className="w-full p-4 text-left"
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="text-[10px] font-black px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400">#{i + 1}</span>
                                    <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest">{scene.shotType}</span>
                                    <span className="text-[10px] text-[var(--color-text-muted)]">· {scene.duration}s</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {scene.vfx !== 'none' && (
                                        <span className="text-[8px] bg-indigo-500/10 text-indigo-400 px-1.5 py-0.5 rounded-full border border-indigo-500/20">{scene.vfx}</span>
                                    )}
                                    <span className="text-xs text-[var(--color-text-muted)]">{editingId === scene.id ? '▼' : '▶'}</span>
                                </div>
                            </div>
                            <p className="text-sm text-zinc-200 font-medium leading-relaxed mt-2 line-clamp-2">"{scene.text}"</p>
                        </button>

                        {/* Expanded Editor */}
                        {editingId === scene.id && (
                            <div className="px-4 pb-4 space-y-4 animate-fade-in border-t border-white/5 pt-4">
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Narration</label>
                                    <textarea
                                        value={scene.text}
                                        onChange={e => updateScene(scene.id, { text: e.target.value })}
                                        className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 resize-none"
                                        rows={2}
                                    />
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Visual Description</label>
                                    <input
                                        value={scene.visualDescription}
                                        onChange={e => updateScene(scene.id, { visualDescription: e.target.value })}
                                        className="w-full mt-1 bg-black/40 border border-white/10 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-indigo-500/50"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Shot</label>
                                        <select value={scene.shotType} onChange={e => updateScene(scene.id, { shotType: e.target.value as ShotType })}
                                            className="w-full mt-1 bg-black/60 border border-white/10 rounded-lg py-2 px-2 text-xs text-white focus:outline-none">
                                            {SHOT_TYPES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Motion</label>
                                        <select value={scene.motionIntent} onChange={e => updateScene(scene.id, { motionIntent: e.target.value as MotionIntent })}
                                            className="w-full mt-1 bg-black/60 border border-white/10 rounded-lg py-2 px-2 text-xs text-white focus:outline-none">
                                            {MOTION_INTENTS.map(m => <option key={m} value={m}>{m}</option>)}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">VFX</label>
                                        <select value={scene.vfx} onChange={e => updateScene(scene.id, { vfx: e.target.value as VFXType })}
                                            className="w-full mt-1 bg-black/60 border border-white/10 rounded-lg py-2 px-2 text-xs text-white focus:outline-none">
                                            {VFX_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <label className="text-[10px] font-bold text-[var(--color-text-muted)] uppercase tracking-wider">Duration</label>
                                    <input
                                        type="range" min={1} max={15} value={scene.duration}
                                        onChange={e => updateScene(scene.id, { duration: Number(e.target.value) })}
                                        className="flex-1 accent-indigo-500"
                                    />
                                    <span className="text-xs font-mono text-indigo-400 w-8 text-right">{scene.duration}s</span>
                                </div>
                                {/* Scene Actions */}
                                <div className="flex gap-2 pt-2 border-t border-white/5">
                                    <button onClick={() => moveScene(i, -1)} disabled={i === 0}
                                        className="px-2 py-1 text-[10px] rounded bg-white/5 text-[var(--color-text-muted)] hover:bg-white/10 disabled:opacity-30">↑ Up</button>
                                    <button onClick={() => moveScene(i, 1)} disabled={i === scenes.length - 1}
                                        className="px-2 py-1 text-[10px] rounded bg-white/5 text-[var(--color-text-muted)] hover:bg-white/10 disabled:opacity-30">↓ Down</button>
                                    <button onClick={() => duplicateScene(scene)}
                                        className="px-2 py-1 text-[10px] rounded bg-white/5 text-[var(--color-text-muted)] hover:bg-white/10">⊕ Dup</button>
                                    <button onClick={() => deleteScene(scene.id)} disabled={scenes.length <= 1}
                                        className="ml-auto px-2 py-1 text-[10px] rounded bg-red-500/10 text-red-400 hover:bg-red-500/20 disabled:opacity-30">🗑 Delete</button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

// ══════════════════════════════════════════════════════════════════
// HUD Pipeline Loader
// ══════════════════════════════════════════════════════════════════

const PipelineHUD: React.FC<{ update: PipelineUpdate }> = ({ update }) => (
    <div className="flex flex-col items-center justify-center space-y-10 py-20 animate-fade-in">
        <div className="relative">
            <div className="w-28 h-28 rounded-full border-t-2 border-indigo-500 animate-spin" />
            <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-3xl animate-pulse">✨</span>
            </div>
            <div className="absolute -inset-4 border border-white/5 rounded-full animate-ping" style={{ animationDuration: '3s' }} />
        </div>
        <div className="text-center space-y-4">
            <h2 className="text-xl font-black uppercase tracking-[0.2em] bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                Faceless Pro Engine
            </h2>
            <p className="text-[var(--color-text-muted)] font-mono text-sm tracking-wider uppercase animate-pulse">
                [ {update.state} ]: {update.message}
            </p>
        </div>
        <div className="w-72 h-1.5 bg-white/5 rounded-full overflow-hidden">
            <div
                className="h-full bg-gradient-to-r from-indigo-500 to-cyan-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${update.progress}%` }}
            />
        </div>
        <p className="text-xs text-[var(--color-text-muted)] font-mono">{update.progress}%</p>
    </div>
);

// ══════════════════════════════════════════════════════════════════
// Main Faceless Studio
// ══════════════════════════════════════════════════════════════════

const FacelessStudio: React.FC = () => {
    const router = useRouter();
    const { user, decrementCredits } = useAuth();
    const { showToast } = useToast();
    const { addToHistory } = useHistory();
    const [isGenerating, setIsGenerating] = useState(false);
    const [pipelineUpdate, setPipelineUpdate] = useState<PipelineUpdate>({
        state: 'IDLE', message: 'Initializing...', progress: 0,
    });
    const [generatedContent, setGeneratedContent] = useState<VideoScript | null>(null);
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [lastRequest, setLastRequest] = useState<FacelessRequest | null>(null);

    const handleGenerate = useCallback(async (data: FacelessRequest) => {
        if (!user || user.processingCredits <= 0) {
            showToast('No credits remaining! Upgrade your plan.', 'error');
            router.push('/pricing');
            return;
        }
        setIsGenerating(true);
        setGeneratedContent(null);
        setLastRequest(data);

        try {
            const script = await runFacelessPipeline(data, setPipelineUpdate);
            setGeneratedContent(script);
            setSelectedVariantIndex(0);
            decrementCredits();
            showToast('🎬 Video campaign generated!', 'success');

            // Save to history
            addToHistory({
                title: script.title,
                content: script.variants[0]?.scenes.map(s => s.text).join(' | '),
                format: `Faceless Video · ${script.style} · ${script.variants.length} assets`,
                status: 'success',
                icon: '🎞️',
            });
        } catch {
            showToast('Generation failed. Please try again.', 'error');
        } finally {
            setIsGenerating(false);
        }
    }, [user, decrementCredits, showToast, navigate, addToHistory]);

    const handleRegenerate = () => {
        if (lastRequest) handleGenerate(lastRequest);
    };

    const handleUpdateScenes = (newScenes: Scene[]) => {
        if (!generatedContent) return;
        const updated = { ...generatedContent };
        updated.variants = updated.variants.map((v, i) =>
            i === selectedVariantIndex ? { ...v, scenes: newScenes, totalDuration: newScenes.reduce((a, s) => a + s.duration, 0) } : v
        );
        setGeneratedContent(updated);
    };

    const handleDownloadTXT = () => {
        const variant = generatedContent?.variants[selectedVariantIndex];
        if (!variant) return;
        const text = `${generatedContent?.title}\n${'='.repeat(40)}\n\n${variant.scenes.map((s, i) =>
            `[Scene ${i + 1}] (${s.shotType} · ${s.duration}s · ${s.motionIntent})\n"${s.text}"\nVisual: ${s.visualDescription}\n`
        ).join('\n')}`;
        const blob = new Blob([text], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${generatedContent?.title || 'script'}.txt`; a.click();
        URL.revokeObjectURL(url);
        showToast('Script downloaded!', 'success');
    };

    const handleDownloadJSON = () => {
        if (!generatedContent) return;
        const blob = new Blob([JSON.stringify(generatedContent, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url; a.download = `${generatedContent.title || 'campaign'}.json`; a.click();
        URL.revokeObjectURL(url);
        showToast('JSON exported!', 'success');
    };

    const currentVariant = generatedContent?.variants[selectedVariantIndex];

    const getVariantLabel = (v: typeof currentVariant) => {
        if (!v) return '';
        if (v.type === 'HOOK') return `🪝 ${v.hookType}`;
        if (v.type === 'PRIMARY') return `🎬 ${v.platform}`;
        if (v.type === 'CAROUSEL') return '📱 Carousel';
        if (v.type === 'THREAD') return '🧵 Thread';
        return v.type;
    };

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <SEO title="Faceless Studio" description="Automated AI faceless video generation pipeline." />
            <div className="container mx-auto px-6 py-12">
                {!generatedContent ? (
                    isGenerating ? (
                        <PipelineHUD update={pipelineUpdate} />
                    ) : (
                        <VibeInput onGenerate={handleGenerate} isGenerating={isGenerating} />
                    )
                ) : (
                    <div className="animate-fade-in">
                        {/* Title Row */}
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 mb-8">
                            <div>
                                <h1 className="text-3xl font-black bg-gradient-to-r from-white via-indigo-200 to-cyan-200 bg-clip-text text-transparent tracking-tight">
                                    {generatedContent.title}
                                </h1>
                                <div className="flex gap-2 mt-2 flex-wrap">
                                    <span className="text-[10px] bg-indigo-500/10 text-indigo-400 px-2.5 py-1 rounded-md border border-indigo-500/20 font-bold uppercase tracking-wider">{generatedContent.style}</span>
                                    <span className="text-[10px] bg-cyan-500/10 text-cyan-400 px-2.5 py-1 rounded-md border border-cyan-500/20 font-bold uppercase tracking-wider">{generatedContent.purpose}</span>
                                    <span className="text-[10px] bg-violet-500/10 text-violet-400 px-2.5 py-1 rounded-md border border-violet-500/20 font-bold uppercase tracking-wider">{generatedContent.aspectRatio}</span>
                                    <span className="text-[10px] bg-amber-500/10 text-amber-400 px-2.5 py-1 rounded-md border border-amber-500/20 font-bold uppercase tracking-wider">🎵 {generatedContent.musicMood}</span>
                                    <span className="text-[10px] bg-emerald-500/10 text-emerald-400 px-2.5 py-1 rounded-md border border-emerald-500/20 font-bold uppercase tracking-wider">🎙 {generatedContent.voiceTone}</span>
                                </div>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Campaign Package</p>
                                <p className="text-xs text-[var(--color-text-muted)]">{generatedContent.variants.length} assets · {generatedContent.targetDuration}s target</p>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Preview Column */}
                            <div className="flex flex-col items-center gap-5 lg:w-[380px] shrink-0">
                                {currentVariant?.type === 'CAROUSEL' ? (
                                    <div className="w-full aspect-[9/16] max-h-[550px] overflow-y-auto p-4 bg-zinc-900/50 rounded-2xl border border-white/5 grid grid-cols-2 gap-3">
                                        {currentVariant.scenes.map((s, i) => (
                                            <div key={i} className="aspect-[9/16] bg-zinc-800 rounded-xl overflow-hidden relative border border-white/10">
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10" />
                                                <p className="absolute bottom-3 left-3 right-3 text-[10px] text-white font-bold z-20 line-clamp-3">Slide {i + 1}: {s.text}</p>
                                                <div className="w-full h-full bg-indigo-900/20" />
                                            </div>
                                        ))}
                                    </div>
                                ) : currentVariant?.type === 'THREAD' ? (
                                    <div className="w-full aspect-[9/16] max-h-[550px] overflow-y-auto p-6 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-4">
                                        {currentVariant.scenes.map((s, i) => (
                                            <div key={i} className="p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition">
                                                <p className="text-sm text-zinc-200 leading-relaxed">{s.text}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <FacelessPreview
                                        scenes={currentVariant?.scenes || []}
                                        colorGrade={generatedContent.colorGrade}
                                        captionStyle={generatedContent.captionStyle}
                                        aspectRatio={generatedContent.aspectRatio}
                                    />
                                )}

                                {/* Variant Tabs */}
                                <div className="flex flex-wrap justify-center gap-2">
                                    {generatedContent.variants.map((v, i) => (
                                        <button
                                            key={v.id}
                                            onClick={() => setSelectedVariantIndex(i)}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-tight transition-all ${selectedVariantIndex === i
                                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                                                : 'bg-white/5 text-[var(--color-text-muted)] hover:bg-white/10 border border-white/5'
                                                }`}
                                        >{getVariantLabel(v)}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Editor Column */}
                            <div className="flex-1 space-y-6 min-w-0">
                                <SceneEditor
                                    scenes={currentVariant?.scenes || []}
                                    onChange={handleUpdateScenes}
                                />

                                {/* Action Bar */}
                                <div className="flex flex-wrap gap-3 pt-4 border-t border-white/5">
                                    <button onClick={() => setGeneratedContent(null)}
                                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm">
                                        ← New Video
                                    </button>
                                    <button onClick={handleRegenerate} disabled={isGenerating}
                                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm disabled:opacity-50">
                                        🔄 Regenerate
                                    </button>
                                    <button onClick={() => {
                                        const text = currentVariant?.scenes.map(s => s.text).join('\n\n') || '';
                                        navigator.clipboard.writeText(text);
                                        showToast('Script copied to clipboard!', 'success');
                                    }}
                                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm">
                                        📋 Copy
                                    </button>
                                    <button onClick={handleDownloadTXT}
                                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm">
                                        📄 .TXT
                                    </button>
                                    <button onClick={handleDownloadJSON}
                                        className="px-5 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium transition-all text-sm">
                                        💾 .JSON
                                    </button>
                                    <button onClick={async () => {
                                        showToast(`Publishing to ${currentVariant?.platform}...`, 'info');
                                        try {
                                            const text = currentVariant?.scenes.map(s => s.text).join('\n\n') || '';
                                            const res = await fetch('/api/social/publish', {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json' },
                                                body: JSON.stringify({
                                                    content: text,
                                                    platforms: [currentVariant?.platform.toLowerCase()]
                                                })
                                            });
                                            if (res.ok) {
                                                showToast('Published successfully! 🎉', 'success');
                                            } else {
                                                const err = await res.json();
                                                showToast(err.error || 'Failed to publish', 'error');
                                            }
                                        } catch(e) {
                                            showToast('Publishing error', 'error');
                                        }
                                    }}
                                        className="flex-1 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold shadow-lg shadow-indigo-500/20 transition-all text-sm">
                                        🚀 Publish to {currentVariant?.platform}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default FacelessStudio;
