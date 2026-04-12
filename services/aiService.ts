import { Scene } from './facelessGenerator';
import { videoScriptCore } from '@/app/api/ai/video-script/route';
import { replicateEngine } from './replicateEngine';
import { env } from '../config/env';
import { v4 as uuidv4 } from 'uuid';

export interface GeneratedVideoProject {
    projectId: string;
    title: string;
    clips: any[];
}

class AIService {
    private static instance: AIService;

    static getInstance(): AIService {
        if (!AIService.instance) {
            AIService.instance = new AIService();
        }
        return AIService.instance;
    }

    /**
     * The master flow: Topic -> Script -> Visual Assets -> Project
     */
    async generateFullVideoProject(supabase: any, userId: string, topic: string, style: string): Promise<GeneratedVideoProject> {

        // 1. Generate Script using unified AI core
        const script = await videoScriptCore(topic, style, 'engagement', 30);
        const scenes = script.scenes;

        // 2. Process Scenes to generate/fetch assets
        const clips: any[] = [];
        let currentTime = 0;
        const mainTrackId = 'video-track-1';

        for (const scene of scenes) {
            // In a real-world app, we would call Replicate here for each scene.
            let assetUrl = '';
            
            if (env.REPLICATE_API_TOKEN && env.REPLICATE_API_TOKEN.length > 10) {
                try {
                    const gen = await replicateEngine.generateRealVideo({
                        prompt: scene.visualDescription,
                        style,
                        userId,
                        platform: 'shorts'
                    }, env.REPLICATE_API_TOKEN);
                    
                    assetUrl = this.getStockVideoForScene(scene); // Fallback to stock for immediate UI response
                } catch (e) {
                    assetUrl = this.getStockVideoForScene(scene);
                }
            } else {
                assetUrl = this.getStockVideoForScene(scene);
            }

            const clipId = uuidv4();
            clips.push({
                id: clipId,
                assetId: 'ai-gen-' + clipId.slice(0, 8),
                trackId: mainTrackId,
                name: `Scene: ${scene.text.slice(0, 20)}...`,
                type: 'video',
                url: assetUrl,
                startTime: currentTime,
                duration: scene.duration,
                startOffset: 0,
                layer: 1,
                textConfig: {
                    fontSize: 48,
                    color: '#ffffff',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    fontWeight: 'bold',
                    alignment: 'center'
                }
            });

            currentTime += scene.duration;
        }

        // 3. Create Project in Supabase
        const { data: project, error } = await supabase
            .from('projects')
            .insert({
                user_id: userId,
                title: script.title,
                timeline_data: {
                    tracks: [
                        { id: mainTrackId, type: 'video', name: 'Main Video', order: 0 }
                    ],
                    clips: clips,
                    duration: currentTime,
                    zoom: 1
                },
                status: 'draft'
            })
            .select()
            .single();

        if (error) {
            console.error('[AIService] Project insertion failed:', error.message);
            if (error.message.includes('not found')) {
                throw new Error("CRITICAL: The 'projects' table is missing in your Supabase database. Please run the SQL in schema.sql to fix this.");
            }
            throw error;
        }

        return {
            projectId: project.id,
            title: project.title,
            clips
        };
    }

    private getStockVideoForScene(scene: Scene): string {
        const desc = scene.visualDescription.toLowerCase();
        const text = scene.text.toLowerCase();

        // High-Quality Stock Fallbacks (Stable Cloudinary Samples)
        if (desc.includes('nature') || desc.includes('mountain') || text.includes('adventure')) {
            return "https://res.cloudinary.com/demo/video/upload/v1/samples/sea-turtle.mp4";
        }
        if (desc.includes('tech') || desc.includes('city') || text.includes('future') || text.includes('ai') || desc.includes('modern')) {
            return "https://res.cloudinary.com/demo/video/upload/v1/samples/cld-sample-video.mp4";
        }
        if (desc.includes('horror') || desc.includes('shadow') || text.includes('scary') || desc.includes('dark')) {
            return "https://res.cloudinary.com/demo/video/upload/v1/samples/elephants.mp4"; 
        }
        
        return "https://res.cloudinary.com/demo/video/upload/v1/samples/sea-turtle.mp4";
    }
}

export const aiService = AIService.getInstance();
