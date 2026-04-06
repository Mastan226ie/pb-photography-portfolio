import React, { useState, useRef, useEffect, useCallback } from 'react'
import HTMLFlipBook from 'react-pageflip'
import { X, ChevronLeft, ChevronRight, BookOpen, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

/* ─────────────────────────────────────────
   Individual page components
───────────────────────────────────────── */

// Hard cover page (first & last)
const CoverPage = React.forwardRef(({ album, isBack }, ref) => (
  <div ref={ref} className="relative w-full h-full overflow-hidden select-none">
    {/* Background image */}
    <img
      src={album.coverImage}
      alt={album.title}
      className="absolute inset-0 w-full h-full object-cover"
      draggable={false}
    />
    {/* Dark gradient overlay */}
    <div className={`absolute inset-0 ${isBack
      ? 'bg-gradient-to-r from-black/80 via-black/60 to-black/30'
      : 'bg-gradient-to-l from-black/80 via-black/60 to-black/30'
    }`} />

    {/* Leather texture strips */}
    <div className="absolute inset-0 opacity-10"
      style={{ backgroundImage: 'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 1px,transparent 8px)' }} />

    {!isBack && (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
        {/* Camera icon 3D badge */}
        <motion.div
          animate={{ rotateY: [0, 15, 0, -15, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="w-20 h-20 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center mb-6 backdrop-blur-sm shadow-2xl"
        >
          <Camera className="w-10 h-10 text-amber-400" />
        </motion.div>
        <h1 className="text-3xl md:text-4xl font-playfair font-bold text-center mb-3 drop-shadow-2xl">
          {album.title}
        </h1>
        <div className="w-16 h-px bg-amber-400/70 mx-auto mb-3" />
        <p className="text-white/70 text-sm text-center font-light tracking-wider">
          {album.description}
        </p>
        <div className="absolute bottom-8 left-0 right-0 text-center">
          <p className="text-white/40 text-xs tracking-[0.3em] uppercase">Flip to open →</p>
        </div>
      </div>
    )}

    {isBack && (
      <div className="absolute inset-0 flex flex-col items-center justify-center text-white p-8">
        <BookOpen className="w-12 h-12 text-amber-400/60 mb-4" />
        <p className="text-white/40 text-sm tracking-wider font-light">Lens & Light Photography</p>
      </div>
    )}

    {/* Cover binding strip */}
    <div className={`absolute top-0 bottom-0 w-6 ${isBack ? 'right-0' : 'left-0'} bg-gradient-to-${isBack ? 'l' : 'r'} from-black/60 to-transparent`} />
  </div>
))
CoverPage.displayName = 'CoverPage'


// Inner photo page
const PhotoPage = React.forwardRef(({ photos, pageIndex, side, albumTitle }, ref) => {
  // side: 'left' or 'right'
  const isLeft = side === 'left'

  // Determine which photos belong to this page
  // Each spread has 2 photos (left + right). Spread index = Math.floor(pageIndex / 2)
  const spreadIndex = Math.floor(pageIndex / 2)
  const photo = photos[Math.min(spreadIndex * 2 + (isLeft ? 0 : 1), photos.length - 1)]

  return (
    <div
      ref={ref}
      className={`relative w-full h-full overflow-hidden select-none flex flex-col
        ${isLeft ? 'bg-gradient-to-br from-stone-50 to-amber-50' : 'bg-gradient-to-bl from-stone-50 to-amber-50'}`}
    >
      {/* Paper texture */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\'/%3E%3C/filter%3E%3Crect width=\'200\' height=\'200\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />

      {/* Binding shadow */}
      {isLeft && <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-black/15 to-transparent z-10 pointer-events-none" />}
      {!isLeft && <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-black/15 to-transparent z-10 pointer-events-none" />}

      {/* Page content */}
      <div className="flex flex-col h-full p-5 gap-3">
        {/* Main photo */}
        <div className="flex-1 rounded-md overflow-hidden shadow-lg ring-1 ring-black/10 relative group">
          {photo ? (
            <img
              src={photo}
              alt={`${albumTitle} page`}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              draggable={false}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <Camera className="w-10 h-10 text-gray-400" />
            </div>
          )}
          {/* Photo mat border */}
          <div className="absolute inset-1.5 ring-1 ring-white/40 rounded pointer-events-none" />
        </div>

        {/* Caption bar */}
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] text-amber-700/60 uppercase tracking-widest font-semibold">
            {albumTitle}
          </span>
          <span className="text-[10px] text-gray-400 tabular-nums">
            {pageIndex + 1}
          </span>
        </div>
      </div>
    </div>
  )
})
PhotoPage.displayName = 'PhotoPage'


/* ─────────────────────────────────────────
   Main AlbumBook component
───────────────────────────────────────── */
const AlbumBook = ({ album, onClose }) => {
  const bookRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)
  const [isFlipping, setIsFlipping] = useState(false)

  // Build pages array:
  // Page 0 = front cover
  // Pages 1..N = photo pages (pairs)
  // Last page = back cover
  const photos = album.photos || []

  // We want spreads: each spread has left + right photo
  // Number of inner page pairs needed = ceil(photos.length / 2)
  // Each pair = 2 pages (left page + right page)
  const innerPagePairs = Math.ceil(photos.length / 2)
  // total pages: front cover + inner pages (pairs * 2) + back cover
  const pages = [
    { type: 'cover', side: 'front' },
    ...Array.from({ length: innerPagePairs }, (_, i) => [
      { type: 'photo', pageIndex: i * 2, side: 'left' },
      { type: 'photo', pageIndex: i * 2, side: 'right' },
    ]).flat(),
    { type: 'cover', side: 'back' },
  ]

  useEffect(() => {
    setTotalPages(pages.length)
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = 'unset' }
  }, [pages.length])

  const isFirst = currentPage === 0
  const isLast = currentPage >= totalPages - 2

  const flipNext = useCallback(() => {
    if (!isFlipping && !isLast) {
      setIsFlipping(true)
      bookRef.current?.pageFlip().flipNext()
      setTimeout(() => setIsFlipping(false), 700)
    }
  }, [isFlipping, isLast])

  const flipPrev = useCallback(() => {
    if (!isFlipping && !isFirst) {
      setIsFlipping(true)
      bookRef.current?.pageFlip().flipPrev()
      setTimeout(() => setIsFlipping(false), 700)
    }
  }, [isFlipping, isFirst])

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') flipNext()
      if (e.key === 'ArrowLeft') flipPrev()
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [flipNext, flipPrev, onClose])

  const onFlip = (e) => {
    setCurrentPage(e.data)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-neutral-950/97 backdrop-blur-md overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at center, #1c1a17 0%, #0a0908 100%)' }}
    >
      {/* Background bokeh lights */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full blur-3xl opacity-10"
            style={{
              background: i % 2 === 0 ? '#f59e0b' : '#d97706',
              width: `${80 + i * 40}px`,
              height: `${80 + i * 40}px`,
              left: `${10 + i * 20}%`,
              top: `${20 + (i % 3) * 25}%`,
            }}
            animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
            transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </div>

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between w-full max-w-5xl px-4 mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span className="text-amber-400 font-playfair font-semibold text-lg">{album.title}</span>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-1.5 text-white/50 hover:text-white transition-colors group"
        >
          <span className="text-xs tracking-wider group-hover:text-amber-400 transition-colors">Close</span>
          <X className="w-5 h-5 group-hover:text-amber-400 transition-colors" />
        </button>
      </div>

      {/* ── THE BOOK ── */}
      <div className="relative z-10 flex items-center gap-4">
        {/* Prev arrow */}
        <motion.button
          onClick={flipPrev}
          disabled={isFirst || isFlipping}
          whileHover={{ scale: 1.1, x: -3 }}
          whileTap={{ scale: 0.9 }}
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-200
            ${isFirst ? 'opacity-20 cursor-not-allowed bg-white/5' : 'bg-amber-500/90 hover:bg-amber-400 cursor-pointer'}`}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>

        {/* Book wrapper with drop shadow */}
        <div className="relative" style={{ filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.7))' }}>
          <HTMLFlipBook
            ref={bookRef}
            width={380}
            height={520}
            size="fixed"
            minWidth={200}
            maxWidth={500}
            minHeight={300}
            maxHeight={700}
            maxShadowOpacity={0.6}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={onFlip}
            className="book-flip"
            style={{ fontFamily: "'Playfair Display', serif" }}
            flippingTime={700}
            usePortrait={false}
            startZIndex={0}
            autoSize={false}
            drawShadow={true}
            clickEventForward={true}
            useMouseEvents={true}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {/* Front Cover */}
            <CoverPage album={album} isBack={false} />

            {/* Inner photo pages */}
            {Array.from({ length: innerPagePairs }, (_, i) => [
              <PhotoPage
                key={`L${i}`}
                photos={photos}
                pageIndex={i * 2}
                side="left"
                albumTitle={album.title}
              />,
              <PhotoPage
                key={`R${i}`}
                photos={photos}
                pageIndex={i * 2}
                side="right"
                albumTitle={album.title}
              />,
            ]).flat()}

            {/* Back Cover */}
            <CoverPage album={album} isBack={true} />
          </HTMLFlipBook>

          {/* Book spine glow */}
          <div className="absolute left-1/2 top-0 bottom-0 w-2 -translate-x-1/2 pointer-events-none z-20"
            style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.4), rgba(245,158,11,0.15), rgba(0,0,0,0.4))' }} />
        </div>

        {/* Next arrow */}
        <motion.button
          onClick={flipNext}
          disabled={isLast || isFlipping}
          whileHover={{ scale: 1.1, x: 3 }}
          whileTap={{ scale: 0.9 }}
          className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-200
            ${isLast ? 'opacity-20 cursor-not-allowed bg-white/5' : 'bg-amber-500/90 hover:bg-amber-400 cursor-pointer'}`}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Progress dots */}
      <div className="relative z-10 flex items-center gap-2 mt-6">
        {Array.from({ length: Math.ceil(totalPages / 2) }, (_, i) => {
          const spread = Math.floor(currentPage / 2)
          const isActive = spread === i
          return (
            <button
              key={i}
              onClick={() => {
                const target = i * 2
                const current = bookRef.current?.pageFlip().getCurrentPageIndex() || 0
                if (target > current) {
                  for (let j = 0; j < (target - current) / 2; j++) {
                    setTimeout(() => bookRef.current?.pageFlip().flipNext(), j * 720)
                  }
                } else {
                  for (let j = 0; j < (current - target) / 2; j++) {
                    setTimeout(() => bookRef.current?.pageFlip().flipPrev(), j * 720)
                  }
                }
              }}
              className={`transition-all duration-300 rounded-full
                ${isActive ? 'w-6 h-2 bg-amber-400' : 'w-2 h-2 bg-white/20 hover:bg-white/40'}`}
              aria-label={`Go to spread ${i + 1}`}
            />
          )
        })}
      </div>

      {/* Keyboard hint */}
      <p className="relative z-10 mt-3 text-white/20 text-xs tracking-widest">
        ← → arrow keys &nbsp;·&nbsp; click corners &nbsp;·&nbsp; swipe &nbsp;·&nbsp; ESC to close
      </p>
    </div>
  )
}

export default AlbumBook