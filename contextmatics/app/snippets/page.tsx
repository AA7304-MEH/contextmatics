import { Metadata } from 'next';
import SnippetsClient from './SnippetsClient';

export const metadata: Metadata = {
    title: 'Snippets Library | ContextMatic',
    description: 'Archive, organize, and repurpose your AI-generated snippets into professional videos.',
};

export default function SnippetsPage() {
    return <SnippetsClient />;
}
