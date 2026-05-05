import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { videoScriptCore } from '@/lib/ai/video-script-core';

async function videoScriptHandler(req: NextRequest, { deductCredits }: AuthContext) {
    const { topic, style, purpose, targetDuration } = await req.json();

    if (!topic) {
        return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'Topic is required' }, { status: 400 });
    }

    const result = await videoScriptCore(topic, style, purpose, targetDuration);
    
    await deductCredits();
    
    return NextResponse.json({ success: true, data: result }, { status: 200 });
}

export const POST = withAuthAndCredits(videoScriptHandler, { 
    requireCredits: 2, 
    actionName: 'Generate Video Script' 
});
