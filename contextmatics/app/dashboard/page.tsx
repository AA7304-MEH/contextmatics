import { Metadata } from 'next';
import DashboardClient from './DashboardClient';

export const metadata: Metadata = {
    title: 'User Dashboard',
    description: 'Manage your AI content generations, view analytics, and access quick tools.',
};

import { VerifiedProtection } from '@/components/VerifiedProtection';

export default function Page() {
    return (
        <VerifiedProtection>
            <DashboardClient />
        </VerifiedProtection>
    );
}
