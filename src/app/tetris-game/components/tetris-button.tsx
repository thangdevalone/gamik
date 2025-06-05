"use client"

import { motion } from "framer-motion"

interface TetrisButtonProps {
  label: string
  onClick: () => void
  color: "blue" | "pink" | "purple" | "yellow"
}

export default function TetrisButton({ label, onClick, color }: TetrisButtonProps) {
  // Define color schemes based on the color prop
  const colorSchemes = {
    blue: {
      bg: "bg-blue-500",
      shadow: "shadow-blue-700",
      highlight: "bg-blue-400",
      text: "text-white",
    },
    pink: {
      bg: "bg-pink-500",
      shadow: "shadow-pink-700",
      highlight: "bg-pink-400",
      text: "text-white",
    },
    purple: {
      bg: "bg-purple-500",
      shadow: "shadow-purple-700",
      highlight: "bg-purple-400",
      text: "text-white",
    },
    yellow: {
      bg: "bg-yellow-400",
      shadow: "shadow-yellow-600",
      highlight: "bg-yellow-300",
      text: "text-gray-800",
    },
  }

  const scheme = colorSchemes[color]

  return (
    <motion.div className="relative w-64 h-16 group" whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
      {/* Button base - pixel art style */}
      <div className={`absolute inset-0 ${scheme.bg} rounded-none border-4 border-black`}></div>

      {/* Button shadow/3D effect */}
      <div className={`absolute inset-0 translate-y-2 ${scheme.shadow} border-4 border-black`}></div>

      {/* Button highlight/top */}
      <div
        className={`absolute inset-0 ${scheme.highlight} border-4 border-black translate-y-0 
                      group-hover:translate-y-1 group-active:translate-y-2 transition-transform duration-100`}
      >
        {/* Pixel corners */}
        <div className="absolute top-0 left-0 w-2 h-2 bg-black"></div>
        <div className="absolute top-0 right-0 w-2 h-2 bg-black"></div>
        <div className="absolute bottom-0 left-0 w-2 h-2 bg-black"></div>
        <div className="absolute bottom-0 right-0 w-2 h-2 bg-black"></div>

        {/* Button text */}
        <button
          onClick={onClick}
          className={`w-full h-full flex items-center justify-center font-bold text-2xl ${scheme.text} tracking-wider`}
          style={{ fontFamily: "'Press Start 2P', monospace", letterSpacing: "0.1em" }}
        >
          {label}
        </button>
      </div>
    </motion.div>
  )
}
