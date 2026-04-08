import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

/**
 * PortalLoader
 * ─────────────────────────────────────────────────────────
 * 1. SVG camera body fades + scales in from centre
 * 2. The lens aperture is a transparent "hole" (clip-path mask)
 *    so the site content is visible through it
 * 3. After a brief hold the entire camera element scales to ~28×
 *    and fades out — the growing transparent hole swallows the screen,
 *    giving the illusion of "zooming through the lens"
 * 4. onComplete fires → loader unmounts → site appears
 */

const PortalLoader = ({ onComplete }) => {
  const controls  = useAnimation()
  const outerCtrl = useAnimation()

  useEffect(() => {
    const run = async () => {
      // Phase 1 — camera materialises
      await controls.start({
        scale: 1,
        opacity: 1,
        transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
      })

      // Phase 2 — gentle hold / breathe
      await new Promise(r => setTimeout(r, 300))

      // Phase 3 — zoom through lens (scale up dramatically)
      await Promise.all([
        controls.start({
          scale: 28,
          opacity: 0,
          transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
        }),
        outerCtrl.start({
          opacity: 0,
          transition: { duration: 0.7, ease: 'easeIn' },
        }),
      ])

      onComplete()
    }
    run()
  }, [controls, outerCtrl, onComplete])

  return (
    <motion.div
      animate={outerCtrl}
      initial={{ opacity: 1 }}
      className="loader-overlay"
      style={{ background: '#000' }}
    >
      {/* Ambient bokeh rings */}
      {[240, 380, 520].map((size, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-amber-500/10"
          style={{ width: size, height: size }}
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: [0, 0.25, 0], scale: [0.6, 1.1, 0.6] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.4,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* The Camera SVG — centre of the screen */}
      <motion.div
        animate={controls}
        initial={{ scale: 0.1, opacity: 0 }}
        style={{ originX: '50%', originY: '50%' }}
        className="relative flex items-center justify-center"
      >
        <svg
          width="260"
          height="200"
          viewBox="0 0 260 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Mask that punches a transparent circle in the body */}
            <mask id="lens-hole">
              <rect width="260" height="200" fill="white" />
              {/* The centre aperture — appears transparent */}
              <circle cx="130" cy="108" r="52" fill="black" />
            </mask>

            {/* Radial gradient for camera body */}
            <radialGradient id="bodyGrad" cx="50%" cy="50%" r="60%">
              <stop offset="0%" stopColor="#2a2a2a" />
              <stop offset="100%" stopColor="#111111" />
            </radialGradient>

            {/* Lens ring gradient */}
            <linearGradient id="lensRingGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#d97706" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#92400e" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {/* ── Camera body ── */}
          {/* Viewfinder bump */}
          <rect x="90" y="14" width="80" height="22" rx="5"
            fill="#1a1a1a" stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.3" />

          {/* Main body */}
          <rect x="20" y="30" width="220" height="148" rx="16"
            fill="url(#bodyGrad)" mask="url(#lens-hole)"
            stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.25" />

          {/* Top flash shoe groove */}
          <rect x="108" y="20" width="44" height="5" rx="2" fill="#333" />

          {/* Mode dial */}
          <circle cx="210" cy="44" r="12" fill="#222"
            stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.4" />
          <line x1="210" y1="36" x2="210" y2="40"
            stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.7" />

          {/* Shutter button */}
          <circle cx="52" cy="42" r="9" fill="#1a1a1a"
            stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="52" cy="42" r="5" fill="#f59e0b" fillOpacity="0.8" />

          {/* ── Lens assembly — drawn on TOP of mask so they render ── */}
          {/* Outer lens barrel ring */}
          <circle cx="130" cy="108" r="68"
            fill="none" stroke="#f59e0b" strokeWidth="2" strokeOpacity="0.5" />

          {/* Mid lens ring */}
          <circle cx="130" cy="108" r="58"
            fill="#1c1c1c" stroke="url(#lensRingGrad)" strokeWidth="2.5" />

          {/* Inner lens ring */}
          <circle cx="130" cy="108" r="48"
            fill="#111" stroke="#f59e0b" strokeWidth="1.5" strokeOpacity="0.4" />

          {/* Aperture blades hint — 6-point star shape */}
          {[0, 60, 120, 180, 240, 300].map(deg => {
            const rad = (deg * Math.PI) / 180
            const x1 = 130 + 44 * Math.cos(rad)
            const y1 = 108 + 44 * Math.sin(rad)
            const x2 = 130 + 16 * Math.cos(rad + Math.PI / 6)
            const y2 = 108 + 16 * Math.sin(rad + Math.PI / 6)
            return (
              <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="#f59e0b" strokeWidth="1" strokeOpacity="0.35" />
            )
          })}

          {/* THE TRANSPARENT APERTURE (just empty — no fill = window to site) */}
          {/* We only need the surrounding rings drawn. The circle at cx130 r52 is open. */}

          {/* Lens reflection glints */}
          <ellipse cx="115" cy="93" rx="6" ry="3"
            fill="white" fillOpacity="0.12" transform="rotate(-30 115 93)" />
          <ellipse cx="150" cy="124" rx="3" ry="1.5"
            fill="white" fillOpacity="0.08" transform="rotate(-30 150 124)" />

          {/* Focus ring notches */}
          {Array.from({ length: 18 }, (_, i) => {
            const angle = (i / 18) * 2 * Math.PI
            const r = 64
            const x = 130 + r * Math.cos(angle)
            const y = 108 + r * Math.sin(angle)
            return (
              <circle key={i} cx={x} cy={y} r="1.2"
                fill="#f59e0b" fillOpacity="0.25" />
            )
          })}

          {/* Grip textured side */}
          {Array.from({ length: 6 }, (_, i) => (
            <rect key={i} x="21" y={55 + i * 12} width="12" height="6"
              rx="2" fill="#333" opacity="0.6" />
          ))}
        </svg>

        {/* Amber glow emanating through the lens hole */}
        <motion.div
          className="absolute rounded-full"
          style={{
            width: 104,
            height: 104,
            top: '50%',
            left: '50%',
            marginTop: 8,         // offset to camera lens centre
            transform: 'translate(-50%, -50%)',
            background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)',
            filter: 'blur(8px)',
            pointerEvents: 'none',
          }}
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </motion.div>

      {/* Brand name */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="absolute bottom-16 font-playfair text-amber-400/70 tracking-[0.4em] text-sm uppercase"
      >
        PB Photography
      </motion.p>
    </motion.div>
  )
}

export default PortalLoader
