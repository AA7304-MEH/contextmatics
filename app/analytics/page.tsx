import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Content Analytics',
    description: 'Track your content generation trends, credit usage, and format distribution.',
};

import dynamic from 'next/dynamic';
const AnalyticsClient = dynamic(() => import('./AnalyticsClient'), { ssr: false });

export default function Page() {
    return <AnalyticsClient />;
}
