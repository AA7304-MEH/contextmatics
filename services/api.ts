import type { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

// This service simulates a backend API and database.
// The fingerprint database is stored in localStorage for persistence across refreshes.

// Simulates a database table that tracks how many accounts are associated with a device fingerprint.
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
 * This function simulates a critical backend security check that would run after a user signs up.
 * 1. It takes the new user's email and country, along with their device visitorId.
 * 2. It checks a simulated database (`fingerprint_db`) for existing accounts with that visitorId.
 * 3. If the count is >= 1, it flags the new user's account for abuse.
 * 4. Otherwise, it creates a new user profile on the standard free plan.
 * The created User object is then returned to be stored by the Auth context.
 */
export const checkAbuseAndCreateUser = async (
    email: string,
    countryCode: string,
    visitorId: string
): Promise<User> => {
    // Simulate network delay for the backend check
    await new Promise(res => setTimeout(res, 500));

    const db = getFingerprintDB();
    const existingCount = db[visitorId] || 0;

    // Abuse check: If this device fingerprint has been seen before, flag the account.
    if (existingCount >= 1) {
        console.warn(`ABUSE DETECTED: Visitor ID ${visitorId} already has ${existingCount} account(s). Marking as abuse.`);
        db[visitorId] = existingCount + 1;
        saveFingerprintDB(db);
        
        return {
            id: uuidv4(),
            email,
            countryCode,
            plan: 'free_abuse',
            processingCredits: 0,
        };
    }

    // No abuse detected. Create a new free user profile.
    console.log(`New user for Visitor ID ${visitorId}. Count: ${existingCount}.`);
    db[visitorId] = existingCount + 1;
    saveFingerprintDB(db);
    
    return {
        id: uuidv4(),
        email,
        countryCode,
        plan: 'free',
        processingCredits: 3, // Start with 3 credits on the free plan
    };
};