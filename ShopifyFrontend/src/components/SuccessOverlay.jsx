import React from 'react'

const particles = [
  { x: '-90px', y: '-80px', color: '#FF5C5C', size: '14px', scale: 1.3 },
  { x: '90px', y: '-90px', color: '#FFB938', size: '12px', scale: 1.1 },
  { x: '-100px', y: '40px', color: '#3B82F6', size: '15px', scale: 1.4 },
  { x: '100px', y: '50px', color: '#A855F7', size: '13px', scale: 1.2 },
  { x: '0px', y: '-120px', color: '#EC4899', size: '10px', scale: 0.9 },
  { x: '-120px', y: '-10px', color: '#3B82F6', size: '13px', scale: 1.2 },
  { x: '120px', y: '-15px', color: '#FFB938', size: '14px', scale: 1.3 },
  { x: '-45px', y: '110px', color: '#FF5C5C', size: '11px', scale: 1.0 },
  { x: '55px', y: '110px', color: '#A855F7', size: '13px', scale: 1.2 },
  { x: '-55px', y: '-110px', color: '#FFB938', size: '11px', scale: 1.0 },
  { x: '65px', y: '-110px', color: '#EC4899', size: '12px', scale: 1.1 },
]

const SuccessOverlay = () => {
  return (
    <div className="absolute inset-0 bg-white/70 backdrop-blur-xs z-50 flex items-center justify-center rounded-[24px]">
      <div className="relative flex items-center justify-center">
        {/* Confetti Particles */}
        {particles.map((p, i) => (
          <div
            key={i}
            className="absolute rounded-full opacity-0 animate-confetti"
            style={{
              width: p.size,
              height: p.size,
              backgroundColor: p.color,
              '--c-x': p.x,
              '--c-y': p.y,
              '--c-scale': p.scale
            }}
          />
        ))}

        {/* Central Green Check Circle */}
        <div className="w-[120px] h-[120px] rounded-full bg-[#83DCA6] flex items-center justify-center shadow-[0_8px_30px_rgba(131,220,166,0.4)] opacity-0 animate-pop-in">
          <svg
            className="w-16 h-16 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={4.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M5 13l4 4L19 7"
              className="animate-draw-check"
            />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default SuccessOverlay
