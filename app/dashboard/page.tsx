import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'User Dashboard',
    description: 'Manage your AI content generations, view analytics, and access quick tools.',
};

import { VerifiedProtection } from '@/components/VerifiedProtection';

import dynamic from 'next/dynamic';
const DashboardClient = dynamic(() => import('./DashboardClient'), { ssr: false });

export default function Page() {
    return (
        <VerifiedProtection>
            <DashboardClient />
        </VerifiedProtection>
    );
}
