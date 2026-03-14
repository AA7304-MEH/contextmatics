export type MediaType = 'video' | 'audio' | 'image' | 'text' | 'sticker';

export interface Resolution {
    width: number;
    height: number;
}

export interface Transform {
    x: number;
    y: number;
    scale: number;
    rotation: number;
    opacity: number;
}

export interface Effect {
    id: string;
    type: string;
    params: Record<string, any>;
    enabled: boolean;
}

export interface TextStyle {
    fontSize: number;
    color: string;
    fontFamily: string;
    textAlign: 'left' | 'center' | 'right';
    backgroundColor?: string;
}

export interface Clip {
    id: string;
    type: MediaType;
    name: string;
    assetId: string;
    url: string;
    start: number; // Start time in seconds on the timeline
    duration: number; // Length in seconds on the timeline
    sourceStart: number; // Start time within the source media
    sourceDuration: number; // Original duration of the source media
    speed: number;
    trackId: string;
    waveform?: number[];
    transforms?: Transform;
    effects?: Effect[];
    textContent?: string;
    textStyle?: TextStyle;
}

export interface Track {
    id: string;
    name: string;
    type: 'video' | 'audio' | 'overlay';
    clips: Clip[];
    muted: boolean;
    locked: boolean;
    volume: number;
}

export interface Project {
    id: string;
    name: string;
    resolution: Resolution;
    fps: number;
    tracks: Track[];
    duration: number;
    updatedAt: number;
}

export interface EditorState {
    project: Project;
    selectedClipId: string | null;
    selectedTrackId: string | null;
    playheadTime: number;
    isPlaying: boolean;
    zoomLevel: number; // pixels per second

    // History for undo/redo
    history: Project[];
    historyIndex: number;
}
