import React, { useState, useRef, useEffect } from 'react';
import { PageLayout } from './shared';

const VideoEditor: React.FC = () => {
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [videoUrl, setVideoUrl] = useState<string>('');
    const [activeTab, setActiveTab] = useState<'trim' | 'filters' | 'text' | 'audio'>('trim');
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Cleanup video URL
    useEffect(() => {
        return () => {
            if (videoUrl) URL.revokeObjectURL(videoUrl);
        };
    }, [videoUrl]);

    const handleFileSelect = (file: File) => {
        if (!file.type.startsWith('video/')) {
            alert('Please upload a valid video file.');
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

    const handleExport = () => {
        alert('Exporting video... (Simulation)');
    };

    return (
        <PageLayout showPricing={true} showSettings={true}>
            <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#111827', marginBottom: '1rem' }}>
                        Video Editor Studio
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#6b7280' }}>
                        Edit, trim, and enhance your videos manually.
                    </p>
                </div>

                {!videoFile ? (
                    <div
                        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        onClick={() => fileInputRef.current?.click()}
                        style={{
                            border: `3px dashed ${isDragging ? '#4f46e5' : '#e5e7eb'}`,
                            borderRadius: '24px',
                            padding: '5rem 2rem',
                            textAlign: 'center',
                            backgroundColor: isDragging ? '#eef2ff' : 'white',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            maxWidth: '800px',
                            margin: '0 auto'
                        }}
                    >
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="video/*"
                            style={{ display: 'none' }}
                            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
                        />
                        <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🎬</div>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827', marginBottom: '0.5rem' }}>
                            Upload Video to Edit
                        </h3>
                        <p style={{ color: '#6b7280' }}>Drag & drop or click to browse</p>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 350px', gap: '2rem', height: 'calc(100vh - 12rem)' }}>
                        {/* Main Editor Area */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {/* Video Player */}
                            <div style={{
                                flex: 1,
                                backgroundColor: 'black',
                                borderRadius: '24px',
                                overflow: 'hidden',
                                position: 'relative',
                                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
                            }}>
                                <video
                                    ref={videoRef}
                                    src={videoUrl}
                                    controls
                                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                />
                            </div>

                            {/* Timeline (Visual Mock) */}
                            <div style={{
                                backgroundColor: 'white',
                                borderRadius: '16px',
                                padding: '1.5rem',
                                border: '1px solid #e5e7eb'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.875rem', color: '#6b7280', fontWeight: '600' }}>
                                    <span>00:00</span>
                                    <span>Timeline</span>
                                    <span>05:30</span>
                                </div>
                                <div style={{ height: '60px', backgroundColor: '#f3f4f6', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
                                    {/* Mock waveforms */}
                                    <div style={{
                                        position: 'absolute',
                                        inset: '10px 0',
                                        background: 'repeating-linear-gradient(90deg, #d1d5db 0px, #d1d5db 2px, transparent 2px, transparent 8px)',
                                        opacity: 0.5
                                    }} />
                                    {/* Scrubber */}
                                    <div style={{
                                        position: 'absolute',
                                        left: '30%',
                                        top: 0,
                                        bottom: 0,
                                        width: '2px',
                                        backgroundColor: '#ef4444',
                                        zIndex: 10
                                    }}>
                                        <div style={{
                                            position: 'absolute',
                                            top: 0,
                                            left: '-6px',
                                            width: '14px',
                                            height: '14px',
                                            backgroundColor: '#ef4444',
                                            borderRadius: '50%'
                                        }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar Controls */}
                        <div style={{
                            backgroundColor: 'white',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            border: '1px solid #e5e7eb',
                            display: 'flex',
                            flexDirection: 'column'
                        }}>
                            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem', padding: '0.25rem', backgroundColor: '#f3f4f6', borderRadius: '12px' }}>
                                {['trim', 'filters', 'text', 'audio'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setActiveTab(tab as any)}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: '10px',
                                            border: 'none',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            cursor: 'pointer',
                                            backgroundColor: activeTab === tab ? 'white' : 'transparent',
                                            color: activeTab === tab ? '#4f46e5' : '#6b7280',
                                            boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                                            transition: 'all 0.2s',
                                            textTransform: 'capitalize'
                                        }}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>

                            <div style={{ flex: 1 }}>
                                {activeTab === 'trim' && (
                                    <div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' }}>Trim Video</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Start Time</label>
                                                <input type="text" defaultValue="00:00.00" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                            </div>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>End Time</label>
                                                <input type="text" defaultValue="00:15.00" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'filters' && (
                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                        {['None', 'Warm', 'Cool', 'B&W', 'Vivid', 'Vintage'].map(filter => (
                                            <button key={filter} style={{
                                                padding: '1rem',
                                                borderRadius: '8px',
                                                border: '1px solid #e5e7eb',
                                                backgroundColor: '#f9fafb',
                                                cursor: 'pointer',
                                                fontWeight: '500'
                                            }}>{filter}</button>
                                        ))}
                                    </div>
                                )}
                                {activeTab === 'text' && (
                                    <div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' }}>Add Text Overlay</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            <div>
                                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Text Content</label>
                                                <input type="text" placeholder="Enter text here..." style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db' }} />
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Font</label>
                                                    <select style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid #d1d5db', backgroundColor: 'white' }}>
                                                        <option>Sans Serif</option>
                                                        <option>Serif</option>
                                                        <option>Monospace</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Color</label>
                                                    <input type="color" style={{ width: '100%', height: '42px', borderRadius: '8px', border: '1px solid #d1d5db', padding: '2px' }} />
                                                </div>
                                            </div>
                                            <button style={{
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                backgroundColor: '#e0e7ff',
                                                color: '#4338ca',
                                                border: 'none',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                marginTop: '0.5rem'
                                            }}>
                                                + Add Text Layer
                                            </button>
                                        </div>
                                    </div>
                                )}
                                {activeTab === 'audio' && (
                                    <div>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '700', marginBottom: '1rem' }}>Background Music</h3>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                                            {['Upbeat Pop', 'Chill Lofi', 'Corporate Energetic', 'Cinematic Build'].map((track) => (
                                                <div key={track} style={{
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'space-between',
                                                    padding: '0.75rem',
                                                    borderRadius: '8px',
                                                    border: '1px solid #e5e7eb',
                                                    backgroundColor: '#f9fafb'
                                                }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                        <span>🎵</span>
                                                        <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>{track}</span>
                                                    </div>
                                                    <button style={{
                                                        padding: '0.25rem 0.75rem',
                                                        borderRadius: '6px',
                                                        backgroundColor: 'white',
                                                        border: '1px solid #d1d5db',
                                                        fontSize: '0.75rem',
                                                        cursor: 'pointer'
                                                    }}>Add</button>
                                                </div>
                                            ))}
                                            <div style={{ marginTop: '1rem' }}>
                                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', marginBottom: '0.5rem' }}>Volume</label>
                                                <input type="range" min="0" max="100" defaultValue="80" style={{ width: '100%' }} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid #e5e7eb' }}>
                                <button
                                    onClick={handleExport}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        borderRadius: '12px',
                                        backgroundColor: '#4f46e5',
                                        color: 'white',
                                        border: 'none',
                                        fontWeight: '700',
                                        fontSize: '1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 6px -1px rgba(79, 70, 229, 0.2)'
                                    }}
                                >
                                    Export Video
                                </button>
                                <button
                                    onClick={() => { setVideoFile(null); setVideoUrl(''); }}
                                    style={{
                                        width: '100%',
                                        marginTop: '0.75rem',
                                        padding: '0.75rem',
                                        borderRadius: '12px',
                                        backgroundColor: 'transparent',
                                        color: '#ef4444',
                                        border: 'none',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                >
                                    Cancel
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
