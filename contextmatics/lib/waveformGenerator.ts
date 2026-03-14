"use client";

export async function generateWaveformData(blob: Blob, samples = 100): Promise<number[]> {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const arrayBuffer = await blob.arrayBuffer();

    try {
        const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        const channelData = audioBuffer.getChannelData(0);
        const blockSize = Math.floor(channelData.length / samples);
        const waveform = [];

        for (let i = 0; i < samples; i++) {
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum += Math.abs(channelData[i * blockSize + j]);
            }
            waveform.push(sum / blockSize);
        }

        // Normalize
        const multiplier = Math.pow(Math.max(...waveform), -1);
        return waveform.map(n => n * multiplier);
    } catch (e) {
        console.error('Failed to decode audio for waveform', e);
        return new Array(samples).fill(0);
    } finally {
        audioContext.close();
    }
}
