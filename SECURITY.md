# Trust & Security Protocol

## Data Privacy
- **Supabase RLS**: All tables (`profiles`, `videos`, `snippets`, `templates`, `video_feedback`) have strict Row Level Security (RLS) policies. Users can only access data where `user_id = auth.uid()`.
- **Public Templates**: Templates are stored in a designated `templates` table with public read-only access but private write access (Admin only).

## Security Measures
- **Rate Limiting**: Implementation of credit-based throttling for AI generation tasks to prevent API abuse and cost overrun.
- **Cookie Consent**: GDPR-compliant cookie consent banner with granular controls.
- **Error Handling**: Global Error Boundary prevents data leaking in crash reports and provides a safe fallback for users.

## Compliance
- **SOC2 Ready**: Architecture follows SOC2 principles for data isolation and audit logging via Supabase Auth logs.
- **Billing Security**: Payments handled exclusively via Razorpay/Stripe (PCI-DSS compliant). No credit card data is stored on ContextMatic servers.
