import React, { useEffect } from 'react';
import { useJobStatus } from '../hooks/useJobStatus';
import type { JobStatus } from '../types';

interface JobProgressProps {
    jobId: string;
    onComplete: (result: string) => void;
    onFailure: (error: string) => void;
}

const STATUS_TEXT: Record<JobStatus, string> = {
    queued: "Your request is in the queue...",
    processing: "Processing your content...",
    analyzing: "AI is analyzing and generating...",
    complete: "Done!",
    failed: "An error occurred.",
};

const JobProgress: React.FC<JobProgressProps> = ({ jobId, onComplete, onFailure }) => {
    const { job, isLoading } = useJobStatus(jobId);

    useEffect(() => {
        if (job) {
            if (job.status === 'complete' && job.result) {
                onComplete(job.result);
            } else if (job.status === 'failed' && job.error) {
                onFailure(job.error);
            }
        }
    }, [job, onComplete, onFailure]);

    if (isLoading || !job) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400">
                <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4">Initializing job...</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{STATUS_TEXT[job.status]}</h3>
            <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2.5 my-4">
                <div 
                    className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500" 
                    style={{ width: `${job.progress}%` }}
                ></div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">{job.progress}% complete</p>
        </div>
    );
};

export default JobProgress;
