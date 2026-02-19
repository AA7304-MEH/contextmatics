// Faceless Video AI Script Generator — Advanced Edition
// Gemini AI integration + 10 themes + multi-format atomization

import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY || '');

export type ShotType = 'Close-up' | 'Wide' | 'Establishing' | 'Dynamic' | 'Overhead' | 'POV' | 'Tracking';
export type MotionIntent = 'Slow zoom in' | 'Quick pan' | 'Parallax scroll' | 'Static' | 'Dolly out' | 'Tilt up' | 'Orbit';
export type VFXType = 'light leaks' | 'particle burst' | 'glitch' | 'film grain' | 'chromatic aberration' | 'none';
export type CaptionStyle = 'mrbeast' | 'hormozi' | 'subtitle' | 'neon';
export type AspectRatio = '9:16' | '16:9' | '1:1';
export type MusicMood = 'cinematic' | 'upbeat' | 'dark' | 'ambient' | 'lofi' | 'epic';
export type VoiceTone = 'dramatic' | 'calm' | 'energetic' | 'whisper' | 'authoritative';

export interface Scene {
    id: string;
    text: string;
    visualDescription: string;
    duration: number;
    assetUrl?: string;
    prompt?: string;
    shotType: ShotType;
    visualMotif?: string;
    motionIntent: MotionIntent;
    vfx: VFXType;
}

export interface VideoVariant {
    id: string;
    platform: string;
    type: 'PRIMARY' | 'HOOK' | 'CAROUSEL' | 'THREAD';
    hookType?: string;
    scenes: Scene[];
    totalDuration: number;
    audio?: {
        voiceoverUrl: string;
        backgroundMusicUrl: string;
        sfx?: { type: string; timestamp: number }[];
    };
}

export interface VideoScript {
    title: string;
    coreDNA: {
        topic: string;
        keyPoints: string[];
        audience: string;
        tone: string;
    };
    style: string;
    purpose: string;
    variants: VideoVariant[];
    colorGrade?: string;
    captionStyle: CaptionStyle;
    aspectRatio: AspectRatio;
    musicMood: MusicMood;
    voiceTone: VoiceTone;
    targetDuration: number;
}

// ── 10 Pre-built Faceless Video Themes ─────────────────────────

