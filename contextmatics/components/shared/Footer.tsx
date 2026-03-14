import React from 'react';

export const Footer: React.FC = () => {
    return (
        <footer className="border-t border-white/5 py-20 bg-background-primary text-sm">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 text-text-secondary">
                <div className="md:col-span-2">
                    <div className="text-white font-bold text-lg mb-4">ContextMatic</div>
                    <p className="max-w-xs leading-relaxed">The AI workspace for the next generation of creators. Built by engineers for engineers.</p>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Product</h4>
                    <ul className="space-y-3">
                        <li><a href="/#features" className="hover:text-white transition-colors">Features</a></li>
                        <li><a href="/pricing" className="hover:text-white transition-colors">Pricing</a></li>
                        <li><a href="/templates" className="hover:text-white transition-colors">Templates</a></li>
                    </ul>
                </div>
                <div>
                    <h4 className="text-white font-semibold mb-4">Company</h4>
                    <ul className="space-y-3">
                        <li><a href="/privacy" className="hover:text-white transition-colors">Privacy</a></li>
                        <li><a href="/terms" className="hover:text-white transition-colors">Terms</a></li>
                        <li><a href="mailto:support@contextmatic.com" className="hover:text-white transition-colors">Support</a></li>
                    </ul>
                </div>
            </div>
        </footer>
    );
};

