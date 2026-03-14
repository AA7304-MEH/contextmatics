'use client';

import { useEffect } from 'react';
import { driver } from 'driver.js';
import 'driver.js/dist/driver.css';

export default function OnboardingTour() {
    useEffect(() => {
        const hasSeenTour = localStorage.getItem('contextmatic_tour_completed');

        if (!hasSeenTour) {
            const driverObj = driver({
                showProgress: true,
                steps: [
                    {
                        element: '#nav-logo',
                        popover: {
                            title: 'Welcome to ContextMatic!',
                            description: 'This is where you can quickly navigate between your projects and tools.',
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: '#nav-video-templates',
                        popover: {
                            title: 'Start with Templates',
                            description: 'Skip the blank canvas. Pick a professional template to get started instantly.',
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: '#nav-video-generator',
                        popover: {
                            title: 'AI Video Creation',
                            description: 'Already have a script or blog? Paste it here and let our AI do the heavy lifting.',
                            side: "bottom",
                            align: 'start'
                        }
                    },
                    {
                        element: '#nav-video-editor',
                        popover: {
                            title: 'Professional Editor',
                            description: 'Fine-tune every frame, add effects, and export high-quality videos.',
                            side: "bottom",
                            align: 'start'
                        }
                    },
                ],
                onDestroyStarted: () => {
                    localStorage.setItem('contextmatic_tour_completed', 'true');
                    driverObj.destroy();
                }
            });

            // Start the tour after a brief delay
            setTimeout(() => {
                driverObj.drive();
            }, 2000);
        }
    }, []);

    return null;
}
