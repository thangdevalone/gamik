"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { motion, useAnimation } from "framer-motion"

// Define the 7 standard Tetrimino shapes
const TETRIMINOS = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
}

// Define TETORIS-themed colors
const TETORIS_COLORS = [
  "#FF4D6D", // Pink
  "#FF8FA3", // Light Pink
  "#4EA8DE", // Blue
  "#57CC99", // Green
  "#FFC857", // Yellow
  "#A06CD5", // Purple
  "#FF7B00", // Orange
]

interface TetriminoProps {
  type: keyof typeof TETRIMINOS
  color: string
  x: number
  delay: number
}

const Tetrimino = ({ type, color, x, delay }: TetriminoProps) => {
  const controls = useAnimation()
  const blockSize = 20
  const matrix = TETRIMINOS[type]

  useEffect(() => {
    controls.start({
      y: ["0vh", "120vh"],
      rotate: [0, 360],
      transition: {
        y: {
          duration: 10 + Math.random() * 5,
          ease: "linear",
          delay,
          repeat: Infinity,
        },
        rotate: {
          duration: 20 + Math.random() * 10,
          ease: "linear",
          repeat: Infinity,
        },
      },
    })
    
  }, [controls, delay])

  return (
    <motion.div
      animate={controls}
      style={{
        position: "absolute",
        left: `${x}%`,
        top: "-100px",
      }}
    >
      <div className="relative">
        {matrix.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, cellIndex) => (
              <div
                key={cellIndex}
                style={{
                  width: blockSize,
                  height: blockSize,
                  backgroundColor: cell ? color : "transparent",
                  border: cell ? "2px solid black" : "none",
                  boxShadow: cell ? "inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.3)" : "none",
                }}
                className={cell ? "pixel-block" : ""}
              />
            ))}
          </div>
        ))}
      </div>
    </motion.div>
  )
}

export default function TetrisBackground() {
  const [tetriminos, setTetriminos] = useState<React.ReactNode[]>([])

  useEffect(() => {
    const types = Object.keys(TETRIMINOS) as Array<keyof typeof TETRIMINOS>
    const pieces: React.ReactNode[] = []

    // Create 20 random tetriminos
    for (let i = 0; i < 20; i++) {
      const randomType = types[Math.floor(Math.random() * types.length)]
      const randomColor = TETORIS_COLORS[Math.floor(Math.random() * TETORIS_COLORS.length)]
      const randomX = Math.random() * 90 // Random position from 0-90%
      const randomDelay = Math.random() * 5 // Random delay for staggered effect

      pieces.push(<Tetrimino key={i} type={randomType} color={randomColor} x={randomX} delay={randomDelay} />)
    }

    setTetriminos(pieces)
  }, [])

  return <div className="w-full h-full absolute overflow-hidden opacity-70">{tetriminos}</div>
}
