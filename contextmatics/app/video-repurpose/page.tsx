"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { PageLayout } from '@/components/shared';

const processingStages = [
    'Downloading Video...',
    'Transcribing Audio...',
    'Analyzing Viral Moments...',
    'Reframing for Vertical...'
];

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

export default function VideoRepurposingPage() {
    const router = useRouter();
    const { user, decrementCredits } = useAuth();
    const { showToast } = useToast();

    const [platform, setPlatform] = useState<'shorts' | 'tiktok' | 'reels'>('shorts');
    const [processingMode, setProcessingMode] = useState<'highlights' | 'summary'>('highlights');
    const [targetDuration, setTargetDuration] = useState<number>(30);
    const [customDuration, setCustomDuration] = useState<string>('30');
    const [captionStyle, setCaptionStyle] = useState<'hormozi' | 'neon' | 'minimal'>('hormozi');
    const [showCaptions, setShowCaptions] = useState(true);

    const [step, setStep] = useState<'input' | 'processing' | 'editor'>('input');
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [processingStage, setProcessingStage] = useState(0);
    const [selectedClip, setSelectedClip] = useState<number | null>(null);
    const [currentClips, setCurrentClips] = useState<any[]>([]);

    const [isRendering, setIsRendering] = useState(false);
    const [renderProgress, setRenderProgress] = useState(0);

    const fileInputRef = useRef<HTMLInputElement>(null);
    const renderVideoRef = useRef<HTMLVideoElement>(null);
    const renderCanvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        return () => {
            if (videoPreviewUrl) {
                URL.revokeObjectURL(videoPreviewUrl);
            }
        };
    }, [videoPreviewUrl]);

    const validateFile = (file: File): { valid: boolean; error?: string } => {
        const validTypes = ['video/mp4', 'video/quicktime', 'video/x-msvideo', 'video/webm'];
        const maxSize = 1024 * 1024 * 1024; // 1GB
        if (!validTypes.includes(file.type)) return { valid: false, error: 'Invalid file type. Please upload MP4, MOV, AVI, or WebM.' };
        if (file.size > maxSize) return { valid: false, error: 'File too large. Maximum size is 1GB.' };
        return { valid: true };
    };

    const validateYouTubeUrl = (url: string): boolean => {
        const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)[\w-]+/;
        return youtubeRegex.test(url);
    };

    const handleFileSelect = (file: File) => {
        const validation = validateFile(file);
        if (!validation.valid) {
            showToast(validation.error || 'Invalid file', 'warning');
            return;
        }
        setUploadedFile(file);
        const previewUrl = URL.createObjectURL(file);
        setVideoPreviewUrl(previewUrl);
        setVideoUrl('');
    };

    const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) handleFileSelect(file);
    };

    const handleProcess = () => {
        if (!videoUrl && !uploadedFile) return;
        if (!user || user.processingCredits <= 0) {
            showToast('No credits remaining! Please upgrade your plan to continue processing videos.', 'error');
            router.push('/pricing');
            return;
        }
        if (videoUrl && !validateYouTubeUrl(videoUrl)) {
            showToast('Invalid YouTube URL. Please enter a valid YouTube link.', 'warning');
            return;
        }

        setStep('processing');
        let currentStage = 0;
        const interval = setInterval(() => {
            currentStage++;
            setProcessingStage(currentStage);
            if (currentStage >= 5) { // 5 total stages in stage rendering
                clearInterval(interval);
                setTimeout(() => {
                    const durationToUse = parseInt(customDuration) || targetDuration;
                    const platformLabel = platform === 'tiktok' ? 'TikTok' : (platform === 'reels' ? 'Reels' : 'Shorts');
                    const generatedClips = generateMockClips(durationToUse, processingMode, platformLabel);
                    setCurrentClips(generatedClips);
                    setStep('editor');
                    setSelectedClip(generatedClips[0].id);
                    decrementCredits();
                }, 1000);
            }
        }, 1500);
    };

    const handleExport = async () => {
        if (uploadedFile && videoPreviewUrl) {
            setIsRendering(true);
            setRenderProgress(0);
            await processVideoExport();
        } else if (videoUrl) {
            showToast('YouTube downloads require a backend server. Upload a local file to test the cropping engine.', 'info');
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

        const clip = currentClips.find(c => c.id === selectedClip);
        if (!clip) return;

        const parseTimeToSeconds = (timeStr: string) => {
            const [min, sec] = timeStr.split(':').map(Number);
            return min * 60 + sec;
        };

        const [startStr, endStr] = clip.time.split(' - ');
        const startTime = parseTimeToSeconds(startStr);
        const duration = parseTimeToSeconds(endStr) - startTime;

        canvas.width = 1080;
        canvas.height = 1920;

        video.currentTime = startTime;
        await new Promise(r => { video.onseeked = r; video.currentTime = startTime; });

        const stream = canvas.captureStream(30);
        // @ts-ignore
        const videoStream = video.captureStream ? video.captureStream() : (video as any).mozCaptureStream ? (video as any).mozCaptureStream() : null;
        if (videoStream) {
            const audioTrack = videoStream.getAudioTracks()[0];
            if (audioTrack) stream.addTrack(audioTrack);
        }

        const chunks: Blob[] = [];
        const mediaRecorder = new MediaRecorder(stream, { mimeType: 'video/webm;codecs=vp9' });
        mediaRecorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
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

        const drawFrame = () => {
            if (!isRendering) return;
            if (video.currentTime >= startTime + duration) {
                mediaRecorder.stop();
                video.pause();
                return;
            }
            const scale = Math.max(canvas.width / video.videoWidth, canvas.height / video.videoHeight);
            const x = (canvas.width / 2) - (video.videoWidth / 2) * scale;
            const y = (canvas.height / 2) - (video.videoHeight / 2) * scale;
            ctx.drawImage(video, x, y, video.videoWidth * scale, video.videoHeight * scale);
            if (showCaptions) {
                ctx.font = captionStyle === 'minimal' ? '500 40px Inter, sans-serif' : '900 50px Inter, sans-serif';
                ctx.textAlign = 'center';
                ctx.fillStyle = 'rgba(0,0,0,0.5)';
                ctx.fillText(clip.title, canvas.width / 2 + 2, canvas.height * 0.8 + 2);
                ctx.fillStyle = captionStyle === 'hormozi' ? '#fbbf24' : 'white';
                ctx.fillText(clip.title, canvas.width / 2, canvas.height * 0.8);
            }
            const progress = ((video.currentTime - startTime) / duration) * 100;
            setRenderProgress(Math.min(progress, 100));
            requestAnimationFrame(drawFrame);
        };
        drawFrame();
    };

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const currentClip = currentClips.find(c => c.id === selectedClip) || currentClips[0];
    const parseTimeToSeconds = (timeStr: string) => {
        const parts = timeStr.split(':').map(Number);
        return parts.length === 2 ? parts[0] * 60 + parts[1] : 0;
    };
    const [pageStartTime, pageEndTime] = currentClip ? currentClip.time.split(' - ') : ['00:00', '00:00'];
    const startSecs = parseTimeToSeconds(pageStartTime);
    const endSecs = parseTimeToSeconds(pageEndTime);

    return (
        <PageLayout>
            <video ref={renderVideoRef} src={videoPreviewUrl} style={{ display: 'none' }} crossOrigin="anonymous" muted={false} />
            <canvas ref={renderCanvasRef} style={{ display: 'none' }} />
            {isRendering && (
                <div className="fixed inset-0 bg-black/90 z-50 flex flex-col items-center justify-center text-white backdrop-blur-md">
                    <div className="w-[300px] mb-4 text-left">
                        <div className="flex justify-between mb-2 text-sm font-bold">
                            <span>High-Quality Rendering...</span>
                            <span>{Math.round(renderProgress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-pink-500 to-violet-500 transition-all duration-100 ease-linear" style={{ width: `${renderProgress}%` }} />
                        </div>
                    </div>
                </div>
            )}
            <div className="container mx-auto py-12 px-6">
                {step === 'input' && (
                    <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
                        <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tighter text-white">
                            Turn Long Videos into <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">Viral Shorts</span>
                        </h1>
                        <div className="card p-10 text-left border border-white/10 bg-white/5 backdrop-blur-sm">
                            <div className="mb-8">
                                <input type="text" placeholder="Paste YouTube URL here..." value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} className="input text-lg py-6 bg-black/40 border-white/10" />
                            </div>
                            <div className="flex items-center justify-center gap-4 mb-8">
                                <div className="h-px bg-white/10 flex-1"></div>
                                <span className="text-zinc-500 font-medium uppercase text-xs tracking-widest">Or Upload File</span>
                                <div className="h-px bg-white/10 flex-1"></div>
                            </div>
                            <div onClick={() => fileInputRef.current?.click()} className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${isDragging ? 'border-pink-500 bg-pink-500/10' : 'border-white/10 bg-black/20 hover:bg-black/30'}`}>
                                <input ref={fileInputRef} type="file" accept="video/*" onChange={handleFileInputChange} className="hidden" />
                                {uploadedFile ? <p className="text-emerald-400 font-bold">✅ {uploadedFile.name}</p> : <p className="text-zinc-300">Click to upload or drag & drop</p>}
                            </div>
                            <button onClick={handleProcess} disabled={!videoUrl && !uploadedFile} className="btn w-full text-xl py-5 mt-8 font-bold bg-gradient-to-r from-pink-600 to-violet-600">✨ Generate Shorts</button>
                        </div>
                    </div>
                )}
                {step === 'processing' && (
                    <div className="max-w-xl mx-auto text-center pt-20">
                        <div className="w-24 h-24 mx-auto rounded-full border-4 border-white/5 border-t-pink-500 animate-spin mb-12"></div>
                        <h2 className="text-3xl font-bold text-white mb-8">AI is analyzing content...</h2>
                    </div>
                )}
                {step === 'editor' && (
                    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-6 h-[calc(100vh-10rem)]">
                        <div className="bg-black/20 border border-white/10 rounded-2xl p-4 overflow-y-auto">
                            <h3 className="text-xs font-bold uppercase text-zinc-500 mb-4 px-2">Viral Moments Found</h3>
                            {currentClips.map((clip) => (
                                <div key={clip.id} onClick={() => setSelectedClip(clip.id)} className={`p-4 rounded-xl border mb-2 cursor-pointer transition-all ${selectedClip === clip.id ? 'border-pink-500/50 bg-pink-500/10' : 'border-transparent hover:bg-white/5'}`}>
                                    <p className="font-semibold text-sm text-white">{clip.title}</p>
                                    <p className="text-xs text-zinc-500 mt-2">{clip.time}</p>
                                </div>
                            ))}
                        </div>
                        <div className="card bg-black rounded-2xl overflow-hidden relative border border-white/10 flex flex-col">
                            <div className="flex-1 flex items-center justify-center p-4">
                                {uploadedFile && videoPreviewUrl ? (
                                    <video key={selectedClip} src={`${videoPreviewUrl}#t=${startSecs},${endSecs}`} controls autoPlay className="max-h-full max-w-full" />
                                ) : (
                                    <iframe width="100%" height="100%" src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?start=${startSecs}&end=${endSecs}&autoplay=1`} />
                                )}
                            </div>
                            <div className="p-6 bg-black/40 border-t border-white/10 flex justify-between gap-4">
                                <button onClick={() => setStep('input')} className="btn btn-secondary">Back</button>
                                <button onClick={handleExport} className="btn btn-primary bg-gradient-to-r from-pink-600 to-violet-600 border-none">Export Magic Short</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
}
