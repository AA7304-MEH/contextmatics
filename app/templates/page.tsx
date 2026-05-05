import { Metadata } from 'next';
import TemplatesClient from './TemplatesClient';

export const metadata: Metadata = {
    title: 'Template Library',
    description: 'Browse pre-built AI prompts for social media, blogs, emails, and more.',
};

export default function Page() {
    return <TemplatesClient />;
}
