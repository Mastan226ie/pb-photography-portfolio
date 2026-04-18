import React, { useMemo } from 'react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

/**
 * Reveal — scroll-triggered entrance with random sideways/dramatic directions.
 * Biased heavily toward left/right to give a cinematic "sliding in" feel.
 */

const DIRECTIONS = [
  'left', 'right',       // most common — sideways slide
  'left', 'right',       // extra weight on sides
  'scale-left',          // scale + slide from left
  'scale-right',         // scale + slide from right
  'up',                  // classic up
  'tilt-left',           // tilt-rotate from left
  'tilt-right',          // tilt-rotate from right
]

function getVariants(dir) {
  const ease = [0.16, 1, 0.3, 1]
  switch (dir) {
    case 'left':
      return {
        hidden:  { opacity: 0, x: -90, y: 0,  scale: 1,    rotate: 0  },
        visible: { opacity: 1, x: 0,   y: 0,  scale: 1,    rotate: 0  },
      }
    case 'right':
      return {
        hidden:  { opacity: 0, x: 90,  y: 0,  scale: 1,    rotate: 0  },
        visible: { opacity: 1, x: 0,   y: 0,  scale: 1,    rotate: 0  },
      }
    case 'scale-left':
      return {
        hidden:  { opacity: 0, x: -60, y: 20, scale: 0.88, rotate: 0  },
        visible: { opacity: 1, x: 0,   y: 0,  scale: 1,    rotate: 0  },
      }
    case 'scale-right':
      return {
        hidden:  { opacity: 0, x: 60,  y: 20, scale: 0.88, rotate: 0  },
        visible: { opacity: 1, x: 0,   y: 0,  scale: 1,    rotate: 0  },
      }
    case 'tilt-left':
      return {
        hidden:  { opacity: 0, x: -70, y: 30, scale: 0.92, rotate: -6 },
        visible: { opacity: 1, x: 0,   y: 0,  scale: 1,    rotate: 0  },
      }
    case 'tilt-right':
      return {
        hidden:  { opacity: 0, x: 70,  y: 30, scale: 0.92, rotate: 6  },
        visible: { opacity: 1, x: 0,   y: 0,  scale: 1,    rotate: 0  },
      }
    case 'up':
    default:
      return {
        hidden:  { opacity: 0, x: 0,   y: 65, scale: 1,    rotate: 0  },
        visible: { opacity: 1, x: 0,   y: 0,  scale: 1,    rotate: 0  },
      }
  }
}

const Reveal = ({ children, delay = 0, random = true, dir, className = '' }) => {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-6% 0px' })

  const direction = useMemo(() => {
    if (dir) return dir
    if (random) return DIRECTIONS[Math.floor(Math.random() * DIRECTIONS.length)]
    return 'up'
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const variants = useMemo(() => getVariants(direction), [direction])

  return (
    <motion.div
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      transition={{
        duration: 0.95,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export default Reveal
