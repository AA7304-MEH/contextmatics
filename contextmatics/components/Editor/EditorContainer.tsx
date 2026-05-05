"use client";

import React, { useState } from 'react';
import { useProjectStore } from '../../stores/projectStore';
import Sidebar from './Sidebar';
import PreviewCanvas from './Preview/PreviewCanvas';
import TimelineContainer from './Timeline/TimelineContainer';
import Header from './Header';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import PropertiesPanel from './Panels/PropertiesPanel';
import { exportManager } from '../../lib/exporter';

const EditorContainer: React.FC = () => {
    const { project, undo, redo } = useProjectStore();
    const [isExporting, setIsExporting] = useState(false);

    useKeyboardShortcuts();

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const blob = await exportManager.exportVideo(project);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `${project.name}.mp4`;
            a.click();
            URL.revokeObjectURL(url);
        } catch (e) {
            console.error('Export failed', e);
            alert('Export failed. Check console for details.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <DndProvider backend={HTML5Backend}>
            <div className="flex flex-col h-screen bg-[#121212] text-white overflow-hidden font-sans">
                <Header
                    project={project}
                    undo={undo}
                    redo={redo}
                    onExport={handleExport}
                    isExporting={isExporting}
                />

                <div className="flex flex-1 overflow-hidden">
                    <Sidebar />

                    <div className="flex flex-col flex-1 overflow-hidden">
                        <div className="flex-1 relative bg-black flex items-center justify-center p-8">
                            <PreviewCanvas />
                        </div>

                        <TimelineContainer />
                    </div>

                    <PropertiesPanel />
                </div>
            </div>
        </DndProvider>
    );
};

export default EditorContainer;
