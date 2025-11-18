import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Normalize non-hash paths to hash-based routes for HashRouter
if (window.location.pathname && window.location.pathname !== '/') {
  const newUrl = `/#${window.location.pathname}${window.location.search}`
  window.location.replace(newUrl)
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)