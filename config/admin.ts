export const ADMIN_EMAILS = (() => {
    const envAdmins = process.env.NEXT_PUBLIC_ADMIN_EMAILS as string | undefined;
    if (envAdmins) {
        return envAdmins.split(',').map((e: string) => e.trim().toLowerCase());
    }
    return []; // No default admins in production
})();

export const isAdminEmail = (email: string | undefined | null): boolean => {
    if (!email) return false;
    return ADMIN_EMAILS.includes(email.toLowerCase());
};