const FACELESS_THEMES: Record<string, { title: string; scenes: Omit<Scene, 'id'>[] }> = {
    motivational: {
        title: "The Champion's Mindset",
        scenes: [
            { text: "Success isn't owned. It's leased.", visualDescription: "Slow motion mountain peak at sunrise", duration: 4, shotType: 'Establishing', motionIntent: 'Slow zoom in', visualMotif: 'Cinematic Nature', vfx: 'light leaks' },
            { text: "And rent is due every single day.", visualDescription: "Athlete training in heavy rain", duration: 4, shotType: 'Close-up', motionIntent: 'Static', visualMotif: 'Gritty Realism', vfx: 'film grain' },
            { text: "Keep pushing. Don't look back.", visualDescription: "Close up of determined eyes", duration: 3, shotType: 'Close-up', motionIntent: 'Parallax scroll', visualMotif: 'High Contrast', vfx: 'none' },
            { text: "Your future self is watching.", visualDescription: "City skyline at night with fast motion", duration: 4, shotType: 'Wide', motionIntent: 'Quick pan', visualMotif: 'Cyberpunk', vfx: 'chromatic aberration' },
        ]
    },
    horror: {
        title: "Shadows in the Attic",
        scenes: [
            { text: "They said the house was empty.", visualDescription: "Creaky door opening in darkness", duration: 4, shotType: 'Wide', motionIntent: 'Slow zoom in', visualMotif: 'Gothic Horror', vfx: 'film grain' },
            { text: "But the footsteps upstairs said otherwise.", visualDescription: "Shadowy figure passing a hallway", duration: 4, shotType: 'Dynamic', motionIntent: 'Quick pan', visualMotif: 'VHS Glitch', vfx: 'glitch' },
            { text: "Never look under the bed.", visualDescription: "Extreme close up of a dusty floor", duration: 3, shotType: 'Close-up', motionIntent: 'Static', visualMotif: 'Low Light', vfx: 'none' },
            { text: "Because something is looking back.", visualDescription: "Flickering lights in a basement", duration: 4, shotType: 'Establishing', motionIntent: 'Slow zoom in', visualMotif: 'Industrial Decay', vfx: 'chromatic aberration' },
        ]
    },
    facts: {
        title: "3 Mind-Blowing Space Facts",
        scenes: [
            { text: "Fact 1: Space is completely silent.", visualDescription: "Deep space nebula shot", duration: 4, shotType: 'Establishing', motionIntent: 'Parallax scroll', visualMotif: 'Cosmic Glow', vfx: 'particle burst' },
            { text: "Fact 2: A day on Venus is longer than a year.", visualDescription: "Rotating planet Venus animation", duration: 5, shotType: 'Wide', motionIntent: 'Orbit', visualMotif: 'Scientific Diagram', vfx: 'none' },
            { text: "Fact 3: There are more stars than grains of sand.", visualDescription: "Star cluster zoom in", duration: 4, shotType: 'Dynamic', motionIntent: 'Slow zoom in', visualMotif: 'Star Field', vfx: 'light leaks' },
            { text: "Subscribe for more cosmic secrets.", visualDescription: "Logo animation over stars", duration: 2, shotType: 'Close-up', motionIntent: 'Static', visualMotif: 'Flat Minimalist', vfx: 'none' },
        ]
    },
    tech: {
        title: "AI Will Change Everything",
        scenes: [
            { text: "In 2025, AI wrote its first novel.", visualDescription: "Futuristic holographic text display", duration: 4, shotType: 'Dynamic', motionIntent: 'Quick pan', visualMotif: 'Neon Tech', vfx: 'glitch' },
            { text: "By 2026, it was directing movies.", visualDescription: "Robotic arm holding a film reel", duration: 4, shotType: 'Close-up', motionIntent: 'Slow zoom in', visualMotif: 'Sci-Fi Clean', vfx: 'chromatic aberration' },
            { text: "The question isn't if, it's when.", visualDescription: "Clock dissolving into code particles", duration: 3, shotType: 'Establishing', motionIntent: 'Parallax scroll', visualMotif: 'Matrix Rain', vfx: 'particle burst' },
            { text: "Are you ready for the future?", visualDescription: "Human hand reaching toward digital hand", duration: 4, shotType: 'Wide', motionIntent: 'Static', visualMotif: 'Blade Runner', vfx: 'light leaks' },
        ]
    },
    finance: {
        title: "Money Secrets They Don't Teach You",
        scenes: [
            { text: "Rule #1: Never save what's left after spending.", visualDescription: "Pile of coins growing into a tower", duration: 4, shotType: 'Close-up', motionIntent: 'Slow zoom in', visualMotif: 'Gold & Dark', vfx: 'none' },
            { text: "Spend what's left after saving.", visualDescription: "Vault door opening to reveal light", duration: 4, shotType: 'Wide', motionIntent: 'Quick pan', visualMotif: 'Luxury Minimal', vfx: 'light leaks' },
            { text: "Compound interest is the 8th wonder.", visualDescription: "Exponential growth curve animation", duration: 3, shotType: 'Dynamic', motionIntent: 'Parallax scroll', visualMotif: 'Data Viz', vfx: 'none' },
            { text: "Start today. Your future self will thank you.", visualDescription: "Sunrise over a peaceful lake", duration: 4, shotType: 'Establishing', motionIntent: 'Static', visualMotif: 'Warm Cinematic', vfx: 'film grain' },
        ]
    },
    cooking: {
        title: "5-Minute Recipes That Slap",
        scenes: [
            { text: "Tired of boring meals? Watch this.", visualDescription: "Overhead shot of colorful ingredients", duration: 3, shotType: 'Overhead', motionIntent: 'Static', visualMotif: 'Food Aesthetic', vfx: 'none' },
            { text: "Step 1: Crack two eggs into a bowl.", visualDescription: "Close-up of eggs cracking in slow motion", duration: 4, shotType: 'Close-up', motionIntent: 'Slow zoom in', visualMotif: 'Kitchen Studio', vfx: 'light leaks' },
            { text: "Step 2: Add the secret ingredient: love... and butter.", visualDescription: "Butter melting in a sizzling pan", duration: 4, shotType: 'POV', motionIntent: 'Tilt up', visualMotif: 'Warm Tones', vfx: 'film grain' },
            { text: "And now? Chef's kiss. 👨‍🍳", visualDescription: "Finished dish plated beautifully", duration: 3, shotType: 'Dynamic', motionIntent: 'Orbit', visualMotif: 'Restaurant Quality', vfx: 'none' },
            { text: "Follow for more fire recipes. 🔥", visualDescription: "Animated subscribe button overlay", duration: 2, shotType: 'Close-up', motionIntent: 'Static', visualMotif: 'Branded Outro', vfx: 'particle burst' },
        ]
    },
    travel: {
        title: "Places You Must Visit Before You Die",
        scenes: [
            { text: "The world is too big to stay in one place.", visualDescription: "Aerial shot of turquoise ocean meeting white sand", duration: 4, shotType: 'Establishing', motionIntent: 'Dolly out', visualMotif: 'Tropical Paradise', vfx: 'light leaks' },
            { text: "Santorini: Where blue domes meet the sunset.", visualDescription: "Time-lapse sunset over Santorini", duration: 4, shotType: 'Wide', motionIntent: 'Parallax scroll', visualMotif: 'Mediterranean Dream', vfx: 'none' },
            { text: "Kyoto: Ancient temples hidden in bamboo forests.", visualDescription: "Dolly through bamboo grove", duration: 4, shotType: 'Tracking', motionIntent: 'Slow zoom in', visualMotif: 'Japanese Zen', vfx: 'film grain' },
            { text: "Northern Lights: Nature's own light show.", visualDescription: "Aurora borealis dancing over mountains", duration: 4, shotType: 'Wide', motionIntent: 'Orbit', visualMotif: 'Arctic Glow', vfx: 'chromatic aberration' },
            { text: "Pack your bags. Adventure is calling.", visualDescription: "Passport stamp montage", duration: 3, shotType: 'Dynamic', motionIntent: 'Quick pan', visualMotif: 'Vintage Travel', vfx: 'none' },
        ]
    },
    gaming: {
        title: "Gaming Moments That Broke the Internet",
        scenes: [
            { text: "Some moments change gaming forever.", visualDescription: "Glitchy game title screen montage", duration: 3, shotType: 'Dynamic', motionIntent: 'Quick pan', visualMotif: 'RGB Gamer', vfx: 'glitch' },
            { text: "The play that made 50 million people scream.", visualDescription: "Esports arena crowd reaction", duration: 4, shotType: 'Wide', motionIntent: 'Dolly out', visualMotif: 'Stadium Lights', vfx: 'chromatic aberration' },
            { text: "1 HP. Zero chance. Full send.", visualDescription: "Close-up of intense gameplay footage", duration: 3, shotType: 'Close-up', motionIntent: 'Static', visualMotif: 'Neon Glitch', vfx: 'particle burst' },
            { text: "And that's why this clip has 200M views.", visualDescription: "View count counter spinning up", duration: 3, shotType: 'POV', motionIntent: 'Slow zoom in', visualMotif: 'Social Stats', vfx: 'none' },
            { text: "Drop a 🎮 if you're a real one.", visualDescription: "Animated like button + subscribe CTA", duration: 2, shotType: 'Close-up', motionIntent: 'Static', visualMotif: 'Branded Outro', vfx: 'glitch' },
        ]
    },
    fitness: {
        title: "30-Day Body Transformation",
        scenes: [
            { text: "Day 1: You're the weakest you'll ever be.", visualDescription: "Before photo with dim lighting", duration: 4, shotType: 'Close-up', motionIntent: 'Static', visualMotif: 'Raw Documentary', vfx: 'film grain' },
            { text: "Day 10: The mirror doesn't lie.", visualDescription: "Time-lapse of pushups from different angles", duration: 4, shotType: 'Dynamic', motionIntent: 'Quick pan', visualMotif: 'Gym Aesthetic', vfx: 'none' },
            { text: "Day 20: People start noticing.", visualDescription: "Side-by-side comparison shots", duration: 4, shotType: 'Wide', motionIntent: 'Parallax scroll', visualMotif: 'Split Screen', vfx: 'light leaks' },
            { text: "Day 30: You're not the same person anymore.", visualDescription: "After photo with dramatic lighting", duration: 4, shotType: 'Establishing', motionIntent: 'Slow zoom in', visualMotif: 'Hero Shot', vfx: 'chromatic aberration' },
            { text: "Your turn. No excuses. 💪", visualDescription: "Motivational text with heartbeat animation", duration: 2, shotType: 'Close-up', motionIntent: 'Static', visualMotif: 'Bold Typography', vfx: 'particle burst' },
        ]
    },
    history: {
        title: "The Day That Changed History",
        scenes: [
            { text: "July 20, 1969. The world held its breath.", visualDescription: "Vintage TV static transitioning to NASA footage", duration: 4, shotType: 'Establishing', motionIntent: 'Slow zoom in', visualMotif: 'Vintage Film', vfx: 'film grain' },
            { text: "One small step for man...", visualDescription: "Boot print on lunar surface", duration: 4, shotType: 'Close-up', motionIntent: 'Static', visualMotif: 'Monochrome Documentary', vfx: 'none' },
            { text: "600 million people watched live.", visualDescription: "Collage of people watching TV sets worldwide", duration: 4, shotType: 'Wide', motionIntent: 'Parallax scroll', visualMotif: 'Photo Collage', vfx: 'light leaks' },
            { text: "One giant leap for mankind.", visualDescription: "Earth rising over the moon horizon", duration: 5, shotType: 'Dynamic', motionIntent: 'Tilt up', visualMotif: 'Earthrise', vfx: 'chromatic aberration' },
            { text: "What will YOUR legacy be?", visualDescription: "Modern space exploration montage", duration: 3, shotType: 'Tracking', motionIntent: 'Dolly out', visualMotif: 'Future Forward', vfx: 'particle burst' },
        ]
    }
};

