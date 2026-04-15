import React, { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'

/**
 * ScrollJourney
 * ──────────────────────────────────────────────────────────
 * A tall sticky container (500 vh) that drives a Z-axis
 * depth experience as the user scrolls.  Five "depth layers"
 * travel from far-in-front → behind the virtual camera,
 * with bokeh blur applied based on distance from the current
 * focal point.
 */

/* ── Depth layer definitions ──────────────── */
const LAYERS = [
  {
    id: 'lens1',
    focalAt: 0.15,
    content: <LensElement size={480} color="#f59e0b" opacity={0.6} />,
  },
  {
    id: 'aperture',
    focalAt: 0.29,
    content: <ApertureElement />,
  },
  {
    id: 'midcopy',
    focalAt: 0.43,
    content: <MidCopy />,
  },
  {
    id: 'filmstrip',
    focalAt: 0.57,
    content: <FilmStrip />,
  },
  {
    id: 'photoframe',
    focalAt: 0.71,
    content: <FloatingFrame />,
  },
  {
    id: 'titlecard',
    focalAt: 0.85,
    content: <TitleCard />,
  },
]

/* ── Helper: map scroll [0→1] to Z position ─ */
function useLayerTransforms(scrollProgress, layer) {
  // By forcing Z to hit 0 EXACTLY at focalAt, layers perfectly pass through the screen.
  const z = useTransform(
    scrollProgress,
    [layer.focalAt - 0.25, layer.focalAt, layer.focalAt + 0.25],
    [900, 0, -600]
  )

  // Strict opacity envelope that reaches 0 well before the next layer dominates.
  const opacity = useTransform(scrollProgress, (v) => {
    const dist = Math.abs(v - layer.focalAt)
    // Drops to 0 when dist >= 0.12, ensuring strict "one by one" separation.
    return Math.max(0, 1 - dist * 8.33)
  })

  // Scale: slight depth-of-field scale bonus at focus
  const scale = useTransform(scrollProgress, (v) => {
    return 1
  })

  return { z, opacity, scale }
}

/* ── ScrollJourney (main) ─────────────────── */
const ScrollJourney = () => {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Text that slides up at end
  const endOpacity = useTransform(scrollYProgress, [0.88, 0.96], [0, 1])
  const endY = useTransform(scrollYProgress, [0.88, 0.96], [60, 0])

  return (
    <section
      id="journey"
      ref={containerRef}
      style={{ height: '500vh', position: 'relative' }} /* Increased height to give layers room to breathe smoothly */
      aria-label="Cinematic scroll journey"
    >
      {/* ── Sticky stage ──────────────────── */}
      <div className="journey-stage flex items-center justify-center bg-[#0d0d0d]">

        {/* Dark vignette edges */}
        <div
          className="absolute inset-0 pointer-events-none z-10"
          style={{
            background:
              'radial-gradient(ellipse 80% 80% at 50% 50%, transparent 40%, rgba(0,0,0,0.4) 100%)',
          }}
        />

        {/* Subtle film grain overlay */}
        <div
          className="absolute inset-0 pointer-events-none z-10 opacity-[0.04]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'300\' height=\'300\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.85\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'300\' height=\'300\' filter=\'url(%23n)\'/%3E%3C/svg%3E")',
          }}
        />

        {/* ── Depth layers ─────────────────── */}
        {LAYERS.map((layer) => (
          <DepthLayer
            key={layer.id}
            layer={layer}
            scrollProgress={scrollYProgress}
          />
        ))}

        {/* ── End-section teaser ───────────── */}
        <motion.div
          style={{ opacity: endOpacity, y: endY }}
          className="absolute bottom-12 z-20 text-center pointer-events-none"
        >
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase font-poppins">
            Scroll to connect with us ↓
          </p>
        </motion.div>

        {/* Scroll progress pip */}
        <ScrollProgressPip progress={scrollYProgress} />
      </div>
    </section>
  )
}

/* ── Individual depth layer ───────────────── */
const DepthLayer = ({ layer, scrollProgress }) => {
  const { z, opacity, scale } = useLayerTransforms(scrollProgress, layer)

  return (
    <motion.div
      style={{
        z,
        opacity,
        scale,
        position: 'absolute',
        left: `calc(50% + ${layer.offsetX})`,
        top: `calc(50% + ${layer.offsetY})`,
        transform: 'translate(-50%, -50%)',
        willChange: 'transform, opacity',
      }}
    >
      {layer.content}
    </motion.div>
  )
}



