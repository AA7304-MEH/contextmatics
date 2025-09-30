import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { startRepurposingJob } from '../services/geminiService';
import { REPURPOSE_OPTIONS } from '../constants';
import type { RepurposeOption } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';
import Spinner from './ui/Spinner';
import JobProgress from './JobProgress';

const Dashboard: React.FC = () => {
    const { user, decrementCredits } = useAuth();
    const { addToast } = useToast();
    const [originalContent, setOriginalContent] = useState('');
    const [repurposedContent, setRepurposedContent] = useState('');
    const [selectedOption, setSelectedOption] = useState<RepurposeOption>(REPURPOSE_OPTIONS[0].value);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [activeJobId, setActiveJobId] = useState<string | null>(null);

    const handleRepurpose = async () => {
        if (!originalContent.trim() || originalContent.length < 50) {
            setError('Please enter at least 50 characters to repurpose.');
            return;
        }
        if (!user) {
             setError('User not found. Please log in again.');
             return;
        }
        if (user.processingCredits <= 0) {
            setError('You have no processing credits left. Please upgrade your plan.');
            return;
        }

        setIsLoading(true);
        setError(null);
        setRepurposedContent('');

        try {
            const jobId = await startRepurposingJob(originalContent, selectedOption, user.plan);
            setActiveJobId(jobId);
            decrementCredits();
            addToast('Your content is being repurposed!', 'info');
        } catch (err) {
            setError((err as Error).message);
            addToast((err as Error).message, 'error');
        } finally {
            setIsLoading(false);
        }
    };
    
    const onJobComplete = (result: string) => {
        setRepurposedContent(result);
        setActiveJobId(null);
        addToast('Content successfully repurposed!', 'success');
    };
    
    const onJobFail = (jobError: string) => {
        setError(jobError);
        setActiveJobId(null);
        addToast(jobError, 'error');
    };

    const canRepurpose = user && user.processingCredits > 0;

    const renderButtonContent = () => {
        if (activeJobId) {
            return (
                <>
                    <Spinner />
                    <span className="ml-2">Processing...</span>
                </>
            );
        }
        if (isLoading) {
            return (
                <>
                    <Spinner />
                    <span className="ml-2">Repurpose Content</span>
                </>
            );
        }
        return (
            <>
                <SparklesIcon className="w-5 h-5 mr-2" />
                <span>Repurpose Content</span>
            </>
        );
    };

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Input Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 transition-shadow hover:shadow-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Your Content</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Paste your blog post, script, or notes here.</p>
                    <textarea
                        value={originalContent}
                        onChange={(e) => setOriginalContent(e.target.value)}
                        placeholder="Start typing or paste your content..."
                        className="w-full h-64 p-4 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                        disabled={!!activeJobId}
                    />
                    <div className="mt-4">
                        <label htmlFor="repurpose-select" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Repurpose as:</label>
                        <select
                            id="repurpose-select"
                            value={selectedOption}
                            onChange={(e) => setSelectedOption(e.target.value as RepurposeOption)}
                            className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            disabled={!!activeJobId}
                        >
                            {REPURPOSE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        onClick={handleRepurpose}
                        disabled={isLoading || !canRepurpose || !!activeJobId}
                        className="mt-6 w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:from-slate-400 disabled:to-slate-400 disabled:cursor-not-allowed transition-all transform hover:scale-105"
                    >
                        {renderButtonContent()}
                    </button>
                     {!canRepurpose && <p className="text-red-500 text-center mt-4">You're out of credits. Please upgrade to continue.</p>}
                     {error && <p className="text-red-500 text-center mt-2">{error}</p>}
                </div>

                {/* Output Card */}
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-200 dark:border-slate-700 p-6 transition-shadow hover:shadow-2xl">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">AI Generated Content</h2>
                    <p className="text-slate-600 dark:text-slate-300 mb-4">Your repurposed content will appear here.</p>
                    <div aria-live="polite" className="w-full h-96 p-4 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 overflow-y-auto whitespace-pre-wrap prose prose-sm dark:prose-invert">
                        {activeJobId ? (
                             <JobProgress jobId={activeJobId} onComplete={onJobComplete} onFailure={onJobFail} />
                        ) : (
                            repurposedContent || <div className="flex justify-center items-center h-full text-slate-500">Your results will be displayed here.</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;