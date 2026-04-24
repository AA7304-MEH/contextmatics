import { NextRequest, NextResponse } from "next/server";
import { withAuthAndCredits, AuthContext } from "@/lib/api-utils";
import { logger } from "@/lib/logger";

async function socialPublishHandler(req: NextRequest, { deductCredits }: AuthContext) {
    try {
        const body = await req.json();
        const { content, platforms, scheduleDate, mediaUrls } = body;

        if (!content || !platforms || platforms.length === 0) {
            return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: "Missing required fields" }, { status: 400 });
        }

        const ayrshareApiKey = process.env.AYRSHARE_API_KEY;
        if (!ayrshareApiKey) {
            return NextResponse.json({ success: false, code: 'CONFIG_ERROR', message: "Ayrshare API key not configured" }, { status: 500 });
        }

        // 1. Send direct REST request to Ayrshare
        const postData: Record<string, unknown> = {
            post: content,
            platforms: platforms,
        };

        if (scheduleDate) postData.scheduleDate = scheduleDate;
        if (mediaUrls && Array.isArray(mediaUrls) && mediaUrls.length > 0) {
            postData.mediaUrls = mediaUrls;
        }

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
            return NextResponse.json({ 
                success: false, 
                code: 'PUBLISH_REJECTED', 
                message: result.message || "Ayrshare rejected the post" 
            }, { 
                status: response.status || 400 
            });
        }

        // Mandatory: Deduct credits after successful API call
        await deductCredits();

        return NextResponse.json({ success: true, data: { postIds: result.postIds } }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error("Ayrshare publish error:", { error: errorMessage });
        return NextResponse.json({ success: false, code: 'PUBLISH_FAILED', message: "Failed to publish to social platforms" }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(socialPublishHandler, {
    requireCredits: 1, // Deduct 1 credit per publish action
    actionName: 'Publish Social Media'
});