export function getThemeIds(): string[] {
    return Object.keys(FACELESS_THEMES);
}

export function getTheme(id: string) {
    return FACELESS_THEMES[id] || null;
}

// ── Gemini AI Script Generation ──────────────────────────────────

async function generateAIScript(
    topic: string,
    style: string,
    purpose: string,
    targetDuration: number,
): Promise<{ title: string; scenes: Omit<Scene, 'id'>[]; keyPoints: string[] }> {
    if (!API_KEY || API_KEY.includes('dummy')) {
        return generateMockScript(topic, style, purpose, targetDuration);
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const sceneCount = Math.max(3, Math.ceil(targetDuration / 5));

        const prompt = `You are a professional faceless video scriptwriter for TikTok, Instagram Reels, and YouTube Shorts.

Create a ${targetDuration}-second faceless video script about: "${topic}"
Style: ${style} | Purpose: ${purpose}

Return ONLY valid JSON (no markdown, no code blocks) with this exact structure:
{
  "title": "catchy video title",
  "keyPoints": ["point1", "point2", "point3"],
  "scenes": [
    {
      "text": "narration text for this scene (max 15 words)",
      "visualDescription": "what the viewer sees (be specific, cinematic)",
      "duration": 4,
      "shotType": "Close-up",
      "motionIntent": "Slow zoom in",
      "visualMotif": "descriptive style label",
      "vfx": "none"
    }
  ]
}

Rules:
- Generate exactly ${sceneCount} scenes
- shotType must be one of: Close-up, Wide, Establishing, Dynamic, Overhead, POV, Tracking
- motionIntent must be one of: Slow zoom in, Quick pan, Parallax scroll, Static, Dolly out, Tilt up, Orbit
- vfx must be one of: light leaks, particle burst, glitch, film grain, chromatic aberration, none
- Scene durations should sum to approximately ${targetDuration} seconds
- First scene must be a hook that grabs attention
- Last scene should be a CTA
- Text should be punchy, conversational, and viral-worthy`;

        const result = await model.generateContent(prompt);
        const response = await result.response;
        let text = response.text().trim();

        // Strip markdown code blocks if present
        text = text.replace(/^```json?\s*/i, '').replace(/```\s*$/i, '').trim();

        const parsed = JSON.parse(text);
        return {
            title: parsed.title || `The Truth About ${topic}`,
            scenes: (parsed.scenes || []).map((s: any) => ({
                text: s.text || '',
                visualDescription: s.visualDescription || '',
                duration: s.duration || 4,
                shotType: s.shotType || 'Dynamic',
                motionIntent: s.motionIntent || 'Static',
                visualMotif: s.visualMotif || 'Default',
                vfx: s.vfx || 'none',
            })),
            keyPoints: parsed.keyPoints || ['Key insight'],
        };
    } catch (error) {
        console.warn('Gemini AI generation failed, using mock:', error);
        return generateMockScript(topic, style, purpose, targetDuration);
    }
}

