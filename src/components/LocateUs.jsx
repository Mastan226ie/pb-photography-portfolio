import React from 'react'
import { MapPin, Navigation, Clock, ExternalLink } from 'lucide-react'
import Reveal from './Reveal'

const INFO_ITEMS = [
  {
    Icon: MapPin,
    label: 'Address',
    value: 'Vijayawada, Andhra Pradesh, India',
  },
  {
    Icon: Clock,
    label: 'Studio Hours',
    value: 'Mon – Sat · 9 AM – 9 PM',
  },
  {
    Icon: Navigation,
    label: 'Directions',
    value: 'Get Directions →',
    href: 'https://maps.app.goo.gl/EkhFCBWT8pvggnij6',
  },
]

const LocateUs = () => {
  return (
    <section
      id="locate"
      className="py-24 relative overflow-hidden"
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
              Find Us
            </span>
            <h2 className="text-4xl md:text-6xl font-playfair font-bold mt-3 mb-4 text-white">
              Locate <span className="text-amber-500 italic">Us</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto font-poppins text-sm leading-relaxed">
              Visit our studio in <strong className="text-amber-500/80">Vijayawada</strong> or reach out to schedule an on-location shoot anywhere across Andhra Pradesh.
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-stretch max-w-6xl mx-auto">

          {/* LEFT — Info card (2/5) */}
          <Reveal dir="left" className="lg:col-span-2 h-full">
            <div
              className="glass-card rounded-2xl p-8 h-full flex flex-col justify-between border border-white/5 relative overflow-hidden"
            >
              {/* decorative corner glow */}
              <div className="absolute -top-20 -right-20 w-56 h-56 bg-amber-500/8 blur-3xl rounded-full pointer-events-none" />

              <div>
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <p className="text-white font-playfair font-bold text-xl leading-tight">PB Photography</p>
                    <p className="text-amber-500/70 text-[11px] uppercase tracking-widest font-poppins">Vijayawada Studio</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {INFO_ITEMS.map(({ Icon, label, value, href }, i) => (
                    <div key={i} className="flex items-start gap-4 group">
                      <div className="w-11 h-11 rounded-xl bg-white/5 border border-white/8 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-white group-hover:border-amber-500 transition-all duration-300 flex-shrink-0">
                        <Icon className="w-[18px] h-[18px]" />
                      </div>
                      <div className="pt-0.5">
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mb-1 font-poppins">{label}</p>
                        {href ? (
                          <a
                            href={href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-amber-400 hover:text-amber-300 font-medium text-sm font-poppins transition-colors flex items-center gap-1"
                          >
                            {value}
                            <ExternalLink className="w-3 h-3 opacity-70" />
                          </a>
                        ) : (
                          <p className="text-white font-medium text-sm font-poppins">{value}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA button */}
              <a
                href="https://maps.app.goo.gl/EkhFCBWT8pvggnij6"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-10 w-full py-4 px-6 rounded-xl font-poppins font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 hover:scale-[1.02] text-white"
                style={{
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  boxShadow: '0 6px 28px rgba(245,158,11,0.25)',
                }}
              >
                <Navigation className="w-4 h-4" />
                Open in Google Maps
              </a>
            </div>
          </Reveal>

          {/* RIGHT — Map embed (3/5) */}
          <Reveal dir="right" className="lg:col-span-3 h-full">
            <div className="glass-card rounded-2xl overflow-hidden border border-white/5 h-full min-h-[420px] relative group">
              {/* subtle amber border glow on hover */}
              <div className="absolute inset-0 rounded-2xl ring-1 ring-amber-500/0 group-hover:ring-amber-500/20 transition-all duration-500 pointer-events-none z-10" />

              {/* Google Maps iframe — exact PB Photography location */}
              <iframe
                title="PB Photography Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3825.6!2d80.6289158!3d16.5136158!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a35ef413a888f55%3A0x4956fafa4b7c8b8!2sPB%20Photography!5e0!3m2!1sen!2sin!4v1713200000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, display: 'block', minHeight: '380px' }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

export default LocateUs
