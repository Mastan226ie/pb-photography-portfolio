import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'

/**
 * CameraContactForm
 * ──────────────────────────────────────────────────────────
 * A 3D interactive camera graphic that serves as the contact form.
 * Built with CSS perspective + Framer Motion — no Three.js required.
 *
 * Layout:
 *   Left  — Contact info card (glassmorphism)
 *   Right — The 3D Camera graphic (the form itself)
 *
 * Camera interactions:
 *   • Entrance: rotates from Y=-60 → Y=0 as section enters viewport
 *   • Hover tilt: slight Y/X rotation following mouse
 *   • Lens Ring: rotating dial to pick event type
 *   • Ejected Polaroid: slides out, contains name/email/message fields
 *   • Shutter Button: springs down, triggers full-screen flash + sends
 */

const EVENT_TYPES = [
  { label: 'Wedding',   icon: '💍', angle: 0   },
  { label: 'Portrait',  icon: '🎭', angle: 60  },
  { label: 'Corporate', icon: '💼', angle: 120 },
  { label: 'Event',     icon: '🎉', angle: 180 },
  { label: 'Fashion',   icon: '✨', angle: 240 },
  { label: 'Other',     icon: '📷', angle: 300 },
]

const ContactForm = () => {
  /* ── Form state ───────────────────── */
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', message: '',
  })
  const [selectedEvent, setSelectedEvent] = useState(null)    // index
  const [dialAngle, setDialAngle] = useState(0)               // deg
  const [polaroidOpen, setPolaroidOpen] = useState(false)
  const [shutterPressed, setShutterPressed] = useState(false)
  const [flash, setFlash] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })

  /* ── Mouse tilt ───────────────────── */
  const handleMouseMove = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top  + rect.height / 2
    const dx = (e.clientX - cx) / (rect.width  / 2)
    const dy = (e.clientY - cy) / (rect.height / 2)
    setTilt({ x: -dy * 5, y: dx * 6 })
  }, [])

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 })
  }, [])

  /* ── Lens dial ────────────────────── */
  const handleDialSelect = useCallback((index) => {
    setSelectedEvent(index)
    setDialAngle(EVENT_TYPES[index].angle)
  }, [])

  /* ── Submit ───────────────────────── */
  const handleSubmit = useCallback(() => {
    if (!formData.name || !formData.email) return

    // Shutter click animation
    setShutterPressed(true)
    setTimeout(() => setShutterPressed(false), 300)

    // Flash effect
    setTimeout(() => {
      setFlash(true)
      setTimeout(() => setFlash(false), 500)
    }, 150)

    // Simulate send
    setTimeout(() => {
      setSubmitted(true)
      setPolaroidOpen(false)
      setFormData({ name: '', email: '', phone: '', message: '' })
      setSelectedEvent(null)
      setDialAngle(0)
      setTimeout(() => setSubmitted(false), 4000)
    }, 600)
  }, [formData])

  const handleWhatsApp = () => {
    const msg = encodeURIComponent("Hi! I'd like to book a photography session.")
    window.open(`https://wa.me/919876543210?text=${msg}`, '_blank')
  }

  return (
    <section id="contact" className="py-20 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)' }}>

      {/* Background decorative blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl" />
      </div>

      {/* Full-screen shutter flash */}
      <AnimatePresence>
        {flash && (
          <motion.div
            key="flash"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className="fixed inset-0 bg-white pointer-events-none z-[100]"
          />
        )}
      </AnimatePresence>

      <div className="container-custom">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="text-amber-500 font-semibold tracking-[0.3em] uppercase text-xs font-poppins">
            Get In Touch
          </span>
          <h2 className="text-4xl md:text-6xl font-playfair font-bold mt-3 mb-4">
            Let's Create{' '}
            <span className="text-amber-500">Something</span>
            <br />Beautiful
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto font-poppins text-sm">
            Use the camera below to send your story. Pick your shoot type with
            the lens dial, write your message on the polaroid, then press the
            shutter.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* ── LEFT — Contact info ────────── */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            {/* Info card */}
            <div className="glass-card rounded-2xl p-8">
              <h3 className="text-2xl font-playfair font-bold mb-6">
                Contact Information
              </h3>
              <div className="space-y-5">
                {[
                  { icon: <Phone className="w-5 h-5" />, label: 'Phone', value: '+91 80083 60032', href: 'tel:+918008360032' },
                  { icon: <Mail className="w-5 h-5" />,  label: 'Email', value: 'pbvideography.0032@gmail.com', href: 'mailto:[EMAIL_ADDRESS]' },
                  { icon: <MapPin className="w-5 h-5" />, label: 'Location', value: 'Vijayawada, India' },
                  { icon: <Clock className="w-5 h-5" />,  label: 'Hours', value: 'Mon – Sat: 09 AM – 09 PM' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-11 h-11 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white transition-all duration-300 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs uppercase tracking-wider mb-0.5">{item.label}</p>
                      {item.href
                        ? <a href={item.href} className="text-white hover:text-amber-400 transition-colors font-medium">{item.value}</a>
                        : <p className="text-white font-medium">{item.value}</p>
                      }
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleWhatsApp}
                className="mt-8 w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-3 group"
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Chat on WhatsApp
              </button>
            </div>

            {/* Success toast */}
            <AnimatePresence>
              {submitted && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, y: 20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="p-5 bg-green-500/10 border border-green-500/40 rounded-2xl text-green-400 text-center font-poppins text-sm"
                >
                  📸 Message captured! We'll be in touch soon.
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ── RIGHT — 3D Camera ─────────── */}
          <motion.div
            initial={{ opacity: 0, rotateY: -60, x: 60 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
            viewport={{ once: true }}
            style={{ perspective: 1400 }}
            className="flex flex-col items-center"
          >
            {/* Camera outer wrapper with mouse tilt */}
            <motion.div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              animate={{ rotateX: tilt.x, rotateY: tilt.y }}
              transition={{ type: 'spring', stiffness: 200, damping: 25 }}
              style={{ transformStyle: 'preserve-3d' }}
              className="relative"
            >
              {/* ══ CAMERA BODY ══════════════════ */}
              <div
                className="relative rounded-2xl select-none"
                style={{
                  width: 380,
                  background: 'linear-gradient(145deg, #1e1e1e 0%, #141414 50%, #1a1a1a 100%)',
                  boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)',
                  padding: '20px 24px 28px',
                }}
              >
                {/* Top ridge / viewfinder */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex items-end gap-3">
                  {/* Viewfinder bump */}
                  <div
                    className="rounded-t-lg"
                    style={{
                      width: 100, height: 28,
                      background: 'linear-gradient(180deg, #252525 0%, #1a1a1a 100%)',
                      border: '1px solid rgba(255,255,255,0.06)',
                      borderBottom: 'none',
                    }}
                  />
                </div>

                {/* TOP BAR — Mode dial + shutter */}
                <div className="flex items-center justify-between mb-4 pt-2">
                  {/* Brand */}
                  <div className="flex flex-col">
                    <span className="text-amber-400/80 font-playfair font-bold text-lg leading-none">PB</span>
                    <span className="text-white/30 text-[8px] tracking-[0.3em] uppercase">Photography</span>
                  </div>

                  {/* Central top info */}
                  <div className="text-center">
                    <div className="text-white/20 text-[8px] tracking-widest uppercase">Mode</div>
                    <div className="text-amber-400 text-xs font-mono">PORTRAIT</div>
                  </div>

                  {/* ── SHUTTER BUTTON ── */}
                  <div className="flex flex-col items-center gap-1">
                    <div className="text-white/20 text-[8px] tracking-widest uppercase mb-0.5">Shutter</div>
                    <motion.button
                      id="shutter-btn"
                      onClick={handleSubmit}
                      animate={shutterPressed ? { scale: 0.82, y: 3 } : { scale: 1, y: 0 }}
                      whileHover={{ scale: 1.08 }}
                      transition={{ type: 'spring', stiffness: 500, damping: 18 }}
                      className="relative"
                      title="Send Message"
                    >
                      {/* Outer ring */}
                      <div
                        className="rounded-full"
                        style={{
                          width: 46, height: 46,
                          background: 'linear-gradient(145deg, #2a2a2a, #1a1a1a)',
                          boxShadow: 'inset 0 2px 4px rgba(255,255,255,0.08), 0 4px 12px rgba(0,0,0,0.6), 0 0 0 2px rgba(245,158,11,0.2)',
                        }}
                      />
                      {/* Inner dome */}
                      <div
                        className="absolute inset-2 rounded-full flex items-center justify-center"
                        style={{
                          background: shutterPressed
                            ? 'radial-gradient(circle at 40% 35%, #c97706, #92400e)'
                            : 'radial-gradient(circle at 40% 35%, #f59e0b, #d97706)',
                        }}
                      >
                        <div
                          className="rounded-full"
                          style={{
                            width: 10, height: 10,
                            background: 'rgba(255,255,255,0.25)',
                          }}
                        />
                      </div>
                    </motion.button>
                    <span className="text-amber-500/60 text-[8px] font-poppins">SEND</span>
                  </div>
                </div>

                {/* BODY HORIZONTAL RULE */}
                <div
                  className="w-full mb-4"
                  style={{ height: 1, background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)' }}
                />

                {/* MAIN LENS + DIAL ─────────────── */}
                <div className="flex items-center gap-5">

                  {/* ── LENS RING DIAL ── */}
                  <div className="relative flex-shrink-0" style={{ width: 170, height: 170 }}>
                    {/* Outer barrel */}
                    <div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: 'linear-gradient(145deg, #2a2a2a, #111)',
                        boxShadow: '0 0 0 2px rgba(255,255,255,0.05), inset 0 0 12px rgba(0,0,0,0.8), 0 8px 30px rgba(0,0,0,0.7)',
                      }}
                    />
                    {/* Focus ring tick marks */}
                    {Array.from({ length: 24 }, (_, i) => {
                      const angle = (i / 24) * 360
                      const rad = (angle * Math.PI) / 180
                      const r = 78
                      const x = 85 + r * Math.cos(rad - Math.PI / 2)
                      const y = 85 + r * Math.sin(rad - Math.PI / 2)
                      return (
                        <div
                          key={i}
                          className="absolute rounded-full"
                          style={{
                            width: i % 4 === 0 ? 3 : 1.5,
                            height: i % 4 === 0 ? 5 : 3,
                            background: i % 4 === 0 ? '#f59e0b' : 'rgba(255,255,255,0.2)',
                            left: x - (i % 4 === 0 ? 1.5 : 0.75),
                            top: y - (i % 4 === 0 ? 2.5 : 1.5),
                            transform: `rotate(${angle}deg)`,
                          }}
                        />
                      )
                    })}

                    {/* Rotating inner dial */}
                    <motion.div
                      animate={{ rotate: -dialAngle }}
                      transition={{ type: 'spring', stiffness: 80, damping: 15 }}
                      className="absolute inset-3 rounded-full"
                      style={{
                        background: 'linear-gradient(145deg, #1e1e1e, #0d0d0d)',
                        boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
                      }}
                    >
                      {/* Event type labels on dial */}
                      {EVENT_TYPES.map((evt, i) => {
                        const rad = (evt.angle * Math.PI) / 180
                        const r = 44
                        const cx = 72
                        const cy = 72
                        const x = cx + r * Math.cos(rad - Math.PI / 2) - 16
                        const y = cy + r * Math.sin(rad - Math.PI / 2) - 8
                        const isSelected = selectedEvent === i
                        return (
                          <button
                            key={i}
                            onClick={() => handleDialSelect(i)}
                            className="absolute flex flex-col items-center"
                            style={{ left: x, top: y, width: 32, height: 18 }}
                            title={evt.label}
                          >
                            <span style={{ fontSize: 9, lineHeight: 1 }}>{evt.icon}</span>
                            <span
                              className="font-poppins"
                              style={{
                                fontSize: 5.5,
                                color: isSelected ? '#f59e0b' : 'rgba(255,255,255,0.3)',
                                letterSpacing: '0.05em',
                                marginTop: 1,
                              }}
                            >
                              {evt.label.toUpperCase()}
                            </span>
                          </button>
                        )
                      })}
                    </motion.div>

                    {/* Glass aperture inner (transparent window) */}
                    <div
                      className="absolute rounded-full overflow-hidden"
                      style={{
                        inset: 38,
                        background: 'radial-gradient(circle at 35% 30%, rgba(245,158,11,0.08), rgba(0,0,0,0.6))',
                        boxShadow: 'inset 0 0 20px rgba(0,0,0,0.9), 0 0 0 1px rgba(245,158,11,0.2)',
                        backdropFilter: 'blur(2px)',
                      }}
                    >
                      {/* Lens glint */}
                      <div
                        className="absolute rounded-full"
                        style={{
                          width: 18, height: 10,
                          background: 'rgba(255,255,255,0.12)',
                          top: 8, left: 10,
                          transform: 'rotate(-30deg)',
                          filter: 'blur(2px)',
                        }}
                      />
                      {/* Selected event display */}
                      {selectedEvent !== null && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                          <span style={{ fontSize: 18 }}>{EVENT_TYPES[selectedEvent].icon}</span>
                          <span className="text-amber-400/70 font-poppins mt-0.5" style={{ fontSize: 8 }}>
                            {EVENT_TYPES[selectedEvent].label}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* "Choose shoot type" hint */}
                    {selectedEvent === null && (
                      <div
                        className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        style={{ left: 38, right: 38, top: 38, bottom: 38 }}
                      >
                        <span className="text-white/20 font-poppins text-center leading-tight" style={{ fontSize: 8 }}>
                          ROTATE<br />DIAL
                        </span>
                      </div>
                    )}
                  </div>

                  {/* ── RIGHT-OF-LENS controls ──── */}
                  <div className="flex flex-col gap-3 flex-1">
                    {/* AF mode */}
                    <div className="text-center">
                      <div className="text-white/20 text-[7px] uppercase tracking-widest mb-1">AF Mode</div>
                      <div className="flex gap-1 justify-center">
                        {['S', 'C', 'M'].map((m, i) => (
                          <div
                            key={m}
                            className="rounded text-[8px] font-mono px-1.5 py-0.5"
                            style={{
                              background: i === 0 ? '#f59e0b' : 'rgba(255,255,255,0.05)',
                              color: i === 0 ? '#000' : 'rgba(255,255,255,0.3)',
                            }}
                          >
                            {m}
                          </div>
                        ))}
                      </div>
                    </div>
                    {/* Exposure comp */}
                    <div>
                      <div className="text-white/20 text-[7px] uppercase tracking-widest mb-1 text-center">±EV</div>
                      <div
                        className="h-1.5 rounded-full overflow-hidden"
                        style={{ background: 'rgba(255,255,255,0.05)' }}
                      >
                        <div className="h-full w-1/2 bg-amber-400 rounded-full" />
                      </div>
                      <div className="flex justify-between mt-0.5">
                        <span className="text-[6px] text-white/20">-3</span>
                        <span className="text-[6px] text-amber-400/70">0</span>
                        <span className="text-[6px] text-white/20">+3</span>
                      </div>
                    </div>
                    {/* ISO */}
                    <div className="text-center">
                      <div className="text-white/20 text-[7px] uppercase tracking-widest">ISO</div>
                      <div className="text-amber-400/70 text-xs font-mono">100</div>
                    </div>
                  </div>
                </div>

                {/* ── POLAROID FILM EJECTOR ──────── */}
                <div className="mt-4 relative">
                  {/* Film slot / eject strip */}
                  <button
                    onClick={() => setPolaroidOpen(v => !v)}
                    className="w-full flex items-center justify-between px-4 py-2 rounded-lg group"
                    style={{
                      background: 'linear-gradient(135deg, #1a1a1a, #111)',
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">
                        {[...Array(8)].map((_, i) => (
                          <div key={i} className="w-1 h-3 rounded-sm"
                            style={{ background: i % 3 === 0 ? '#f59e0b44' : '#ffffff11' }} />
                        ))}
                      </div>
                      <span className="text-white/40 text-[9px] font-mono tracking-wider">FILM BACK</span>
                    </div>
                    <motion.span
                      animate={{ rotate: polaroidOpen ? 90 : 0 }}
                      className="text-amber-400/60 text-sm"
                    >
                      ▶
                    </motion.span>
                  </button>

                  {/* Ejected Polaroid — slides out below */}
                  <AnimatePresence>
                    {polaroidOpen && (
                      <motion.div
                        key="polaroid"
                        initial={{ y: -20, opacity: 0, scaleY: 0.5 }}
                        animate={{ y: 0, opacity: 1, scaleY: 1 }}
                        exit={{ y: -20, opacity: 0, scaleY: 0.5 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 18 }}
                        style={{ originY: 0 }}
                        className="mt-2 rounded-xl overflow-hidden"
                        // Polaroid card styling
                      >
                        <div
                          className="p-5"
                          style={{
                            background: '#f5f0e8',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.6)',
                          }}
                        >
                          {/* Film perforations top */}
                          <div className="flex gap-1 mb-3 justify-center">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className="w-2 h-1 rounded-sm bg-amber-900/15" />
                            ))}
                          </div>
                          {/* Input fields on polaroid */}
                          <div className="space-y-3">
                            <input
                              id="contact-name"
                              type="text"
                              placeholder="Your Name"
                              value={formData.name}
                              onChange={e => setFormData(p => ({ ...p, name: e.target.value }))}
                              className="w-full bg-transparent border-b border-amber-900/25 focus:border-amber-600 text-amber-950 placeholder-amber-900/30 text-sm py-1 outline-none font-playfair italic"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            />
                            <input
                              id="contact-email"
                              type="email"
                              placeholder="Email Address"
                              value={formData.email}
                              onChange={e => setFormData(p => ({ ...p, email: e.target.value }))}
                              className="w-full bg-transparent border-b border-amber-900/25 focus:border-amber-600 text-amber-950 placeholder-amber-900/30 text-sm py-1 outline-none font-playfair italic"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            />
                            <input
                              id="contact-phone"
                              type="tel"
                              placeholder="Phone (optional)"
                              value={formData.phone}
                              onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))}
                              className="w-full bg-transparent border-b border-amber-900/25 focus:border-amber-600 text-amber-950 placeholder-amber-900/30 text-sm py-1 outline-none font-playfair italic"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            />
                            <textarea
                              id="contact-message"
                              placeholder="Tell me about your shoot…"
                              value={formData.message}
                              onChange={e => setFormData(p => ({ ...p, message: e.target.value }))}
                              rows={3}
                              className="w-full bg-transparent border-b border-amber-900/25 focus:border-amber-600 text-amber-950 placeholder-amber-900/30 text-sm py-1 outline-none resize-none font-playfair italic"
                              style={{ fontFamily: "'Playfair Display', serif" }}
                            />
                          </div>
                          {/* Date stamp */}
                          <div className="flex items-center justify-between mt-4">
                            <span className="text-amber-900/25 text-[9px] tracking-widest font-mono uppercase">
                              PB Photography
                            </span>
                            <span className="text-amber-900/25 text-[9px] font-mono">
                              {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </span>
                          </div>
                          {/* Film perforations bottom */}
                          <div className="flex gap-1 mt-3 justify-center">
                            {[...Array(10)].map((_, i) => (
                              <div key={i} className="w-2 h-1 rounded-sm bg-amber-900/15" />
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Bottom grip / rubber pad */}
                <div className="flex justify-between mt-4 px-2">
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1 h-4 rounded-sm" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    ))}
                  </div>
                  <div className="text-white/15 text-[8px] font-mono tracking-wider">α7R IV</div>
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="w-1 h-4 rounded-sm" style={{ background: 'rgba(255,255,255,0.04)' }} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Camera drop shadow plane */}
              <div
                className="absolute -bottom-6 left-1/2 -translate-x-1/2 rounded-full blur-2xl"
                style={{
                  width: 300, height: 30,
                  background: 'rgba(0,0,0,0.5)',
                }}
              />
            </motion.div>

            {/* Usage hint */}
            <p className="mt-8 text-white/25 text-[10px] font-poppins tracking-[0.2em] uppercase text-center">
              Rotate lens dial → open film back → press shutter to send
            </p>
          </motion.div>

        </div>
      </div>
    </section>
  )
}

export default ContactForm