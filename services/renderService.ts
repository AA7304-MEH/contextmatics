import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export interface RenderJob {
  id: string;
  projectId: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  priority: number;
  metadata: any;
  createdAt: string;
}

/**
 * RenderService: Orchestrates video exports between the client and cloud workers.
 * Weaponized for Phase 9 Scalability.
 */
export class RenderService {
  private static instance: RenderService;

  static getInstance(): RenderService {
    if (!RenderService.instance) {
      RenderService.instance = new RenderService();
    }
    return RenderService.instance;
  }

  /**
   * Queue a new render job.
   * In a full production setup, this would push to a Redis queue or AWS SQS.
   * For the current foundation, we use the Supabase 'projects' status.
   */
  async queueRender(projectId: string, userId: string): Promise<{ jobId: string; status: string }> {
    const cookieStore = cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value;
          },
        },
      }
    );

    const { logger } = await import('@/lib/logger');
    logger.info(`Queuing production render for project: ${projectId}`, { projectId, userId });

    const { data, error } = await supabase
      .from('projects')
      .update({ 
        status: 'processing',
        updated_at: new Date().toISOString()
      })
      .eq('id', projectId)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('[RenderService] Failed to queue job:', error);
      throw new Error('Failed to initiate cloud render.');
    }

    return { 
      jobId: data.id, 
      status: 'processing' 
    };
  }

  /**
   * Check status of a render job
   */
  async getStatus(projectId: string): Promise<string> {
    const cookieStore = cookies();
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return cookieStore.get(name)?.value;
            },
          },
        }
      );

    const { data } = await supabase
      .from('projects')
      .select('status')
      .eq('id', projectId)
      .single();

    return data?.status || 'unknown';
  }
}

export const renderService = RenderService.getInstance();
