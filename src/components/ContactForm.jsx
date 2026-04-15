import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Phone, Mail, MapPin, Clock, MessageCircle, Send, CheckCircle2 } from 'lucide-react'
import Reveal from './Reveal'

const ContactForm = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', eventType: 'Wedding', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!formData.name.trim())  e.name  = 'Required'
    if (!formData.email.trim()) e.email = 'Required'
    else if (!/\S+@\S+\.\S+/.test(formData.email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validate()) return
    setIsSubmitting(true)
    // Simulate sending
    setTimeout(() => {
      setSubmitted(true)
      setIsSubmitting(false)
      setFormData({ name: '', email: '', phone: '', eventType: 'Wedding', message: '' })
      setErrors({})
      setTimeout(() => setSubmitted(false), 5000)
    }, 1500)
  }

  const handleWhatsApp = () => {
    const msg = encodeURIComponent(`Hi PB Photography! I'd like to book a ${formData.eventType} photography session.`)
    window.open(`https://wa.me/918008360032?text=${msg}`, '_blank')
  }

  const update = (field) => (e) => setFormData(p => ({ ...p, [field]: e.target.value }))

  return (
    <section
      id="contact"
      className="py-24 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #111 50%, #0a0a0a 100%)' }}
    >
      {/* Background blurs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl opacity-50" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-amber-600/5 rounded-full blur-3xl opacity-50" />
      </div>

      <div className="container-custom relative z-10">
        {/* Section Header */}
        <Reveal dir="up">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-semibold tracking-[0.3em] uppercase text-xs font-poppins">Get In Touch</span>
            <h2 className="text-4xl md:text-6xl font-playfair font-bold mt-3 mb-4">
              Let's Create <span className="text-amber-500 italic">Something</span>
              <br />Beautiful
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto font-poppins text-sm leading-relaxed">
              We'd love to hear about your upcoming project. Fill out the form below or reach out directly to capture your story with <strong className="text-amber-500/80">PB Photography</strong>.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch max-w-6xl mx-auto">
          {/* LEFT — Contact info */}
          <Reveal dir="left" className="h-full">
            <div className="glass-card rounded-2xl p-8 md:p-10 h-full flex flex-col justify-between border border-white/5 relative overflow-hidden">
              {/* Decorative gradient */}
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />
              
              <div>
                <h3 className="text-3xl font-playfair font-bold mb-2 text-white">PB Photography</h3>
                <p className="text-amber-500/80 text-sm tracking-widest uppercase font-poppins mb-10">Vijayawada, India</p>
                
                <div className="space-y-8">
                  {[
                    { Icon: Phone,  label: 'Phone',    value: '+91 80083 60032',              href: 'tel:+918008360032' },
                    { Icon: Mail,   label: 'Email',    value: 'pbvideography.0032@gmail.com', href: 'mailto:pbvideography.0032@gmail.com' },
                    { Icon: MapPin, label: 'Location', value: 'Vijayawada, Andhra Pradesh' },
                    { Icon: Clock,  label: 'Hours',    value: 'Mon – Sat · 9 AM – 9 PM' },
                  ].map(({ Icon, label, value, href }, i) => (
                    <div key={i} className="flex items-start gap-5 group">
                      <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all duration-300 flex-shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="pt-1">
                        <p className="text-gray-500 text-[11px] uppercase tracking-widest mb-1 font-poppins">{label}</p>
                        {href
                          ? <a href={href} className="text-white hover:text-amber-400 transition-colors font-medium text-base break-all font-poppins">{value}</a>
                          : <p className="text-white font-medium text-base font-poppins">{value}</p>
                        }
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={handleWhatsApp}
                className="mt-12 w-full py-4 px-6 rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-3 group transition-all duration-300 hover:scale-[1.02]"
                style={{ background: 'linear-gradient(135deg, #22c55e, #16a34a)', boxShadow: '0 6px 24px rgba(34,197,94,0.2)' }}
              >
                <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Chat on WhatsApp
              </button>
            </div>
          </Reveal>

          {/* RIGHT — Standard Form */}
          <Reveal dir="right" className="h-full">
            <div className="glass-card rounded-2xl p-8 md:p-10 h-full border border-white/5 bg-[#141414]/60 relative flex flex-col">
               <AnimatePresence>
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#141414]/95 backdrop-blur-md rounded-2xl border border-amber-500/20"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: "spring", damping: 15, delay: 0.1 }}
                      className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mb-4 text-amber-500"
                    >
                      <CheckCircle2 className="w-8 h-8" />
                    </motion.div>
                    <h3 className="text-2xl font-playfair font-bold text-white mb-2">Message Sent</h3>
                    <p className="text-gray-400 font-poppins text-sm text-center px-6">
                      Thank you for reaching out! We'll get back to you shortly to discuss your photography needs.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10 flex flex-col flex-1">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins block">Full Name</label>
                    <input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={update('name')}
                      className={`w-full bg-black/40 border ${errors.name ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none transition-colors font-poppins text-sm`}
                    />
                    {errors.name && <p className="text-red-500 text-xs mt-1 font-poppins">{errors.name}</p>}
                  </div>
                  
                  {/* Email */}
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins block">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={update('email')}
                      className={`w-full bg-black/40 border ${errors.email ? 'border-red-500/50' : 'border-white/10'} focus:border-amber-500 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none transition-colors font-poppins text-sm`}
                    />
                    {errors.email && <p className="text-red-500 text-xs mt-1 font-poppins">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Phone */}
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins block">Phone (Optional)</label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={update('phone')}
                      className="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none transition-colors font-poppins text-sm"
                    />
                  </div>
                  
                  {/* Event Type */}
                  <div className="space-y-2">
                    <label htmlFor="eventType" className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins block">Event Type</label>
                    <div className="relative">
                      <select
                        id="eventType"
                        value={formData.eventType}
                        onChange={update('eventType')}
                        className="w-full bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3.5 text-white outline-none transition-colors font-poppins text-sm appearance-none"
                      >
                        <option value="Wedding">Wedding</option>
                        <option value="Portrait">Portrait</option>
                        <option value="Corporate">Corporate</option>
                        <option value="Event">Event</option>
                        <option value="Fashion">Fashion</option>
                        <option value="Other">Other</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-white/50 text-xs">
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-2 flex-col flex flex-1">
                  <label htmlFor="message" className="text-[11px] uppercase tracking-widest text-gray-400 font-poppins block">Your Message</label>
                  <textarea
                    id="message"
                    placeholder="Tell us about your event, preferred dates, or specific requirements..."
                    value={formData.message}
                    onChange={update('message')}
                    className="w-full flex-1 min-h-[120px] bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3.5 text-white placeholder-white/20 outline-none transition-colors font-poppins text-sm resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="mt-auto w-full py-4 px-6 rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-3 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden flex-shrink-0"
                  style={{ background: 'linear-gradient(135deg, #f59e0b, #d97706)' }}
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
                  <span className="relative z-10 flex items-center gap-2 text-white">
                    {isSubmitting ? 'Sending Message...' : 'Send Message'}
                    {!isSubmitting && <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />}
                  </span>
                </button>
              </form>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default ContactForm