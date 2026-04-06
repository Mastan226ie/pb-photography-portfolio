import React from 'react'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?w=1600&h=900&fit=crop"
          alt="Photography"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="container-custom relative z-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-amber-500 font-semibold tracking-wider uppercase text-sm">Premium Photography</span>
            <h1 className="text-5xl md:text-7xl font-playfair font-bold mt-4 mb-6">
              Capturing Moments,
              <br />
              Creating <span className="text-amber-500">Memories</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              Professional photography services that tell your unique story. 
              From weddings to portraits, we capture life's most precious moments with artistry and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#contact"
                className="btn-primary inline-flex items-center justify-center gap-2 group"
              >
                Book a Session
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#albums"
                className="btn-secondary inline-flex items-center justify-center"
              >
                View Portfolio
              </a>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-12">
              {[
                {
                  href: "#",
                  label: "Instagram",
                  svg: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                },
                {
                  href: "#",
                  label: "LinkedIn",
                  svg: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
                },
                {
                  href: "#",
                  label: "YouTube",
                  svg: <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.495 6.205a3.007 3.007 0 0 0-2.088-2.088c-1.87-.501-9.396-.501-9.396-.501s-7.507-.01-9.396.501A3.007 3.007 0 0 0 .527 6.205a31.247 31.247 0 0 0-.522 5.805 31.247 31.247 0 0 0 .522 5.783 3.007 3.007 0 0 0 2.088 2.088c1.868.502 9.396.502 9.396.502s7.506 0 9.396-.502a3.007 3.007 0 0 0 2.088-2.088 31.247 31.247 0 0 0 .5-5.783 31.247 31.247 0 0 0-.5-5.805zM9.609 15.601V8.408l6.264 3.602z"/></svg>
                },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="w-10 h-10 rounded-full border border-white/30 flex items-center justify-center hover:bg-amber-500 hover:border-amber-500 transition-all duration-300 pointer-events-auto"
                >
                  {social.svg}
                </a>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Floating 3D Photography Elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/2 h-[800px] hidden lg:block z-20 pointer-events-none perspective-[2000px]">
        {/* Main 3D Camera Focus */}
        <motion.div
          initial={{ opacity: 0, x: 100, rotateY: 30 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: [-15, 15, -15],
            rotateY: [-25, -15, -25],
            rotateX: [5, 15, 5]
          }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 right-24 w-80 h-80 rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.5)] border-8 border-white/10 overflow-hidden backdrop-blur-sm"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img 
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&h=600&fit=crop"
            alt="3D Camera"
            className="w-full h-full object-cover opacity-90"
          />
        </motion.div>

        {/* Floating Polaroid 1 */}
        <motion.div
          initial={{ opacity: 0, x: 50, rotateZ: 45 }}
          animate={{ 
            opacity: 1, 
            x: 0,
            y: [0, 20, 0],
            rotateZ: [12, 20, 12],
            rotateY: [15, 25, 15]
          }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-80 right-72 w-56 bg-white p-4 shadow-[0_20px_40px_-5px_rgba(0,0,0,0.4)] rounded-sm"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img src="https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=400&h=400&fit=crop" className="w-full h-48 object-cover rounded-sm shadow-inner" alt="Wedding" />
          <div className="h-10 bg-white flex items-center justify-center font-playfair text-amber-900/40 text-sm font-semibold">Love Stories</div>
        </motion.div>

        {/* Floating Polaroid 2 */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotateZ: -30 }}
          animate={{ 
            opacity: 1, 
            y: [0, -15, 0],
            rotateZ: [-15, -8, -15],
            rotateX: [10, 20, 10]
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute top-48 right-12 w-48 bg-white p-3 shadow-[0_30px_50px_-5px_rgba(0,0,0,0.5)] rounded-sm"
          style={{ transformStyle: 'preserve-3d' }}
        >
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" className="w-full h-40 object-cover rounded-sm shadow-inner" alt="Portrait" />
          <div className="h-8 bg-white flex items-center justify-center font-playfair text-amber-900/40 text-xs font-semibold">Portraits</div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2"></div>
        </div>
      </motion.div>
    </section>
  )
}

export default Hero