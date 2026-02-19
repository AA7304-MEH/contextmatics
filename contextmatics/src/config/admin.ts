export const ADMIN_EMAILS = [
    'admin@com.com'
];

export const ADMIN_PASSWORD = 'Password@123';

export const isAdminEmail = (email: string | undefined | null): boolean => {
    if (!email) return false;

    // Check against hardcoded list
    if (ADMIN_EMAILS.includes(email)) return true;

    // Check against environment variable if available
    const envAdmins = import.meta.env.VITE_ADMIN_EMAILS;
    if (envAdmins) {
        const envAdminList = envAdmins.split(',').map((e: string) => e.trim());
        if (envAdminList.includes(email)) return true;
    }

    return false;
};
