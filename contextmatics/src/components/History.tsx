import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHistory } from '../context/HistoryContext';
import { PageLayout } from './shared';

const History: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { historyItems, deleteFromHistory } = useHistory();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterFormat, setFilterFormat] = useState<string>('all');

  const filteredItems = historyItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterFormat === 'all' || item.format === filterFormat;
    return matchesSearch && matchesFilter;
  });

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return 'Just now';
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', textAlign: 'center', maxWidth: '28rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <h2 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#111827', marginBottom: '1rem' }}>Please Log In</h2>
          <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>You need to be logged in to view history.</p>
          <button
            onClick={() => navigate('/')}
            style={{ backgroundColor: '#2563eb', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '8px', fontWeight: '600', border: 'none', cursor: 'pointer' }}
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <PageLayout showPricing={true} showSettings={true}>
      <div style={{ maxWidth: '1152px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '3rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', marginBottom: '1rem', color: '#111827' }}>Content History</h1>
          <p style={{ fontSize: '1.125rem', color: '#6b7280' }}>View and manage all your generated content</p>
        </div>

        {/* Search and Filter Bar */}
        <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Search */}
            <div style={{ flex: 1 }}>
              <div style={{ position: 'relative' }}>
                <input
                  type="text"
                  placeholder="Search content..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    paddingLeft: '2.5rem',
                    paddingRight: '1rem',
                    paddingTop: '0.75rem',
                    paddingBottom: '0.75rem',
                    border: '2px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    outline: 'none',
                    transition: 'all 0.2s'
                  }}
                />
                <svg style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: '20px', height: '20px', color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* Filter */}
            <select
              value={filterFormat}
              onChange={(e) => setFilterFormat(e.target.value)}
              style={{
                padding: '0.75rem 1rem',
                border: '2px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                transition: 'all 0.2s',
                backgroundColor: 'white'
              }}
            >
              <option value="all">All Formats</option>
              <option value="Blog Post">Blog Posts</option>
              <option value="Twitter Thread">Twitter Threads</option>
              <option value="Email Newsletter">Newsletters</option>
              <option value="LinkedIn Post">LinkedIn Posts</option>
              <option value="Summary">Summaries</option>
            </select>
          </div>
        </div>

        {/* Stats Overview */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
          <div style={{ background: 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)', border: '1px solid #93c5fd', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>{historyItems.length}</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Total Items</div>
          </div>
          <div style={{ background: 'linear-gradient(to bottom right, #d1fae5, #a7f3d0)', border: '1px solid #6ee7b7', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>5</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>This Week</div>
          </div>
          <div style={{ background: 'linear-gradient(to bottom right, #e9d5ff, #d8b4fe)', border: '1px solid #c084fc', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>100%</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Success Rate</div>
          </div>
          <div style={{ background: 'linear-gradient(to bottom right, #fed7aa, #fdba74)', border: '1px solid #fb923c', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>3.2k</div>
            <div style={{ fontSize: '0.875rem', color: '#6b7280', fontWeight: '500' }}>Words Generated</div>
          </div>
        </div>

        {/* History List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filteredItems.length === 0 ? (
            <div style={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '3rem', textAlign: 'center' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🔍</div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.5rem' }}>No content found</h3>
              <p style={{ color: '#6b7280' }}>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <div
                key={item.id}
                style={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '16px',
                  padding: '1.5rem',
                  transition: 'all 0.2s',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                  {/* Icon */}
                  <div style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: '#dbeafe',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.5rem',
                    flexShrink: 0
                  }}>
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <div>
                        <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold', color: '#111827', marginBottom: '0.25rem' }}>{item.title}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                          <span style={{ backgroundColor: '#dbeafe', color: '#1d4ed8', padding: '0.25rem 0.5rem', borderRadius: '6px', fontWeight: '500' }}>
                            {item.format}
                          </span>
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                      </div>
                      <span style={{
                        padding: '0.25rem 0.75rem',
                        borderRadius: '8px',
                        fontSize: '0.75rem',
                        fontWeight: '600',
                        backgroundColor: item.status === 'success' ? '#d1fae5' : '#fee2e2',
                        color: item.status === 'success' ? '#065f46' : '#dc2626'
                      }}>
                        {item.status === 'success' ? '✓ Success' : '✗ Failed'}
                      </span>
                    </div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '1rem', lineHeight: '1.5' }}>{item.content}</p>

                    {/* Actions */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <button style={{
                        backgroundColor: '#dbeafe',
                        border: '1px solid #93c5fd',
                        color: '#1d4ed8',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        📋 Copy
                      </button>
                      <button style={{
                        backgroundColor: '#d1fae5',
                        border: '1px solid #6ee7b7',
                        color: '#047857',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        📤 Export
                      </button>
                      <button style={{
                        backgroundColor: '#e9d5ff',
                        border: '1px solid #c084fc',
                        color: '#7c3aed',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}>
                        🔄 Regenerate
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteFromHistory(item.id);
                        }}
                        style={{
                          backgroundColor: '#fee2e2',
                          border: '1px solid #fca5a5',
                          color: '#dc2626',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          cursor: 'pointer',
                          transition: 'all 0.2s'
                        }}>
                        🗑️ Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default History;
