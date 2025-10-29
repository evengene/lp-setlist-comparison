import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Analytics } from "@vercel/analytics/react"
import './index.css'
import App from './App.tsx'

console.log(
  '%cYou found a secret message from developer' +
  ', here\'s a cookie 🍪',
  'font-size: 14px; font-weight: bold; color: black;'
);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
      <App />
      <Analytics/>
  </StrictMode>,
)
