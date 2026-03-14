import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ModernNav } from './shared/ModernNav';
import { LogoStyleGrid } from './logo-maker/LogoStyleGrid';
import { logoGeneratorService } from '../services/logoGeneratorService';
import { useToast } from '../context/ToastContext';
import { LogoStyle, LogoResult } from '../types';
import { SEO } from './shared/SEO';

const LOGO_STYLES: LogoStyle[] = [
    { id: 'minimal', name: 'Minimalist', prompt: 'minimalist vector logo, clean lines, flat design, white background', image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bde2?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: '3d', name: '3D Render', prompt: '3D isometric logo design, octane render, high detail, volumetric lighting, white background', image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 'gradient', name: 'Gradient', prompt: 'modern logo with vibrant gradients, mesh gradient, glassmorphism, white background', image: 'https://images.unsplash.com/photo-1557683316-973673baf926?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 'vintage', name: 'Vintage', prompt: 'vintage badge logo, retro typography, rustic texture, hand-drawn style, white background', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 'futuristic', name: 'Futuristic', prompt: 'cyberpunk style logo, neon accents, high-tech, geometric, white background', image: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 'abstract', name: 'Abstract', prompt: 'abstract organic shapes logo, symbolic, artistic, fluid lines, white background', image: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 'luxury', name: 'Luxury', prompt: 'elegant luxury logo, gold accents, serif typography, sophisticated, white background', image: 'https://images.unsplash.com/photo-1563906267088-b029e7101114?auto=format&fit=crop&q=80&w=300&h=300' },
    { id: 'mascot', name: 'Mascot', prompt: 'vector mascot logo, character design, bold outlines, vibrant, esports style, white background', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=300&h=300' },
];

const LogoMaker: React.FC = () => {
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [prompt, setPrompt] = useState('');
    const [selectedStyle, setSelectedStyle] = useState(LOGO_STYLES[0].id);
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        if (!prompt) return;

        setIsGenerating(true);
        try {
            const style = LOGO_STYLES.find(s => s.id === selectedStyle);
            const fullPrompt = `${prompt}, ${style?.prompt}`;

            console.log('Initiating logo generation...', { selectedStyle });

            const imageUrl = await logoGeneratorService.generate({
                prompt: fullPrompt,
                styleId: selectedStyle,
                tier: 'free'
            });

            if (!imageUrl) {
                throw new Error('No image URL returned from generator');
            }

            const result: LogoResult = {
                imageUrl,
                prompt: fullPrompt,
                styleId: selectedStyle,
                tier: 'free',
                timestamp: Date.now(),
                createdAt: new Date().toISOString()
            };

            sessionStorage.setItem('last_logo_result', JSON.stringify(result));
            console.log('Generation successful, navigating to results');
            navigate('/logo-results');
        } catch (error) {
            console.error('Generation error:', error);
            showToast('Generation failed. Please try a different tier or style.', 'error');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-primary)] text-white">
            <SEO title="AI Logo Maker" description="Create professional logos in seconds with AI." />
            <ModernNav />

            <main className="max-w-7xl mx-auto px-6 pt-32 pb-20">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-12">
                        <span className="inline-block px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-widest mb-4">
                            AI-Powered Design
                        </span>
                        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
                            Brand Identity in <span className="text-blue-500">Seconds</span>
                        </h1>
                        <p className="text-[var(--color-text-secondary)] text-lg">
                            Describe your business and let our AI craft a unique logo for you.
                        </p>
                    </div>

                    <div className="space-y-8 bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl">
                        {/* Prompt Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Business Description & Name
                            </label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="e.g., A minimalist logo for a tech startup called 'ContextMatic' that specializes in AI content repurposing."
                                className="w-full h-32 px-5 py-4 rounded-2xl bg-black/40 border border-white/10 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all resize-none text-white placeholder-gray-600"
                            />
                        </div>

                        {/* Style Selection */}
                        <div>
                            <label className="block text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
                                Choose Style
                            </label>
                            <LogoStyleGrid
                                styles={LOGO_STYLES}
                                selectedId={selectedStyle}
                                onSelect={setSelectedStyle}
                            />
                        </div>

                        {/* Tier Selection - Removed to make it Free */}

                        {/* Generate Button */}
                        <button
                            disabled={!prompt || isGenerating}
                            onClick={handleGenerate}
                            className={`w-full py-5 rounded-2xl font-bold text-lg transition-all duration-300 shadow-xl ${!prompt || isGenerating
                                ? 'bg-gray-600 cursor-not-allowed opacity-50'
                                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white shadow-blue-500/20 hover:scale-[1.01] active:scale-[0.99]'
                                }`}
                        >
                            {isGenerating ? (
                                <div className="flex items-center justify-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Capturing your vision...
                                </div>
                            ) : (
                                'Generate Logo'
                            )}
                        </button>
                    </div>

                    <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center opacity-60">
                        <div>
                            <p className="text-2xl font-bold text-white">100%</p>
                            <p className="text-xs uppercase tracking-widest text-gray-400">Unique Designs</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">4K</p>
                            <p className="text-xs uppercase tracking-widest text-gray-400">Resolution</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">SVG</p>
                            <p className="text-xs uppercase tracking-widest text-gray-400">Ready Formats</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-white">Commercial</p>
                            <p className="text-xs uppercase tracking-widest text-gray-400">Usage Rights</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default LogoMaker;
