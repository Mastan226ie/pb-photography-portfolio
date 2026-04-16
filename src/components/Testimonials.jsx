import React, { useState, useEffect } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote, Loader2 } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Reveal from './Reveal'
import api from '../api/axios'

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data } = await api.get('/testimonials')
        setTestimonials(data)
      } catch (error) {
        console.error('Failed to fetch testimonials:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchTestimonials()
  }, [])

  const nextTestimonial = () => {
    if (testimonials.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    if (testimonials.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="container-custom relative z-10">
        <Reveal dir="up">
          <div className="text-center mb-12">
            <span className="text-amber-500 font-semibold tracking-[0.3em] uppercase text-sm font-poppins">Client Love</span>
            <h2 className="text-4xl md:text-5xl font-playfair font-bold mt-2 mb-4">
              What Our <span className="text-amber-500">Clients Say</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto font-poppins text-sm leading-relaxed">
              Don't just take our word for it - hear from the amazing people we've had the pleasure of working with.
            </p>
          </div>
        </Reveal>

        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="h-[400px] flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-amber-500 animate-spin" />
            </div>
          ) : testimonials.length > 0 ? (
            <>
              <Reveal delay={0.2} random>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    className="bg-gradient-to-br from-gray-900 to-[#121212] rounded-3xl p-8 md:p-14 shadow-2xl border border-white/5 relative overflow-hidden"
                  >
                    <Quote className="absolute top-8 right-8 w-20 h-20 text-amber-500/5 pointer-events-none" />
                    
                    <p className="text-xl md:text-2xl text-gray-200 mb-10 leading-relaxed font-playfair italic">
                      "{testimonials[currentIndex].content}"
                    </p>
                    
                    <div className="flex items-center justify-between flex-wrap gap-6 pt-8 border-t border-white/5">
                      <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full border-2 border-amber-500/30 overflow-hidden ring-4 ring-black">
                            <img
                            src={testimonials[currentIndex].image}
                            alt={testimonials[currentIndex].name}
                            className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                          <h4 className="text-xl font-playfair font-bold text-white mb-0.5">{testimonials[currentIndex].name}</h4>
                          <p className="text-amber-500 text-[10px] uppercase font-bold tracking-[0.2em]">{testimonials[currentIndex].role}</p>
                          <div className="flex gap-1 mt-2">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < testimonials[currentIndex].rating ? 'fill-amber-500 text-amber-500' : 'text-gray-700'}`} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="text-gray-600 text-[10px] uppercase tracking-widest font-mono font-bold bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                        {testimonials[currentIndex].date}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </Reveal>

              <div className="flex justify-center gap-6 mt-12 items-center">
                <button
                  onClick={prevTestimonial}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500 hover:text-amber-500 transition-all group"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-400 group-hover:text-amber-500 transition-colors" />
                </button>
                <div className="flex gap-2.5">
                  {testimonials.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx === currentIndex ? 'w-10 bg-amber-500' : 'w-2 bg-gray-800 hover:bg-gray-600'}`}
                    />
                  ))}
                </div>
                <button
                  onClick={nextTestimonial}
                  className="w-12 h-12 flex items-center justify-center rounded-2xl bg-white/5 border border-white/10 hover:border-amber-500 hover:text-amber-500 transition-all group"
                >
                  <ChevronRight className="w-6 h-6 text-gray-400 group-hover:text-amber-500 transition-colors" />
                </button>
              </div>
            </>
          ) : (
             <div className="text-center py-20 bg-white/[0.02] border border-dashed border-white/10 rounded-3xl">
                <p className="text-gray-500 uppercase tracking-widest text-xs font-bold">No verified feedback yet</p>
             </div>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mt-24 max-w-5xl mx-auto">
          {[
            { number: "500+", label: "Happy Clients" },
            { number: "1000+", label: "Photos Taken" },
            { number: "50+", label: "Events Covered" },
            { number: "100%", label: "Satisfaction" },
          ].map((stat, idx) => (
            <Reveal key={idx} delay={idx * 0.1}>
              <div className="text-center group">
                <h3 className="text-4xl md:text-5xl font-playfair font-bold text-white group-hover:text-amber-500 transition-colors duration-500">{stat.number}</h3>
                <p className="text-gray-500 text-[10px] uppercase tracking-[0.2em] font-bold mt-2">{stat.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials