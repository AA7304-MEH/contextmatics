import React, { useState } from 'react';
import { Profile } from '@/types';

interface GrantCreditsModalProps {
    user: Profile;
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (newBalance: number) => void;
}

export const GrantCreditsModal: React.FC<GrantCreditsModalProps> = ({ user, isOpen, onClose, onSuccess }) => {
    const [amount, setAmount] = useState<number>(10);
    const [reason, setReason] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/users/grant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    targetUserId: user.id,
                    amount,
                    reason
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || 'Failed to grant credits');
            }

            const result = await response.json();
            onSuccess(result.newBalance);
            onClose();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="card w-full max-w-md border border-white/10 bg-background-surface p-8 shadow-2xl">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">Grant Credits</h2>
                        <p className="text-sm text-text-muted mt-1">To: {user.full_name || user.username || user.id.substring(0, 8)}</p>
                    </div>
                    <button onClick={onClose} className="text-text-muted hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                            Amount (Credits)
                        </label>
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            className="input w-full py-3 px-4 text-lg font-bold"
                            min="1"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                            Reason (Optional)
                        </label>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Customer support gesture"
                            className="input w-full py-2 px-4 text-sm h-24 resize-none"
                        />
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 btn btn-secondary"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 btn btn-primary flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Granting...
                                </>
                            ) : (
                                <>⚡ Grant Credits</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
