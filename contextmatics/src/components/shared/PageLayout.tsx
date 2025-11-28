import React, { ReactNode } from 'react';
import { GradientOrbs } from './GradientOrbs';
import { ModernNav } from './ModernNav';

interface PageLayoutProps {
    children: ReactNode;
    showPricing?: boolean;
    showSettings?: boolean;
    showHistory?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({
    children,
    showPricing = true,
    showSettings = false,
    showHistory = false
}) => {
    return (
        <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', color: '#111827', position: 'relative' }}>
            <GradientOrbs />
            <ModernNav showPricing={showPricing} showSettings={showSettings} showHistory={showHistory} />
            <div style={{ paddingTop: '8rem', paddingBottom: '3rem', position: 'relative', zIndex: 10 }}>
                {children}
            </div>
        </div>
    );
};

export default PageLayout;
