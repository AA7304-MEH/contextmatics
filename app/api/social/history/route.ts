import { NextRequest, NextResponse } from "next/server";
import { withAuthAndCredits } from "@/lib/api-utils";

async function socialHistoryHandler(req: NextRequest) {
    try {
        const ayrshareApiKey = process.env.AYRSHARE_API_KEY;
        if (!ayrshareApiKey) {
            return NextResponse.json({ error: "Ayrshare API key not configured" }, { status: 500 });
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

        return NextResponse.json(history);
    } catch (error: any) {
        console.error("Ayrshare get history error:", error);
        return NextResponse.json({ error: "Failed to fetch social history" }, { status: 500 });
    }
}

export const GET = withAuthAndCredits(socialHistoryHandler, {
    actionName: 'Fetch Social History',
    requireCredits: 0
});
