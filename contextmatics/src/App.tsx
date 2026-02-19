import React, { Suspense } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { HistoryProvider } from './context/HistoryContext'
import { ClerkWrapper, ProtectedRoute } from './components/ClerkWrapper'
import { AdminRoute } from './components/AdminRoute'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import { validateEnv } from './config/env'
import Auth from './components/Auth'
import { SEO } from './components/shared/SEO'

const PricingPage = React.lazy(() => import('./components/PricingPage'))
const Dashboard = React.lazy(() => import('./components/Dashboard'))
const SubscriptionManager = React.lazy(() => import('./components/SubscriptionManager'))
const Settings = React.lazy(() => import('./components/Settings'))
const History = React.lazy(() => import('./components/History'))
const ContentCreator = React.lazy(() => import('./components/ContentCreator'))
const VideoRepurposing = React.lazy(() => import('./components/VideoRepurposing'))
const VideoEditor = React.lazy(() => import('./components/VideoEditor'))
const VideoGeneratorPage = React.lazy(() => import('./components/video-generator/VideoGeneratorPage'))
const AdminDashboard = React.lazy(() => import('./components/AdminDashboard'))
const Analytics = React.lazy(() => import('./components/Analytics'))
const TemplatesLibrary = React.lazy(() => import('./components/TemplatesLibrary'))
const FacelessStudio = React.lazy(() => import('./components/faceless/FacelessStudio'))
import { CursorLandingPage } from './components/CursorLandingPage'

// Loading fallback component
const PageLoader = () => (
  <div className="loader-container">
    <div className="loader" />
  </div>
)

function App() {
  // Validate environment variables on app start
  validateEnv();

  return (
    <ThemeProvider>
      <ToastProvider>
        <ClerkWrapper>
          <AuthProvider>
            <HistoryProvider>
              <Router>
                <div className="App">
                  <Suspense fallback={<PageLoader />}>
                    <Routes>
                      {/* Ultimate Cursor Clone as Main Entry */}
                      <Route path="/" element={
                        <>
                          <SEO title="ContextMatic" />
                          <CursorLandingPage />
                        </>
                      } />

                      <Route path="/auth" element={<Auth />} />
                      <Route path="/login" element={
                        <>
                          <SEO title="Login" description="Securely log in to your ContextMatic account." />
                          <Auth />
                        </>
                      } />
                      <Route path="/signup" element={
                        <>
                          <SEO title="Sign Up" description="Create a new ContextMatic account to start repurposing content." />
                          <Auth />
                        </>
                      } />
                      <Route path="/sso-callback" element={<AuthenticateWithRedirectCallback />} />
                      <Route path="/pricing" element={
                        <>
                          <SEO title="Pricing Plans" description="Choose the perfect plan for your content repurposing needs." />
                          <PricingPage />
                        </>
                      } />
                      <Route path="/dashboard" element={
                        <ProtectedRoute>
                          <SEO title="Dashboard" />
                          <Dashboard />
                        </ProtectedRoute>
                      } />
                      <Route path="/content-creator" element={
                        <ProtectedRoute>
                          <SEO title="Content Creator" />
                          <ContentCreator />
                        </ProtectedRoute>
                      } />
                      <Route path="/video-repurpose" element={
                        <ProtectedRoute>
                          <SEO title="Video Repurposing" />
                          <VideoRepurposing />
                        </ProtectedRoute>
                      } />
                      <Route path="/subscription" element={
                        <ProtectedRoute>
                          <SEO title="Subscription" />
                          <SubscriptionManager />
                        </ProtectedRoute>
                      } />
                      <Route path="/settings" element={
                        <ProtectedRoute>
                          <SEO title="Settings" />
                          <Settings />
                        </ProtectedRoute>
                      } />
                      <Route path="/history" element={
                        <ProtectedRoute>
                          <SEO title="History" />
                          <History />
                        </ProtectedRoute>
                      } />
                      <Route path="/video-editor" element={
                        <ProtectedRoute>
                          <SEO title="Video Editor" />
                          <VideoEditor />
                        </ProtectedRoute>
                      } />
                      <Route path="/video-generator" element={
                        <ProtectedRoute>
                          <SEO title="AI Video Generator" />
                          <VideoGeneratorPage />
                        </ProtectedRoute>
                      } />
                      <Route path="/analytics" element={
                        <ProtectedRoute>
                          <SEO title="Analytics" description="Track your content creation activity and usage insights." />
                          <Analytics />
                        </ProtectedRoute>
                      } />
                      <Route path="/templates" element={
                        <ProtectedRoute>
                          <SEO title="Templates Library" description="Pre-built prompt templates to supercharge your content creation." />
                          <TemplatesLibrary />
                        </ProtectedRoute>
                      } />
                      <Route path="/faceless-studio" element={
                        <ProtectedRoute>
                          <SEO title="Faceless Video Studio" description="Create platform-optimized faceless videos with AI-powered scripts and cinematic storyboards." />
                          <FacelessStudio />
                        </ProtectedRoute>
                      } />
                      <Route path="/admin" element={
                        <AdminRoute>
                          <SEO title="Admin Console" />
                          <AdminDashboard />
                        </AdminRoute>
                      } />
                      {/* Catch-all route for hash links like #cta, #features etc. */}
                      <Route path="*" element={<CursorLandingPage />} />
                    </Routes>
                  </Suspense>
                </div>
              </Router>
            </HistoryProvider>
          </AuthProvider>
        </ClerkWrapper>
      </ToastProvider>
    </ThemeProvider >
  )
}

export default App
