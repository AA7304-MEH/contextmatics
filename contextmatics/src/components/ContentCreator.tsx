import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { generateContent } from '../services/geminiService';
import { REPURPOSE_OPTIONS } from '../constants';

interface ContentCreatorProps {
  onGenerate?: (content: string, format: string) => void;
}

const ContentCreator: React.FC<ContentCreatorProps> = ({ onGenerate }) => {
  const { user, logout } = useAuth();
  const { addToHistory } = useHistory();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [inputContent, setInputContent] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('Summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGenerate = async () => {
    if (!inputContent.trim()) {
      alert('Please enter some content to repurpose');
      return;
    }

    setIsGenerating(true);
    setGeneratedResult('');

    try {
      const result = await generateContent(inputContent, selectedFormat);
      setGeneratedResult(result);

      // Save to history
      addToHistory({
        title: `${selectedFormat} of Content`,
        format: selectedFormat,
        content: result,
        status: 'success',
        icon: getIconForFormat(selectedFormat)
      });

      if (onGenerate) {
        onGenerate(result, selectedFormat);
      }
    } catch (error) {
      console.error(error);
      alert('Failed to generate content. Please check your API key and try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const getIconForFormat = (format: string) => {
    switch (format) {
      case 'Blog Post': return '📝';
      case 'Twitter Thread': return '🐦';
      case 'Email Newsletter': return '📧';
      case 'LinkedIn Post': return '💼';
      case 'Summary': return '📊';
      default: return '📄';
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedResult);
    alert('Copied to clipboard!');
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827', position: 'relative' }}>
      {/* Gradient Orbs Background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)', filter: 'blur(60px)' }}></div>
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
                background: 'linear-gradient(to bottom right, #4f46e5, #9333ea)',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}>
                <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>C</span>
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827' }}>ContextMatics</span>
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
              >
                Dashboard
              </button>
              <button
                onClick={() => navigate('/pricing')}
                style={{ color: '#4b5563', fontSize: '1.125rem', fontWeight: '500', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
                onMouseOut={(e) => e.currentTarget.style.color = '#4b5563'}
              >
                Pricing
              </button>
              <button
                onClick={logout}
                style={{
                  backgroundColor: 'white',
                  color: '#dc2626',
                  fontSize: '1rem',
                  fontWeight: '600',
                  border: '2px solid #fecaca',
                  padding: '0.625rem 1.5rem',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#fef2f2';
                  e.currentTarget.style.borderColor = '#fca5a5';
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = 'white';
                  e.currentTarget.style.borderColor = '#fecaca';
                }}
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={{ paddingTop: '10rem', paddingBottom: '5rem', paddingLeft: '2rem', paddingRight: '2rem', position: 'relative', zIndex: 10 }}>
        <div style={{ maxWidth: '1024px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
            <h1 style={{ fontSize: '3rem', fontWeight: '800', color: '#111827', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
              Create Content
            </h1>
            <p style={{ fontSize: '1.25rem', color: '#4b5563', maxWidth: '42rem', margin: '0 auto' }}>
              Transform your ideas into engaging posts, threads, and emails in seconds.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: generatedResult ? '1fr 1fr' : '1fr', gap: '2rem' }}>
            {/* Input Column */}
            <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #f3f4f6' }}>
              {/* Input Area */}
              <div style={{ marginBottom: '2.5rem' }}>
                <label style={{ display: 'block', color: '#111827', marginBottom: '1rem', fontSize: '1rem', fontWeight: '700' }}>
                  Your Content
                </label>
                <textarea
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="Paste your content here... (blog post, article, notes, etc.)"
                  style={{
                    width: '100%',
                    height: '16rem',
                    backgroundColor: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: '#111827',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    outline: 'none',
                    resize: 'none',
                    transition: 'all 0.2s',
                    boxShadow: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#6366f1';
                    e.target.style.backgroundColor = 'white';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.backgroundColor = '#f9fafb';
                  }}
                />
                <div style={{ marginTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#6b7280', fontSize: '0.875rem', fontWeight: '500' }}>
                    {inputContent.length} characters
                  </span>
                  {inputContent.length > 0 && (
                    <button
                      onClick={() => setInputContent('')}
                      style={{
                        color: '#ef4444',
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        padding: '0.5rem',
                        borderRadius: '6px',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#fef2f2'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Format Selection */}
              <div style={{ marginBottom: '3rem' }}>
                <label style={{ display: 'block', color: '#111827', marginBottom: '1rem', fontSize: '1rem', fontWeight: '700' }}>
                  Output Format
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                  {REPURPOSE_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setSelectedFormat(option.value)}
                      style={{
                        padding: '0.75rem',
                        borderRadius: '12px',
                        border: selectedFormat === option.value ? '2px solid #4f46e5' : '2px solid #e5e7eb',
                        backgroundColor: selectedFormat === option.value ? '#eef2ff' : 'white',
                        color: selectedFormat === option.value ? '#4f46e5' : '#4b5563',
                        fontWeight: '600',
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        textAlign: 'center',
                        boxShadow: selectedFormat === option.value ? '0 4px 6px -1px rgba(79, 70, 229, 0.1)' : 'none'
                      }}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Generate Button */}
              <button
                onClick={handleGenerate}
                disabled={isGenerating || !inputContent.trim()}
                style={{
                  width: '100%',
                  padding: '1.25rem',
                  borderRadius: '16px',
                  fontSize: '1.125rem',
                  fontWeight: '700',
                  border: 'none',
                  cursor: isGenerating || !inputContent.trim() ? 'not-allowed' : 'pointer',
                  background: isGenerating || !inputContent.trim() ? '#e5e7eb' : 'linear-gradient(to right, #4f46e5, #9333ea)',
                  color: isGenerating || !inputContent.trim() ? '#9ca3af' : 'white',
                  transition: 'all 0.3s',
                  boxShadow: isGenerating || !inputContent.trim() ? 'none' : '0 10px 15px -3px rgba(79, 70, 229, 0.3)',
                  transform: isGenerating || !inputContent.trim() ? 'none' : 'translateY(0)',
                }}
              >
                {isGenerating ? (
                  <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg style={{ animation: 'spin 1s linear infinite', height: '1.5rem', width: '1.5rem', marginRight: '0.75rem' }} viewBox="0 0 24 24">
                      <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Generating Magic...
                  </span>
                ) : (
                  '✨ Generate Content'
                )}
              </button>
            </div>

            {/* Result Column (Only visible when content is generated) */}
            {generatedResult && (
              <div style={{ backgroundColor: 'white', borderRadius: '24px', padding: '3rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)', border: '1px solid #f3f4f6', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#111827' }}>Generated Result</h2>
                  <button
                    onClick={copyToClipboard}
                    style={{
                      backgroundColor: '#f3f4f6',
                      color: '#4b5563',
                      padding: '0.5rem 1rem',
                      borderRadius: '8px',
                      fontWeight: '600',
                      fontSize: '0.875rem',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#e5e7eb'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f3f4f6'}
                  >
                    📋 Copy
                  </button>
                </div>
                <textarea
                  readOnly
                  value={generatedResult}
                  style={{
                    flex: 1,
                    width: '100%',
                    backgroundColor: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    color: '#111827',
                    fontSize: '1rem',
                    lineHeight: '1.6',
                    outline: 'none',
                    resize: 'none',
                    marginBottom: '1.5rem'
                  }}
                />
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button
                    onClick={() => navigate('/history')}
                    style={{
                      flex: 1,
                      backgroundColor: 'white',
                      border: '2px solid #e5e7eb',
                      color: '#4b5563',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.borderColor = '#d1d5db'}
                    onMouseOut={(e) => e.currentTarget.style.borderColor = '#e5e7eb'}
                  >
                    View History
                  </button>
                  <button
                    onClick={handleGenerate}
                    style={{
                      flex: 1,
                      backgroundColor: '#4f46e5',
                      border: 'none',
                      color: 'white',
                      padding: '1rem',
                      borderRadius: '12px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#4338ca'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#4f46e5'}
                  >
                    🔄 Regenerate
                  </button>
                </div>
              </div>
            )}
          </div>
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

export default ContentCreator;
