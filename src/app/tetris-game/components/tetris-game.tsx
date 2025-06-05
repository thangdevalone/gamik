"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import KeyGuide from "./key-guide"
import GameOverScreen from "./game-over-screen"


// Tetris game constants
const BOARD_WIDTH = 10
const BOARD_HEIGHT = 20
const BLOCK_SIZE = 30 // Pixel size of each block
const LEVEL_SPEED = [800, 650, 500, 400, 300, 250, 200, 150, 100, 80, 50] // ms per drop

// Audio URLs
const LINE_CLEAR_SOUND_URL =
  "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/NES%20Tetris%20Sound%20Effect_%20Tetris%20Clear%20%5B%20ezmp3.cc%20%5D-5XTgKAM6n0llLgC1JaFq5SiOKAVHzA.mp3"

// Tetrimino shapes with our theme colors
const TETRIMINOS = {
  I: {
    shape: [
      [0, 0, 0, 0],
      [1, 1, 1, 1],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
    ],
    color: "#4EA8DE", // Blue
  },
  O: {
    shape: [
      [1, 1],
      [1, 1],
    ],
    color: "#FFC857", // Yellow
  },
  T: {
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#A06CD5", // Purple
  },
  J: {
    shape: [
      [1, 0, 0],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#57CC99", // Green
  },
  L: {
    shape: [
      [0, 0, 1],
      [1, 1, 1],
      [0, 0, 0],
    ],
    color: "#FF7B00", // Orange
  },
  S: {
    shape: [
      [0, 1, 1],
      [1, 1, 0],
      [0, 0, 0],
    ],
    color: "#FF8FA3", // Light Pink
  },
  Z: {
    shape: [
      [1, 1, 0],
      [0, 1, 1],
      [0, 0, 0],
    ],
    color: "#FF4D6D", // Pink
  },
}

// Create an empty game board
const createEmptyBoard = () => {
  return Array.from({ length: BOARD_HEIGHT }, () => Array.from({ length: BOARD_WIDTH }, () => 0))
}

// Get a random tetrimino
const getRandomTetrimino = () => {
  const tetriminos = Object.keys(TETRIMINOS) as Array<keyof typeof TETRIMINOS>
  const randTetrimino = tetriminos[Math.floor(Math.random() * tetriminos.length)]
  return {
    ...TETRIMINOS[randTetrimino],
    type: randTetrimino,
  }
}

// Initial position for new tetriminos
const initialPosition = {
  x: Math.floor(BOARD_WIDTH / 2) - 1,
  y: 0,
}

interface TetrisGameProps {
  onReturn: () => void
}

export default function TetrisGame({ onReturn }: TetrisGameProps) {
  const [board, setBoard] = useState(createEmptyBoard())
  const [currentPiece, setCurrentPiece] = useState(getRandomTetrimino())
  const [nextPiece, setNextPiece] = useState(getRandomTetrimino())
  const [position, setPosition] = useState({ ...initialPosition })
  const [gameOver, setGameOver] = useState(false)
  const [score, setScore] = useState(0)
  const [level, setLevel] = useState(1)
  const [lines, setLines] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Audio refs
  const lineClearSoundRef = useRef<HTMLAudioElement | null>(null)
  const dropIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Initialize audio
  useEffect(() => {
    // Create audio elements
    lineClearSoundRef.current = new Audio(LINE_CLEAR_SOUND_URL)

    // Clean up
    return () => {
      if (lineClearSoundRef.current) {
        lineClearSoundRef.current.pause()
        lineClearSoundRef.current = null
      }
    }
  }, [])

  // Function to play line clear sound
  const playLineClearSound = useCallback(() => {
    if (lineClearSoundRef.current) {
      // Reset the audio to the beginning if it's already playing
      lineClearSoundRef.current.currentTime = 0
      lineClearSoundRef.current.play().catch((err) => console.error("Error playing sound:", err))
    }
  }, [])

  // Toggle pause state
  const togglePause = useCallback(() => {
    setIsPaused((prev) => !prev)
  }, [])

  // Check for collisions with other pieces or the board edges
  const checkCollision = useCallback(
    (piece: any, pos: any) => {
      for (let y = 0; y < piece.shape.length; y++) {
        for (let x = 0; x < piece.shape[y].length; x++) {
          // If this is a filled square in the tetrimino
          if (piece.shape[y][x]) {
            const boardX = pos.x + x
            const boardY = pos.y + y

            // Check if outside board limits
            if (boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT) {
              return true
            }

            // Check if overlapping a placed piece (and not above the board)
            if (boardY >= 0 && board[boardY][boardX]) {
              return true
            }
          }
        }
      }
      return false
    },
    [board],
  )

  // Update the board with the current piece
  const updateBoard = useCallback(() => {
    // Create a new board with the current piece in its final position
    const newBoard = [...board.map((row) => [...row])]

    for (let y = 0; y < currentPiece.shape.length; y++) {
      for (let x = 0; x < currentPiece.shape[y].length; x++) {
        if (currentPiece.shape[y][x]) {
          const boardY = position.y + y
          const boardX = position.x + x

          // Only update if the piece is within the board
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            newBoard[boardY][boardX] = currentPiece as any// Store just the presence of a piece
          }
        }
      }
    }

    // Check for completed lines
    const completedLines: number[] = []
    for (let y = 0; y < BOARD_HEIGHT; y++) {
      if (newBoard[y].every((cell) => cell !== 0)) {
        completedLines.push(y)
      }
    }

    // Remove completed lines and add new empty rows at the top
    if (completedLines.length > 0) {
      // Play line clear sound effect
      playLineClearSound()

      // Update score based on the number of lines cleared
      const linePoints = [40, 100, 300, 1200] // Points for 1, 2, 3, and 4 lines
      const points = linePoints[completedLines.length - 1] * level
      setScore((prevScore) => prevScore + points)

      // Update lines cleared count
      setLines((prevLines) => {
        const newLines = prevLines + completedLines.length
        // Update level based on lines cleared
        setLevel(Math.floor(newLines / 10) + 1)
        return newLines
      })

      // Remove the completed lines and add new empty rows
      const filteredBoard = newBoard.filter((_, index) => !completedLines.includes(index))
      const newRows = Array.from({ length: completedLines.length }, () => Array.from({ length: BOARD_WIDTH }, () => 0))
      setBoard([...newRows, ...filteredBoard])
    } else {
      setBoard(newBoard)
    }

    // Check for game over
    if (position.y <= 0) {
      setGameOver(true)
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current)
      }
      return
    }

    // Reset position and get a new piece
    setPosition({ ...initialPosition })
    setCurrentPiece(nextPiece)
    setNextPiece(getRandomTetrimino())
  }, [board, currentPiece, nextPiece, position, level, playLineClearSound])

  // Rotate a piece
  const rotate = useCallback((piece: any) => {
    // Create a new rotated matrix
    const newShape = piece.shape.map((_: any, index: any) => piece.shape.map((row: any) => row[index]).reverse())
    return { ...piece, shape: newShape }
  }, [])

  // Try to rotate, checking for collisions
  const tryRotate = useCallback(() => {
    const rotatedPiece = rotate(currentPiece)
    if (!checkCollision(rotatedPiece, position)) {
      setCurrentPiece(rotatedPiece)
    }
  }, [currentPiece, position, rotate, checkCollision])

  // Move the piece horizontally
  const moveHorizontal = useCallback(
    (direction: number) => {
      if (gameOver || isPaused) return

      const newPos = { ...position, x: position.x + direction }
      if (!checkCollision(currentPiece, newPos)) {
        setPosition(newPos)
      }
    },
    [currentPiece, position, checkCollision, gameOver, isPaused],
  )

  // Move the piece down
  const moveDown = useCallback(() => {
    if (gameOver || isPaused) return

    const newPos = { ...position, y: position.y + 1 }
    if (!checkCollision(currentPiece, newPos)) {
      setPosition(newPos)
      return
    }

    // Collision detected, lock the piece in place
    updateBoard()
  }, [currentPiece, position, checkCollision, gameOver, isPaused, updateBoard])

  // Hard drop the piece to the bottom
  const hardDrop = useCallback(() => {
    if (gameOver || isPaused) return

    // First, find the lowest valid position
    let newY = position.y
    let collisionDetected = false

    // Keep moving down until collision is detected
    while (!collisionDetected && newY < BOARD_HEIGHT) {
      if (checkCollision(currentPiece, { x: position.x, y: newY + 1 })) {
        collisionDetected = true
      } else {
        newY++
      }
    }

    // Update position first and force a re-render
    setPosition({ x: position.x, y: newY })

    // Use a useEffect to handle the piece locking after position update
  }, [currentPiece, position.x, position.y, checkCollision, gameOver, isPaused, BOARD_HEIGHT])

  // Add this new useEffect to handle piece locking after hard drop
  useEffect(() => {
    // This effect will run after position updates
    // Check if current position would collide if moved down
    // If it would, then lock the piece
    if (!gameOver && !isPaused && position.y > 0) {
      if (checkCollision(currentPiece, { x: position.x, y: position.y + 1 })) {
        // Lock piece after a very short delay to ensure rendering
        const lockTimeout = setTimeout(() => {
          updateBoard()
        }, 50)

        return () => clearTimeout(lockTimeout)
      }
    }
  }, [position.x, position.y, currentPiece, checkCollision, updateBoard, gameOver, isPaused])

  // Set up keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return

      switch (e.key) {
        case "ArrowLeft":
          moveHorizontal(-1)
          break
        case "ArrowRight":
          moveHorizontal(1)
          break
        case "ArrowDown":
          moveDown()
          break
        case "ArrowUp":
          tryRotate()
          break
        case " ": // Space bar
          hardDrop()
          break
        case "p":
        case "P":
          togglePause()
          break
        default:
          break
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [moveHorizontal, moveDown, tryRotate, hardDrop, gameOver, togglePause])

  // Restart the game
  const restartGame = useCallback(() => {
    setBoard(createEmptyBoard())
    setCurrentPiece(getRandomTetrimino())
    setNextPiece(getRandomTetrimino())
    setPosition({ ...initialPosition })
    setGameOver(false)
    setScore(0)
    setLevel(1)
    setLines(0)
    setIsPaused(false)
  }, [])

  // Set up automatic dropping
  useEffect(() => {
    if (!gameOver && !isPaused) {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current)
      }

      const dropSpeed = LEVEL_SPEED[Math.min(level - 1, LEVEL_SPEED.length - 1)]
      dropIntervalRef.current = setInterval(() => {
        moveDown()
      }, dropSpeed)
    } else if (dropIntervalRef.current) {
      clearInterval(dropIntervalRef.current)
    }

    return () => {
      if (dropIntervalRef.current) {
        clearInterval(dropIntervalRef.current)
      }
    }
  }, [level, moveDown, gameOver, isPaused])

  // Render the current piece on the board
  const renderPiece = () => {
    return currentPiece.shape.map((row, y) => {
      return row.map((cell, x) => {
        if (cell) {
          const boardX = position.x + x
          const boardY = position.y + y

          // Only render if the piece is within the board
          if (boardY >= 0 && boardY < BOARD_HEIGHT && boardX >= 0 && boardX < BOARD_WIDTH) {
            return (
              <div
                key={`piece-${boardY}-${boardX}`}
                className="absolute border-2 border-black"
                style={{
                  width: BLOCK_SIZE,
                  height: BLOCK_SIZE,
                  backgroundColor: currentPiece.color,
                  left: boardX * BLOCK_SIZE,
                  top: boardY * BLOCK_SIZE,
                  boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.3)",
                }}
              />
            )
          }
        }
        return null
      })
    })
  }

  // Render the board with placed pieces
  const renderBoard = () => {
    return board.map((row, y) => {
      return row.map((cell, x) => {
        return (
          <div
            key={`cell-${y}-${x}`}
            className="border border-gray-800"
            style={{
              width: BLOCK_SIZE,
              height: BLOCK_SIZE,
              backgroundColor: cell ? (cell as any).color : "transparent",
              boxShadow: cell ? "inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.3)" : "none",
            }}
          />
        )
      })
    })
  }

  // Update the renderNextPiece function
  const renderNextPiece = () => {
    const shape = nextPiece.shape
    const color = nextPiece.color
    const previewSize = 18 // Slightly larger block size for preview

    // Calculate the actual dimensions of the piece matrix (excluding empty rows/columns)
    const pieceRows = shape.filter((row) => row.some((cell) => cell === 1))
    const pieceWidth = shape[0].length
    const pieceHeight = shape.length

    // Calculate the total size the piece will occupy
    const totalWidth = pieceWidth * previewSize
    const totalHeight = pieceHeight * previewSize

    // Calculate offsets to center in the container (which is 72px inner content area)
    const offsetX = (72 - totalWidth) / 2
    const offsetY = (72 - totalHeight) / 2

    return (
      <div className="relative w-24 h-24 bg-yellow-300 border-[3px] border-black">
        {/* Inner border for pixel art effect */}
        <div className="absolute inset-2 border-[3px] border-black">
          <div className="relative w-full h-full">
            {shape.map((row, y) => {
              return row.map((cell, x) => {
                if (cell) {
                  return (
                    <div
                      key={`next-${y}-${x}`}
                      className="absolute border-2 border-black"
                      style={{
                        width: previewSize,
                        height: previewSize,
                        backgroundColor: color,
                        left: offsetX + x * previewSize,
                        top: offsetY + y * previewSize,
                        boxShadow: "inset 2px 2px 0 rgba(255,255,255,0.4), inset -2px -2px 0 rgba(0,0,0,0.3)",
                      }}
                    />
                  )
                }
                return null
              })
            })}
          </div>
        </div>
      </div>
    )
  }

  // Update the game info section in the return statement
  return (
    <div className="w-full h-full flex flex-col items-center justify-center py-8">
      {gameOver ? (
        <GameOverScreen score={score} onRestart={restartGame} onMainMenu={onReturn} />
      ) : (
        <div className="flex sm:flex-col flex-row items-start justify-center gap-6">
          {/* Game board */}
          <div className="relative w-fit h-fit border-4 border-black bg-yellow-300 shadow-lg">
            <div className="grid grid-cols-10 grid-rows-20">{renderBoard()}</div>
            {!isPaused && renderPiece()}

            {/* Pause overlay */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                <div
                  className="text-white text-3xl font-bold"
                  style={{ fontFamily: "'Press Start 2P', monospace", fontSize: "1.5rem" }}
                >
                  PAUSED
                </div>
              </div>
            )}
          </div>

          {/* Game info */}
          <div className="flex flex-col items-center gap-4">
            <div className="bg-yellow-300 p-4 border-4 border-black shadow-lg w-48">
              {/* Next piece preview */}
              <div className="text-center mb-4">
                <h3
                  className="font-bold uppercase tracking-wide mb-2 text-black"
                  style={{ fontFamily: "'Press Start 2P', monospace" }}
                >
                  NEXT
                </h3>
                <div className="flex justify-center items-center">{renderNextPiece()}</div>
              </div>

              {/* LCD-style displays */}
              <div className="space-y-4">
                <div className="bg-black p-3">
                  <h3
                    className="font-bold uppercase tracking-wide text-white mb-1 text-xs"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    SCORE
                  </h3>
                  <p className="font-mono text-lg text-[#00ff00] leading-none">{score.toString().padStart(6, "0")}</p>
                </div>

                <div className="bg-black p-3">
                  <h3
                    className="font-bold uppercase tracking-wide text-white mb-1 text-xs"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    LEVEL
                  </h3>
                  <p className="font-mono text-lg text-[#00ff00] leading-none">{level.toString().padStart(2, "0")}</p>
                </div>

                <div className="bg-black p-3">
                  <h3
                    className="font-bold uppercase tracking-wide text-white mb-1 text-xs"
                    style={{ fontFamily: "'Press Start 2P', monospace" }}
                  >
                    LINES
                  </h3>
                  <p className="font-mono text-lg text-[#00ff00] leading-none">{lines.toString().padStart(4, "0")}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3 w-48">
              <button
                onClick={togglePause}
                className="w-full py-3 bg-blue-400 text-white font-bold border-4 border-black hover:brightness-110 transition-all"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                {isPaused ? "RESUME" : "PAUSE"}
              </button>

              <button
                onClick={restartGame}
                className="w-full py-3 bg-pink-400 text-white font-bold border-4 border-black hover:brightness-110 transition-all"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                RESTART
              </button>

              <button
                onClick={onReturn}
                className="w-full py-3 bg-yellow-300 text-black font-bold border-4 border-black hover:brightness-110 transition-all"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                MENU
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Key guide */}
      <KeyGuide />
    </div>
  )
}
