import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import { HistoryProvider } from './context/HistoryContext'
import { ClerkWrapper, ProtectedRoute } from './components/ClerkWrapper'
import { AuthenticateWithRedirectCallback } from '@clerk/clerk-react'
import NewLandingPage from './components/NewLandingPage'
import PricingPage from './components/PricingPage'
import Dashboard from './components/Dashboard'
import SubscriptionManager from './components/SubscriptionManager'
import Settings from './components/Settings'
import History from './components/History'
import Auth from './components/Auth'
import ContentCreator from './components/ContentCreator'
import VideoRepurposing from './components/VideoRepurposing'
import { validateEnvironmentVariables } from './utils/envCheck'

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
                  </Routes>
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
