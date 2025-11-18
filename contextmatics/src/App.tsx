import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import NewLandingPage from './components/NewLandingPage'
import PricingPage from './components/PricingPage'
import Dashboard from './components/Dashboard'
import SubscriptionManager from './components/SubscriptionManager'
import Settings from './components/Settings'
import History from './components/History'
import Auth from './components/Auth'
import { validateEnvironmentVariables } from './utils/envCheck'

function App() {
  // Validate environment variables on app start
  if (import.meta.env.PROD) {
    validateEnvironmentVariables();
  }
  
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<NewLandingPage />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/login" element={<Auth />} />
                <Route path="/signup" element={<Auth />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subscription" element={<SubscriptionManager />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/history" element={<History />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App
