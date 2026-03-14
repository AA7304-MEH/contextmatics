# Admin Access & Credentials

This document outlines how to access the Admin Console and the credentials required.

## 1. Permanent Admin Credentials
The following email address is **permanently** configured as the ONLY Admin in `src/config/admin.ts`:

*   **Email**: `admin@com.com`

Any user logging in with these emails will automatically receive:
*   **Role**: `admin`
*   **Plan**: `enterprise`
*   **Credits**: `999,999` (Unlimited)

## 2. How to Access (Development Mode)
Since the Admin button is hidden from normal users, follow these steps to access it in specific Development/Mock scenarios:

1.  Open your browser to the login page:
    **`http://localhost:3003/sign-in`**
2.  Sign in with email: **`admin@com.com`**
3.  Enter the password: **`contestmatic@admin`**
4.  You will be logged in as `admin@contextmatic.example.com`.

## 3. How to Access (Production / Real Auth)
1.  Go to the login page normally.
2.  Sign In or Sign Up using one of the emails listed above (e.g., `admin@contextmatic.example.com`).
3.  You will automatically be recognized as an admin.

## 4. How to Add New Admins
To grant admin access to a new user permanently:
1.  Open `src/config/admin.ts`.
2.  Add the new email string to the `ADMIN_EMAILS` array.
    ```typescript
    export const ADMIN_EMAILS = [
        'admin@contextmatic.example.com',
        'your-email@example.com' // <-- Add here
    ];
    ```
3.  Alternatively, set the `VITE_ADMIN_EMAILS` environment variable with a comma-separated list of emails.
