import { Metadata } from 'next';
import HistoryClient from './HistoryClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
    title: 'Generation History',
    description: 'View and manage all your previously generated content pieces and videos.',
};

export default function Page() {
    return <HistoryClient />;
}
