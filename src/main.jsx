import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Navbar from './assets/components/Navbar.jsx'
import Hero from './assets/components/Hero.jsx'
import Historia from './assets/components/historia.jsx'
import MapaArgentina from './assets/components/mapa.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <Navbar />
      <Hero />
      <Historia />
      <MapaArgentina />
  </StrictMode>,
)
