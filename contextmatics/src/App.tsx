import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import { ToastProvider } from './context/ToastContext'
import LandingPage from './components/LandingPage'
import PricingPage from './components/PricingPage'
import Dashboard from './components/Dashboard'
import SubscriptionManager from './components/SubscriptionManager'

function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <div className="App">
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/subscription" element={<SubscriptionManager />} />
              </Routes>
            </div>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  )
}

export default App