/* ── Scroll progress side pip ─────────────── */
const ScrollProgressPip = ({ progress }) => {
  const height = useTransform(progress, [0, 1], ['0%', '100%'])
  return (
    <div className="absolute right-6 top-8 bottom-8 w-0.5 bg-white/10 rounded-full z-30">
      <motion.div
        style={{ height }}
        className="w-full bg-amber-400 rounded-full origin-top"
      />
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-amber-400" />
    </div>
  )
}

/* ════════════════════════════════════════════
   LAYER CONTENT COMPONENTS
   ════════════════════════════════════════════ */

/* ── Giant Glass Lens ────────────────────── */
function LensElement({ size = 400, color = '#f59e0b', opacity = 0.5 }) {
  return (
    <div style={{ width: size, height: size }} className="relative flex items-center justify-center">
      {/* Outer glow */}
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `radial-gradient(circle, ${color}08 0%, transparent 70%)`,
          filter: 'blur(30px)',
        }}
      />
      {/* Concentric rings */}
      {[1, 0.78, 0.57, 0.38].map((scale, i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            width: `${scale * 100}%`,
            height: `${scale * 100}%`,
            border: `${2 - i * 0.3}px solid ${color}`,
            opacity: opacity - i * 0.1,
            boxShadow: i === 0
              ? `0 0 40px ${color}20, inset 0 0 40px ${color}10`
              : 'none',
          }}
        />
      ))}
      {/* Glass tint */}
      <div
        className="absolute rounded-full"
        style={{
          width: '36%',
          height: '36%',
          background: `radial-gradient(circle at 35% 35%, ${color}18, transparent 70%)`,
          border: `1px solid ${color}30`,
        }}
      />
      {/* Aperture blades */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * 360
        return (
          <div
            key={i}
            className="absolute"
            style={{
              width: '40%',
              height: '1px',
              background: `linear-gradient(to right, transparent, ${color}40, transparent)`,
              transformOrigin: '50% 50%',
              transform: `rotate(${angle}deg)`,
            }}
          />
        )
      })}
      {/* Lens label */}
      <p
        className="absolute bottom-6 font-poppins text-xs tracking-[0.3em] uppercase"
        style={{ color: `${color}60` }}
      >
        50mm f/1.4
      </p>
    </div>
  )
}

