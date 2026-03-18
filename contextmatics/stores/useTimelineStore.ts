"use client";

import { create } from 'zustand';
import { Track, Clip, TrackType } from '@/types';
import { v4 as uuidv4 } from 'uuid';

interface TimelineState {
    tracks: Track[];
    clips: Clip[];
    duration: number;
    currentTime: number;
    isPlaying: boolean;
    zoom: number;
    selectedClipId: string | null;
    
    // Actions
    setTracks: (tracks: Track[]) => void;
    setClips: (clips: Clip[]) => void;
    addTrack: (type: TrackType, name: string) => void;
    removeTrack: (trackId: string) => void;
    addClip: (clip: Omit<Clip, 'id'>) => void;
    updateClip: (clipId: string, updates: Partial<Clip>) => void;
    removeClip: (clipId: string) => void;
    moveClip: (clipId: string, newStartTime: number, newTrackId?: string) => void;
    
    setCurrentTime: (time: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setZoom: (zoom: number) => void;
    setDuration: (duration: number) => void;
    setSelectedClipId: (id: string | null) => void;
    
    // Complex actions
    splitClip: (clipId: string, time: number) => void;
    loadProject: (projectData: any) => void;
}

export const useTimelineStore = create<TimelineState>((set, get) => ({
    tracks: [
        { id: 'v1', type: 'video', name: 'Video 1', order: 0 },
        { id: 'a1', type: 'audio', name: 'Audio 1', order: 1 },
        { id: 't1', type: 'text', name: 'Text 1', order: 2 },
    ],
    clips: [],
    duration: 60,
    currentTime: 0,
    isPlaying: false,
    zoom: 1,
    selectedClipId: null,

    setTracks: (tracks) => set({ tracks }),
    setClips: (clips) => set({ clips }),
    
    addTrack: (type, name) => set((state) => ({
        tracks: [...state.tracks, { id: uuidv4(), type, name, order: state.tracks.length }]
    })),
    
    removeTrack: (trackId) => set((state) => ({
        tracks: state.tracks.filter(t => t.id !== trackId),
        clips: state.clips.filter(c => c.trackId !== trackId)
    })),
    
    addClip: (clipData) => set((state) => ({
        clips: [...state.clips, { ...clipData, id: uuidv4() }]
    })),
    
    updateClip: (clipId, updates) => set((state) => ({
        clips: state.clips.map(c => c.id === clipId ? { ...c, ...updates } : c)
    })),
    
    removeClip: (clipId) => set((state) => ({
        clips: state.clips.filter(c => c.id !== clipId),
        selectedClipId: state.selectedClipId === clipId ? null : state.selectedClipId
    })),
    
    moveClip: (clipId, newStartTime, newTrackId) => set((state) => ({
        clips: state.clips.map(c => 
            c.id === clipId 
                ? { ...c, startTime: Math.max(0, newStartTime), trackId: newTrackId || c.trackId } 
                : c
        )
    })),
    
    setCurrentTime: (time) => set({ currentTime: Math.max(0, Math.min(time, get().duration)) }),
    setIsPlaying: (isPlaying) => set({ isPlaying }),
    setZoom: (zoom) => set({ zoom: Math.max(0.1, Math.min(zoom, 10)) }),
    setDuration: (duration) => set({ duration: Math.max(1, duration) }),
    setSelectedClipId: (selectedClipId) => set({ selectedClipId }),
    
    splitClip: (clipId, time) => set((state) => {
        const clip = state.clips.find(c => c.id === clipId);
        if (!clip) return state;
        
        const relativeSplitTime = time - clip.startTime;
        if (relativeSplitTime <= 0 || relativeSplitTime >= clip.duration) return state;
        
        const firstClip: Clip = {
            ...clip,
            duration: relativeSplitTime,
        };
        
        const secondClip: Clip = {
            ...clip,
            id: uuidv4(),
            startTime: time,
            duration: clip.duration - relativeSplitTime,
            startOffset: clip.startOffset + relativeSplitTime
        };
        
        return {
            clips: state.clips.map(c => c.id === clipId ? firstClip : c).concat(secondClip)
        };
    }),
    
    loadProject: (projectData) => set({
        tracks: projectData.tracks || [],
        clips: projectData.clips || [],
        duration: projectData.duration || 60,
        currentTime: 0,
        isPlaying: false,
        selectedClipId: null
    })
}));
