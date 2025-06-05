"use client"

export default function KeyGuide() {
  return (
    <div className="absolute bottom-0 left-0 right-0 bg-black/90 text-white p-3 text-center border-t-4 border-black">
      <div
        className="flex justify-center items-center gap-6 flex-wrap text-sm"
        style={{ fontFamily: "'Press Start 2P', monospace" }}
      >
        <div className="flex items-center gap-2">
          <div className="bg-yellow-300 px-2 py-1 text-black border-2 border-black">←</div>
          <div className="bg-yellow-300 px-2 py-1 text-black border-2 border-black">→</div>
          <span>Move</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-yellow-300 px-2 py-1 text-black border-2 border-black">↓</div>
          <span>Soft Drop</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-yellow-300 px-2 py-1 text-black border-2 border-black">↑</div>
          <span>Rotate</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-yellow-300 px-2 py-1 text-black border-2 border-black whitespace-nowrap">SPACE</div>
          <span>Hard Drop</span>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-yellow-300 px-2 py-1 text-black border-2 border-black">P</div>
          <span>Pause</span>
        </div>
      </div>
    </div>
  )
}
