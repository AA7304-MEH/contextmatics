import type { SubscriptionInfo, PlanId } from '../types';

/**
 * Subscription management service with expiry tracking and renewal reminders
 */
class SubscriptionService {
    private static instance: SubscriptionService;
    private renewalReminders: Map<string, number> = new Map();

    static getInstance(): SubscriptionService {
        if (!SubscriptionService.instance) {
            SubscriptionService.instance = new SubscriptionService();
        }
        return SubscriptionService.instance;
    }

    /**
     * Create subscription for user after successful payment
     */
    createSubscription(userId: string, planId: PlanId): SubscriptionInfo {
        const now = Date.now();
        const subscriptionLength = planId === 'pro' ? 30 : planId === 'business' ? 30 : 0; // days
        const endDate = now + (subscriptionLength * 24 * 60 * 60 * 1000);

        const subscription: SubscriptionInfo = {
            id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
            planId,
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            cancelAtPeriodEnd: false,
            daysUntilExpiry: subscriptionLength,
            autoRenew: true,
        };

        return subscription;
    }

    /**
     * Update subscription after plan change
     */
    updateSubscription(subscription: SubscriptionInfo, newPlanId: PlanId): SubscriptionInfo {
        const now = Date.now();
        const subscriptionLength = newPlanId === 'pro' ? 30 : newPlanId === 'business' ? 30 : 0;
        const endDate = now + (subscriptionLength * 24 * 60 * 60 * 1000);

        const updatedSubscription: SubscriptionInfo = {
            ...subscription,
            planId: newPlanId,
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            daysUntilExpiry: subscriptionLength,
            status: 'active',
        };

        return updatedSubscription;
    }

    /**
     * Cancel subscription
     */
    cancelSubscription(subscription: SubscriptionInfo, cancelAtPeriodEnd: boolean = true): SubscriptionInfo {
        const updatedSubscription: SubscriptionInfo = {
            ...subscription,
            cancelAtPeriodEnd,
            autoRenew: false,
        };

        if (!cancelAtPeriodEnd) {
            updatedSubscription.status = 'cancelled';
        }

        return updatedSubscription;
    }

    /**
     * Renew subscription
     */
    renewSubscription(subscription: SubscriptionInfo): SubscriptionInfo {
        const now = Date.now();
        const subscriptionLength = subscription.planId === 'pro' ? 30 : subscription.planId === 'business' ? 30 : 0;
        const endDate = now + (subscriptionLength * 24 * 60 * 60 * 1000);

        const renewedSubscription: SubscriptionInfo = {
            ...subscription,
            status: 'active',
            currentPeriodStart: now,
            currentPeriodEnd: endDate,
            daysUntilExpiry: subscriptionLength,
            cancelAtPeriodEnd: false,
            autoRenew: true,
        };

        return renewedSubscription;
    }

    /**
     * Check if subscription is expired
     */
    isSubscriptionExpired(subscription: SubscriptionInfo): boolean {
        return Date.now() > subscription.currentPeriodEnd;
    }

    /**
     * Get days until expiry
     */
    getDaysUntilExpiry(subscription: SubscriptionInfo): number {
        const now = Date.now();
        const days = Math.ceil((subscription.currentPeriodEnd - now) / (24 * 60 * 60 * 1000));
        return Math.max(0, days);
    }

    /**
     * Check subscription status and update if necessary
     */
    checkAndUpdateSubscriptionStatus(subscription: SubscriptionInfo): SubscriptionInfo {
        const now = Date.now();

        if (subscription.status === 'active' && now > subscription.currentPeriodEnd) {
            return {
                ...subscription,
                status: 'expired',
                daysUntilExpiry: 0,
            };
        }

        if (subscription.status === 'active' || subscription.status === 'expired') {
            const daysUntilExpiry = this.getDaysUntilExpiry(subscription);
            return {
                ...subscription,
                daysUntilExpiry,
            };
        }

        return subscription;
    }
}

// Export singleton instance
export const subscriptionService = SubscriptionService.getInstance();

/**
 * Utility functions for subscription management
 */
export const createUserSubscription = (userId: string, planId: PlanId): SubscriptionInfo => {
    return subscriptionService.createSubscription(userId, planId);
};

export const updateUserSubscription = (subscription: SubscriptionInfo, newPlanId: PlanId): SubscriptionInfo => {
    return subscriptionService.updateSubscription(subscription, newPlanId);
};

export const cancelUserSubscription = (subscription: SubscriptionInfo, cancelAtPeriodEnd: boolean = true): SubscriptionInfo => {
    return subscriptionService.cancelSubscription(subscription, cancelAtPeriodEnd);
};

export const renewUserSubscription = (subscription: SubscriptionInfo): SubscriptionInfo => {
    return subscriptionService.renewSubscription(subscription);
};

export const checkSubscriptionStatus = (subscription: SubscriptionInfo): SubscriptionInfo => {
    return subscriptionService.checkAndUpdateSubscriptionStatus(subscription);
};