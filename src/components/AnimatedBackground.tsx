import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

const AnimatedBackground = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10">
      {/* Gradient Orbs */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-[32rem] h-[32rem] bg-gradient-to-r from-coral-300/35 to-purple-400/35 rounded-full filter blur-3xl"
        animate={{
          x: mousePosition.x * 0.05,
          y: mousePosition.y * 0.05,
          scale: [1, 1.05, 1],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 30, damping: 30 },
          y: { type: "spring", stiffness: 30, damping: 30 },
          scale: { 
            duration: 8, 
            repeat: Infinity,
            ease: "easeInOut" 
          }
        }}
      />
      
      <motion.div
        className="absolute top-3/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-300/35 to-coral-400/35 rounded-full filter blur-3xl"
        animate={{
          x: -mousePosition.x * 0.04,
          y: -mousePosition.y * 0.04,
          scale: [1, 1.1, 1],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 25, damping: 25 },
          y: { type: "spring", stiffness: 25, damping: 25 },
          scale: { 
            duration: 6, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }
        }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/2 w-80 h-80 bg-gradient-to-r from-coral-300/35 to-purple-300/35 rounded-full filter blur-3xl"
        animate={{
          x: mousePosition.x * 0.03,
          y: mousePosition.y * 0.03,
          scale: [1, 1.15, 1],
        }}
        transition={{ 
          x: { type: "spring", stiffness: 20, damping: 20 },
          y: { type: "spring", stiffness: 20, damping: 20 },
          scale: { 
            duration: 7, 
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }
        }}
      />
    </div>
  )
}

export default AnimatedBackground