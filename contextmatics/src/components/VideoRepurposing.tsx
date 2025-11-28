import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { PageLayout } from './shared';

const VideoRepurposing: React.FC = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToHistory } = useHistory();

    const [step, setStep] = useState<'input' | 'processing' | 'editor'>('input');
    const [videoUrl, setVideoUrl] = useState('');
    const [uploadedFile, setUploadedFile] = useState<File | null>(null);
    const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
    const [isDragging, setIsDragging] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [processingStage, setProcessingStage] = useState(0);
    const [selectedClip, setSelectedClip] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

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

    const handleProcess = () => {
        if (!videoUrl && !uploadedFile) return;

        // Validate YouTube URL if provided
        if (videoUrl && !validateYouTubeUrl(videoUrl)) {
            alert('Invalid YouTube URL. Please enter a valid YouTube link.');
            return;
        }

        setStep('processing');

        // Simulate AI processing steps
        const stages = ['Downloading Video...', 'Transcribing Audio...', 'Analyzing Viral Moments...', 'Reframing for Vertical...'];
        let currentStage = 0;

        const interval = setInterval(() => {
            currentStage++;
            setProcessingStage(currentStage);
            if (currentStage >= stages.length) {
                clearInterval(interval);
                setTimeout(() => setStep('editor'), 1000);
            }
        }, 1500);
    };

    const handleExport = () => {
        alert('Exporting video... This would trigger a download in a real app.');
        addToHistory({
            title: 'Viral Short from Video',
            format: 'Video Short',
            content: uploadedFile ? `Generated from: ${uploadedFile.name}` : `Generated short video from: ${videoUrl}`,
            status: 'success',
            icon: '🎥'
        });
    };

    const processingStages = ['Downloading Video...', 'Transcribing Audio...', 'Analyzing Viral Moments...', 'Reframing for Vertical...'];

    const mockClips = [
        { id: 1, time: '00:15 - 00:45', score: 98, title: 'The Main Insight' },
        { id: 2, time: '02:10 - 02:40', score: 92, title: 'Funny Moment' },
        { id: 3, time: '05:20 - 05:50', score: 88, title: 'Conclusion' },
    ];

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>

                {step === 'input' && (
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

                {step === 'editor' && (
                    <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '2rem', height: 'calc(100vh - 10rem)' }}>
                        {/* Sidebar - Clips */}
                        <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '1.5rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', overflowY: 'auto' }}>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '1.5rem', color: '#111827' }}>Viral Moments Found</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {mockClips.map((clip) => (
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
                            <div style={{ backgroundColor: 'black', borderRadius: '24px', overflow: 'hidden', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ color: 'white', textAlign: 'center' }}>
                                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>▶️</div>
                                    <p>Original Video Preview</p>
                                </div>
                            </div>

                            {/* Vertical Preview */}
                            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '1rem', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)', display: 'flex', flexDirection: 'column' }}>
                                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem', color: '#111827', textAlign: 'center' }}>Vertical Preview (9:16)</h3>
                                <div style={{
                                    flex: 1,
                                    backgroundColor: 'black',
                                    borderRadius: '16px',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    aspectRatio: '9/16'
                                }}>
                                    {/* Simulated Content */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        background: 'linear-gradient(45deg, #111, #222)'
                                    }}>
                                        <div style={{ textAlign: 'center', color: 'white' }}>
                                            <p style={{ fontWeight: 'bold', fontSize: '1.5rem', marginBottom: '0.5rem' }}>AI Cropped</p>
                                            <p style={{ fontSize: '0.875rem', opacity: 0.7 }}>Keeping subject in frame</p>
                                        </div>
                                    </div>

                                    {/* Captions Overlay */}
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '20%',
                                        left: '10%',
                                        right: '10%',
                                        textAlign: 'center'
                                    }}>
                                        <span style={{
                                            backgroundColor: 'rgba(0,0,0,0.6)',
                                            color: '#fbbf24',
                                            padding: '0.5rem',
                                            borderRadius: '8px',
                                            fontSize: '1.25rem',
                                            fontWeight: '800',
                                            boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
                                        }}>
                                            This is a viral caption! 🚀
                                        </span>
                                    </div>
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
                                    Download Short
                                </button>
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
