import { Metadata } from 'next';
import PricingClient from './PricingClient';

export const metadata: Metadata = {
    title: 'Pricing Plans',
    description: 'Simple, transparent pricing for creators. Choose the plan that fits your content generation needs.',
};

export default function Page() {
    return <PricingClient />;
}
