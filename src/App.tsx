import { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import AppPreview from './components/AppPreview'
import Security from './components/Security'
import Download from './components/Download'
import Footer from './components/Footer'
import CookieConsent from './components/CookieConsent'

function App() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="App">
      <Navbar scrolled={scrolled} />
      <Hero />
      <Features />
      <AppPreview />
      <Security />
      <Download />
      <Footer />
      <CookieConsent />
    </div>
  )
}

export default App

