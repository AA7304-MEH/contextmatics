"use client";

import React, { useEffect, useState } from 'react';
import { Toolbar } from '@/components/Editor/Toolbar';
import { AssetsPanel } from '@/components/Editor/AssetsPanel';
import { PreviewCanvas } from '@/components/Editor/PreviewCanvas';
import { PropertiesPanel } from '@/components/Editor/PropertiesPanel';
import { Timeline } from '@/components/Editor/Timeline';
import { useTimelineStore } from '@/stores/useTimelineStore';
import { useAuth } from '@/context/AuthContext';
import { useParams } from 'next/navigation';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';

export default function StudioPage() {
    const { user } = useAuth();
    const { projectId } = useParams();
    const { 
        loadProject, tracks, clips, duration, zoom, 
        isPlaying, setIsPlaying, selectedClipId, removeClip 
    } = useTimelineStore();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!user || !projectId) return;
        
        const fetchProject = async () => {
            try {
                const response = await fetch(`/api/projects/${projectId}`);
                if (response.ok) {
                    const project = await response.json();
                    loadProject(project.timeline_data);
                }
            } catch (error) {
                console.error("Error loading project", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [user, projectId]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if user is typing in an input or textarea
            if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
                return;
            }

            // Space: Toggle Playback
            if (e.code === 'Space') {
                e.preventDefault();
                setIsPlaying(!isPlaying);
            }

            // Delete / Backspace: Remove selected clip
            if (e.code === 'Delete' || e.code === 'Backspace') {
                if (selectedClipId) {
                    e.preventDefault();
                    removeClip(selectedClipId);
                }
            }

            // Ctrl/Cmd + S: Force save (manual save)
            if ((e.ctrlKey || e.metaKey) && e.code === 'KeyS') {
                e.preventDefault();
                // Auto-save logic handles this normally
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, selectedClipId, setIsPlaying, removeClip]);

    // Auto-save logic
    useEffect(() => {
        if (loading || !projectId) return;

        const timer = setTimeout(async () => {
            try {
                await fetch(`/api/projects/${projectId}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        timeline_data: { tracks, clips, duration, zoom }
                    })
                });
            } catch (error) {
                console.error("Auto-save failed", error);
            }
        }, 5000); // Save after 5 seconds of inactivity

        return () => clearTimeout(timer);
    }, [tracks, clips, duration, zoom, projectId, loading]);

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-zinc-950">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            </div>
        );
    }

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen bg-zinc-950 overflow-hidden text-white font-sans selection:bg-blue-500/30">
                <Toolbar />
                
                <div className="flex-1 flex overflow-hidden">
                    <AssetsPanel />
                    
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <PreviewCanvas />
                        <Timeline />
                    </div>
                    
                    <PropertiesPanel />
                </div>
            </div>
        </DndProvider>
    );
}
