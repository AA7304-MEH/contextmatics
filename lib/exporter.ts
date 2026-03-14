"use client";

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Project } from '../types/editor';

class ExportManager {
    private ffmpeg: FFmpeg | null = null;
    private loaded = false;

    async load() {
        if (this.loaded) return;

        this.ffmpeg = new FFmpeg();
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        await this.ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
        });
        this.loaded = true;
    }

    async exportVideo(project: Project, onProgress?: (p: number) => void) {
        if (!this.ffmpeg) await this.load();
        const ffmpeg = this.ffmpeg!;

        ffmpeg.on('progress', ({ progress }) => {
            onProgress?.(progress);
        });

        const videoClips: string[] = [];
        const audioClips: string[] = [];
        const fetchPromises: Promise<void>[] = [];

        // 1. Write source files
        let clipIndex = 0;
        for (const track of project.tracks) {
            for (const clip of track.clips) {
                const fileName = `clip_${clipIndex}_${clip.id}`;
                fetchPromises.push((async () => {
                    const fileData = await fetchFile(clip.url);
                    await ffmpeg.writeFile(fileName, fileData);
                })());

                if (clip.type === 'video' || clip.type === 'image') {
                    videoClips.push(fileName);
                } else if (clip.type === 'audio') {
                    audioClips.push(fileName);
                }
                clipIndex++;
            }
        }
        await Promise.all(fetchPromises);

        // 2. Build filter_complex string
        // Note: This is an advanced implementation that simplifies for the proof of concept
        // In a real app, this would involve precise mapping of [v][a] streams with setpts and amix

        const inputs = project.tracks.flatMap(t => t.clips).map((_, i) => `-i clip_${i}_${project.tracks.flatMap(t => t.clips)[i].id}`);

        // Simple composition: Overlay all video tracks
        // [0:v][1:v]overlay=enable='between(t,start,end)'[v1]; [v1][2:v]overlay...
        let filterStr = "";
        let videoCount = 0;
        const videoInputs = project.tracks.flatMap(t => t.clips).filter(c => c.type === 'video' || c.type === 'image');

        videoInputs.forEach((clip, i) => {
            if (i === 0) {
                filterStr += `[0:v]scale=${project.resolution.width}:${project.resolution.height},setpts=PTS-STARTPTS+${clip.start}/TB[v0];`;
            } else {
                filterStr += `[${i}:v]scale=${project.resolution.width}:${project.resolution.height},setpts=PTS-STARTPTS+${clip.start}/TB[v${i}];`;
                filterStr += `[v${i - 1}][v${i}]overlay=enable='between(t,${clip.start},${clip.start + clip.duration})'[v_out_${i}];`;
            }
            videoCount = i;
        });

        const finalVideoLabel = videoInputs.length > 1 ? `[v_out_${videoCount}]` : `[v0]`;

        // 3. Execute with complex filter
        await ffmpeg.exec([
            ...inputs,
            '-filter_complex', filterStr.endsWith(';') ? filterStr.slice(0, -1) : filterStr,
            '-map', finalVideoLabel,
            '-t', project.duration.toString(),
            '-preset', 'ultrafast',
            'output.mp4'
        ]);

        const data = await ffmpeg.readFile('output.mp4');
        return new Blob([(data as any).buffer], { type: 'video/mp4' });
    }
}

export const exportManager = new ExportManager();
