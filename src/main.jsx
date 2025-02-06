import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import App from './App.jsx'
import Moderator from './Moderator';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />  {/* Página de los participantes */}
        <Route path="/moderador" element={<Moderator />} />  {/* Página del moderador */}
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)







