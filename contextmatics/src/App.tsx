import React, { Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { HistoryProvider } from './context/HistoryContext'
import { ClerkWrapper, ProtectedRoute } from './components/ClerkWrapper'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { validateEnvironmentVariables } from './utils/envCheck'
import Auth from './components/Auth'

// Lazy load components for better performance
const NewLandingPage = React.lazy(() => import('./components/NewLandingPage'))
const PricingPage = React.lazy(() => import('./components/PricingPage'))
const Dashboard = React.lazy(() => import('./components/Dashboard'))
const SubscriptionManager = React.lazy(() => import('./components/SubscriptionManager'))
const Settings = React.lazy(() => import('./components/Settings'))
const History = React.lazy(() => import('./components/History'))
const ContentCreator = React.lazy(() => import('./components/ContentCreator'))
const VideoRepurposing = React.lazy(() => import('./components/VideoRepurposing'))
const VideoEditor = React.lazy(() => import('./components/VideoEditor'))

// Loading fallback component
const PageLoader = () => (
  <div style={{
    height: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(to bottom right, #f9fafb, #ffffff)'
  }}>
    <div style={{
      width: '40px',
      height: '40px',
      border: '3px solid rgba(79, 70, 229, 0.1)',
      borderRadius: '50%',
      borderTopColor: '#4f46e5',
      animation: 'spin 1s ease-in-out infinite'
    }} />
    <style>{`
      @keyframes spin {
        to { transform: rotate(360deg); }
      }
    `}</style>
  </div>
)

function App() {
  // Validate environment variables on app start
  validateEnvironmentVariables();

  return (
    <ThemeProvider>
      <ToastProvider>
        <HistoryProvider>
          <ClerkWrapper>
            <AuthProvider>
              <Router>
                <div className="App">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      <Route path="/" element={<NewLandingPage />} />
                      <Route path="/auth" element={<Auth />} />
                      <Route path="/login" element={<Auth />} />
                      <Route path="/signup" element={<Auth />} />
                      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
                      <Route path="/pricing" element={<PricingPage />} />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/content-creator" element={
                        <ProtectedRoute>
                          <ContentCreator onGenerate={(content, format) => {
                            console.log('Generating content:', content, format);
                            alert(`Generating ${format} from: ${content.substring(0, 50)}...`);
                          }} />
                        </ProtectedRoute>
                      } />
                      <Route path="/video-repurpose" element={
                        <ProtectedRoute>
                          <VideoRepurposing />
                        </ProtectedRoute>
                      } />
                      <Route path="/subscription" element={
                        <ProtectedRoute>
                          <SubscriptionManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <Settings />
                        </ProtectedRoute>
                      } />
                      <Route path="/history" element={
                        <ProtectedRoute>
                          <History />
                        </ProtectedRoute>
                      } />
                      <Route path="/video-editor" element={
                        <ProtectedRoute>
                          <VideoEditor />
                        </ProtectedRoute>
                      } />
                    </Routes>
                  </Suspense>
                </div>
              </Router>
            </AuthProvider>
          </ClerkWrapper>
        </HistoryProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
