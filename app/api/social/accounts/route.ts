import { NextRequest, NextResponse } from "next/server";
import { withAuthAndCredits } from "@/lib/api-utils";

async function socialAccountsHandler(req: NextRequest) {
    try {
        const ayrshareApiKey = process.env.AYRSHARE_API_KEY;
        if (!ayrshareApiKey) {
            return NextResponse.json({ error: "Ayrshare API key not configured" }, { status: 500 });
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
            return NextResponse.json({ error: data.message || "Failed to fetch profiles" }, { status: res.status });
        }

        return NextResponse.json(data);
    } catch (error: any) {
        console.error("Ayrshare get accounts error:", error);
        return NextResponse.json({ error: "Failed to fetch social accounts" }, { status: 500 });
    }
}

export const GET = withAuthAndCredits(socialAccountsHandler, {
    actionName: 'Fetch Social Accounts'
});