function generateMockScript(
    topic: string,
    style: string,
    _purpose: string,
    targetDuration: number,
): { title: string; scenes: Omit<Scene, 'id'>[]; keyPoints: string[] } {
    const isFunny = style === 'animated' || style === 'trendy';
    const sceneCount = Math.max(3, Math.ceil(targetDuration / 5));

    const shotTypes: ShotType[] = ['Dynamic', 'Close-up', 'Wide', 'Establishing', 'POV', 'Tracking', 'Overhead'];
    const motions: MotionIntent[] = ['Quick pan', 'Slow zoom in', 'Parallax scroll', 'Static', 'Dolly out', 'Tilt up', 'Orbit'];
    const vfxOptions: VFXType[] = ['light leaks', 'none', 'particle burst', 'film grain', 'glitch', 'chromatic aberration'];

    const hookLines = [
        `Stop scrolling. You need to hear this about ${topic}.`,
        `${topic}? Most people get this completely wrong.`,
        `What nobody tells you about ${topic}...`,
        isFunny ? `So, you think you know about ${topic}? Wrong.` : `Let's talk about ${topic}.`,
    ];

    const bodyLines = [
        `Here's the secret that ${isFunny ? "nobody talks about because it's boring" : 'changed everything'}.`,
        `The ${topic} industry is worth $${Math.floor(Math.random() * 900 + 100)} billion.`,
        `Scientists discovered something shocking about ${topic} in 2024.`,
        `This single fact about ${topic} will change how you think.`,
        `Here's what the top 1% know about ${topic} that you don't.`,
        `The data doesn't lie: ${topic} is exploding right now.`,
    ];

    const ctaLines = [
        'Follow for more. You don\'t want to miss what\'s next.',
        'Subscribe and share this with someone who needs to hear it.',
        'Drop a 🔥 if this blew your mind.',
        isFunny ? 'Like and follow or I\'ll be sad. 😢' : 'Your move. Start today.',
    ];

    const scenes: Omit<Scene, 'id'>[] = [];
    const avgDuration = targetDuration / sceneCount;

    for (let i = 0; i < sceneCount; i++) {
        const isFirst = i === 0;
        const isLast = i === sceneCount - 1;

        let text: string;
        if (isFirst) {
            text = hookLines[Math.floor(Math.random() * hookLines.length)];
        } else if (isLast) {
            text = ctaLines[Math.floor(Math.random() * ctaLines.length)];
        } else {
            text = bodyLines[Math.floor(Math.random() * bodyLines.length)];
        }

        scenes.push({
            text,
            visualDescription: isFirst ? 'Fast-paced montage intro with bold text' : isLast ? 'Animated CTA with logo reveal' : `Cinematic B-roll showing ${topic} visuals`,
            duration: Math.round(avgDuration),
            shotType: shotTypes[i % shotTypes.length],
            motionIntent: motions[i % motions.length],
            visualMotif: isFirst ? 'High Energy Hook' : isLast ? 'Branded Outro' : 'Professional Studio',
            vfx: vfxOptions[i % vfxOptions.length],
        });
    }

    return {
        title: `The Truth About ${topic}`,
        scenes,
        keyPoints: [`${topic} is trending`, 'Data-driven insight', 'Actionable takeaway'],
    };
}

