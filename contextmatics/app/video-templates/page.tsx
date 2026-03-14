import { Metadata } from 'next';
import VideoTemplatesLibrary from '@/components/VideoTemplatesLibrary';

export const metadata: Metadata = {
    title: 'Video Templates | ContextMatic',
    description: 'Professional video templates for TikTok, Reels, and YouTube.',
};

export default function Page() {
    return <VideoTemplatesLibrary />;
}
