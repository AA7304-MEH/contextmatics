import { Metadata } from 'next';
import AnalyticsClient from './AnalyticsClient';

export const metadata: Metadata = {
    title: 'Content Analytics',
    description: 'Track your content generation trends, credit usage, and format distribution.',
};

export default function Page() {
    return <AnalyticsClient />;
}
