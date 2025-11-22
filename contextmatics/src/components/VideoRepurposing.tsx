import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';

const VideoRepurposing: React.FC = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const { addToHistory } = useHistory();

    const [step, setStep] = useState<'input' | 'processing' | 'editor'>('input');
    const [videoUrl, setVideoUrl] = useState('');
    const [processingStage, setProcessingStage] = useState(0);
    const [scrolled, setScrolled] = useState(false);
    const [selectedClip, setSelectedClip] = useState<number | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleProcess = () => {
        if (!videoUrl) return;
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
            content: 'Generated short video from: ' + videoUrl,
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
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827', position: 'relative' }}>
            {/* Gradient Orbs Background */}
            <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
                <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
                <div style={{ position: 'absolute', bottom: '-10%', left: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
            </div>

            {/* Navigation */}
            <nav style={{
                position: 'fixed',
                top: 0,
                width: '100%',
                zIndex: 50,
                backgroundColor: scrolled ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.95)',
                backdropFilter: 'blur(20px)',
                boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.08)' : '0 1px 3px rgba(0,0,0,0.05)',
                transition: 'all 0.3s',
                borderBottom: '1px solid rgba(0,0,0,0.05)'
            }}>
                <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '1rem 1.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <button
                            onClick={() => navigate('/')}
                            style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                            <div style={{
                                width: '44px',
                                height: '44px',
                                background: 'linear-gradient(to bottom right, #ec4899, #8b5cf6)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}>
                                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>V</span>
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>VideoMagic</span>
                        </button>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                            <button onClick={() => navigate('/dashboard')} style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer' }}>Dashboard</button>
                            <button onClick={logout} style={{ backgroundColor: 'white', color: '#dc2626', fontSize: '1rem', fontWeight: '600', border: '2px solid #fecaca', padding: '0.625rem 1.5rem', borderRadius: '12px', cursor: 'pointer' }}>Logout</button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <div style={{ paddingTop: '8rem', paddingBottom: '5rem', paddingLeft: '2rem', paddingRight: '2rem', position: 'relative', zIndex: 10 }}>
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

                                <div style={{
                                    border: '2px dashed #e5e7eb',
                                    borderRadius: '16px',
                                    padding: '3rem',
                                    cursor: 'pointer',
                                    backgroundColor: '#f9fafb',
                                    transition: 'all 0.2s'
                                }}
                                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#ec4899'}
                                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                                >
                                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📁</div>
                                    <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#4b5563' }}>Click to upload video file</p>
                                    <p style={{ fontSize: '0.875rem', color: '#9ca3af' }}>MP4, MOV up to 1GB</p>
                                </div>

                                <button
                                    onClick={handleProcess}
                                    disabled={!videoUrl}
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
            </div>
            <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
        </div>
    );
};

export default VideoRepurposing;
