import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';

async function createWorkspaceHandler(req: NextRequest, { user, supabase }: any) {
  try {
    const { name, brandVoice, brandDescription } = await req.json();

    if (!name) {
      return NextResponse.json({ error: 'Workspace name is required' }, { status: 400 });
    }

    // 1. Create the workspace
    const { data: workspace, error: wsError } = await supabase
      .from('workspaces')
      .insert({
        name,
        owner_id: user.id,
        brand_voice: brandVoice || '',
        brand_description: brandDescription || ''
      })
      .select()
      .single();

    if (wsError) throw wsError;

    // 2. Add creator as 'owner' in workspace_members
    const { error: memberError } = await supabase
      .from('workspace_members')
      .insert({
        workspace_id: workspace.id,
        user_id: user.id,
        role: 'owner',
        status: 'active'
      });

    if (memberError) throw memberError;

    return NextResponse.json(workspace);
  } catch (error: any) {
    console.error('Workspace creation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to create workspace' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(createWorkspaceHandler, {
  requireCredits: 0,
  actionName: 'Create Workspace'
});
