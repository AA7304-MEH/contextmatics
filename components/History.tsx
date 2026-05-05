import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { useToast } from '../context/ToastContext';
import { PageLayout } from './shared';
import { SEO } from './shared/SEO';

const History: React.FC = () => {
  const { user } = useAuth();
  const { historyItems, deleteFromHistory, clearHistory } = useHistory();
  const { showToast } = useToast();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showConfirmClear, setShowConfirmClear] = useState(false);

  if (!user) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      case 'failed': return 'text-red-400 bg-red-500/10 border-red-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  const getTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - new Date(date).getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    e.currentTarget.style.setProperty('--mouse-x', `${x}px`);
    e.currentTarget.style.setProperty('--mouse-y', `${y}px`);
  };

  // Get unique formats for filter
  const uniqueFormats = Array.from(new Set(historyItems.map(i => i.format)));

  const filteredItems = historyItems.filter(item =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (filterType === 'all' || item.format === filterType)
  );

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteFromHistory(id);
  };

  const handleCopy = (content: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(content);
    showToast('Content copied to clipboard!', 'success');
  };

  return (
    <PageLayout showPricing={true} showSettings={true}>
      <SEO title="Activity History" description="View and manage your AI-generated content history." />
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 animate-fade-in">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60 mb-2">History</h1>
            <p className="text-[var(--color-text-secondary)]">
              {historyItems.length} generation{historyItems.length !== 1 ? 's' : ''} total
            </p>
          </div>

          <div className="flex gap-3 items-center">
            {/* Search */}
            <div className="relative group w-full md:w-64">
              <input
                type="text"
                placeholder="Search history..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50 transition-all placeholder:text-[var(--color-text-muted)]"
              />
              <svg className="w-4 h-4 text-[var(--color-text-muted)] absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-blue-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Format Filter */}
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="bg-black/40 border border-white/10 rounded-xl py-2.5 px-3 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
            >
              <option value="all">All Formats</option>
              {uniqueFormats.map(f => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>

            {/* Clear All */}
            {historyItems.length > 0 && (
              <button
                onClick={() => setShowConfirmClear(true)}
                className="p-2.5 rounded-xl bg-black/40 border border-white/10 text-[var(--color-text-secondary)] hover:text-red-400 hover:border-red-500/30 transition-all"
                title="Clear all history"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Confirm Clear Modal */}
        {showConfirmClear && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="card p-8 max-w-sm mx-auto border border-white/10 bg-[var(--color-background-surface)]">
              <h3 className="text-lg font-semibold text-white mb-3">Clear All History?</h3>
              <p className="text-sm text-[var(--color-text-secondary)] mb-6">This action cannot be undone. All {historyItems.length} items will be removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmClear(false)} className="btn btn-secondary flex-1">Cancel</button>
                <button
                  onClick={() => { clearHistory(); setShowConfirmClear(false); }}
                  className="btn flex-1 bg-red-600 text-white hover:bg-red-700 border-none"
                >
                  Clear All
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <div className="card p-16 border border-white/5 bg-[var(--color-background-surface)]/30 text-center animate-fade-in">
            <span className="text-5xl block mb-4">{searchTerm ? '🔍' : '📭'}</span>
            <h3 className="text-xl font-semibold text-white mb-2">
              {searchTerm ? 'No matches found' : 'No history yet'}
            </h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              {searchTerm ? 'Try a different search term.' : 'Generate some content to see your history here.'}
            </p>
            {!searchTerm && (
              <button onClick={() => router.push('/content-creator')} className="btn btn-primary bg-gradient-to-r from-blue-600 to-violet-600 border-none px-6">
                Create Content ✨
              </button>
            )}
          </div>
        )}

        {/* History List */}
        <div className="grid grid-cols-1 gap-3 animate-fade-in">
          {filteredItems.map((item, index) => (
            <div
              key={item.id}
              onMouseMove={handleMouseMove}
              onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
              className="card group relative rounded-2xl border border-white/5 bg-[var(--color-background-surface)]/50 overflow-hidden cursor-pointer transition-all hover:border-white/10"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              {/* Spotlight Effect */}
              <div className="pointer-events-none absolute -inset-px opacity-0 group-hover:opacity-100 transition duration-300"
                style={{
                  background: `radial-gradient(600px circle at var(--mouse-x) var(--mouse-y), rgba(255,255,255,0.06), transparent 40%)`
                }}
              />

              {/* Main Row */}
              <div className="p-5 flex items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4 min-w-0">
                  <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-xl shrink-0 shadow-inner">
                    {item.icon}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-base font-medium text-white group-hover:text-white transition-colors truncate">{item.title}</h3>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--color-text-secondary)]">
                      <span className="capitalize">{item.format}</span>
                      <span className="w-1 h-1 rounded-full bg-zinc-700" />
                      <span>{getTimeAgo(item.created_at)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                    {item.status}
                  </span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={(e) => handleCopy(item.content, e)}
                      className="p-2 rounded-lg hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-white transition-colors"
                      title="Copy content"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    </button>
                    <button
                      onClick={(e) => handleDelete(item.id, e)}
                      className="p-2 rounded-lg hover:bg-white/10 text-[var(--color-text-secondary)] hover:text-red-400 transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                  <svg className={`w-4 h-4 text-[var(--color-text-secondary)] transition-transform ${expandedId === item.id ? 'rotate-90' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedId === item.id && (
                <div className="px-5 pb-5 pt-0 border-t border-white/5 animate-fade-in relative z-10">
                  <div className="mt-4 bg-black/30 rounded-xl p-5 border border-white/5 max-h-[400px] overflow-y-auto overflow-x-hidden" style={{ scrollbarWidth: 'thin', scrollbarColor: '#333 transparent' }}>
                    {item.format === 'Logo' ? (
                      <div className="flex flex-col items-center gap-4">
                        <img
                          src={item.content}
                          alt={item.title}
                          className="max-w-full h-auto rounded-lg shadow-2xl bg-white p-4 mx-auto"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400?text=Logo+Not+Found';
                          }}
                        />
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            const link = document.createElement('a');
                            link.href = item.content;
                            link.download = `logo-${item.id}.png`;
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                          }}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-colors"
                        >
                          Download Image
                        </button>
                      </div>
                    ) : (
                      <pre className="text-sm text-[var(--color-text-secondary)] whitespace-pre-wrap font-mono leading-relaxed">{item.content}</pre>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default History;
