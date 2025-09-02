
import type { User } from '../types';

// This service simulates a backend API and database (Supabase).
// The fingerprint database is stored in localStorage for persistence across refreshes.

const mockUUID = () => `user_${Math.random().toString(36).substring(2, 15)}`;

// Simulates the 'profiles' table in Supabase.
const getFingerprintDB = (): Record<string, number> => {
    try {
        const db = localStorage.getItem('fingerprint_db');
        return db ? JSON.parse(db) : {};
    } catch (e) {
        return {};
    }
};

const saveFingerprintDB = (db: Record<string, number>) => {
    localStorage.setItem('fingerprint_db', JSON.stringify(db));
};

/**
 * This function simulates the Clerk webhook handler.
 * It's the most critical security function.
 * 1. It gets the visitorId from the sign-up request.
 * 2. It checks a simulated Supabase table (`fingerprint_db`) for existing accounts with that ID.
 * 3. If the count is >= 1, it flags the account for abuse.
 * 4. Otherwise, it creates a new user on the free plan.
 */
export const checkAbuseAndCreateUser = async (
    email: string,
    countryCode: string,
    visitorId: string
): Promise<User> => {
    // Simulate network delay
    await new Promise(res => setTimeout(res, 500));

    const db = getFingerprintDB();
    const existingCount = db[visitorId] || 0;

    // Abuse check for creating multiple free accounts
    if (existingCount >= 1) {
        console.warn(`ABUSE DETECTED: Visitor ID ${visitorId} already has ${existingCount} account(s). Marking as abuse.`);
        db[visitorId] = existingCount + 1;
        saveFingerprintDB(db);
        
        return {
            id: mockUUID(),
            email,
            countryCode,
            plan: 'free_abuse',
            processingCredits: 0,
        };
    }

    // No abuse, create a new free user.
    console.log(`New user for Visitor ID ${visitorId}. Count: ${existingCount}.`);
    db[visitorId] = existingCount + 1;
    saveFingerprintDB(db);
    
    return {
        id: mockUUID(),
        email,
        countryCode,
        plan: 'free',
        processingCredits: 3, // Start with 3 credits on the free plan
    };
};