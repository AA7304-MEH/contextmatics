"use client";

import { useEffect } from 'react';
import { useProjectStore } from '../stores/projectStore';

export const useKeyboardShortcuts = () => {
    const {
        undo,
        redo,
        selectedClipId,
        removeClip,
        splitClip,
        playheadTime,
        setIsPlaying,
        isPlaying
    } = useProjectStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Check if user is typing in an input
            if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
                return;
            }

            // Cmd/Ctrl + Z (Undo)
            if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }

            // Cmd/Ctrl + Y or Shift + Cmd/Ctrl + Z (Redo)
            if (((e.metaKey || e.ctrlKey) && e.key === 'y') ||
                ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z')) {
                e.preventDefault();
                redo();
            }

            // Space (Play/Pause)
            if (e.code === 'Space') {
                e.preventDefault();
                setIsPlaying(!isPlaying);
            }

            // S (Split)
            if (e.key.toLowerCase() === 's' && selectedClipId) {
                e.preventDefault();
                splitClip(selectedClipId, playheadTime);
            }

            // Delete/Backspace (Remove)
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedClipId) {
                e.preventDefault();
                removeClip(selectedClipId);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, selectedClipId, removeClip, splitClip, playheadTime, isPlaying, setIsPlaying]);
};
