import { NextRequest, NextResponse } from "next/server";
import { withAuthAndCredits, AuthContext } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

async function socialAccountsHandler(_req: NextRequest, { user }: AuthContext) {
    try {
        const ayrshareApiKey = process.env.AYRSHARE_API_KEY;
        if (!ayrshareApiKey) {
            return NextResponse.json({ success: false, code: 'CONFIG_ERROR', message: "Ayrshare API key not configured" }, { status: 500 });
        }

        // We use fetch since the SDK doesn't natively expose user/profile conveniently
        const res = await fetch("https://app.ayrshare.com/api/profiles", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ayrshareApiKey}`,
                "Content-Type": "application/json"
            }
        });

        const data = await res.json();
        
        if (!res.ok) {
            return NextResponse.json({ success: false, code: 'FETCH_REJECTED', message: data.message || "Failed to fetch profiles" }, { status: res.status });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error("Ayrshare get accounts error:", { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'FETCH_FAILED', message: "Failed to fetch social accounts" }, { status: 500 });
    }
}

export const GET = withAuthAndCredits(socialAccountsHandler, {
    actionName: 'Fetch Social Accounts'
});
