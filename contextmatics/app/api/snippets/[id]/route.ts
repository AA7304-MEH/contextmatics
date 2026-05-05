import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext, ApiHandler } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { Snippet } from '@/types/database';

/**
 * PATCH: Update a snippet
 */
async function patchSnippetHandler(req: NextRequest, { user, supabase, params }: AuthContext & { params: { id: string } }) {
    try {
        const { id } = params;
        const body = await req.json();
        const { title, content, tags, platform, content_type, language } = body;

        const { data, error } = await supabase
            .from('snippets')
            .update({
                title,
                content,
                tags: tags || [],
                platform,
                content_type,
                language,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        
        return NextResponse.json({ success: true, data: data as Snippet }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('PATCH snippet failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'UPDATE_FAILED', message: errorMessage }, { status: 500 });
    }
}

/**
 * DELETE: Remove a snippet
 */
async function deleteSnippetHandler(_req: NextRequest, { user, supabase, params }: AuthContext & { params: { id: string } }) {
    try {
        const { id } = params;

        const { error } = await supabase
            .from('snippets')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
        
        return NextResponse.json({ success: true, message: 'Snippet deleted' }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('DELETE snippet failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'DELETE_FAILED', message: errorMessage }, { status: 500 });
    }
}

export const PATCH = withAuthAndCredits(patchSnippetHandler as any as ApiHandler, { actionName: 'Update Snippet' });
export const DELETE = withAuthAndCredits(deleteSnippetHandler as any as ApiHandler, { actionName: 'Delete Snippet' });
