import Dexie, { Table } from 'dexie';
import { generateWaveformData } from './waveformGenerator';

export interface MediaAsset {
  id: string;
  name: string;
  type: 'video' | 'audio' | 'image';
  size: number;
  lastModified: number;
  blob: Blob;
  thumbnailUrl?: string;
  waveform?: number[];
  duration?: number;
  width?: number;
  height?: number;
}

class MediaDatabase extends Dexie {
  assets!: Table<MediaAsset>;

  constructor() {
    super('ContextCutDB');
    this.version(1).stores({
      assets: 'id, name, type'
    });
  }
}

export const db = new MediaDatabase();

export const mediaManager = {
  async importFile(file: File): Promise<MediaAsset> {
    const id = crypto.randomUUID();
    const type = file.type.startsWith('video/') ? 'video' :
      file.type.startsWith('audio/') ? 'audio' :
        file.type.startsWith('image/') ? 'image' : 'video'; // Fallback

    let thumbnailUrl: string | undefined;
    let waveform: number[] | undefined;
    let duration: number | undefined;
    let width: number | undefined;
    let height: number | undefined;

    if (type === 'video') {
      const metadata = await this.getVideoMetadata(file);
      duration = metadata.duration;
      width = metadata.width;
      height = metadata.height;
      thumbnailUrl = await this.generateVideoThumbnail(file);
      waveform = await generateWaveformData(file);
    } else if (type === 'audio') {
      duration = await this.getAudioDuration(file);
      waveform = await generateWaveformData(file);
    } else if (type === 'image') {
      const dim = await this.getImageDimensions(file);
      width = dim.width;
      height = dim.height;
      thumbnailUrl = URL.createObjectURL(file);
    }

    const asset: MediaAsset = {
      id,
      name: file.name,
      type,
      size: file.size,
      lastModified: file.lastModified,
      blob: file,
      thumbnailUrl,
      waveform,
      duration,
      width,
      height
    };

    await db.assets.add(asset);
    return asset;
  },

  async getAllAssets(): Promise<MediaAsset[]> {
    return db.assets.toArray();
  },

  async deleteAsset(id: string) {
    const asset = await db.assets.get(id);
    if (asset?.thumbnailUrl && asset.thumbnailUrl.startsWith('blob:')) {
      URL.revokeObjectURL(asset.thumbnailUrl);
    }
    return db.assets.delete(id);
  },

  getVideoMetadata(file: File): Promise<{ duration: number; width: number; height: number }> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.onloadedmetadata = () => {
        resolve({
          duration: video.duration,
          width: video.videoWidth,
          height: video.videoHeight
        });
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    });
  },

  getAudioDuration(file: File): Promise<number> {
    return new Promise((resolve) => {
      const audio = new Audio();
      audio.onloadedmetadata = () => {
        resolve(audio.duration);
        URL.revokeObjectURL(audio.src);
      };
      audio.src = URL.createObjectURL(file);
    });
  },

  getImageDimensions(file: File): Promise<{ width: number; height: number }> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        resolve({ width: img.width, height: img.height });
        URL.revokeObjectURL(img.src);
      };
      img.src = URL.createObjectURL(file);
    });
  },

  generateVideoThumbnail(file: File): Promise<string> {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.onloadeddata = () => {
        video.currentTime = Math.min(1, video.duration / 2);
      };
      video.onseeked = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
        URL.revokeObjectURL(video.src);
      };
      video.src = URL.createObjectURL(file);
    });
  }
};
