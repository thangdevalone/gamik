"use client"

import { motion } from "framer-motion"

export default function TetrisLogo() {
  // Define the pixel art for each letter
  const pixelSize = 12 // Increased from 8 to make it bigger

  // T
  const T = [
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 0, 0],
  ]

  // E
  const E = [
    [1, 1, 1, 1],
    [1, 0, 0, 0],
    [1, 1, 1, 0],
    [1, 0, 0, 0],
    [1, 1, 1, 1],
  ]
  // R
  const R = [
    [1, 1, 1, 0],
    [1, 0, 0, 1],
    [1, 1, 1, 0],
    [1, 0, 1, 0],
    [1, 0, 0, 1],
  ]

  // I
  const I = [
    [1, 1, 1],
    [0, 1, 0],
    [0, 1, 0],
    [0, 1, 0],
    [1, 1, 1],
  ]

  // S
  const S = [
    [0, 1, 1, 1],
    [1, 0, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 0, 1],
    [1, 1, 1, 0],
  ]

  const letterData = [
    { letter: T, isSpecial: false },
    { letter: E, isSpecial: false },
    { letter: T, isSpecial: false },
    { letter: R, isSpecial: false },
    { letter: I, isSpecial: false },
    { letter: S, isSpecial: false },
  ]

  return (
    <div className="relative select-none" style={{ userSelect: "none" }}>
      {/* No background, just the letters */}
      <div className="flex items-center space-x-2 relative z-10">
        {letterData.map((item, letterIndex) => (
          <motion.div
            key={letterIndex}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              delay: 0.1 * letterIndex,
              duration: 0.3,
              type: "spring",
              stiffness: 200,
            }}
            className="flex flex-col"
          >
            {item.letter.map((row, rowIndex) => (
              <div key={rowIndex} className="flex">
                {row.map((pixel, pixelIndex) => (
                  <motion.div
                    key={pixelIndex}
                    initial={{ scale: 0 }}
                    animate={{ scale: pixel ? 1 : 0 }}
                    transition={{
                      delay: 0.1 * letterIndex + 0.01 * (rowIndex + pixelIndex),
                      type: "spring",
                      stiffness: 300,
                      damping: 15,
                    }}
                    style={{
                      width: pixelSize,
                      height: pixelSize,
                      backgroundColor: pixel ? (item.isSpecial ? "#333" : "white") : "transparent",
                    }}
                    className={pixel ? "shadow-sm" : ""}
                  />
                ))}
              </div>
            ))}
          </motion.div>
        ))}
      </div>
    </div>
  )
}
