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
    
    // Simulate AI processing
    setTimeout(() => {
      onGenerate(inputContent, selectedFormat);
      setIsGenerating(false);
    }, 2000);
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
      <h2 className="text-3xl font-bold text-white mb-6">Create Content</h2>
      
      {/* Input Area */}
      <div className="mb-6">
        <label className="block text-white/80 mb-3 text-lg font-medium">
          Your Content
        </label>
        <textarea
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="Paste your content here... (blog post, article, notes, etc.)"
          className="w-full h-48 bg-white/5 border border-white/20 rounded-xl p-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        <div className="mt-2 text-white/60 text-sm">
          {inputContent.length} characters
        </div>
      </div>

      {/* Format Selection */}
      <div className="mb-6">
        <label className="block text-white/80 mb-3 text-lg font-medium">
          Output Format
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {REPURPOSE_OPTIONS.map((option) => (
            <button
              key={option.value}
              onClick={() => setSelectedFormat(option.value)}
              className={`p-4 rounded-xl border-2 transition-all duration-300 ${
                selectedFormat === option.value
                  ? 'bg-purple-500/30 border-purple-400 text-white'
                  : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:border-white/40'
              }`}
            >
              <div className="font-semibold">{option.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Generate Button */}
      <button
        onClick={handleGenerate}
        disabled={isGenerating || !inputContent.trim()}
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
          isGenerating || !inputContent.trim()
            ? 'bg-gray-500 cursor-not-allowed'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 transform hover:scale-105'
        } text-white shadow-lg`}
      >
        {isGenerating ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Generating...
          </span>
        ) : (
          '✨ Generate Content'
        )}
      </button>
    </div>
  );
};

export default ContentCreator;