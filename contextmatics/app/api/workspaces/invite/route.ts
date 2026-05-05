import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits } from '@/lib/api-utils';

async function inviteMemberHandler(req: NextRequest, { user, supabase }:any) {
  try {
    const { email, workspace_id, role } = await req.json();

    if (!email || !workspace_id) {
      return NextResponse.json({ error: 'Email and workspace ID are required' }, { status: 400 });
    }

    // 1. Verify that the current user is owner or admin of the workspace
    const { data: member, error: checkError } = await supabase
      .from('workspace_members')
      .select('role')
      .eq('user_id', user.id)
      .eq('workspace_id', workspace_id)
      .single();

    if (checkError || (member.role !== 'owner' && member.role !== 'admin')) {
      return NextResponse.json({ error: 'Permission denied. Only owners or admins can invite members.' }, { status: 403 });
    }

    // 2. Check if user already exists in the system
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', email)
      .single();

    // 3. Create or Update workspace member record
    const { data: invite, error: inviteError } = await supabase
      .from('workspace_members')
      .upsert({
        workspace_id,
        user_id: existingProfile?.id || null, // null if user doesn't exist yet
        invited_email: email,
        role: role || 'editor',
        status: 'pending'
      }, { onConflict: 'workspace_id, user_id' })
      .select()
      .single();

    if (inviteError) throw inviteError;

    // Optional: Send transactional email logic here
    // For now, we'll return success and the frontend can show a temporary notice.

    return NextResponse.json({ success: true, invite_id: invite.id });
  } catch (error:any) {
    console.error('Workspace invitation error:', error);
    return NextResponse.json({ error: error.message || 'Failed to invite member' }, { status: 500 });
  }
}

export const POST = withAuthAndCredits(inviteMemberHandler, {
  requireCredits: 0,
  actionName: 'Invite Workspace Member'
});
