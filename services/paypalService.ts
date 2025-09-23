// --- SIMULATED BACKEND SERVICE FOR PAYPAL ---

interface OrderDetails {
    orderId: string;
}

interface CaptureDetails {
    status: 'COMPLETED';
}

/**
 * SIMULATED `create-order` BACKEND FUNCTION
 * In a real application, this function would make a secure API call to your backend server.
 * The backend would then use the PayPal REST API and your **SECRET KEY** to create an order
 * with the specified amount. It's critical that the secret key is never exposed on the frontend.
 * The server would then return the `orderID` to the frontend to be used by the PayPal SDK.
 *
 * @param amount - The amount in the base currency (e.g., 29.00 for $29.00).
 * @param currency - The currency code (e.g., 'USD').
 * @returns A promise that resolves to the order details containing the orderId.
 */
export const createPayPalOrder = async (
    amount: number,
    currency: string
): Promise<OrderDetails> => {
    console.log(`[PayPal Service] Simulating backend call to create order for ${amount} ${currency}`);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 800));

    // This is a mock Order ID. In a real scenario, this ID would be returned from the PayPal API.
    const mockOrderId = `PAYPAL_ORDER_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    console.log(`[PayPal Service] Mock order created with ID: ${mockOrderId}`);

    return { orderId: mockOrderId };
};

/**
 * SIMULATED `capture-order` BACKEND FUNCTION
 * In a real application, after the user approves the payment in the PayPal popup, the `orderID`
 * is sent to your backend. The backend then makes a secure API call to PayPal's `/v2/checkout/orders/{id}/capture`
 * endpoint using your **SECRET KEY** to finalize the transaction.
 *
 * Your server should then:
 * 1. Verify the captured amount matches the plan price.
 * 2. Update the user's plan in your database.
 * 3. Return a success message to the frontend.
 *
 * @param orderId - The ID of the order to capture.
 * @returns A promise that resolves to the capture details.
 */
export const capturePayPalOrder = async (orderId: string): Promise<CaptureDetails> => {
    console.log(`[PayPal Service] Simulating backend call to CAPTURE order with ID: ${orderId}`);
    // Simulate network delay
    await new Promise(res => setTimeout(res, 1200));

    console.log(`[PayPal Service] Successfully captured payment for ${orderId}.`);

    return { status: 'COMPLETED' };
};
