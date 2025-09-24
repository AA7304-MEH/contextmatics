import React, { useEffect, useRef, useState } from 'react';
import { createPayPalOrder, capturePayPalOrder } from '../services/paypalService';
import { useToast } from '../context/ToastContext';

interface PayPalButtonProps {
    planId: 'pro' | 'business';
    amount: number;
    currency: 'USD' | 'INR';
    onSuccess: (planId: 'pro' | 'business') => void;
    setLoadingPlan: (planId: 'pro' | 'business' | null) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({ planId, amount, currency, onSuccess, setLoadingPlan }) => {
    const paypalRef = useRef<HTMLDivElement>(null);
    const { addToast } = useToast();
    const [isSdkReady, setIsSdkReady] = useState(Boolean(window.paypal));

    useEffect(() => {
        if (!isSdkReady) {
            // A fallback public sandbox Client ID is provided for demonstration purposes.
            const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8iP3mcIHk2-BbL_FXVLW0gM_zS1aN7RzP8o';

            if (!PAYPAL_CLIENT_ID) {
                console.error("PayPal Client ID not found. Please set the PAYPAL_CLIENT_ID environment variable.");
                addToast("Payment gateway (PayPal) is not configured.", "error");
                return;
            }

            const existingScript = document.getElementById('paypal-sdk');
            if (!existingScript) {
                const script = document.createElement('script');
                script.id = 'paypal-sdk';
                script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD&intent=capture&commit=true&disable-funding=card`;
                script.onload = () => {
                    setIsSdkReady(true);
                };
                script.onerror = () => {
                    console.error('Failed to load PayPal SDK script.');
                    addToast('Could not load payment script. Please try refreshing the page.', 'error');
                };
                document.body.appendChild(script);
            } else {
                 // Script is already loading, just check for window.paypal to be available
                 const interval = setInterval(() => {
                    if (window.paypal) {
                        setIsSdkReady(true);
                        clearInterval(interval);
                    }
                }, 100);
                return () => clearInterval(interval);
            }
        }
    }, [isSdkReady, addToast]);

    useEffect(() => {
        if (isSdkReady && paypalRef.current && window.paypal) {
            // To prevent re-rendering issues, clear the container first
            paypalRef.current.innerHTML = ''; 

            window.paypal.Buttons({
                style: {
                    layout: 'vertical',
                    color: 'blue',
                    shape: 'rect',
                    label: 'paypal',
                    height: 44,
                },
                
                createOrder: async () => {
                    setLoadingPlan(planId);
                    try {
                        const orderDetails = await createPayPalOrder(amount, currency);
                        return orderDetails.orderId;
                    } catch (err) {
                        console.error('PayPal createOrder error:', err);
                        // Re-throw the error to let the SDK trigger the centralized onError callback
                        throw err;
                    }
                },
                
                onApprove: async (data: any) => {
                    try {
                        const captureDetails = await capturePayPalOrder(data.orderID);
                        if (captureDetails.status === 'COMPLETED') {
                            onSuccess(planId);
                        } else {
                            throw new Error('Payment was not completed successfully.');
                        }
                    } catch (err) {
                        console.error('PayPal onApprove error:', err);
                        // Re-throw to trigger the centralized onError callback
                        throw err;
                    }
                },
                
                onError: (err: any) => {
                    console.error('PayPal button error:', err);
                    addToast('An error occurred during the PayPal transaction. Please try again.', 'error');
                    setLoadingPlan(null);
                },

                onCancel: () => {
                    addToast('Payment was cancelled.', 'info');
                    setLoadingPlan(null);
                },

            }).render(paypalRef.current);
        }
    }, [isSdkReady, planId, amount, currency, onSuccess, setLoadingPlan, addToast]);

    if (!isSdkReady) {
        const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID || 'AZDxjDScFpQtjWTOUtWKbyN_bDt4OgqaF4eYXlewfBP4-8iP3mcIHk2-BbL_FXVLW0gM_zS1aN7RzP8o';
        return (
             <div className="h-[44px] flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-lg text-center">
                <p className="text-sm text-slate-600 dark:text-slate-300 px-2">
                    {PAYPAL_CLIENT_ID ? 'Loading Payment...' : 'PayPal Not Configured'}
                </p>
            </div>
        );
    }


    return <div ref={paypalRef} aria-label={`Pay with PayPal for ${planId} plan`}></div>;
};

export default PayPalButton;