// ── Main Generator Function ──────────────────────────────────────

export interface GenerateOptions {
    topic: string;
    style: string;
    purpose: string;
    platforms: string[];
    themeId?: string;
    captionStyle?: CaptionStyle;
    aspectRatio?: AspectRatio;
    musicMood?: MusicMood;
    voiceTone?: VoiceTone;
    targetDuration?: number;
}

export async function generateFacelessScript(options: GenerateOptions): Promise<VideoScript> {
    const {
        topic, style, purpose, platforms,
        themeId,
        captionStyle = 'mrbeast',
        aspectRatio = '9:16',
        musicMood = 'cinematic',
        voiceTone = 'dramatic',
        targetDuration = 30,
    } = options;

    let title: string;
    let scenes: Scene[];
    let keyPoints: string[];

    if (themeId && FACELESS_THEMES[themeId]) {
        const theme = FACELESS_THEMES[themeId];
        title = theme.title;
        scenes = theme.scenes.map((s, i) => ({ ...s, id: `scene-${i + 1}` }));
        keyPoints = ['Pre-built theme', 'Optimized for engagement'];
    } else {
        const aiResult = await generateAIScript(topic, style, purpose, targetDuration);
        title = aiResult.title;
        scenes = aiResult.scenes.map((s, i) => ({ ...s, id: `scene-${i + 1}` }));
        keyPoints = aiResult.keyPoints;
    }

    return buildVideoScript(title, topic, style, purpose, platforms, scenes, keyPoints, {
        captionStyle, aspectRatio, musicMood, voiceTone, targetDuration,
    });
}

