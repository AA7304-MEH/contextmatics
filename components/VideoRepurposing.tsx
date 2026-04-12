import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { PageLayout, SEO } from './shared';

const processingStages = [
    'Downloading Video...',
    'Transcribing Audio...',
    'Analyzing Viral Moments...',
    'Reframing for Vertical...'
];

// Dynamic generation of clips based on duration
const generateMockClips = (duration: number, mode: 'highlights' | 'summary', platform: string) => {
    if (mode === 'summary') {
        return [
            { id: 1, title: `✨ Artificial Intelligence Summary (${platform})`, score: 99, time: `00:00 - 00:${duration}`, duration: duration }
        ];
    }
    return [
        { id: 1, title: 'Found: The Aha Moment 💡', score: 98, time: `02:15 - 02:${15 + duration}`, duration: duration },
        { id: 2, title: 'Found: Controversial Take 😲', score: 92, time: `05:30 - 05:${30 + duration}`, duration: duration },
        { id: 3, title: 'Found: Perfect Loop 🔄', score: 88, time: `08:45 - 08:${45 + duration}`, duration: duration },
        { id: 4, title: 'Found: Key Insight 🧠', score: 85, time: `12:10 - 12:${10 + duration}`, duration: duration },
    ];
};

const VideoRepurposing: React.FC = () => {
    const router = useRouter();
    const { user, decrementCredits } = useAuth();
    const { showToast } = useToast();

    // Configuration State
    const [platform, setPlatform] = useState<'shorts' | 'tiktok' | 'reels'>('shorts');
    const [processingMode, setProcessingMode] = useState<'highlights' | 'summary'>('highlights');
    const [targetDuration, setTargetDuration] = useState<number>(30); // Default 30s
    const [customDuration, setCustomDuration] = useState<string>('30'); // Text input for custom
    const [captionStyle, setCaptionStyle] = useState<'hormozi' | 'neon' | 'minimal'>('hormozi');
    const [showCaptions, setShowCaptions] = useState(true);

    // Core State
    const [step, setStep] = useState<'input' | 'processing' | 'editor'>('input');
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [processingStage, setProcessingStage] = useState(0);
    const [selectedClip, setSelectedClip] = useState<number | null>(null);
    const [currentClips, setCurrentClips] = useState<any[]>([]);

    // Rendering State
    const [isRendering, setIsRendering] = useState(false);
    const [renderProgress, setRenderProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    // Hidden refs for rendering
    const renderVideoRef = useRef<HTMLVideoElement>(null);
    const renderCanvasRef = useRef<HTMLCanvasElement>(null);

    // Cleanup video preview URL on unmount
    useEffect(() => {
        return () => {
            if (videoPreviewUrl) {
                URL.revokeObjectURL(videoPreviewUrl);
            }
        };
    }, [videoPreviewUrl]);

    // File validation
    const validateFile = (file: File): { valid: boolean; error?: string } => {
        const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
        const maxSize = 1024 * 1024 * 1024; // 1GB

        if (!validTypes.includes(file.type)) {
            return { valid: false, error: 'Invalid file type. Please upload MP4, MOV, AVI, or WebM.' };
        }

        if (file.size > maxSize) {
            return { valid: false, error: 'File too large. Maximum size is 1GB.' };
        }

        return { valid: true };
    };

    // YouTube URL validation
    const validateYouTubeUrl = (url: string): boolean => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
        return youtubeRegex.test(url);
    };

    // Handle file selection
    const handleFileSelect = (file: File) => {
        const validation = validateFile(file);

        if (!validation.valid) {
            showToast(validation.error || 'Invalid file', 'warning');
            return;
        }

        setUploadedFile(file);
        const previewUrl = URL.createObjectURL(file);
        setVideoPreviewUrl(previewUrl);
        setVideoUrl(''); // Clear YouTube URL if file is uploaded
    };

    // Handle file input change
    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Drag and drop handlers
    const handleDragEnter = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const file = e.dataTransfer.files[0];
        if (file) {
            handleFileSelect(file);
        }
    };

    // Helper: Extract YouTube ID
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    // Helper: Parse "MM:SS" to seconds
    const parseTimeToSeconds = (timeStr: string) => {
        const [min, sec] = timeStr.split(':').map(Number);
        return min * 60 + sec;
    };

    const handleProcess = () => {
        if (!videoUrl && !uploadedFile) return;

        // Credit validation before processing
        if (!user || user.processingCredits <= 0) {
            showToast('No credits remaining! Please upgrade your plan to continue processing videos.', 'error');
            router.push('/pricing');
            return;
        }

        // Validate YouTube URL if provided
        if (videoUrl && !validateYouTubeUrl(videoUrl)) {
            showToast('Invalid YouTube URL. Please enter a valid YouTube link.', 'warning');
            return;
        }

        setStep('processing');

        // Simulate AI processing steps
        const stages = [
            `Downloading Video Stream...`,
            `Deep Learning Analysis for ${platform === 'tiktok' ? 'TikTok' : (platform === 'reels' ? 'Reels' : 'Shorts')}...`,
            `${processingMode === 'summary' ? 'Synthesizing Full Summary...' : 'Detecting Viral Hooks & Peaks...'}`,
            'Reframing to 9:16 Vertical...',
            'Finalizing AI Edits...'
        ];
        let currentStage = 0;

        const interval = setInterval(() => {
            currentStage++;
            setProcessingStage(currentStage);
            if (currentStage >= stages.length) {
                clearInterval(interval);
                setTimeout(() => {
                    const durationToUse = parseInt(customDuration) || targetDuration;
                    const generatedClips = generateMockClips(durationToUse, processingMode, platform === 'tiktok' ? 'TikTok' : (platform === 'reels' ? 'Reels' : 'Shorts'));
                    setCurrentClips(generatedClips);
                    setStep('editor');
                    setSelectedClip(generatedClips[0].id); // Auto-select first clip

                    // Deduct credit after successful processing
                    decrementCredits();
                }, 1000);
            }
        }, 1500);
    };

    // Get current clip times
    const currentClip = currentClips.find(c => c.id === selectedClip) || currentClips[0];
    const [startTime, endTime] = currentClip ? currentClip.time.split(' - ') : ['00:00', '00:00'];
    const startSeconds = parseTimeToSeconds(startTime);
    const endSeconds = parseTimeToSeconds(endTime);

    const handleExport = async () => {
        if (uploadedFile && videoPreviewUrl) {
            // Start Real Client-Side Rendering
            setIsRendering(true);
            setRenderProgress(0);
            await processVideoExport();
        } else if (videoUrl) {
            showToast('YouTube downloads require a backend server (ffmpeg). Upload a local file to test the cropping engine.', 'info');
        } else {
            showToast('No video source found to export.', 'warning');
        }
    };

    const processVideoExport = async () => {
        if (!renderVideoRef.current || !renderCanvasRef.current || !selectedClip) return;

        const video = renderVideoRef.current;
        const canvas = renderCanvasRef.current;
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        // Clip Times
        const clip = currentClips.find(c => c.id === selectedClip);
        if (!clip) return;
        const [startStr, endStr] = clip.time.split(' - ');
        const startTime = parseTimeToSeconds(startStr);
        const duration = parseTimeToSeconds(endStr) - startTime;

        // Setup Canvas (1080x1920 HD Vertical)
        canvas.width = 1080;
        canvas.height = 1920;

        // Force video to load for rendering
        video.currentTime = startTime;
        await new Promise(r => { video.onseeked = r; video.currentTime = startTime; });

        // Setup Media Recorder
        const stream = canvas.captureStream(30); // 30 FPS

        // Try to add audio
        // @ts-ignore - captureStream support varies
        if (video.captureStream || video.mozCaptureStream) {
            // @ts-ignore
            const videoStream = video.captureStream ? video.captureStream() : video.mozCaptureStream();
            const audioTrack = videoStream.getAudioTracks()[0];
            if (audioTrack) stream.addTrack(audioTrack);
        }

        const chunks: Blob[] = [];
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `contextmatic_short_${platform}_${selectedClip}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            setIsRendering(false);
        };

        mediaRecorder.start();
        video.play();

        // Rendering Loop
        const drawFrame = () => {
            if (!isRendering) return; // Safety break

            if (video.currentTime >= startTime + duration) {
                mediaRecorder.stop();
                video.pause();
                return;
            }

            // Draw Video (Center Crop / Cover)
            // Calculate scaling to cover 1080x1920
            const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
            const x = (canvas.width / 2) - (video.videoWidth / 2) * scale;
            const y = (canvas.height / 2) - (video.videoHeight / 2) * scale;

            ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);

            // Draw Captions (Simulated burn-in for export)
            if (showCaptions) {
                ctx.font = captionStyle === 'minimal' ? '500 40px Inter, sans-serif' : '900 50px Inter, sans-serif';
                ctx.textAlign = 'center';
                // Basic Shadow
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillText(clip.title, canvas.width / 2 + 2, canvas.height * 0.8 + 2);
                // Text
                ctx.fillStyle = captionStyle === 'hormozi' ? '#fbbf24' : 'white';
                ctx.fillText(clip.title, canvas.width / 2, canvas.height * 0.8);
            }

            // Update Progress
            const progress = ((video.currentTime - startTime) / duration) * 100;
            setRenderProgress(Math.min(progress, 100));

            requestAnimationFrame(drawFrame);
        };

        drawFrame();
    };

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <SEO title="Video Repurposing" description="Turn long-form videos into viral vertical shorts with AI." />
            {/* Hidden Rendering Elements */}
            <video
                ref={renderVideoRef}
                src={videoPreviewUrl}
                style={{ display: 'none' }}
                crossOrigin="anonymous"
                muted={false}
            />
            <canvas ref={renderCanvasRef} style={{ display: 'none' }} />

            {/* Rendering Overlay */}
            {isRendering && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white backdrop-blur-md">
                    <div className="w-[300px] mb-4">
                        <div className="flex justify-between mb-2 text-sm font-bold">
                            <span>High-Quality Rendering...</span>
                            <span>{Math.round(renderProgress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-100 ease-linear"
                                style={{ width: `${renderProgress}%` }}
                            />
                        </div>
                    </div>
                    <p className="opacity-70 text-sm font-mono">Generating {platform} formatted video (1080x1920)</p>
                </div>
            )}

            <div className="cx-container py-12">

                {step === 'input' && (
                    <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter text-white">
                            Turn Long Videos into <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 animate-gradient-x">Viral Shorts</span>
                        </h1>
                        <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto font-light">
                            Paste a YouTube link or upload a video. Our AI will find the best moments and reframe them for TikTok, Reels, and Shorts.
                        </p>

                        <div className="card p-10 text-left border border-white/10 bg-white/5 backdrop-blur-sm">
                            <div className="mb-8">
                                <input
                                    type="text"
                                    placeholder="Paste YouTube URL here..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    className="input text-lg py-6 bg-black/40 border-white/10 focus:border-pink-500/50 focus:ring-pink-500/20 placeholder:text-zinc-600"
                                />
                            </div>

                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span className="text-zinc-500 font-medium uppercase text-xs tracking-widest">Or Upload File</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>

                            {/* File Upload Area */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                                onChange={handleFileInputChange}
                                className="hidden"
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all duration-300 ${isDragging
                                    ? 'border-pink-500 bg-pink-500/10 scale-[1.02]'
                                    : 'border-white/10 bg-black/20 hover:border-white/20 hover:bg-black/30'
                                    }`}
                            >
                                {uploadedFile ? (
                                    <div className="animate-fade-in-up">
                                        <div className="text-5xl mb-4">✅</div>
                                        <p className="text-lg font-bold text-emerald-400">File uploaded successfully!</p>
                                        <p className="text-sm text-zinc-400 mt-1 font-medium">{uploadedFile.name}</p>
                                        <p className="text-xs text-zinc-600 mt-1 font-mono">
                                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUploadedFile(null);
                                                setVideoPreviewUrl('');
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            className="mt-6 px-4 py-2 bg-red-500/10 text-red-400 border border-red-500/20 rounded-lg text-sm font-bold hover:bg-red-500/20 transition-colors"
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div className="text-5xl mb-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-300">📁</div>
                                        <p className="text-lg font-bold text-zinc-300">
                                            {isDragging ? 'Drop video here' : 'Click to upload or drag & drop'}
                                        </p>
                                        <p className="text-sm text-zinc-500 mt-2">MP4, MOV, AVI, WebM up to 1GB</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleProcess}
                                disabled={!videoUrl && !uploadedFile}
                                className={`btn w-full text-xl py-5 mt-8 font-bold tracking-wide transition-all duration-300 ${!videoUrl && !uploadedFile
                                    ? 'btn--secondary opacity-50 cursor-not-allowed'
                                    : 'btn--primary bg-gradient-to-r from-pink-600 to-violet-600 hover:shadow-lg hover:shadow-pink-500/20 hover:-translate-y-0.5'
                                    }`}
                            >
                                ✨ Generate Shorts
                            </button>

                            {/* Configuration Panel */}
                            <div className="mt-8 p-8 bg-black/20 rounded-3xl border border-white/5">
                                <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                    <span className="text-lg">⚙️</span> AI Configuration Engine
                                </h3>

                                <div className="grid gap-8">
                                    {/* 1. Platform Selection */}
                                    <div>
                                        <label className="block mb-3 font-medium text-sm text-zinc-400">Target Platform</label>
                                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                            {[
                                                { id: 'shorts', label: 'Shorts', icon: '▶️' },
                                                { id: 'reels', label: 'Reels', icon: '📸' },
                                                { id: 'tiktok', label: 'TikTok', icon: '🎵' }
                                            ].map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => setPlatform(p.id as any)}
                                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${platform === p.id
                                                        ? 'border-pink-500/50 bg-pink-500/10 text-pink-400 font-bold shadow-[0_0_15px_rgba(236,72,153,0.1)]'
                                                        : 'border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10 hover:border-white/10'
                                                        }`}
                                                >
                                                    <span className="text-2xl">{p.icon}</span>
                                                    <span>{p.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Processing Mode */}
                                    <div>
                                        <label className="block mb-3 font-medium text-sm text-zinc-400">AI Logic</label>
                                        <div className="flex gap-4 flex-col sm:flex-row">
                                            <button
                                                onClick={() => setProcessingMode('highlights')}
                                                className={`flex-1 p-4 rounded-xl border text-left transition-all ${processingMode === 'highlights'
                                                    ? 'border-violet-500/50 bg-violet-500/10 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                                    : 'border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="font-bold mb-1 flex items-center gap-2">🔥 Viral Highlights</div>
                                                <div className="text-xs opacity-70">Finds multiple viral moments from long video.</div>
                                            </button>
                                            <button
                                                onClick={() => setProcessingMode('summary')}
                                                className={`flex-1 p-4 rounded-xl border text-left transition-all ${processingMode === 'summary'
                                                    ? 'border-violet-500/50 bg-violet-500/10 text-violet-300 shadow-[0_0_15px_rgba(139,92,246,0.1)]'
                                                    : 'border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10'
                                                    }`}
                                            >
                                                <div className="font-bold mb-1 flex items-center gap-2">📝 Summarize</div>
                                                <div className="text-xs opacity-70">Condenses entire video into one cohesive short.</div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 3. Duration & Custom */}
                                    <div>
                                        <label className="block mb-3 font-medium text-sm text-zinc-400">Duration Limit</label>
                                        <div className="flex gap-4 items-start flex-col sm:flex-row">
                                            <div className="flex-1 w-full">
                                                <div className="flex gap-2 mb-2">
                                                    {[15, 30, 60].map(d => (
                                                        <button
                                                            key={d}
                                                            onClick={() => { setTargetDuration(d); setCustomDuration(d.toString()); }}
                                                            className={`flex-1 py-3 rounded-lg border font-semibold transition-all text-sm ${parseInt(customDuration) === d
                                                                ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                                                                : 'border-white/5 bg-white/5 text-zinc-400 hover:bg-white/10'
                                                                }`}
                                                        >
                                                            {d}s
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-full sm:w-32">
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={customDuration}
                                                        onChange={(e) => setCustomDuration(e.target.value)}
                                                        min="5"
                                                        max="300"
                                                        className="input font-mono text-center pr-8"
                                                    />
                                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-zinc-500">s</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Processing State */}
                {step === 'processing' && (
                    <div className="max-w-xl mx-auto text-center pt-20 animate-fade-in">
                        <div className="mb-12 relative">
                            <div className="absolute inset-0 bg-pink-500/20 blur-3xl rounded-full"></div>
                            <div className="w-24 h-24 mx-auto rounded-full border-4 border-white/5 border-t-pink-500 animate-spin relative z-10"></div>
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-8 tracking-tight">
                            AI is analyzing content...
                        </h2>
                        <div className="flex flex-col gap-4 items-start max-w-sm mx-auto">
                            {processingStages.map((stage, index) => (
                                <div key={index} className={`flex items-center gap-4 transition-all duration-500 w-full ${index <= processingStage ? 'opacity-100 transform translate-x-2' : 'opacity-30'}`}>
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-black text-xs font-bold shadow-lg transition-all ${index < processingStage ? 'bg-emerald-400' : (index === processingStage ? 'bg-pink-500 animate-pulse scale-110' : 'bg-zinc-800')
                                        }`}>
                                        {index < processingStage ? '✓' : ''}
                                    </div>
                                    <span className={`text-base font-mono ${index === processingStage ? 'text-white' : 'text-zinc-500'}`}>
                                        {stage}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* Editor Content */}
                {step === 'editor' && (
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-10rem)] min-h-[600px]">
                        {/* Sidebar - Clips */}
                        <div className="sidebar-nav !w-full !static !h-full bg-black/20 border border-white/10 rounded-2xl">
                            <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-4 px-2">Viral Moments Found</h3>
                            <div className="flex flex-col gap-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                                {currentClips.map((clip) => (
                                    <div
                                        key={clip.id}
                                        onClick={() => setSelectedClip(clip.id)}
                                        className={`p-4 rounded-xl border cursor-pointer transition-all group ${selectedClip === clip.id
                                            ? 'border-pink-500/50 bg-pink-500/10 shadow-[0_0_15px_rgba(236,72,153,0.1)]'
                                            : 'border-transparent hover:bg-white/5'
                                            }`}
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className={`font-semibold text-sm leading-tight group-hover:text-white transition-colors ${selectedClip === clip.id ? 'text-white' : 'text-zinc-400'}`}>{clip.title}</span>
                                        </div>
                                        <div className="flex justify-between items-center mt-2">
                                            <div className="text-[10px] font-mono text-zinc-500 bg-white/5 px-1.5 py-0.5 rounded border border-white/5">{clip.time}</div>
                                            <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-1.5 py-0.5 rounded text-[10px] font-bold flex items-center gap-1">
                                                🔥 {clip.score}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-6 h-full">
                            {/* Main Preview */}
                            <div className="card bg-black rounded-2xl overflow-hidden relative flex items-center justify-center border border-white/10 h-full max-h-[800px]">
                                {uploadedFile && videoPreviewUrl ? (
                                    <video
                                        key={`main-${selectedClip}`}
                                        src={`${videoPreviewUrl}#t=${startSeconds},${endSeconds}`}
                                        controls
                                        autoPlay
                                        className="w-full h-full object-contain"
                                    />
                                ) : videoUrl ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        className="w-full h-full border-0 min-h-[400px]"
                                        src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?start=${startSeconds}&end=${endSeconds}&autoplay=1&rel=0`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div className="text-zinc-600 text-center p-20">
                                        <div className="text-6xl mb-4 opacity-50">▶️</div>
                                        <p className="font-mono text-sm">Original Video Preview</p>
                                    </div>
                                )}
                            </div>


                            {/* Vertical Preview & Creative Studio */}
                            <div className="flex flex-col gap-6 h-full overflow-y-auto">
                                {/* Creative Studio Controls */}
                                <div className="card p-6 border border-white/10 bg-black/20">
                                    <h4 className="text-xs font-bold uppercase tracking-widest text-zinc-500 mb-6 flex items-center gap-2">
                                        ✨ Creative Studio
                                    </h4>

                                    <div className="flex items-center justify-between mb-6">
                                        <label className="text-sm font-medium text-zinc-300">AI Captions</label>
                                        <button
                                            onClick={() => setShowCaptions(!showCaptions)}
                                            className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors ${showCaptions
                                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/20'
                                                : 'bg-white/5 text-zinc-500 border border-white/5'
                                                }`}
                                        >
                                            {showCaptions ? 'ON' : 'OFF'}
                                        </button>
                                    </div>

                                    {showCaptions && (
                                        <div className="grid grid-cols-3 gap-2 mb-8">
                                            {[
                                                { id: 'hormozi', label: 'Bold', color: '#fbbf24' },
                                                { id: 'neon', label: 'Neon', color: '#06b6d4' },
                                                { id: 'minimal', label: 'Clean', color: '#e5e7eb' }
                                            ].map(style => (
                                                <button
                                                    key={style.id}
                                                    onClick={() => setCaptionStyle(style.id as any)}
                                                    className={`py-2 px-1 rounded-lg border font-medium text-[10px] transition-all ${captionStyle === style.id
                                                        ? 'bg-white/10 text-white border-white/20'
                                                        : 'bg-transparent text-zinc-500 border-transparent hover:bg-white/5'
                                                        }`}
                                                    style={{ borderColor: captionStyle === style.id ? style.color : 'transparent', color: captionStyle === style.id ? style.color : undefined }}
                                                >
                                                    {style.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}

                                    <button
                                        onClick={handleExport}
                                        className="btn btn--primary w-full py-4 text-base font-bold bg-gradient-to-r from-pink-600 to-violet-600 hover:shadow-lg hover:shadow-pink-500/20"
                                    >
                                        Download {platform === 'tiktok' ? 'TikTok' : (platform === 'reels' ? 'Instagram Reel' : 'Short')}
                                    </button>
                                    <div className="flex justify-center gap-4 mt-4 opacity-30 grayscale hover:grayscale-0 transition-all duration-500">
                                        <span title="Optimized for TikTok" className="text-xl cursor-help hover:scale-110 transition-transform">🎵</span>
                                        <span title="Optimized for Instagram Reels" className="text-xl cursor-help hover:scale-110 transition-transform">📸</span>
                                        <span title="Optimized for YouTube Shorts" className="text-xl cursor-help hover:scale-110 transition-transform">▶️</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default VideoRepurposing;
