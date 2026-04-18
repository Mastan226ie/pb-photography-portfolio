import React, { useState } from 'react'
import { Star, Send, MessageSquare, MapPin } from 'lucide-react'
import Reveal from './Reveal'
import api from '../api/axios'
import toast from 'react-hot-toast'

const LocateUs = () => {
  const [feedback, setFeedback] = useState({ name: '', role: '', email: '', content: '', rating: 0 })
  const [hoverRating, setHoverRating] = useState(0)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // States for map interaction to prevent scroll trapping
  const [mapHovered, setMapHovered] = useState(false)
  const [mapInteractive, setMapInteractive] = useState(false)

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault()
    if (!feedback.name.trim() || !feedback.content.trim()) {
      toast.error('Name and feedback are required')
      return
    }
    if (!feedback.email.trim() || !/\S+@\S+\.\S+/.test(feedback.email)) {
      toast.error('A valid email is required')
      return
    }
    if (feedback.rating === 0) {
      toast.error('Please select a star rating')
      return
    }
    
    setIsSubmitting(true)
    try {
      await api.post('/testimonials/public', feedback)
      setFeedback({ name: '', role: '', content: '', rating: 0 })
      toast.success('Thank you for your feedback! It has been submitted for review.')
    } catch (error) {
      toast.error('Failed to submit feedback. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section
      id="locate"
      className="py-16 relative overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #0a0a0a 0%, #0d0d0d 50%, #0a0a0a 100%)' }}
    >
      {/* ── Ambient background glows ─────── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-amber-500/4 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-600/4 rounded-full blur-[100px]" />
      </div>

      <div className="container-custom relative z-10">

        {/* ── Section Header ───────────────── */}
        <Reveal dir="up">
          <div className="text-center mb-16">
            <span className="text-amber-500 font-semibold tracking-[0.3em] uppercase text-xs font-poppins">
              Share Your Experience
            </span>
            <h2 className="text-4xl md:text-6xl font-playfair font-bold mt-3 mb-4 text-white">
              Client <span className="text-amber-500 italic">Feedback</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto font-poppins text-sm leading-relaxed">
              We highly value your feedback. Let us know about your experience with <strong className="text-amber-500/80">PB Photography</strong>.
            </p>

            {/* amber divider rule */}
            <div className="flex items-center justify-center gap-3 mt-8">
              <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/60" />
            </div>
          </div>
        </Reveal>

        {/* ── Main grid ───────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 items-stretch max-w-5xl mx-auto">

          {/* LEFT — Feedback Form (2/5) */}
          <Reveal dir="left" className="lg:col-span-2 h-full">
            <div className="glass-card rounded-2xl p-8 h-full flex flex-col justify-between border border-white/5 relative overflow-hidden bg-[#141414]/60">
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/8 blur-3xl rounded-full pointer-events-none" />

              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-playfair font-bold text-xl leading-tight">Leave Feedback</p>
                    <p className="text-amber-500/70 text-[11px] uppercase tracking-widest font-poppins">Tell Us About Your Event</p>
                  </div>
                </div>

                <form onSubmit={handleFeedbackSubmit} className="space-y-5 relative z-10">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Your Name *</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={feedback.name}
                      onChange={(e) => setFeedback({...feedback, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition-colors font-poppins text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Email Address *</label>
                    <input
                      type="email"
                      placeholder="email@example.com"
                      value={feedback.email}
                      onChange={(e) => setFeedback({...feedback, email: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition-colors font-poppins text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Role / Event Type</label>
                    <input
                      type="text"
                      placeholder="e.g. Wedding Client, Wedding Guest..."
                      value={feedback.role}
                      onChange={(e) => setFeedback({...feedback, role: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition-colors font-poppins text-sm"
                    />
                  </div>

                  <div className="space-y-1.5 flex-col flex">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Rating</label>
                    <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-xl px-4 py-2.5">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const active = hoverRating ? hoverRating >= star : feedback.rating >= star;
                        return (
                        <button
                          type="button"
                          key={star}
                          onClick={() => setFeedback({...feedback, rating: star})}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          className="focus:outline-none transition-transform hover:scale-110"
                        >
                          <Star 
                            className={`w-5 h-5 transition-colors duration-200 ${active ? 'fill-amber-500 text-amber-500' : 'text-white/20'}`} 
                          />
                        </button>
                      )})}
                    </div>
                  </div>

                  <div className="space-y-1.5 flex-col flex">
                    <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold ml-1">Your Narrative *</label>
                    <textarea
                      placeholder="Describe your experience with us..."
                      value={feedback.content}
                      onChange={(e) => setFeedback({...feedback, content: e.target.value})}
                      className="w-full min-h-[100px] bg-white/5 border border-white/10 focus:border-amber-500 rounded-xl px-4 py-3 text-white placeholder-white/20 outline-none transition-colors font-poppins text-sm resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 px-6 rounded-xl font-poppins font-bold text-xs uppercase tracking-[0.15em] flex items-center justify-center gap-2 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden text-white"
                    style={{
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      boxShadow: '0 6px 28px rgba(245,158,11,0.25)',
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                       {isSubmitting ? 'Submitting...' : 'Submit Feedback'}
                       {!isSubmitting && <Send className="w-4 h-4" />}
                    </span>
                  </button>
                </form>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — Map embed (3/5) */}
          <Reveal dir="right" className="lg:col-span-3 h-full">
            <div className="glass-card rounded-2xl p-8 h-full flex flex-col border border-white/5 relative overflow-hidden bg-[#141414]/60 group">
              <div className="absolute -bottom-20 -left-20 w-56 h-56 bg-amber-500/5 blur-3xl rounded-full pointer-events-none" />

              {/* Matching Header Structure */}
              <div className="flex items-center gap-3 mb-8 relative z-10">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center transition-colors group-hover:bg-amber-500/20">
                  <MapPin className="w-5 h-5 text-amber-400" />
                </div>
                <div>
                  <p className="text-white font-playfair font-bold text-xl leading-tight">Our Studio</p>
                  <p className="text-amber-500/70 text-[11px] uppercase tracking-widest font-poppins">PB Photography Location</p>
                </div>
              </div>

              {/* Minimal Map Container */}
              <div 
                className="flex-1 rounded-xl overflow-hidden relative ring-1 ring-white/10 group-hover:ring-amber-500/30 transition-all duration-500 min-h-[300px]"
                onMouseEnter={() => setMapHovered(true)}
                onMouseLeave={() => { setMapHovered(false); setMapInteractive(false); }}
                onClick={() => setMapInteractive(true)}
                title={!mapInteractive ? "Click to interact with map" : ""}
                data-lenis-prevent="true"
              >
                {/* Overlay to catch scroll unless interactive */}
                {!mapInteractive && <div className="absolute inset-0 z-10 cursor-pointer" />}

                {/* Google Maps iframe — exact PB Photography location */}
                <iframe
                  title="PB Photography Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.6!2d80.6289158!3d16.5136158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35ef413a888f55%3A0x4956fafa4b7c8b8!2sPB%20Photography!5e0!3m2!1sen!2sin!4v1713200000000!5m2!1sen!2sin"
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ${
                    mapHovered 
                      ? 'opacity-100 grayscale-0 mix-blend-normal' 
                      : 'opacity-60 mix-blend-luminosity grayscale contrast-125'
                  }`}
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  fetchPriority="low"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default LocateUs