function buildVideoScript(
    title: string,
    topic: string,
    style: string,
    purpose: string,
    platforms: string[],
    scenes: Scene[],
    keyPoints: string[],
    meta: { captionStyle: CaptionStyle; aspectRatio: AspectRatio; musicMood: MusicMood; voiceTone: VoiceTone; targetDuration: number },
): VideoScript {
    const isFunny = style === 'animated' || style === 'trendy';

    const variants: VideoVariant[] = [
        {
            id: 'primary-short',
            platform: platforms[0] || 'TikTok',
            type: 'PRIMARY',
            scenes,
            totalDuration: scenes.reduce((acc, s) => acc + s.duration, 0),
            audio: {
                voiceoverUrl: `mock://voiceover/${meta.voiceTone}`,
                backgroundMusicUrl: `mock://music/${meta.musicMood}`,
                sfx: [{ type: 'whoosh', timestamp: 0 }, { type: 'impact', timestamp: 3 }]
            }
        },
        ...[1, 2, 3].map(i => ({
            id: `hook-variant-${i}`,
            platform: 'Reels/Shorts',
            type: 'HOOK' as const,
            hookType: i === 1 ? 'Question' : i === 2 ? 'Shocking Fact' : 'Visual Tease',
            scenes: [{ ...scenes[0], id: `hook-${i}-scene` }],
            totalDuration: scenes[0].duration,
            audio: {
                voiceoverUrl: `mock://voiceover/${meta.voiceTone}`,
                backgroundMusicUrl: `mock://music/${meta.musicMood}`,
            }
        })),
        {
            id: 'insta-carousel',
            platform: 'Instagram',
            type: 'CAROUSEL',
            scenes: scenes.map(s => ({ ...s, duration: 0 })),
            totalDuration: 0,
        },
        {
            id: 'platform-thread',
            platform: 'Twitter/LinkedIn',
            type: 'THREAD',
            scenes: scenes.map(s => ({ ...s, text: `🧵 ${s.text}` })),
            totalDuration: 0,
        }
    ];

    return {
        title,
        coreDNA: {
            topic,
            keyPoints,
            audience: 'General interest',
            tone: isFunny ? 'funny' : 'professional',
        },
        style,
        purpose,
        variants,
        colorGrade: 'Film Bloom',
        captionStyle: meta.captionStyle,
        aspectRatio: meta.aspectRatio,
        musicMood: meta.musicMood,
        voiceTone: meta.voiceTone,
        targetDuration: meta.targetDuration,
    };
}
