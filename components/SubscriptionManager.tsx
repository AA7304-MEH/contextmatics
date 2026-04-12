import React from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { PageLayout, SEO } from './shared'

// Plan credit limits for usage calculation
const PLAN_CREDITS: Record<string, number> = {
  free: 3,
  pro: 10,
  business: 50,
  enterprise: 500
}

const PLAN_NAMES: Record<string, string> = {
  free: 'Free Plan',
  pro: 'Pro Plan',
  business: 'Business Plan',
  enterprise: 'Enterprise Plan'
}

const SubscriptionManager: React.FC = () => {
  const router = useRouter()
  const { user } = useAuth()
  // const [showCancelModal, setShowCancelModal] = useState(false)

  // Calculate usage based on actual user data
  const planLimit = user ? PLAN_CREDITS[user.plan] || 3 : 3
  const creditsRemaining = user?.processingCredits || 0
  const creditsUsed = planLimit - creditsRemaining
  const usagePercent = planLimit > 0 ? ((creditsUsed / planLimit) * 100) : 0
  const remainingPercent = 100 - usagePercent

  return (
    <PageLayout showPricing={true} showSettings={true}>
      <SEO title="Subscription & Billing" description="Manage your ContextMatic workspace plan, usage limits, and billing history." />
      <div className="container mx-auto px-6 py-12">
        <div className="mb-12 text-center animate-fade-in opacity-0 stagger-1">
          <h1 className="text-4xl font-bold mb-4 tracking-tight text-white">Subscription & Billing</h1>
          <p className="text-lg text-text-secondary">Manage your workspace plan, usage limits, and billing history.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12 animate-fade-in opacity-0 stagger-2">
          {/* Current Plan Card */}
          <div className="card p-8 h-full flex flex-col border border-white/10 bg-background-surface/50">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-xl font-bold text-white mb-2">Current Plan</h2>
                <p className="text-text-secondary text-sm">Your active subscription tier.</p>
              </div>
              <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold uppercase tracking-wider">
                Active
              </span>
            </div>

            <div className="flex-1">
              <div className="mb-8 p-6 bg-white/5 border border-white/10 rounded-2xl">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-3xl">⚡</span>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {user ? PLAN_NAMES[user.plan] || 'Free Plan' : 'Free Plan'}
                    </h3>
                    <p className="text-text-muted text-sm">Billed monthly</p>
                  </div>
                </div>
                <div className="text-3xl font-mono font-bold text-white mb-1">
                  {planLimit}<span className="text-sm font-sans font-medium text-text-muted ml-2">credits/mo</span>
                </div>
                <p className="text-emerald-400 text-sm font-medium">{creditsRemaining} credits available now</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button
                onClick={() => router.push('/pricing')}
                className="btn btn-primary flex-1 justify-center bg-white text-black hover:bg-zinc-200 border-white"
              >
                Upgrade Plan
              </button>
              <button
                onClick={() => { /* Cancellation logic handled in settings */ }}
                className="btn btn-secondary flex-1 justify-center border-red-500/20 text-red-400 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel Subscription
              </button>
            </div>
          </div>

          {/* Usage Statistics */}
          <div className="card p-8 h-full flex flex-col border border-white/10 bg-background-surface/50">
            <h2 className="text-xl font-bold text-white mb-2">Usage Statistics</h2>
            <p className="text-text-secondary text-sm mb-8">Real-time usage tracking for current billing cycle.</p>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between mb-2 text-sm font-medium">
                <span className="text-text-muted">Monthly Usage</span>
                <span className="text-white font-mono">{creditsUsed} / {planLimit}</span>
              </div>
              <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${usagePercent > 90 ? 'bg-red-500' : 'bg-emerald-500'}`}
                  style={{ width: `${Math.min(usagePercent, 100)}%` }}
                />
              </div>
              <p className="text-xs text-text-muted mt-2 text-right">{remainingPercent.toFixed(0)}% remaining</p>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-auto">
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">Credits Used</div>
                <div className="text-2xl font-mono font-bold text-white">{creditsUsed}</div>
              </div>
              <div className="p-4 rounded-xl border border-white/5 bg-white/5">
                <div className="text-text-muted text-xs font-medium uppercase tracking-wider mb-2">Remaining</div>
                <div className={`text-2xl font-mono font-bold ${creditsRemaining > 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {creditsRemaining}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Billing History */}
        <div className="card p-6 border border-white/10 bg-background-surface/50 animate-fade-in opacity-0 stagger-3">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-xl font-bold text-white">Billing History</h2>
            <button className="text-xs text-text-muted hover:text-white transition-colors">Download All</button>
          </div>

          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-4 text-xs uppercase tracking-wider text-text-muted font-medium border-b border-white/5">Invoice</th>
                <th className="p-4 text-xs uppercase tracking-wider text-text-muted font-medium border-b border-white/5">Date</th>
                <th className="p-4 text-xs uppercase tracking-wider text-text-muted font-medium border-b border-white/5">Amount</th>
                <th className="p-4 text-xs uppercase tracking-wider text-text-muted font-medium border-b border-white/5">Status</th>
                <th className="p-4 text-xs uppercase tracking-wider text-text-muted font-medium border-b border-white/5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-text-secondary">
              {[
                { date: 'Dec 1, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-2024-001' },
                { date: 'Nov 1, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-2024-002' },
                { date: 'Oct 1, 2024', amount: '$29.00', status: 'Paid', invoice: 'INV-2024-003' }
              ].map((bill, index) => (
                <tr key={index} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="p-4 font-mono text-text-muted">{bill.invoice}</td>
                  <td className="p-4">{bill.date}</td>
                  <td className="p-4 font-bold text-white">{bill.amount}</td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                      <span className="w-1 h-1 rounded-full bg-emerald-400"></span> {bill.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="text-text-muted hover:text-white text-xs font-medium underline decoration-zinc-700 hover:decoration-white underline-offset-4 transition-all">
                      Download PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </PageLayout>
  )
}

export default SubscriptionManager
