"use client";

import { Project, Clip } from '../types/editor';

class AudioMixer {
    private context: AudioContext | null = null;
    private nodes: Map<string, AudioBufferSourceNode> = new Map();
    private gainNodes: Map<string, GainNode> = new Map();
    private masterGain: GainNode | null = null;

    constructor() {
        if (typeof window !== 'undefined') {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
        }
    }

    async play(project: Project, playheadTime: number) {
        if (!this.context) return;
        if (this.context.state === 'suspended') await this.context.resume();

        this.stopAll();

        for (const track of project.tracks) {
            if (track.muted) continue;

            for (const clip of track.clips) {
                if (clip.type === 'audio' || clip.type === 'video') {
                    // Check if clip is active
                    if (playheadTime >= clip.start && playheadTime < clip.start + clip.duration) {
                        await this.playClip(clip, track.volume, playheadTime);
                    }
                }
            }
        }
    }

    private async playClip(clip: Clip, trackVolume: number, playheadTime: number) {
        if (!this.context || !this.masterGain) return;

        try {
            const response = await fetch(clip.url);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await this.context.decodeAudioData(arrayBuffer);

            const source = this.context.createBufferSource();
            source.buffer = audioBuffer;

            const gain = this.context.createGain();
            gain.gain.value = trackVolume; // Simplified clip volume

            source.connect(gain);
            gain.connect(this.masterGain);

            const offset = (playheadTime - clip.start) * clip.speed + clip.sourceStart;
            const duration = clip.duration - (playheadTime - clip.start);

            source.start(0, offset, duration);

            this.nodes.set(clip.id, source);
            this.gainNodes.set(clip.id, gain);
        } catch (e) {
            console.error('Failed to play clip audio', e);
        }
    }

    stopAll() {
        this.nodes.forEach(node => {
            try { node.stop(); } catch (e) { }
        });
        this.nodes.clear();
        this.gainNodes.clear();
    }

    setVolume(volume: number) {
        if (this.masterGain) {
            this.masterGain.gain.value = volume;
        }
    }
}

export const audioMixer = new AudioMixer();
