import { create } from 'zustand';
import { Project, Clip, EditorState, Effect } from '../types/editor';
import { v4 as uuidv4 } from 'uuid';

const DEFAULT_PROJECT: Project = {
    id: uuidv4(),
    name: 'Untitled Project',
    resolution: { width: 1920, height: 1080 },
    fps: 30,
    tracks: [
        { id: 'track-v1', name: 'Video 1', type: 'video', clips: [], muted: false, locked: false, volume: 1 },
        { id: 'track-a1', name: 'Audio 1', type: 'audio', clips: [], muted: false, locked: false, volume: 1 },
        { id: 'track-t1', name: 'Text 1', type: 'overlay', clips: [], muted: false, locked: false, volume: 1 },
    ],
    duration: 60,
    updatedAt: Date.now(),
};

interface ProjectActions {
    setProject: (project: Project) => void;
    addClip: (trackId: string, clip: Omit<Clip, 'id' | 'trackId'>) => void;
    updateClip: (clipId: string, updates: Partial<Clip>) => void;
    removeClip: (clipId: string) => void;
    moveClip: (clipId: string, newTrackId: string, newStart: number) => void;
    splitClip: (clipId: string, time: number) => void;
    setSelectedClipId: (id: string | null) => void;
    setPlayheadTime: (time: number) => void;
    setIsPlaying: (isPlaying: boolean) => void;
    setZoomLevel: (zoom: number) => void;
    addEffect: (clipId: string, effect: Omit<Effect, 'id'>) => void;
    updateEffect: (clipId: string, effectId: string, updates: Partial<Effect>) => void;
    undo: () => void;
    redo: () => void;
    saveHistory: () => void;
}

export const useProjectStore = create<EditorState & ProjectActions>((set, get) => ({
    project: { ...DEFAULT_PROJECT, updatedAt: Date.now() },
    selectedClipId: null,
    selectedTrackId: null,
    playheadTime: 0,
    isPlaying: false,
    zoomLevel: 50, // 50px per second
    history: [DEFAULT_PROJECT],
    historyIndex: 0,

    setProject: (project) => set({ project: { ...project, updatedAt: Date.now() } }),

    saveHistory: () => {
        const { project, history, historyIndex } = get();
        const updatedProject = { ...project, updatedAt: Date.now() };
        const newHistory = history.slice(0, historyIndex + 1);
        newHistory.push(JSON.parse(JSON.stringify(updatedProject)));

        // Limit history to 50 items
        if (newHistory.length > 50) newHistory.shift();

        set({
            project: updatedProject,
            history: newHistory,
            historyIndex: newHistory.length - 1,
        });
    },

    cleanupOldProjects: () => {
        // TODO: Implement project cleanup logic for local storage
    },

    addClip: (trackId, clipData) => {
        const { project } = get();
        const newClip: Clip = {
            ...clipData,
            id: uuidv4(),
            trackId,
        };

        const newTracks = project.tracks.map((track) => {
            if (track.id === trackId) {
                return { ...track, clips: [...track.clips, newClip] };
            }
            return track;
        });

        set({ project: { ...project, tracks: newTracks } });
        get().saveHistory();
    },

    updateClip: (clipId, updates) => {
        const { project } = get();
        const newTracks = project.tracks.map((track) => ({
            ...track,
            clips: track.clips.map((clip) =>
                clip.id === clipId ? { ...clip, ...updates } : clip
            ),
        }));

        set({ project: { ...project, tracks: newTracks } });
        get().saveHistory();
    },

    removeClip: (clipId) => {
        const { project, selectedClipId } = get();
        const newTracks = project.tracks.map((track) => ({
            ...track,
            clips: track.clips.filter((clip) => clip.id !== clipId),
        }));

        set({
            project: { ...project, tracks: newTracks },
            selectedClipId: selectedClipId === clipId ? null : selectedClipId
        });
        get().saveHistory();
    },

    moveClip: (clipId, newTrackId, newStart) => {
        const { project } = get();
        let movedClip: Clip | null = null;

        // Remove from old track and find the clip
        const intermediateTracks = project.tracks.map((track) => {
            const clip = track.clips.find((c) => c.id === clipId);
            if (clip) {
                movedClip = { ...clip, trackId: newTrackId, start: newStart };
                return { ...track, clips: track.clips.filter((c) => c.id !== clipId) };
            }
            return track;
        });

        if (!movedClip) return;

        // Add to new track
        const newTracks = intermediateTracks.map((track) => {
            if (track.id === newTrackId) {
                return { ...track, clips: [...track.clips, movedClip!] };
            }
            return track;
        });

        set({ project: { ...project, tracks: newTracks } });
        get().saveHistory();
    },

    splitClip: (clipId, time) => {
        const { project } = get();

        const newTracks = project.tracks.map((track) => {
            const clipIndex = track.clips.findIndex((c) => c.id === clipId);
            if (clipIndex !== -1) {
                const clip = track.clips[clipIndex];
                const splitPoint = time - clip.start;

                if (splitPoint <= 0 || splitPoint >= clip.duration) return track;

                const firstHalf: Clip = {
                    ...clip,
                    duration: splitPoint,
                };

                const secondHalf: Clip = {
                    ...clip,
                    id: uuidv4(),
                    start: time,
                    duration: clip.duration - splitPoint,
                    sourceStart: clip.sourceStart + splitPoint * clip.speed,
                };

                const filteredClips = track.clips.filter((c) => c.id !== clipId);
                return { ...track, clips: [...filteredClips, firstHalf, secondHalf] };
            }
            return track;
        });

        set({ project: { ...project, tracks: newTracks } });
        get().saveHistory();
    },

    setSelectedClipId: (id) => set({ selectedClipId: id }),

    setPlayheadTime: (time) => set({ playheadTime: Math.max(0, time) }),

    setIsPlaying: (isPlaying) => set({ isPlaying }),

    setZoomLevel: (zoom) => set({ zoomLevel: Math.max(1, zoom) }),

    addEffect: (clipId, effectData) => {
        const { project } = get();
        const newEffect: Effect = {
            ...effectData,
            id: uuidv4(),
        };

        const newTracks = project.tracks.map((track) => ({
            ...track,
            clips: track.clips.map((clip) =>
                clip.id === clipId
                    ? { ...clip, effects: [...(clip.effects || []), newEffect] }
                    : clip
            ),
        }));

        set({ project: { ...project, tracks: newTracks } });
        get().saveHistory();
    },

    updateEffect: (clipId, effectId, updates) => {
        const { project } = get();
        const newTracks = project.tracks.map((track) => ({
            ...track,
            clips: track.clips.map((clip) =>
                clip.id === clipId
                    ? {
                        ...clip,
                        effects: clip.effects?.map((eff) =>
                            eff.id === effectId ? { ...eff, ...updates } : eff
                        ),
                    }
                    : clip
            ),
        }));

        set({ project: { ...project, tracks: newTracks } });
        get().saveHistory();
    },

    undo: () => {
        const { history, historyIndex } = get();
        if (historyIndex > 0) {
            set({
                project: JSON.parse(JSON.stringify(history[historyIndex - 1])),
                historyIndex: historyIndex - 1,
            });
        }
    },

    redo: () => {
        const { history, historyIndex } = get();
        if (historyIndex < history.length - 1) {
            set({
                project: JSON.parse(JSON.stringify(history[historyIndex + 1])),
                historyIndex: historyIndex + 1,
            });
        }
    },
}));
