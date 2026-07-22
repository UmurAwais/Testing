import React from 'react'

const Logo = ({ className = 'mb-14' }) => {
  return (
    <a 
      href="/" 
      className={`inline-flex items-center gap-2.5 font-sans font-extrabold text-[28px] tracking-[-0.03em] text-ecomlly-text ${className}`}
    >
      {/* <div className="w-[34px] h-[34px] rounded-[9px] bg-linear-to-br from-[#4CC183] to-ecomlly-v-deep flex items-center justify-center text-[19px] shadow-[0_8px_20px_-6px_rgba(27,107,66,0.35)]">
        ⚡
      </div> */}
      <span>
        eCom<b className="text-ecomlly-v-soft">lly</b>
      </span>
    </a>
  )
}

export default Logo
