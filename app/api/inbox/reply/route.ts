import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext, ApiHandler } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { SocialInboxItem } from '@/types/database';

async function inboxReplyHandler(req: NextRequest, { user, supabase, deductCredits }: AuthContext) {
    const route = '/api/inbox/reply';
    try {
        const { id, replyContent } = await req.json();

        if (!id || !replyContent) {
            return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'ID and reply content are required' }, { status: 400 });
        }

        // 1. Fetch item to get metadata and platform
        const { data: itemData, error: fetchError } = await supabase
            .from('social_inbox')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (fetchError || !itemData) {
            return NextResponse.json({ success: false, code: 'NOT_FOUND', message: 'Inquiry not found' }, { status: 404 });
        }

        const item = itemData as SocialInboxItem;

        // 2. Trigger Ayrshare/Platform Reply
        const response = await fetch('https://app.ayrshare.com/api/comments/reply', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.AYRSHARE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                commentId: item.comment_id,
                text: replyContent
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            logger.error({ route, message: 'Ayrshare reply failed', userId: user.id, data: { errorData, itemId: id } });
            return NextResponse.json({ success: false, code: 'PLATFORM_REPLY_FAILED', message: 'Failed to send reply to social platform' }, { status: 502 });
        }

        logger.info({ route, message: `Sent reply to ${item.platform}`, userId: user.id, data: { itemId: id } });

        // 3. Mark as Replied
        const { data: updatedItem, error: updateError } = await supabase
            .from('social_inbox')
            .update({ 
                status: 'replied', 
                replied_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (updateError) throw updateError;

        // 4. Deduct Credits
        await deductCredits();

        return NextResponse.json({ success: true, data: updatedItem as SocialInboxItem }, { status: 200 });

    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error({ route, message: 'Inbox reply failed', userId: user.id, data: { error: errorMessage } });
        return NextResponse.json({ success: false, code: 'REPLY_FAILED', message: errorMessage }, { status: 500 });
    }
}

export const POST = withAuthAndCredits(inboxReplyHandler as ApiHandler, {
    requireCredits: 1,
    actionName: 'Audience Inbox Reply'
});
