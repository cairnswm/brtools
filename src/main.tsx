import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

console.log('[Debug] main.tsx: Starting application initialization')
const rootElement = document.getElementById('root')
console.log('[Debug] main.tsx: Root element found:', !!rootElement)

if (!rootElement) {
  throw new Error('Root element not found')
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
