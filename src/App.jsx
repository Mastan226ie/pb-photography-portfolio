import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import PortalLoader from './components/PortalLoader'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import ScrollJourney from './components/ScrollJourney'
import AlbumCollection from './components/AlbumCollection'
import Testimonials from './components/Testimonials'
import ContactForm from './components/ContactForm'
import Footer from './components/Footer'
import SmoothScroll from './components/SmoothScroll'

function App() {
  const [portalDone, setPortalDone] = useState(false)

  const handlePortalComplete = useCallback(() => {
    setPortalDone(true)
  }, [])

  return (
    <>
      {/* ── Portal Loader ─────────────────── */}
      <AnimatePresence mode="wait">
        {!portalDone && (
          <PortalLoader key="portal" onComplete={handlePortalComplete} />
        )}
      </AnimatePresence>

      {/* ── Main Site Content ─────────────── */}
      <AnimatePresence>
        {portalDone && (
          <SmoothScroll>
            <motion.div
              key="site"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="bg-black min-h-screen"
            >
              <Navbar />
              <main>
                <Hero />
                <ScrollJourney />
                <AlbumCollection />
                <Testimonials />
                <ContactForm />
              </main>
              <Footer />
            </motion.div>
          </SmoothScroll>
        )}
      </AnimatePresence>
    </>
  )
}

export default App