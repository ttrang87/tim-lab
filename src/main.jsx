import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ScaleProvider } from './components/context'

createRoot(document.getElementById('root')).render(
  <ScaleProvider>
    <StrictMode>
      <App />
    </StrictMode>
  </ScaleProvider>
)