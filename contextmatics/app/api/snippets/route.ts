import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { Snippet } from '@/types/database';

/**
 * GET: Fetch all snippets for the user
 */
async function getSnippetsHandler(_request: NextRequest, { user, supabase }: AuthContext) {
    try {
        const { data, error } = await supabase
            .from('snippets')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false });

        if (error) throw error;
        
        return NextResponse.json({ success: true, data: data as Snippet[] }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('GET snippets failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'FETCH_FAILED', message: errorMessage }, { status: 500 });
    }
}

/**
 * POST: Create a new snippet
 */
async function postSnippetHandler(req: NextRequest, { user, supabase }: AuthContext) {
    try {
        const body = await req.json();
        const { content, title, tags, platform, content_type, language } = body;

        if (!content) {
            return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'Content is required' }, { status: 400 });
        }

        const { data, error } = await supabase
            .from('snippets')
            .insert({
                user_id: user.id,
                content,
                title,
                tags: tags || [],
                platform: platform || 'general',
                content_type: content_type || 'post',
                language: language || 'english',
                credits_used: 0
            })
            .select()
            .single();

        if (error) throw error;

        return NextResponse.json({ success: true, data: data as Snippet }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('POST snippet failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'CREATE_FAILED', message: errorMessage }, { status: 500 });
    }
}

export const GET = withAuthAndCredits(getSnippetsHandler, { 
    actionName: 'Fetch Snippets', 
    requireAuth: true 
});

export const POST = withAuthAndCredits(postSnippetHandler, { 
    actionName: 'Create Snippet', 
    requireAuth: true 
});
