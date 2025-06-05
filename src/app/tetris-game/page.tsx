"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import SettingsMenu from "./components/setting-menu";
import TetrisBackground from "./components/tetris-background";
import TetrisButton from "./components/tetris-button";
import TetrisGame from "./components/tetris-game";
import TetrisLogo from "./components/tetris-logo";

// Create an audio context and management outside the component
let audioContext: AudioContext | null = null;
let audioSource: AudioBufferSourceNode | null = null;
let gainNode: GainNode | null = null;
let audioBuffer: AudioBuffer | null = null;
let isPlaying = false;

export default function GameMenu() {
  const [showMenu, setShowMenu] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(false);
  const [musicVolume, setMusicVolume] = useState(50);
  const [playingGame, setPlayingGame] = useState(false);

  // Initialize audio context and load audio
  useEffect(() => {
    const initAudio = async () => {
      if (!audioContext) {
        audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        gainNode = audioContext.createGain();
        gainNode.connect(audioContext.destination);

        try {
          const response = await fetch("/assets/805587_Lanterns.mp3");
          const arrayBuffer = await response.arrayBuffer();
          audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        } catch (error) {
          console.error("Error loading audio:", error);
        }
      }
    };

    initAudio();
    return () => {
      if (audioContext) {
        audioContext.close();
        audioContext = null;
        audioBuffer = null;
        isPlaying = false;
      }
    };
  }, []);

  // Handle music playback
  const playMusic = useCallback(() => {
    if (!audioContext || !audioBuffer || !gainNode || isPlaying) return;

    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.loop = true;
    audioSource.connect(gainNode);

    // Set initial volume
    gainNode.gain.value = musicVolume / 100;

    audioSource.start(0);
    isPlaying = true;

    // Handle when the audio ends
    audioSource.onended = () => {
      isPlaying = false;
      if (isMusicEnabled) playMusic();
    };
  }, [musicVolume, isMusicEnabled]);

  // Handle music toggle
  const handleMusicToggle = useCallback(
    (enabled: boolean) => {
      setIsMusicEnabled(enabled);
      if (gainNode) {
        if (enabled) {
          gainNode.gain.value = musicVolume / 100;
          if (!isPlaying) playMusic();
        } else {
          gainNode.gain.value = 0;
        }
      }
    },
    [musicVolume, playMusic]
  );

  // Handle volume change
  const handleVolumeChange = useCallback(
    (volume: number) => {
      setMusicVolume(volume);
      if (gainNode && isMusicEnabled) {
        gainNode.gain.value = volume / 100;
      }
    },
    [isMusicEnabled]
  );

  // Start music when menu shows
  useEffect(() => {
    if (showMenu && isMusicEnabled && !isPlaying) {
      playMusic();
    }
  }, [showMenu, isMusicEnabled, playMusic]);

  // Show menu after delay
  useEffect(() => {
    const timer = setTimeout(() => setShowMenu(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Handle game start
  const startGame = () => {
    setPlayingGame(true);
  };

  // Return to main menu
  const returnToMenu = () => {
    setPlayingGame(false);
  };

  return (
    <div className="relative h-full w-full overflow-hidden bg-yellow-300">
      {/* Pixel art grid overlay */}
      <div className="absolute inset-0 bg-grid opacity-5 pointer-events-none"></div>

      {/* Tetris blocks falling background - only show when not playing */}
      {!playingGame && (
        <div className="absolute inset-0 overflow-hidden">
          <TetrisBackground />
        </div>
      )}

      {/* Game or Menu */}
      {playingGame ? (
        <TetrisGame onReturn={returnToMenu} />
      ) : (
        /* Menu overlay */
        <motion.div
          className="relative z-10 flex flex-col w-full h-full items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: showMenu ? 1 : 0 }}
          transition={{ duration: 0.8 }}
        >
          {showMenu && (
            <div className="flex flex-col items-center">
              {/* TETORIS Logo */}
              <motion.div
                initial={{ y: -50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 300,
                  damping: 20,
                  delay: 0.2,
                }}
                className="mb-20"
              >
                <TetrisLogo />
              </motion.div>

              <div className="flex flex-col space-y-6 items-center">
                <TetrisButton onClick={startGame} label="PLAY" color="blue" />

                <TetrisButton
                  onClick={() => setShowSettings(true)}
                  label="SETTINGS"
                  color="pink"
                />
              </div>
            </div>
          )}
        </motion.div>
      )}

      {/* Settings Menu - Black background appears instantly */}
      {showSettings && (
        <div className="fixed inset-0 z-50 bg-black/50">
          <AnimatePresence>
            <SettingsMenu
              onClose={() => setShowSettings(false)}
              isMusicEnabled={isMusicEnabled}
              musicVolume={musicVolume}
              onMusicToggle={handleMusicToggle}
              onVolumeChange={handleVolumeChange}
            />
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
