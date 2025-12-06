if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') { (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ = { supportsFiber: true, inject: () => {}, onCommitFiberRoot: () => {}, onCommitFiberUnmount: () => {} }; }

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
