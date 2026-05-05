import { NextRequest, NextResponse } from "next/server";
import { withAuthAndCredits, AuthContext } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

async function socialHistoryHandler(_req: NextRequest, { user }: AuthContext) {
    try {
        const ayrshareApiKey = process.env.AYRSHARE_API_KEY;
        if (!ayrshareApiKey) {
            return NextResponse.json({ success: false, code: 'CONFIG_ERROR', message: "Ayrshare API key not configured" }, { status: 500 });
        }

        // 1. Fetch history directly via REST API
        const response = await fetch("https://api.ayrshare.com/api/history", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${ayrshareApiKey}`
            }
        });

        const history = await response.json();

        if (!response.ok) {
            throw new Error(history.message || "Failed to fetch history from Ayrshare");
        }

        return NextResponse.json({ success: true, data: history }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error("Ayrshare get history error:", { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'FETCH_FAILED', message: "Failed to fetch social history" }, { status: 500 });
    }
}

export const GET = withAuthAndCredits(socialHistoryHandler, {
    actionName: 'Fetch Social History',
    requireCredits: 0
});
