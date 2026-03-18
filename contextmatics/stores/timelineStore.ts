import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ClipType = 'video' | 'audio' | 'text' | 'image';

export interface Clip {
    id: string;
    type: ClipType;
    start: number; // Start time on timeline in seconds
    duration: number; // Length of clip in seconds
    sourceStart: number; // Start time within the source media
    src: string;
    name: string;
    metadata?: any;
    layer: number; // Z-index/track level
}

export interface Track {
    id: string;
    name: string;
    type: ClipType | 'mixed';
    clips: Clip[];
}

interface TimelineState {
    tracks: Track[];
    currentTime: number;
    duration: number;
    isPlaying: boolean;
    zoom: number;
    selectedClipId: string | null;
    
    // Actions
    updateTime: (time: number) => void;
    togglePlay: (playing?: boolean) => void;
    addClip: (clip: Omit<Clip, 'id'>, trackId: string) => void;
    removeClip: (clipId: string) => void;
    moveClip: (clipId: string, newStart: number, trackId?: string) => void;
    splitClip: (clipId: string, time: number) => void;
    setZoom: (zoom: number) => void;
    setSelectedClip: (id: string | null) => void;
}

export const useTimelineStore = create<TimelineState>()(
    persist(
        (set, get) => ({
            tracks: [
                { id: 'track-1', name: 'Video 1', type: 'video', clips: [] },
                { id: 'track-2', name: 'Text 1', type: 'text', clips: [] },
                { id: 'track-3', name: 'Audio 1', type: 'audio', clips: [] },
            ],
            currentTime: 0,
            duration: 60, // Default 60 seconds
            isPlaying: false,
            zoom: 10, // Pixels per second
            selectedClipId: null,

            updateTime: (time) => set({ currentTime: Math.max(0, Math.min(time, get().duration)) }),
            
            togglePlay: (playing) => set((state) => ({ isPlaying: playing !== undefined ? playing : !state.isPlaying })),
            
            addClip: (clipData, trackId) => set((state) => {
                const id = Math.random().toString(36).substr(2, 9);
                const newClip: Clip = { ...clipData, id };
                const newTracks = state.tracks.map(t => 
                    t.id === trackId ? { ...t, clips: [...t.clips, newClip] } : t
                );
                return { tracks: newTracks };
            }),

            removeClip: (clipId) => set((state) => {
                const newTracks = state.tracks.map(t => ({
                    ...t,
                    clips: t.clips.filter(c => c.id !== clipId)
                }));
                return { tracks: newTracks, selectedClipId: state.selectedClipId === clipId ? null : state.selectedClipId };
            }),

            moveClip: (clipId, newStart, trackId) => set((state) => {
                let targetClip: Clip | null = null;
                const filteredTracks = state.tracks.map(t => {
                    const clip = t.clips.find(c => c.id === clipId);
                    if (clip) targetClip = { ...clip, start: newStart };
                    return { ...t, clips: t.clips.filter(c => c.id !== clipId) };
                });

                if (!targetClip) return state;

                const finalTrackId = trackId || state.tracks.find(t => t.clips.find(c => c.id === clipId))?.id;
                const finalTracks = filteredTracks.map(t => 
                    t.id === finalTrackId ? { ...t, clips: [...t.clips, targetClip!] } : t
                );
                
                return { tracks: finalTracks };
            }),

            splitClip: (clipId, time) => set((state) => {
                const track = state.tracks.find(t => t.clips.find(c => c.id === clipId));
                if (!track) return state;

                const clip = track.clips.find(c => c.id === clipId)!;
                if (time <= clip.start || time >= clip.start + clip.duration) return state;

                const leftDuration = time - clip.start;
                const rightDuration = clip.duration - leftDuration;

                const leftClip: Clip = { ...clip, duration: leftDuration };
                const rightClip: Clip = { 
                    ...clip, 
                    id: Math.random().toString(36).substr(2, 9),
                    start: time,
                    duration: rightDuration,
                    sourceStart: clip.sourceStart + leftDuration
                };

                const newTracks = state.tracks.map(t => 
                    t.id === track.id ? { ...t, clips: [...t.clips.filter(c => c.id !== clipId), leftClip, rightClip] } : t
                );

                return { tracks: newTracks };
            }),

            setZoom: (zoom) => set({ zoom }),
            setSelectedClip: (id) => set({ selectedClipId: id }),
        }),
        {
            name: 'contextmatic-timeline-storage',
            partialize: (state) => ({ tracks: state.tracks, duration: state.duration }),
        }
    )
);
