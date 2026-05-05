// Updated to fix Vercel deployment email match
import { Suspense } from "react";
import { CursorLandingPage } from "@/components/CursorLandingPage";

export const dynamic = 'force-dynamic';

export default async function Home() {
    return (
        <main>
            <CursorLandingPage />
        </main>
    );
}
