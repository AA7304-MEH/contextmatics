import React, { useState, useRef, useEffect } from 'react';
import { PageLayout } from './shared';
import { useToast } from '../context/ToastContext';

const VideoEditor: React.FC = () => {
    const { showToast } = useToast();
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'trim' | 'filters' | 'text' | 'audio'>('trim');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isExporting, setIsExporting] = useState(false);
    const [exportProgress, setExportProgress] = useState(0);

    // Cleanup video URL
    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        };
    }, [videoUrl]);

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('video/')) {
            showToast('Please upload a valid video file.', 'warning');
            return;
        }
        setVideoFile(file);
        const url = URL.createObjectURL(file);
        setVideoUrl(url);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files?.[0]) {
            handleFileSelect(e.dataTransfer.files[0]);
        }
    };

    // Hidden rendering refs

    const handleExport = async () => {
        if (!videoFile || !videoRef.current) {
            showToast('No video loaded to export.', 'warning');
            return;
        }

        setIsExporting(true);
        setExportProgress(0);

        const video = videoRef.current;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Save current state
        const wasPaused = video.paused;
        const originalTime = video.currentTime;

        // Setup Export
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Audio stream setup
        const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
        const dest = audioCtx.createMediaStreamDestination();
        const source = audioCtx.createMediaElementSource(video);
        source.connect(dest);
        source.connect(audioCtx.destination); // Keep playing audio for user feedback if desired, or duplicate

        // Combine canvas stream and audio
        const canvasStream = canvas.captureStream(30); // 30 FPS
        if (dest.stream.getAudioTracks().length > 0) {
            canvasStream.addTrack(dest.stream.getAudioTracks()[0]);
        }

        const chunks: Blob[] = [];
        const mediaRecorder = new MediaRecorder(canvasStream, { mimeType: 'video/webm;codecs=vp9' });

        mediaRecorder.ondataavailable = (e) => {
            if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = () => {
            const blob = new Blob(chunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `edited_video_${Date.now()}.webm`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            // Cleanup
            setIsExporting(false);
            video.currentTime = originalTime;
            if (wasPaused) video.pause();
        };

        // Start Recording
        mediaRecorder.start();
        video.currentTime = 0;
        await video.play();

        const duration = video.duration;

        // Render Loop
        const processFrame = () => {
            if (!isExporting && mediaRecorder.state === 'inactive') return;

            if (video.ended || video.currentTime >= duration) {
                mediaRecorder.stop();
                video.pause();
                return;
            }

            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

            // Apply Filters (Simple examples)
            // Note: Canvas filters are cleaner but ctx.filter support is good in modern browsers
            if (activeTab === 'filters') {
                // In a real app, state would track the selected filter specifically
            }

            // Overlay Text (Mock implementation based on activeTab check)
            /* 
            if (activeTab === 'text') {
                ctx.font = "40px Arial";
                ctx.fillStyle = "white";
                ctx.fillText("Sample Text", 50, 100);
            }
            */

            setExportProgress((video.currentTime / duration) * 100);
            requestAnimationFrame(processFrame);
        };

        processFrame();
    };

    return (
        <PageLayout showPricing={true} showSettings={true}>
            {/* Real Export Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {isExporting && (
                <div className="fixed inset-0 z-50 bg-black/90 flex flex-col items-center justify-center backdrop-blur-sm">
                    <div className="w-64 mb-4">
                        <div className="flex justify-between text-white mb-2 text-sm font-bold">
                            <span>Exporting...</span>
                            <span>{Math.round(exportProgress)}%</span>
                        </div>
                        <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
                            <div className="h-full bg-brand-primary transition-all duration-100" style={{ width: `${exportProgress}%` }}></div>
                        </div>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-6 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">
                        Video Editor Studio
                    </h1>
                    <p className="text-lg text-text-secondary">
                        Edit, trim, and enhance your videos manually.
                    </p>
                </div>

                {!videoFile ? (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        className={`max-w-3xl mx-auto border-2 border-dashed rounded-3xl p-20 text-center cursor-pointer transition-all duration-300 ${isDragging
                            ? 'border-brand-primary bg-brand-primary/10 scale-[1.02]'
                            : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            className="hidden"
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        />
                        <div className="text-6xl mb-6 opacity-80 decoration-slice">🎬</div>
                        <h3 className="text-2xl font-bold mb-2 text-white">
                            Upload Video to Edit
                        </h3>
                        <p className="text-text-muted">Drag & drop or click to browse</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-8 h-[calc(100vh-12rem)] min-h-[600px]">
                        {/* Main Editor Area */}
                        <div className="flex flex-col gap-6 h-full">
                            {/* Video Player */}
                            <div className="flex-1 bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-white/10">
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    controls
                                    className="w-full h-full object-contain"
                                />
                            </div>

                            {/* Timeline (Visual Mock) */}
                            <div className="card p-6 border border-white/10 bg-black/20 rounded-xl">
                                <div className="flex justify-between mb-2 text-xs font-mono text-text-muted">
                                    <span>00:00</span>
                                    <span className="uppercase tracking-widest text-[10px]">Timeline</span>
                                    <span>05:30</span>
                                </div>
                                <div className="h-16 bg-white/5 rounded-lg relative overflow-hidden group cursor-pointer border border-white/5">
                                    {/* Mock waveforms */}
                                    <div className="absolute inset-y-2 inset-x-0 bg-[repeating-linear-gradient(90deg,rgba(255,255,255,0.1)_0px,rgba(255,255,255,0.1)_2px,transparent_2px,transparent_8px)] opacity-30" />
                                    {/* Scrubber */}
                                    <div className="absolute left-[30%] top-0 bottom-0 w-0.5 bg-brand-primary z-10 group-hover:bg-brand-accent transition-colors shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                                        <div className="absolute top-0 -left-1.5 w-3.5 h-3.5 bg-brand-primary rounded-full shadow-sm ring-2 ring-black" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Controls */}
                        <div className="w-full h-full bg-background-surface/50 border border-white/10 rounded-2xl flex flex-col overflow-hidden">
                            <div className="flex gap-1 mb-6 p-4 bg-black/20 border-b border-white/5 sticky top-0 z-10 backdrop-blur-md">
                                {['trim', 'filters', 'text', 'audio'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        className={`flex-1 py-2 px-1 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${activeTab === tab
                                            ? 'bg-white/10 text-white shadow-sm border border-white/10'
                                            : 'text-text-muted hover:text-text-secondary hover:bg-white/5'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto px-4 pb-4 custom-scrollbar">
                                {activeTab === 'trim' && (
                                    <div className="animate-fade-in space-y-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-2">Trim Segment</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-medium text-text-secondary mb-2 block">Start Time</label>
                                                <input
                                                    type="text"
                                                    defaultValue="00:00.00"
                                                    className="input w-full font-mono text-center tracking-widest bg-black/40 border-white/10 text-white rounded-lg p-2 focus:border-brand-primary/50 outline-none"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-xs font-medium text-text-secondary mb-2 block">End Time</label>
                                                <input
                                                    type="text"
                                                    defaultValue="00:15.00"
                                                    className="input w-full font-mono text-center tracking-widest bg-black/40 border-white/10 text-white rounded-lg p-2 focus:border-brand-primary/50 outline-none"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'filters' && (
                                    <div className="grid grid-cols-2 gap-3 animate-fade-in">
                                        {['None', 'Warm', 'Cool', 'B&W', 'Vivid', 'Vintage'].map(filter => (
                                            <button key={filter} className="p-4 rounded-xl border border-white/5 bg-white/5 text-text-secondary hover:border-brand-primary/50 hover:bg-brand-primary/10 hover:text-brand-primary transition-all font-medium text-sm">
                                                {filter}
                                            </button>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'text' && (
                                    <div className="animate-fade-in space-y-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-2">Overlay Text</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-medium text-text-secondary mb-2 block">Content</label>
                                                <input
                                                    type="text"
                                                    placeholder="Enter text here..."
                                                    className="input w-full bg-black/40 border-white/10 text-white rounded-lg p-2 focus:border-brand-primary/50 outline-none"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-xs font-medium text-text-secondary mb-2 block">Font</label>
                                                    <select
                                                        className="input w-full bg-black/40 border-white/10 text-sm text-white rounded-lg p-2 outline-none"
                                                    >
                                                        <option>Sans Serif</option>
                                                        <option>Serif</option>
                                                        <option>Monospace</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-medium text-text-secondary mb-2 block">Color</label>
                                                    <input type="color" className="w-full h-[38px] rounded-lg border border-white/10 p-1 cursor-pointer bg-black/40" />
                                                </div>
                                            </div>
                                            <button className="btn btn-secondary w-full border-dashed border border-white/10 text-text-muted hover:border-white/30 hover:text-white bg-transparent justify-center">
                                                + Add Text Layer
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'audio' && (
                                    <div className="animate-fade-in space-y-6">
                                        <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted border-b border-white/5 pb-2">Soundtrack</h3>
                                        <div className="space-y-3">
                                            {['Upbeat Pop', 'Chill Lofi', 'Corporate Energetic', 'Cinematic Build'].map((track) => (
                                                <div key={track} className="flex items-center justify-between p-3 rounded-xl border border-white/5 bg-white/5 hover:border-white/20 transition-colors group">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-lg opacity-50 group-hover:opacity-100 transition-opacity">🎵</span>
                                                        <span className="text-sm font-medium text-text-secondary group-hover:text-white">{track}</span>
                                                    </div>
                                                    <button className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-white/10 border border-white/10 rounded text-text-muted hover:bg-brand-primary hover:border-brand-primary hover:text-white transition-all">Add</button>
                                                </div>
                                            ))}
                                            <div className="mt-6">
                                                <label className="label mb-2 block text-text-secondary text-xs font-medium">Volume Mix</label>
                                                <input type="range" min="0" max="100" defaultValue="80" className="w-full accent-brand-primary h-1 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto p-6 border-t border-white/10 space-y-3 bg-black/20">
                                <button
                                    onClick={handleExport}
                                    className="btn btn-primary w-full shadow-lg hover:shadow-brand-primary/20 bg-gradient-to-r from-brand-primary to-brand-accent justify-center"
                                >
                                    Export Video
                                </button>
                                <button
                                    onClick={() => { setVideoFile(null); setVideoUrl(''); }}
                                    className="btn w-full text-text-muted hover:text-red-400 hover:bg-red-500/5 transition-colors text-sm justify-center bg-transparent border-transparent"
                                >
                                    Cancel Project
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </PageLayout>
    );
};

export default VideoEditor;
