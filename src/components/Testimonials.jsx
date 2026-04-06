import React, { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const testimonials = [
  {
    id: 1,
    name: "Sarah Johnson",
    role: "Wedding Client",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop",
    content: "Absolutely breathtaking work! The photos captured every special moment of our wedding day perfectly. The attention to detail and creativity was outstanding. We'll cherish these memories forever.",
    rating: 5,
    date: "December 2024"
  },
  {
    id: 2,
    name: "Michael Chen",
    role: "Portrait Client",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop",
    content: "Incredible photographer! Made me feel completely comfortable during the shoot. The results exceeded all expectations. Professional, creative, and truly talented.",
    rating: 5,
    date: "November 2024"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    role: "Family Session",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop",
    content: "Amazing experience from start to finish. The photos captured our family's personality perfectly. The book opening animation on the website is such a beautiful way to showcase the work!",
    rating: 5,
    date: "January 2025"
  },
  {
    id: 4,
    name: "David Kim",
    role: "Corporate Event",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop",
    content: "Professional, punctual, and produced stunning results. The team captured our corporate event perfectly. Highly recommended for any professional photography needs.",
    rating: 5,
    date: "October 2024"
  }
]

const Testimonials = () => {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length)
  }

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length)
  }

  return (
    <section id="testimonials" className="py-20 bg-black relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-amber-500 rounded-full blur-[100px]"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-600 rounded-full blur-[120px]"></div>
      </div>

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm">Client Love</span>
          <h2 className="text-4xl md:text-5xl font-playfair font-bold mt-2 mb-4">
            What Our <span className="text-amber-500">Clients Say</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Don't just take our word for it - hear from the amazing people we've had the pleasure of working with.
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5 }}
              className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 md:p-12 shadow-2xl"
            >
              <Quote className="w-12 h-12 text-amber-500 mb-6 opacity-50" />
              <p className="text-xl md:text-2xl text-gray-200 mb-6 leading-relaxed">
                "{testimonials[currentIndex].content}"
              </p>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <img
                    src={testimonials[currentIndex].image}
                    alt={testimonials[currentIndex].name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-amber-500"
                  />
                  <div>
                    <h4 className="text-xl font-semibold text-white">{testimonials[currentIndex].name}</h4>
                    <p className="text-gray-400">{testimonials[currentIndex].role}</p>
                    <div className="flex gap-1 mt-1">
                      {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="text-gray-500 text-sm">{testimonials[currentIndex].date}</div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-2 rounded-full bg-gray-800 hover:bg-amber-500 transition-all duration-300 group"
            >
              <ChevronLeft className="w-6 h-6 text-white group-hover:text-black" />
            </button>
            <div className="flex gap-2">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'w-8 bg-amber-500' : 'bg-gray-600 hover:bg-gray-400'}`}
                />
              ))}
            </div>
            <button
              onClick={nextTestimonial}
              className="p-2 rounded-full bg-gray-800 hover:bg-amber-500 transition-all duration-300 group"
            >
              <ChevronRight className="w-6 h-6 text-white group-hover:text-black" />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
          {[
            { number: "500+", label: "Happy Clients" },
            { number: "1000+", label: "Photos Taken" },
            { number: "50+", label: "Events Covered" },
            { number: "100%", label: "Satisfaction" },
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <h3 className="text-3xl md:text-4xl font-bold text-amber-500">{stat.number}</h3>
              <p className="text-gray-400 mt-2">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Testimonials