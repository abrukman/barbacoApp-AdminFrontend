import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { CancionesProvider } from './contexts/CancionesContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <CancionesProvider>
        <App />
      </CancionesProvider>
    </BrowserRouter>
  </StrictMode>,
);
