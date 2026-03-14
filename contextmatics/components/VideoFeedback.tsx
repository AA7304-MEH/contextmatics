'use client';

import React, { useState } from 'react';
import { videoService } from '../services/videoService';

interface VideoFeedbackProps {
    videoId: string;
    userId: string;
    onClose: () => void;
}

export default function VideoFeedback({ videoId, userId, onClose }: VideoFeedbackProps) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async () => {
        if (rating === 0) return;
        setIsSubmitting(true);
        try {
            await videoService.submitFeedback(videoId, userId, rating, comment);
            setSubmitted(true);
            setTimeout(onClose, 2000);
        } catch (err) {
            console.error('Failed to submit feedback', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (submitted) {
        return (
            <div className="bg-green-50 p-6 rounded-2xl border border-green-100 text-center">
                <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                <h3 className="text-lg font-bold text-green-900">Thank you!</h3>
                <p className="text-green-700">Your feedback helps us improve the AI.</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-xl max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-2">How was the result?</h3>
            <p className="text-gray-500 mb-6 text-sm">Rating this video helps our AI understand your style better.</p>

            <div className="flex justify-center gap-3 mb-8">
                {[1, 2, 3, 4, 5].map((star) => (
                    <button
                        key={star}
                        onClick={() => setRating(star)}
                        className={`text-3xl transition-all ${star <= rating ? 'text-yellow-400 scale-110' : 'text-gray-200 hover:text-yellow-200'
                            }`}
                    >
                        ★
                    </button>
                ))}
            </div>

            <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="What could be better? (optional)"
                className="w-full h-24 p-4 rounded-xl border border-gray-100 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all resize-none text-sm mb-6"
            />

            <div className="flex gap-3">
                <button
                    onClick={onClose}
                    className="flex-1 px-4 py-3 rounded-xl border border-gray-100 text-gray-600 font-bold text-sm hover:bg-gray-50 transition-all"
                >
                    Later
                </button>
                <button
                    onClick={handleSubmit}
                    disabled={rating === 0 || isSubmitting}
                    className="flex-1 px-4 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 disabled:opacity-50 transition-all"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                </button>
            </div>
        </div>
    );
}