/* ── Aperture Opening Animation ────────────── */
function ApertureElement() {
  return (
    <div className="relative flex items-center justify-center pointer-events-none" style={{ width: 280, height: 280 }}>
      <div className="absolute inset-0 rounded-full border-[2px] border-amber-500/20" style={{ boxShadow: '0 0 40px rgba(245,158,11,0.1)' }} />
      
      <motion.div
        animate={{ rotate: 180 }}
        transition={{ duration: 16, repeat: Infinity, ease: 'linear' }}
        className="absolute inset-[6px] rounded-full overflow-hidden flex items-center justify-center"
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute origin-bottom-left"
            style={{
              width: '120%', height: '100%',
              background: 'linear-gradient(to right, rgba(15,15,15,0.95), rgba(25,25,25,0.95))',
              borderLeft: '1px solid rgba(245,158,11,0.4)',
              transformOrigin: '0% 100%',
              left: '50%', top: '-50%',
              rotate: i * 45,
            }}
            animate={{ skewX: [35, 10, 35] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute rounded-full"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 60%)' }}
        animate={{ width: [30, 200, 30], height: [30, 200, 30] }}
        transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
      />
      
      <p className="absolute -bottom-10 left-1/2 -translate-x-1/2 font-poppins tracking-[0.3em] text-amber-500/50 text-[9px] uppercase whitespace-nowrap">
        Aperture Opening
      </p>
    </div>
  )
}

/* ── Mid Copy ─────────────────────────────── */
function MidCopy() {
  return (
    <div className="text-center px-4" style={{ width: 600 }}>
      <p className="text-amber-400/70 text-sm tracking-[0.35em] uppercase mb-3 font-poppins">
        Through the lens
      </p>
      <h2 className="font-playfair text-5xl md:text-7xl font-bold text-white/80 leading-tight drop-shadow-2xl">
        Every Frame<br />
        <span className="text-amber-400">Tells a Story</span>
      </h2>
    </div>
  )
}

/* ── Film Strip ──────────────────────────── */
function FilmStrip() {
  const frames = [
    'https://images.unsplash.com/photo-1537633552985-df8429e8048b?w=160&h=120&fit=crop',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=160&h=120&fit=crop',
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=160&h=120&fit=crop',
    'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=160&h=120&fit=crop',
    'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?w=160&h=120&fit=crop',
  ]
  return (
    <div
      className="relative flex gap-1 rounded-md overflow-hidden"
      style={{
        background: '#111',
        padding: '10px 8px',
        border: '2px solid #333',
        boxShadow: '0 0 40px rgba(0,0,0,0.8)',
      }}
    >
      {/* Top perforations */}
      <div className="absolute top-1.5 left-0 right-0 flex justify-around items-center px-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="w-2 h-1.5 bg-gray-700 rounded-sm" />
        ))}
      </div>
      {/* Bottom perforations */}
      <div className="absolute bottom-1.5 left-0 right-0 flex justify-around items-center px-2">
        {Array.from({ length: 10 }, (_, i) => (
          <div key={i} className="w-2 h-1.5 bg-gray-700 rounded-sm" />
        ))}
      </div>
      {/* Photo frames */}
      {frames.map((src, i) => (
        <div
          key={i}
          style={{ width: 90, height: 68, flexShrink: 0 }}
          className="overflow-hidden rounded-sm ring-1 ring-white/10"
        >
          <img
            src={src}
            alt={`frame ${i}`}
            className="w-full h-full object-cover"
            style={{ filter: i === 2 ? 'none' : 'brightness(0.7) saturate(0.8)' }}
          />
        </div>
      ))}
      {/* Frame numbers */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-around px-2">
        {frames.map((_, i) => (
          <span key={i} className="text-[8px] text-amber-500/40 font-mono tabular-nums">
            {(i + 1).toString().padStart(2, '0')}
          </span>
        ))}
      </div>
    </div>
  )
}

/* ── Floating Photo Frame ────────────────── */
function FloatingFrame() {
  return (
    <div className="relative" style={{ width: 300 }}>
      {/* Back polaroid */}
      <div
        className="absolute bg-white rounded-sm shadow-2xl"
        style={{
          width: 240,
          padding: 10,
          bottom: -16,
          left: 30,
          transform: 'rotate(6deg)',
          zIndex: 0,
        }}
      >
        <div style={{ height: 180, background: '#ddd' }} className="rounded-sm" />
        <div className="h-10" />
      </div>
      {/* Front polaroid */}
      <div
        className="relative bg-white rounded-sm shadow-2xl z-10"
        style={{ width: 260, padding: 12 }}
      >
        <div style={{ height: 200 }} className="overflow-hidden rounded-sm">
          <img
            src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=400&h=280&fit=crop"
            alt="polaroid"
            className="w-full h-full object-cover"
          />
        </div>
        <div
          className="h-12 flex items-center justify-center font-playfair italic text-amber-900/50 text-sm"
        >
          Wedding Day ♥
        </div>
      </div>
    </div>
  )
}

/* ── Title Card ──────────────────────────── */
function TitleCard() {
  return (
    <div className="text-center px-8" style={{ maxWidth: 600 }}>
      {/* Amber divider line */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
      </div>
      <p className="text-amber-400/80 text-xs tracking-[0.4em] uppercase mb-4 font-poppins">
        PB Photography
      </p>
      <h3 className="font-playfair text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
        Let's Create<br />
        <span className="text-amber-400">Something</span> Timeless
      </h3>
      <div className="flex items-center gap-4 mt-6">
        <div className="flex-1 h-px bg-gradient-to-r from-transparent to-amber-500/50" />
        <div className="w-2 h-2 rounded-full bg-amber-500" />
        <div className="flex-1 h-px bg-gradient-to-l from-transparent to-amber-500/50" />
      </div>
    </div>
  )
}

export default ScrollJourney
