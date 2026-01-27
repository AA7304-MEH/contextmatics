import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PageLayout } from './shared';

const processingStages = [
    'Downloading Video...',
    'Transcribing Audio...',
    'Analyzing Viral Moments...',
    'Reframing for Vertical...'
];

// Dynamic generation of clips based on duration
// Dynamic generation of clips based on settings
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
    const navigate = useNavigate();
    const { user, decrementCredits } = useAuth();

    // Configuration State
    // Configuration State
    const [platform, setPlatform] = useState<'shorts' | 'tiktok' | 'reels'>('shorts');
    const [processingMode, setProcessingMode] = useState<'highlights' | 'summary'>('highlights');
    const [targetDuration, setTargetDuration] = useState<number>(30); // Default 30s
    const [customDuration, setCustomDuration] = useState<string>('30'); // Text input for custom
    const [captionStyle, setCaptionStyle] = useState<'hormozi' | 'neon' | 'minimal'>('hormozi');
    const [showCaptions, setShowCaptions] = useState(true);

    // Core State
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
            alert(validation.error);
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
            alert('No credits remaining! Please upgrade your plan to continue processing videos.');
            navigate('/pricing');
            return;
        }

        // Validate YouTube URL if provided
        if (videoUrl && !validateYouTubeUrl(videoUrl)) {
            alert('Invalid YouTube URL. Please enter a valid YouTube link.');
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
            alert('YouTube Download Restriction: \n\nDirect browser-download for YouTube links is blocked by CORS security policies. \n\nIn a production environment, this would be handled by a backend server (ffmpeg). For this demo, please upload a local file to test the high-quality cropping engine.');
        } else {
            alert('No video source found to export.');
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
            {/* Hidden Rendering Elements */}
            <video
                ref={renderVideoRef}
                src={videoPreviewUrl}
                style={{ display: 'none' }}
                crossOrigin="anonymous"
                muted={false} // Must be unmuted for capture usually, but we might mute DOM output. Let's try regular.
            />
            <canvas ref={renderCanvasRef} style={{ display: 'none' }} />

            {/* Rendering Overlay */}
            {isRendering && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.9)',
                    zIndex: 9999,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                }}>
                    <div style={{ width: '300px', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                            <span>High-Quality Rendering...</span>
                            <span>{Math.round(renderProgress)}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', backgroundColor: '#374151', borderRadius: '4px', overflow: 'hidden' }}>
                            <div style={{ width: `${renderProgress}%`, height: '100%', backgroundColor: '#ec4899', transition: 'width 0.1s linear' }}></div>
                        </div>
                    </div>
                    <p style={{ opacity: 0.7, fontSize: '0.9rem' }}>Generating {platform} formatted video (1080x1920)</p>
                </div>
            )}

            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                {/* ... input and processing steps remain unchanged ... */}

                {step === 'input' && (
                    // ... (keep existing input step code) ...
                    <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: '800', color: '#111827', marginBottom: '1.5rem', lineHeight: 1.1 }}>
                            Turn Long Videos into <br />
                            <span style={{ background: 'linear-gradient(to right, #ec4899, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Viral Shorts</span>
                        </h1>
                        <p style={{ fontSize: '1.25rem', color: '#4b5563', marginBottom: '3rem' }}>
                            Paste a YouTube link or upload a video. Our AI will find the best moments and reframe them for TikTok, Reels, and Shorts.
                        </p>

                        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #f3f4f6' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <input
                                    type="text"
                                    placeholder="Paste YouTube URL here..."
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1.25rem',
                                        borderRadius: '16px',
                                        border: '2px solid #e5e7eb',
                                        fontSize: '1.125rem',
                                        outline: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onFocus={(e) => e.target.style.borderColor = '#ec4899'}
                                    onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2rem' }}>
                                <div style={{ height: '1px', backgroundColor: '#e5e7eb', flex: 1 }}></div>
                                <span style={{ color: '#9ca3af', fontWeight: '500' }}>OR</span>
                                <div style={{ height: '1px', backgroundColor: '#e5e7eb', flex: 1 }}></div>
                            </div>

                            {/* File Upload Area */}
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                                onChange={handleFileInputChange}
                                style={{ display: 'none' }}
                            />

                            <div
                                onClick={() => fileInputRef.current?.click()}
                                onDragEnter={handleDragEnter}
                                onDragOver={handleDragOver}
                                onDragLeave={handleDragLeave}
                                onDrop={handleDrop}
                                style={{
                                    border: `2px dashed ${isDragging ? '#ec4899' : '#e5e7eb'}`,
                                    borderRadius: '16px',
                                    padding: '3rem',
                                    cursor: 'pointer',
                                    backgroundColor: isDragging ? '#fdf2f8' : '#f9fafb',
                                    transition: 'all 0.2s'
                                }}
                            >
                                {uploadedFile ? (
                                    <div>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
                                        <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#10b981' }}>File uploaded successfully!</p>
                                        <p style={{ fontSize: '0.875rem', color: '#6b7280', marginTop: '0.5rem' }}>{uploadedFile.name}</p>
                                        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                                            {(uploadedFile.size / (1024 * 1024)).toFixed(2)} MB
                                        </p>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                setUploadedFile(null);
                                                setVideoPreviewUrl('');
                                                if (fileInputRef.current) fileInputRef.current.value = '';
                                            }}
                                            style={{
                                                marginTop: '1rem',
                                                padding: '0.5rem 1rem',
                                                backgroundColor: '#fee2e2',
                                                color: '#dc2626',
                                                border: 'none',
                                                borderRadius: '8px',
                                                cursor: 'pointer',
                                                fontSize: '0.875rem',
                                                fontWeight: '600'
                                            }}
                                        >
                                            Remove File
                                        </button>
                                    </div>
                                ) : (
                                    <div>
                                        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                                        <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>
                                            {isDragging ? 'Drop video here' : 'Click to upload or drag & drop'}
                                        </p>
                                        <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>MP4, MOV, AVI, WebM up to 1GB</p>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={handleProcess}
                                disabled={!videoUrl && !uploadedFile}
                                style={{
                                    width: '100%',
                                    marginTop: '2rem',
                                    padding: '1.25rem',
                                    borderRadius: '16px',
                                    fontSize: '1.25rem',
                                    fontWeight: '700',
                                    border: 'none',
                                    cursor: !videoUrl ? 'not-allowed' : 'pointer',
                                    background: !videoUrl ? '#e5e7eb' : 'linear-gradient(to right, #ec4899, #8b5cf6)',
                                    color: !videoUrl ? '#9ca3af' : 'white',
                                    transition: 'all 0.3s',
                                    boxShadow: !videoUrl ? 'none' : '0 10px 15px -3px rgba(236, 72, 153, 0.3)'
                                }}
                            >
                                ✨ Generate Shorts
                            </button>

                            {/* Configuration Panel */}
                            <div style={{ marginTop: '2rem', padding: '2rem', backgroundColor: '#f9fafb', borderRadius: '24px', border: '1px solid #e5e7eb' }}>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem', color: '#111827', textAlign: 'left' }}>
                                    🤖 AI Configuration Engine
                                </h3>

                                <div style={{ display: 'grid', gap: '2rem' }}>
                                    {/* 1. Platform Selection */}
                                    <div style={{ textAlign: 'left' }}>
                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.9rem', color: '#374151' }}>1. Target Platform</label>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                                            {[
                                                { id: 'shorts', label: 'YouTube Shorts', icon: '▶️' },
                                                { id: 'reels', label: 'Instagram Reels', icon: '📸' },
                                                { id: 'tiktok', label: 'TikTok', icon: '🎵' }
                                            ].map(p => (
                                                <button
                                                    key={p.id}
                                                    onClick={() => setPlatform(p.id as any)}
                                                    style={{
                                                        padding: '1rem',
                                                        borderRadius: '12px',
                                                        border: platform === p.id ? '2px solid #ec4899' : '1px solid #e5e7eb',
                                                        backgroundColor: platform === p.id ? '#fdf2f8' : 'white',
                                                        color: platform === p.id ? '#be185d' : '#4b5563',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        alignItems: 'center',
                                                        gap: '0.5rem',
                                                        transition: 'all 0.2s'
                                                    }}
                                                >
                                                    <span style={{ fontSize: '1.5rem' }}>{p.icon}</span>
                                                    <span>{p.label}</span>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* 2. Processing Mode */}
                                    <div style={{ textAlign: 'left' }}>
                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.9rem', color: '#374151' }}>2. AI Processing Mode</label>
                                        <div style={{ display: 'flex', gap: '1rem' }}>
                                            <button
                                                onClick={() => setProcessingMode('highlights')}
                                                style={{
                                                    flex: 1,
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: processingMode === 'highlights' ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                                                    backgroundColor: processingMode === 'highlights' ? '#f5f3ff' : 'white',
                                                    color: processingMode === 'highlights' ? '#6d28d9' : '#4b5563',
                                                    textAlign: 'left',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>🔥 Viral Highlights</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Finds multiple viral moments from long video.</div>
                                            </button>
                                            <button
                                                onClick={() => setProcessingMode('summary')}
                                                style={{
                                                    flex: 1,
                                                    padding: '1rem',
                                                    borderRadius: '12px',
                                                    border: processingMode === 'summary' ? '2px solid #8b5cf6' : '1px solid #e5e7eb',
                                                    backgroundColor: processingMode === 'summary' ? '#f5f3ff' : 'white',
                                                    color: processingMode === 'summary' ? '#6d28d9' : '#4b5563',
                                                    textAlign: 'left',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                <div style={{ fontWeight: '700', marginBottom: '0.25rem' }}>📝 Summarize to Short</div>
                                                <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Condenses entire video into one cohesive short.</div>
                                            </button>
                                        </div>
                                    </div>

                                    {/* 3. Duration & Custom */}
                                    <div style={{ textAlign: 'left' }}>
                                        <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: '700', fontSize: '0.9rem', color: '#374151' }}>3. Exact Duration Control (AI Adjusted)</label>
                                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                                                    {[15, 30, 60].map(d => (
                                                        <button
                                                            key={d}
                                                            onClick={() => { setTargetDuration(d); setCustomDuration(d.toString()); }}
                                                            style={{
                                                                flex: 1,
                                                                padding: '0.75rem',
                                                                borderRadius: '8px',
                                                                border: parseInt(customDuration) === d ? '2px solid #10b981' : '1px solid #e5e7eb',
                                                                backgroundColor: parseInt(customDuration) === d ? '#ecfdf5' : 'white',
                                                                color: parseInt(customDuration) === d ? '#047857' : '#4b5563',
                                                                fontWeight: '600',
                                                                cursor: 'pointer'
                                                            }}
                                                        >
                                                            {d}s Preset
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div style={{ width: '200px' }}>
                                                <label style={{ fontSize: '0.75rem', fontWeight: '600', display: 'block', marginBottom: '0.25rem' }}>Custom Duration (sec)</label>
                                                <input
                                                    type="number"
                                                    value={customDuration}
                                                    onChange={(e) => setCustomDuration(e.target.value)}
                                                    min="5"
                                                    max="300"
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        borderRadius: '8px',
                                                        border: '2px solid #e5e7eb',
                                                        fontWeight: 'bold',
                                                        fontSize: '1rem'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginTop: '0.5rem' }}>
                                            * Our Deep Learning Engine will strictly adhere to the {customDuration}s time limit.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {step === 'processing' && (
                    <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center', paddingTop: '5rem' }}>
                        <div style={{ marginBottom: '3rem' }}>
                            <div style={{
                                width: '80px',
                                height: '80px',
                                margin: '0 auto',
                                border: '4px solid #f3f4f6',
                                borderTop: '4px solid #ec4899',
                                borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }}></div>
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>
                            AI is working its magic...
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center' }}>
                            {processingStages.map((stage, index) => (
                                <div key={index} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    opacity: index <= processingStage ? 1 : 0.4,
                                    transition: 'opacity 0.5s'
                                }}>
                                    <div style={{
                                        width: '24px',
                                        height: '24px',
                                        borderRadius: '50%',
                                        backgroundColor: index < processingStage ? '#10b981' : (index === processingStage ? '#ec4899' : '#e5e7eb'),
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'white',
                                        fontSize: '14px'
                                    }}>
                                        {index < processingStage ? '✓' : (index === processingStage ? '●' : '')}
                                    </div>
                                    <span style={{ fontSize: '1.125rem', fontWeight: index === processingStage ? '600' : '400', color: '#4b5563' }}>{stage}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}


                {/* Editor Content */}
                {step === 'editor' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: 'calc(100vh - 10rem)' }}>
                        {/* Sidebar - Clips */}
                        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', overflowY: 'auto' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' }}>Viral Moments Found</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {currentClips.map((clip) => (
                                    <div
                                        key={clip.id}
                                        onClick={() => setSelectedClip(clip.id)}
                                        style={{
                                            padding: '1rem',
                                            borderRadius: '12px',
                                            backgroundColor: selectedClip === clip.id ? '#fdf2f8' : '#f9fafb',
                                            border: selectedClip === clip.id ? '2px solid #ec4899' : '2px solid transparent',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                    >
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                            <span style={{ fontWeight: '600', color: '#111827' }}>{clip.title}</span>
                                            <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '0.125rem 0.5rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: '700' }}>{clip.score} Viral Score</span>
                                        </div>
                                        <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>{clip.time}</div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Editor Area */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem' }}>
                            {/* Main Preview */}
                            <div style={{ backgroundColor: 'black', borderRadius: '24px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
                                {uploadedFile && videoPreviewUrl ? (
                                    <video
                                        key={`main-${selectedClip}`} // Force re-render on clip change
                                        src={`${videoPreviewUrl}#t=${startSeconds},${endSeconds}`}
                                        controls
                                        autoPlay
                                        style={{ width: '100%', height: '100%', maxHeight: '600px', objectFit: 'contain' }}
                                    />
                                ) : videoUrl ? (
                                    <iframe
                                        width="100%"
                                        height="100%"
                                        style={{ minHeight: '400px', border: 'none' }}
                                        src={`https://www.youtube.com/embed/${getYouTubeId(videoUrl)}?start=${startSeconds}&end=${endSeconds}&autoplay=1&rel=0`}
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    ></iframe>
                                ) : (
                                    <div style={{ color: 'white', textAlign: 'center', padding: '5rem' }}>
                                        <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>▶️</div>
                                        <p>Original Video Preview</p>
                                    </div>
                                )}
                            </div>


                            {/* Vertical Preview & Creative Studio */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {/* Creative Studio Controls */}
                                <div style={{ backgroundColor: 'white', borderRadius: '16px', padding: '1rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
                                    <h4 style={{ fontSize: '0.875rem', fontWeight: '700', marginBottom: '0.75rem', color: '#374151' }}>✨ Creative Studio</h4>

                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <label style={{ fontSize: '0.875rem', fontWeight: '500', color: '#4b5563' }}>AI Captions</label>
                                        <button
                                            onClick={() => setShowCaptions(!showCaptions)}
                                            style={{
                                                padding: '0.25rem 0.75rem',
                                                borderRadius: '999px',
                                                fontSize: '0.75rem',
                                                fontWeight: '600',
                                                backgroundColor: showCaptions ? '#d1fae5' : '#f3f4f6',
                                                color: showCaptions ? '#059669' : '#9ca3af',
                                                border: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            {showCaptions ? 'ON' : 'OFF'}
                                        </button>
                                    </div>

                                    {showCaptions && (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                                            {[
                                                { id: 'hormozi', label: 'Bold', color: '#fbbf24' },
                                                { id: 'neon', label: 'Neon', color: '#06b6d4' },
                                                { id: 'minimal', label: 'Clean', color: '#e5e7eb' }
                                            ].map(style => (
                                                <button
                                                    key={style.id}
                                                    onClick={() => setCaptionStyle(style.id as any)}
                                                    style={{
                                                        padding: '0.5rem',
                                                        borderRadius: '8px',
                                                        border: captionStyle === style.id ? `2px solid ${style.color}` : '1px solid #e5e7eb',
                                                        backgroundColor: captionStyle === style.id ? 'white' : '#f9fafb',
                                                        fontSize: '0.75rem',
                                                        fontWeight: '600',
                                                        cursor: 'pointer',
                                                        color: '#374151'
                                                    }}
                                                >
                                                    {style.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {/* Content Style Removed as per cleanup */}
                                </div>


                                <button
                                    onClick={handleExport}
                                    style={{
                                        width: '100%',
                                        marginTop: '1.5rem',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        fontWeight: '700',
                                        border: 'none',
                                        cursor: 'pointer',
                                        background: 'linear-gradient(to right, #ec4899, #8b5cf6)',
                                        color: 'white',
                                        boxShadow: '0 4px 6px -1px rgba(236, 72, 153, 0.3)'
                                    }}
                                >
                                    Download {platform === 'tiktok' ? 'TikTok Video' : (platform === 'reels' ? 'Instagram Reel' : 'YouTube Short')}
                                </button>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem', opacity: 0.7 }}>
                                    <span title="Optimized for TikTok" style={{ fontSize: '1.5rem' }}>🎵</span>
                                    <span title="Optimized for Instagram Reels" style={{ fontSize: '1.5rem' }}>📸</span>
                                    <span title="Optimized for YouTube Shorts" style={{ fontSize: '1.5rem' }}>▶️</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </PageLayout>
    );
};

export default VideoRepurposing;
