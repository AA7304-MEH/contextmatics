import { Resend } from 'resend';
import { logger } from './logger';

let resend: Resend | null = null;

function getResend() {
  if (!resend) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
}

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    if (!process.env.RESEND_API_KEY) {
        logger.warn('RESEND_API_KEY is not configured. Email not sent.', { to, subject });
        return;
    }

    try {
        const client = getResend();
        const data = await client.emails.send({
            from: 'ContextMatic <ai@updates.contextmatic.com>',
            to,
            subject,
            html,
        });
        
        logger.info('Email sent successfully', { to, messageId: data.data?.id });
        return data;
    } catch (error:any) {
        logger.error('Failed to send email', { to, error: error.message });
        throw error;
    }
}

export function generateWeeklyPlanHtml(userName: string, plan:any[]) {
    const tableRows = plan.map(day => `
        <tr style="border-bottom: 1px solid #eee;">
            <td style="padding: 12px; font-weight: bold;">Day ${day.day}</td>
            <td style="padding: 12px;">${day.platform}</td>
            <td style="padding: 12px;">${day.hook}</td>
        </tr>
    `).join('');

    return `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
            <h1 style="color: #3b82f6;">Your Weekly Content Strategy is Ready! ✨</h1>
            <p>Hi ${userName},</p>
            <p>Our AI Content OS has analyzed your brand voice and reverse-engineered the perfect week of content for you.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
                <thead style="background: #f8fafc;">
                    <tr>
                        <th style="padding: 12px; text-align: left;">Day</th>
                        <th style="padding: 12px; text-align: left;">Platform</th>
                        <th style="padding: 12px; text-align: left;">Hook Inspiration</th>
                    </tr>
                </thead>
                <tbody>
                    ${tableRows}
                </tbody>
            </table>
            
            <div style="margin-top: 30px; text-align: center;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL}/content-os" style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">View Full Plan & Schedule</a>
            </div>
            
            <p style="margin-top: 40px; font-size: 12px; color: #666;">
                Unsubscribe from weekly planning in your Settings.
            </p>
        </div>
    `;
}
