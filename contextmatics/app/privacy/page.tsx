"use client";

import React from 'react';
import { ModernNav } from '@/components/shared/ModernNav';
import { Footer } from '@/components/shared/Footer';

export default function PrivacyPage() {
    return (
        <div className="bg-background-primary min-h-screen text-text-primary">
            <ModernNav />
            <main className="container mx-auto px-6 py-32 max-w-4xl">
                <h1 className="text-4xl font-bold mb-8 text-white">Privacy Policy</h1>
                <p className="text-text-secondary mb-6 italic">Last updated: March 06, 2026</p>

                <section className="space-y-8 prose prose-invert max-w-none">
                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">1. Information We Collect</h2>
                        <p className="text-text-secondary">
                            We collect information you provide directly to us, such as when you create an account, generate AI content, or contact support. This includes your email address, name, and any content you upload for processing.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">2. How We Use Your Information</h2>
                        <p className="text-text-secondary">
                            We use the information we collect to provide, maintain, and improve our services, including the AI content generation features. We also use it to communicate with you about your account and security updates.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">3. Data Sharing & Security</h2>
                        <p className="text-text-secondary">
                            We do not sell your personal information. We share data only with trusted service providers (like Google Gemini and OpenAI) necessary for delivering our AI services. We implement industry-standard security measures to protect your data.
                        </p>
                    </div>

                    <div>
                        <h2 className="text-2xl font-semibold text-white mb-4">4. Your Rights</h2>
                        <p className="text-text-secondary">
                            You have the right to access, update, or delete your personal information at any time through your account settings or by contacting our support team.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
