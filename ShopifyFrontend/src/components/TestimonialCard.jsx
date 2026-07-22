import React from 'react'

const TestimonialCard = ({ className = '' }) => {
  return (
    <div className={`border border-ecomlly-line rounded-[18px] px-6 py-5.5 bg-[rgba(20,60,38,0.035)] backdrop-blur-md max-w-[400px] max-[900px]:max-w-none ${className}`}>
      <div className="text-ecomlly-gold text-base tracking-[2px] mb-2.5">
        ★★★★★
      </div>
      <p className="text-base text-[#24352A] leading-1.6 italic mb-3.5">
        "My store was live and making sales within the same day. I didn't touch a single line of code."
      </p>
      <div className="flex items-center gap-2.75">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-ecomlly-violet to-ecomlly-v-deep flex items-center justify-center font-sans font-extrabold text-white text-base flex-none">
          J
        </div>
        <div>
          <div className="font-bold text-base text-ecomlly-text">
            Jahir K.
          </div>
          <div className="text-base text-ecomlly-muted">
            Fashion Boutique Owner
          </div>
        </div>
      </div>
    </div>
  )
}

export default TestimonialCard
