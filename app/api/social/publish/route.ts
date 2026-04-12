import { NextRequest, NextResponse } from "next/server";
import { withAuthAndCredits } from "@/lib/api-utils";

async function socialPublishHandler(req: NextRequest, { deductCredits }: any) {
    try {
        const body = await req.json();
        const { content, platforms, scheduleDate, mediaUrls } = body;

        if (!content || !platforms || platforms.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const ayrshareApiKey = process.env.AYRSHARE_API_KEY;
        if (!ayrshareApiKey) {
            return NextResponse.json({ error: "Ayrshare API key not configured" }, { status: 500 });
        }

        // 1. Send direct REST request to Ayrshare
        const postData: any = {
            post: content,
            platforms: platforms,
        };

        if (scheduleDate) postData.scheduleDate = scheduleDate;
        if (mediaUrls && mediaUrls.length > 0) postData.mediaUrls = mediaUrls;

        const response = await fetch("https://api.ayrshare.com/api/post", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${ayrshareApiKey}`
            },
            body: JSON.stringify(postData)
        });

        const result = await response.json();
        
        if (!response.ok || result.status === 'error') {
            return NextResponse.json({ error: result.message || "Ayrshare rejected the post" }, { status: response.status || 400 });
        }

        // Mandatory: Deduct credits after successful API call
        await deductCredits();

        return NextResponse.json({ success: true, postIds: result.postIds });
    } catch (error: any) {
        console.error("Ayrshare publish error:", error);
        return NextResponse.json({ error: "Failed to publish to social platforms" }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(socialPublishHandler, {
    requireCredits: 1, // Deduct 1 credit per publish action
    actionName: 'Publish Social Media'
});
