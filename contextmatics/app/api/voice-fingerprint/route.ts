import { NextRequest, NextResponse } from 'next/server';
import { withAuthAndCredits, AuthContext } from '@/lib/api-utils';
import { logger } from '@/lib/logger';
import { VoiceFingerprint } from '@/types/database';

/**
 * GET: List all fingerprints for the user
 */
async function getFingerprintsHandler(_request: NextRequest, { user, supabase }: AuthContext) {
  try {
    const { data, error } = await supabase
      .from('voice_fingerprints')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ success: true, data: data as VoiceFingerprint[] }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('GET voice-fingerprint failed', { userId: user.id, error: errorMessage });
    return NextResponse.json({ success: false, code: 'FETCH_FAILED', message: errorMessage }, { status: 500 });
  }
}

/**
 * PATCH: Set a fingerprint as active
 */
async function patchFingerprintHandler(request: NextRequest, { user, supabase }: AuthContext) {
  try {
    const { id, is_active } = await request.json();

    if (!id || is_active !== true) {
      return NextResponse.json({ success: false, code: 'INVALID_INPUT', message: 'Invalid request' }, { status: 400 });
    }

    // Deactivate all
    await supabase
      .from('voice_fingerprints')
      .update({ is_active: false })
      .eq('user_id', user.id);

    // Activate specific one
    const { data, error } = await supabase
      .from('voice_fingerprints')
      .update({ is_active: true })
      .eq('id', id)
      .eq('user_id', user.id) // Security check
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data: data as VoiceFingerprint }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('PATCH voice-fingerprint failed', { userId: user.id, error: errorMessage });
    return NextResponse.json({ success: false, code: 'UPDATE_FAILED', message: errorMessage }, { status: 500 });
  }
}

/**
 * DELETE: Remove a fingerprint
 */
async function deleteFingerprintHandler(request: NextRequest, { user, supabase }: AuthContext) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
       return NextResponse.json({ success: false, code: 'ID_REQUIRED', message: 'ID required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('voice_fingerprints')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('DELETE voice-fingerprint failed', { userId: user.id, error: errorMessage });
    return NextResponse.json({ success: false, code: 'DELETE_FAILED', message: errorMessage }, { status: 500 });
  }
}

export const GET = withAuthAndCredits(getFingerprintsHandler, { actionName: 'voice-fingerprint-list' });
export const PATCH = withAuthAndCredits(patchFingerprintHandler, { actionName: 'voice-fingerprint-activate' });
export const DELETE = withAuthAndCredits(deleteFingerprintHandler, { actionName: 'voice-fingerprint-delete' });
