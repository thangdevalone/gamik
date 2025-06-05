"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import TetorisButton from "./tetris-button";
import TetrisButton from "./tetris-button";

interface SettingsMenuProps {
  onClose: () => void;
  isMusicEnabled: boolean;
  musicVolume: number;
  onMusicToggle: (enabled: boolean) => void;
  onVolumeChange: (volume: number) => void;
}

export default function SettingsMenu({
  onClose,
  isMusicEnabled,
  musicVolume,
  onMusicToggle,
  onVolumeChange,
}: SettingsMenuProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="relative w-full max-w-lg mx-4">
        {/* Yellow background with pixel art border */}
        <div className="bg-yellow-300 p-6 rounded-none border-4 border-black shadow-lg relative">
          {/* Pixel art border corners */}
          <div className="absolute top-0 left-0 w-4 h-4 bg-black" />
          <div className="absolute top-0 right-0 w-4 h-4 bg-black" />
          <div className="absolute bottom-0 left-0 w-4 h-4 bg-black" />
          <div className="absolute bottom-0 right-0 w-4 h-4 bg-black" />

          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                className="text-gray-800 hover:text-gray-600"
              >
                <ArrowLeft className="h-6 w-6" />
              </motion.button>
              <h2
                className="text-2xl font-bold text-gray-800 tracking-wider"
                style={{
                  fontFamily: "'Press Start 2P', monospace",
                  fontSize: "1.5rem",
                }}
              >
                SETTINGS
              </h2>
              <div className="w-6" /> {/* Spacer for centering */}
            </div>

            {/* Settings Content */}
            <div className="space-y-8 p-4 bg-white/20 rounded-none border-4 border-black">
              {/* Music Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-lg font-semibold text-gray-800">
                    Music
                  </Label>
                  <p className="text-sm text-gray-600">
                    Enable or disable background music
                  </p>
                </div>
                <Switch
                  checked={isMusicEnabled}
                  onCheckedChange={onMusicToggle}
                  className="data-[state=checked]:bg-pink-500 border-black "
                  thumbClassName="data-[state=checked]:bg-white border-black"
                />
              </div>

              {/* Volume Slider */}
              <div className="space-y-4">
                <div className="space-y-1">
                  <Label className="text-lg font-semibold text-gray-800">
                    Volume
                  </Label>
                  <p className="text-sm text-gray-600">Adjust music volume</p>
                </div>
                <div className="flex items-center gap-4">
                  <Slider
                    disabled={!isMusicEnabled}
                    value={[musicVolume]}
                    onValueChange={(value) => onVolumeChange(value[0])}
                    max={100}
                    step={1}
                    className={`${!isMusicEnabled ? "opacity-50" : ""}`}
                    trackClassName="border-black"
                    thumbClassName="border-black"
                  />
                  <span className="min-w-[3ch] text-gray-800 font-mono">
                    {musicVolume}
                  </span>
                </div>
              </div>
            </div>

            {/* Music Credits */}
            <div className="space-y-1 mt-6 p-3 bg-black/20 rounded border-2 border-black">
              <h3
                className="text-sm font-semibold text-gray-800"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                MUSIC CREDITS
              </h3>
              <a
                href="https://www.youtube.com/watch?v=W9gO-K7_31M"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-gray-700 hover:text-blue-700 hover:underline block transition-colors"
                style={{ fontFamily: "'Press Start 2P', monospace" }}
              >
                "Xomu - Lanterns" EDM
              </a>
            </div>

            {/* Return Button */}
            <div className="flex justify-center">
              <TetrisButton label="RETURN" onClick={onClose} color="yellow" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
