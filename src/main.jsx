import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'

console.log('[Debug] main.jsx: Starting application initialization')
const rootElement = document.getElementById('root')
console.log('[Debug] main.jsx: Root element found:', !!rootElement)

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
