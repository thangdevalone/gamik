"use client"

import { motion } from "framer-motion"

interface GameOverScreenProps {
  score: number
  onRestart: () => void
  onMainMenu: () => void
}

export default function GameOverScreen({ score, onRestart, onMainMenu }: GameOverScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center gap-8 p-8 bg-yellow-300 border-4 border-black shadow-xl w-96"
    >
      <h1
        className="text-4xl font-bold text-center text-black tracking-wider"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        GAME OVER
      </h1>

      <div className="bg-black p-4 w-full">
        <h2 className="text-white text-center mb-2 text-sm" style={{ fontFamily: "'Press Start 2P', monospace" }}>
          YOUR SCORE
        </h2>
        <p className="text-4xl font-bold font-mono text-center text-[#00ff00]">{score.toString().padStart(6, "0")}</p>
      </div>

      <div className="flex flex-col gap-4 w-full">
        <button
          onClick={onRestart}
          className="w-full py-3 bg-blue-400 text-white font-bold border-4 border-black hover:brightness-110 transition-all"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          PLAY AGAIN
        </button>
        <button
          onClick={onMainMenu}
          className="w-full py-3 bg-yellow-300 text-black font-bold border-4 border-black hover:brightness-110 transition-all"
          style={{ fontFamily: "'Press Start 2P', monospace" }}
        >
          MAIN MENU
        </button>
      </div>
    </motion.div>
  )
}
