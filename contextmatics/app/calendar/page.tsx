import { Metadata } from 'next';
import CalendarClient from './CalendarClient';
import { VerifiedProtection } from '@/components/VerifiedProtection';

export const metadata: Metadata = {
    title: 'Content Calendar',
    description: 'Schedule and manage your social media posts.',
};

export default function CalendarPage() {
    return (
        <VerifiedProtection>
            <CalendarClient />
        </VerifiedProtection>
    );
}
