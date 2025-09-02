import { useState, useEffect } from 'react';
import type { Job } from '../types';
import { getJob } from '../services/geminiService';

export const useJobStatus = (jobId: string | null) => {
    const [job, setJob] = useState<Job | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!jobId) {
            setJob(null);
            setIsLoading(false);
            return;
        }

        let intervalId: number;

        const fetchJobStatus = async () => {
            try {
                const currentJob = await getJob(jobId);
                setJob(currentJob);
                setIsLoading(false);

                if (currentJob?.status === 'complete' || currentJob?.status === 'failed') {
                    // FIX: Use window.clearInterval to avoid type conflicts with Node.js typings.
                    if (intervalId) window.clearInterval(intervalId);
                }
            } catch (err) {
                setError('Failed to fetch job status.');
                // FIX: Use window.clearInterval to avoid type conflicts with Node.js typings.
                if (intervalId) window.clearInterval(intervalId);
            }
        };

        // Fetch immediately, then poll
        fetchJobStatus();
        // FIX: Use window.setInterval to ensure it returns a number, resolving the type conflict with Node.js's `setInterval` which returns a Timeout object.
        intervalId = window.setInterval(fetchJobStatus, 2000);

        return () => {
            if (intervalId) {
                // FIX: Use window.clearInterval to avoid type conflicts with Node.js typings.
                window.clearInterval(intervalId);
            }
        };
    }, [jobId]);

    return { job, isLoading, error };
};