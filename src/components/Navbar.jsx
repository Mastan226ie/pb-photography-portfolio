import React, { useState, useEffect } from 'react'
import { Camera, Menu, X } from 'lucide-react'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Albums', href: '#albums' },
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Contact', href: '#contact' },
  ]

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/95 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="container-custom flex justify-between items-center">
        <a href="#home" className="flex items-center space-x-2 text-2xl font-playfair font-bold">
          <Camera className="w-8 h-8 text-amber-500" />
          <span className="text-white">Lens<span className="text-amber-500">&</span>Light</span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-white hover:text-amber-500 transition-colors duration-300 font-medium"
            >
              {link.name}
            </a>
          ))}
          <a
            href="#contact"
            className="bg-amber-500 hover:bg-amber-600 px-6 py-2 rounded-full text-white font-semibold transition-all duration-300"
          >
            Book Now
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md absolute top-full left-0 w-full py-4">
          <div className="flex flex-col items-center space-y-4">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="text-white hover:text-amber-500 transition-colors duration-300 font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-amber-500 hover:bg-amber-600 px-6 py-2 rounded-full text-white font-semibold transition-all duration-300"
              onClick={() => setIsOpen(false)}
            >
              Book Now
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar