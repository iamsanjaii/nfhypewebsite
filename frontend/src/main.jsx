import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AnswersProvider } from './AnswersContext'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AnswersProvider>
      <App />
    </AnswersProvider>
  </StrictMode>,
)
