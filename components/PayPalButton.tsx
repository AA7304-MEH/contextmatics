import React, { useEffect, useRef } from 'react';
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

    useEffect(() => {
        if (paypalRef.current && window.paypal) {
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
    }, [planId, amount, currency, onSuccess, setLoadingPlan, addToast]); // Re-render if key details change

    return <div ref={paypalRef} aria-label={`Pay with PayPal for ${planId} plan`}></div>;
};

export default PayPalButton;
