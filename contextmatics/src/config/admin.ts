// Admin configuration
// Set VITE_ADMIN_EMAILS in your environment (comma-separated) for production.
// The hardcoded fallback below is for development only.

const DEV_ADMIN_EMAILS = ['admin@com.com'];

export const ADMIN_EMAILS = (() => {
    const envAdmins = import.meta.env.VITE_ADMIN_EMAILS as string | undefined;
    if (envAdmins) {
        return envAdmins.split(',').map((e: string) => e.trim().toLowerCase());
    }
    return DEV_ADMIN_EMAILS;
})();

export const isAdminEmail = (email: string | undefined | null): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
};
