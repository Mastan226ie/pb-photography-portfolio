import React, { useRef } from 'react'
import { motion, useScroll, useTransform, useMotionValue, useSpring } from 'framer-motion'

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
    focalAt: 0.08,
    content: <LensElement size={480} color="#f59e0b" opacity={0.6} />,
  },
  {
    id: 'aperture',
    focalAt: 0.23,
    content: <ApertureElement />,
  },
  {
    id: 'midcopy',
    focalAt: 0.38,
    content: <MidCopy />,
  },
  {
    id: 'filmstrip',
    focalAt: 0.53,
    content: <FilmStrip />,
  },
  {
    id: 'photoframe',
    focalAt: 0.68,
    content: <FloatingFrame />,
  },
  {
    id: 'titlecard',
    focalAt: 0.83,
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
      style={{ height: '280vh', position: 'relative' }} /* Reduced height for faster interaction and less scroll delay */
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

/* ── True 3D Cylindrical 85mm Lens ────────────────────── */
function LensElement({ size = 480 }) {
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  // Exaggerated rotation to show off the deep 3D geometry
  const rotateX = useTransform(useSpring(y, { stiffness: 100, damping: 30 }), [0, 1], [35, -35]);
  const rotateY = useTransform(useSpring(x, { stiffness: 100, damping: 30 }), [0, 1], [-35, 35]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width);
    y.set((e.clientY - rect.top) / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  // Cylinder Rings for 3D depth
  const RINGS = 12;

  return (
    <div 
      style={{ width: size, height: size, perspective: 1500 }} 
      className="relative flex items-center justify-center pointer-events-auto group"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        style={{
          width: '100%',
          height: '100%',
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d'
        }}
        className="relative flex items-center justify-center cursor-crosshair"
      >
        {/* Outer Casing Tunnel (The Barrel) */}
        {Array.from({ length: RINGS }).map((_, i) => {
           const z = i * -30; // Depth of barrel
           const isFront = i === 0;
           return (
             <div 
               key={`barrel-${i}`}
               className="absolute inset-0 rounded-full border border-gray-800"
               style={{ 
                 background: isFront ? '#0a0a0a' : 'transparent',
                 border: isFront ? '16px solid #141414' : '4px solid #1a1a1a', 
                 boxShadow: isFront ? 'inset 0 0 50px rgba(0,0,0,1)' : 'none',
                 transform: `translateZ(${z}px)`,
                 transformStyle: 'preserve-3d'
               }} 
             >
                {/* Side walls effect (faking solid cylinder walls) */}
                {!isFront && i < RINGS - 1 && (
                    <div className="absolute inset-0 rounded-full border-[10px] border-[#0a0a0a] opacity-80" />
                )}
             </div>
           )
        })}

        {/* Front Glass Element */}
        <motion.div 
          className="absolute inset-[15px] rounded-full overflow-hidden shadow-[0_0_80px_rgba(245,158,11,0.15)]" 
          style={{ 
            background: 'radial-gradient(ellipse at 30% 30%, rgba(245,158,11,0.2) 0%, rgba(0,0,0,0.8) 70%)',
            border: '2px solid rgba(255,255,255,0.05)',
            transform: 'translateZ(-10px)' 
          }}
        >
            {/* Dynamic Glass Reflections */}
            <div className="absolute top-[-20%] left-[-20%] w-[140%] h-[140%] bg-gradient-to-br from-white/10 via-transparent to-transparent rotate-[35deg] mix-blend-screen opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.1)] transition-transform duration-700 group-hover:rotate-[65deg]" />
            <div className="absolute top-[10%] left-[10%] w-[40%] h-[40%] bg-blue-400/5 rounded-full blur-[30px]" />
            <div className="absolute bottom-[20%] right-[10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[40px]" />
        </motion.div>

        {/* Inner Glass Element (Deep) */}
        <div className="absolute inset-[30%] rounded-full border border-white/5 bg-gradient-to-tr from-transparent to-white/5" style={{ transform: 'translateZ(-150px)', boxShadow: '0 0 50px rgba(0,0,0,0.9)' }} />
        <div className="absolute inset-[40%] rounded-full bg-black/90" style={{ transform: 'translateZ(-200px)' }} />

        {/* Aperture inside the tunnel */}
        <div className="absolute inset-[25%] flex items-center justify-center pointer-events-none" style={{ transform: 'translateZ(-250px)' }}>
          {Array.from({ length: 8 }, (_, i) => {
            const rot = i * 45;
            return (
              <div
                key={i}
                className="absolute w-[80%] h-px bg-gray-600/60"
                style={{ transformOrigin: 'left center', transform: `rotate(${rot}deg) translateX(30px) skewY(35deg)` }}
              />
            )
          })}
        </div>

      </motion.div>
      
      {/* Outer ambient glow */}
      <div className="absolute inset-[-50px] rounded-full bg-amber-500/10 blur-[100px] -z-10 pointer-events-none" />
    </div>
  )
}

/* ── Aperture Opening Animation ────────────── */
function ApertureElement() {
  return (
    <div className="relative flex items-center justify-center pointer-events-none" style={{ width: 280, height: 280 }}>
      
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
