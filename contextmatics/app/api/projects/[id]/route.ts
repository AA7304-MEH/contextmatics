import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext, ApiHandler } from '@/lib/api-utils';
import { logger } from '@/lib/logger';

/**
 * GET: Fetch a single project
 */
async function getProjectHandler(_req: NextRequest, { user, supabase, params }: AuthContext & { params: { id: string } }): Promise<NextResponse<any>> {
    try {
        const { id } = params;

        const { data, error } = await supabase
            .from('projects')
            .select('*')
            .eq('id', id)
            .eq('user_id', user.id)
            .single();

        if (error) throw error;
        
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('GET project failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'FETCH_FAILED', message: errorMessage }, { status: 500 });
    }
}

/**
 * PATCH: Update a project
 */
async function patchProjectHandler(req: NextRequest, { user, supabase, params }: AuthContext & { params: { id: string } }): Promise<NextResponse<any>> {
    try {
        const { id } = params;
        const body = await req.json();
        const { title, description, timeline_data, status, thumbnail_url } = body;

        const { data, error } = await supabase
            .from('projects')
            .update({
                title,
                description,
                timeline_data,
                status,
                thumbnail_url,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .eq('user_id', user.id)
            .select()
            .single();

        if (error) throw error;
        
        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('PATCH project failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'UPDATE_FAILED', message: errorMessage }, { status: 500 });
    }
}

/**
 * DELETE: Remove a project
 */
async function deleteProjectHandler(_req: NextRequest, { user, supabase, params }: AuthContext & { params: { id: string } }): Promise<NextResponse<any>> {
    try {
        const { id } = params;

        const { error } = await supabase
            .from('projects')
            .delete()
            .eq('id', id)
            .eq('user_id', user.id);

        if (error) throw error;
        
        return NextResponse.json({ success: true, message: 'Project deleted' }, { status: 200 });
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        logger.error('DELETE project failed', { userId: user.id, error: errorMessage });
        return NextResponse.json({ success: false, code: 'DELETE_FAILED', message: errorMessage }, { status: 500 });
    }
}

export const GET = withAuthAndCredits(getProjectHandler as any as ApiHandler, { actionName: 'Fetch Project' });
export const PATCH = withAuthAndCredits(patchProjectHandler as any as ApiHandler, { actionName: 'Update Project' });
export const DELETE = withAuthAndCredits(deleteProjectHandler as any as ApiHandler, { actionName: 'Delete Project' });
