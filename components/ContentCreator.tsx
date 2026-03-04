import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';
import { generateContent } from '../services/geminiService';
import { REPURPOSE_OPTIONS } from '../constants';
import { PageLayout } from './shared';

interface ContentCreatorProps {
  onGenerate?: (content: string, format: string) => void;
}

const ContentCreator: React.FC<ContentCreatorProps> = ({ onGenerate }) => {

  const { user, decrementCredits } = useAuth();
  const { addToHistory } = useHistory();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [inputContent, setInputContent] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('Summary');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedResult, setGeneratedResult] = useState('');
  const [showComparison, setShowComparison] = useState(false);
  const [templateName, setTemplateName] = useState('');

  // Load template from sessionStorage (from Templates Library)
  useEffect(() => {
    const templatePrompt = sessionStorage.getItem('template_prompt');
    const tName = sessionStorage.getItem('template_name');
    if (templatePrompt) {
      setInputContent(templatePrompt);
      setTemplateName(tName || '');
      sessionStorage.removeItem('template_prompt');
      sessionStorage.removeItem('template_name');
    }
  }, []);

  const handleGenerate = async () => {
    if (!inputContent.trim()) {
      showToast('Please enter some content to repurpose', 'warning');
      return;
    }

    // Credit validation before generation
    if (!user || user.processingCredits <= 0) {
      showToast('No credits remaining! Please upgrade your plan.', 'error');
      navigate('/pricing');
      return;
    }

    setIsGenerating(true);
    setGeneratedResult('');

    try {
      const result = await generateContent(inputContent, selectedFormat);
      setGeneratedResult(result);

      // Deduct credit after successful generation
      decrementCredits();

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
      showToast('Failed to generate content. Check your API key and try again.', 'error');
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
    showToast('Copied to clipboard!', 'success');
  };

  return (
    <PageLayout showPricing={true} showSettings={true}>
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">
            Create Content
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto">
            Transform your ideas into engaging posts, threads, and emails in seconds.
          </p>
          {templateName && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm text-blue-400">
              <span>📚</span> Using template: <strong>{templateName}</strong>
              <button onClick={() => { setTemplateName(''); setInputContent(''); }} className="ml-2 text-blue-300 hover:text-white">✕</button>
            </div>
          )}
        </div>

        <div className={`grid gap-8 ${generatedResult ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1 max-w-4xl mx-auto'}`}>
          {/* Input Column */}
          <div className="card p-8 bg-background-surface/50 border border-white/5">
            {/* Input Area */}
            <div className="mb-10">
              <label className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3 block">
                Source Content
              </label>
              <div className="relative">
                <textarea
                  value={inputContent}
                  onChange={(e) => setInputContent(e.target.value)}
                  placeholder="Paste your content here... (blog post, article, notes, etc.)"
                  className="input w-full h-64 py-4 leading-relaxed resize-none transition-colors font-mono text-sm bg-black/20 focus:bg-black/40 text-text-primary placeholder-text-muted border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 outline-none"
                />
                <div className="absolute bottom-4 right-4 text-xs text-text-muted font-mono">
                  {inputContent.length} chars
                </div>
              </div>
              {inputContent.length > 0 && (
                <div className="flex justify-end mt-2">
                  <button
                    onClick={() => setInputContent('')}
                    className="text-xs text-red-400 hover:text-red-300 transition-colors"
                  >
                    Clear Input
                  </button>
                </div>
              )}
            </div>

            {/* Format Selection */}
            <div className="mb-10">
              <label className="text-sm font-medium text-text-secondary uppercase tracking-wider mb-3 block">
                Output Format
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {REPURPOSE_OPTIONS.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFormat(option.value)}
                    className={`px-4 py-3 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 ${selectedFormat === option.value
                      ? 'border-brand-primary/50 bg-brand-primary/10 text-white shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                      : 'border-white/5 bg-white/5 text-text-muted hover:bg-white/10 hover:text-text-primary'
                      }`}
                  >
                    <span>{getIconForFormat(option.value)}</span>
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !inputContent.trim()}
              className={`btn w-full py-4 text-base font-semibold tracking-wide justify-center ${isGenerating || !inputContent.trim()
                ? 'btn-secondary opacity-50 cursor-not-allowed'
                : 'btn-primary shadow-lg hover:shadow-brand-primary/20'
                }`}
            >
              {isGenerating ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing...
                </span>
              ) : (
                'Generate Content ✨'
              )}
            </button>
          </div>

          {/* Result Column (Only visible when content is generated) */}
          {generatedResult && (
            <div className="card p-8 bg-background-surface/50 border border-white/5 flex flex-col h-full animate-fade-in-up">
              <div className="flex justify-between items-center mb-6">
                <label className="text-sm font-medium text-text-secondary uppercase tracking-wider">
                  Generated Output
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className={`btn py-1.5 px-3 text-xs transition-all ${showComparison ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'btn-secondary'}`}
                  >
                    {showComparison ? '✕ Close Compare' : '⇆ Compare'}
                  </button>
                  <button
                    onClick={copyToClipboard}
                    className="btn btn-secondary py-1.5 px-3 text-xs"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {showComparison ? (
                <div className="grid grid-cols-2 gap-4 flex-1">
                  <div>
                    <p className="text-xs text-text-muted uppercase tracking-wider mb-2 font-medium">Original Input</p>
                    <textarea
                      readOnly
                      value={inputContent}
                      className="input w-full min-h-[350px] bg-black/30 resize-none leading-relaxed font-mono text-sm p-4 rounded-xl border border-white/10 text-text-secondary"
                    />
                  </div>
                  <div>
                    <p className="text-xs text-blue-400 uppercase tracking-wider mb-2 font-medium">Generated Output</p>
                    <textarea
                      readOnly
                      value={generatedResult}
                      className="input w-full min-h-[350px] bg-black/30 resize-none leading-relaxed font-mono text-sm p-4 rounded-xl border border-blue-500/20 text-text-primary"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative flex-1">
                  <textarea
                    readOnly
                    value={generatedResult}
                    className="input w-full h-full min-h-[400px] bg-black/30 resize-none leading-relaxed font-mono text-sm p-6 rounded-xl border-dashed border-2 border-white/10 focus:border-brand-primary/30 transition-colors text-text-primary"
                  />
                </div>
              )}

              <div className="flex gap-4 mt-6 pt-6 border-t border-white/5">
                <button
                  onClick={() => navigate('/history')}
                  className="btn btn-secondary flex-1"
                >
                  View History
                </button>
                <button
                  onClick={handleGenerate}
                  className="btn btn-primary flex-1 bg-white/5 hover:bg-white/10 border-white/10"
                >
                  Regenerate
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default ContentCreator;

