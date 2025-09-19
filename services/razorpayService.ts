import type { PlanId } from '../types';

interface OrderDetails {
    orderId: string;
    amount: number; // in smallest currency unit (e.g. cents)
    currency: string;
}

/**
 * SIMULATED BACKEND FUNCTION
 * In a real application, this function would make a secure API call to your backend.
 * The backend would then use the Razorpay Node.js SDK and your secret key to create an order.
 * The backend would return the orderId to the frontend.
 *
 * @param amount The amount in the base currency (e.g., 29 for $29)
 * @param currency The currency code (e.g., 'USD')
 * @returns A promise that resolves to the order details.
 */
export const createRazorpayOrder = async (
    amount: number,
    currency: string,
    planId: PlanId
): Promise<OrderDetails> => {
    console.log(`Simulating order creation for plan ${planId} with amount ${amount} ${currency}`);
    // Simulate network delay for creating an order on the backend
    await new Promise(res => setTimeout(res, 750));

    // In a real backend, you'd get a unique order_id from Razorpay.
    // We'll generate a mock one here that looks like a real one.
    const mockOrderId = `order_${Math.random().toString(36).substring(2, 11)}`;

    // Razorpay expects the amount in the smallest currency unit (e.g., cents for USD).
    const amountInSmallestUnit = Math.round(amount * 100);

    console.log(`Mock order created: ${mockOrderId} for ${amountInSmallestUnit} ${currency}`);

    return {
        orderId: mockOrderId,
        amount: amountInSmallestUnit,
        currency,
    };
};