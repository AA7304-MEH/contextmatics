import React, { useState } from 'react';
import { REPURPOSE_OPTIONS } from '../constants';

interface ContentCreatorProps {
  onGenerate: (content: string, format: string) => void;
}

const ContentCreator: React.FC<ContentCreatorProps> = ({ onGenerate }) => {
  const [inputContent, setInputContent] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('summary');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!inputContent.trim()) {
      alert('Please enter some content to repurpose');
      return;
    }

    setIsGenerating(true);
    
    setTimeout(() => {
      onGenerate(inputContent, selectedFormat);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem' }}>
      <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#111827', marginBottom: '1.5rem' }}>Create Content</h2>
      
      {/* Input Area */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', color: '#111827', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Your Content
        </label>
        <textarea
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="Paste your content here... (blog post, article, notes, etc.)"
          style={{
            width: '100%',
            height: '12rem',
            backgroundColor: '#f9fafb',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            padding: '1rem',
            color: '#111827',
            fontSize: '0.875rem',
            outline: 'none',
            resize: 'none'
          }}
        />
        <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: '#6b7280', fontSize: '0.875rem' }}>
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
                cursor: 'pointer'
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Format Selection */}
      <div style={{ marginBottom: '1.5rem' }}>
        <label style={{ display: 'block', color: '#111827', marginBottom: '0.75rem', fontSize: '0.875rem', fontWeight: '600' }}>
          Output Format
        </label>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {REPURPOSE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFormat(option.value)}
              style={{
                padding: '0.75rem',
                borderRadius: '8px',
                border: selectedFormat === option.value ? '2px solid #2563eb' : '1px solid #d1d5db',
                backgroundColor: selectedFormat === option.value ? '#dbeafe' : 'white',
                color: selectedFormat === option.value ? '#2563eb' : '#111827',
                fontWeight: '500',
                fontSize: '0.875rem',
                cursor: 'pointer',
                transition: 'all 0.2s'
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
          padding: '0.75rem 1.5rem',
          borderRadius: '8px',
          fontSize: '1rem',
          fontWeight: '600',
          border: 'none',
          cursor: isGenerating || !inputContent.trim() ? 'not-allowed' : 'pointer',
          backgroundColor: isGenerating || !inputContent.trim() ? '#d1d5db' : '#2563eb',
          color: isGenerating || !inputContent.trim() ? '#6b7280' : 'white',
          transition: 'all 0.2s'
        }}
      >
        {isGenerating ? (
          <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ animation: 'spin 1s linear infinite', height: '1.25rem', width: '1.25rem', marginRight: '0.75rem' }} viewBox="0 0 24 24">
              <circle style={{ opacity: 0.25 }} cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path style={{ opacity: 0.75 }} fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </span>
        ) : (
          '✨ Generate Content'
        )}
      </button>
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
