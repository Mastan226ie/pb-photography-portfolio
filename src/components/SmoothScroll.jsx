import React, { useEffect } from 'react'

/**
 * SmoothScroll – native RAF + lerp implementation.
 * Replicates the same silky feel previously provided by the `lenis` package:
 *   - easeOutExpo easing
 *   - lerp factor 0.07 (very smooth / cinematic)
 *   - wheel multiplier 0.9
 * No external dependencies required.
 */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    // Enable smooth-scroll via CSS as a baseline (handles anchor links etc.)
    document.documentElement.style.scrollBehavior = 'auto'

    let currentY = window.scrollY
    let targetY = window.scrollY
    let rafId = null
    let isRunning = false

    const lerp = (start, end, factor) => start + (end - start) * factor

    // easeOutExpo – matches the original lenis config exactly
    const easeOutExpo = (t) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t))

    const wheelMultiplier = 0.9

    const onWheel = (e) => {
      e.preventDefault()
      targetY += e.deltaY * wheelMultiplier
      // Clamp to document bounds
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight
      targetY = Math.max(0, Math.min(targetY, maxScroll))

      if (!isRunning) {
        isRunning = true
        rafId = requestAnimationFrame(tick)
      }
    }

    const tick = () => {
      const diff = targetY - currentY
      // Stop animating when close enough (sub-pixel)
      if (Math.abs(diff) < 0.5) {
        currentY = targetY
        window.scrollTo(0, currentY)
        isRunning = false
        return
      }

      // Apply easeOutExpo to the progress ratio, then lerp
      const progress = Math.min(Math.abs(diff) / window.innerHeight, 1)
      const easedFactor = 0.07 + easeOutExpo(progress) * 0.03
      currentY = lerp(currentY, targetY, easedFactor)
      window.scrollTo(0, currentY)
      rafId = requestAnimationFrame(tick)
    }

    // Sync targetY when user uses keyboard / scrollbar directly
    const onScroll = () => {
      if (!isRunning) {
        currentY = window.scrollY
        targetY = window.scrollY
      }
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('scroll', onScroll)
      if (rafId) cancelAnimationFrame(rafId)
      document.documentElement.style.scrollBehavior = ''
    }
  }, [])

  return <>{children}</>
}

export default SmoothScroll
