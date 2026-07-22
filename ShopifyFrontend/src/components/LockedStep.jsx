import React from 'react'

const LockedStep = ({
  stepNumber,
  title,
  subtitle = 'Next'
}) => {
  return (
    <div className="w-full flex items-center gap-4.5 p-5 bg-white border border-ecomlly-line rounded-2xl opacity-60 pointer-events-none select-none">
      {/* Padlock Icon */}
      <div className="flex-none w-10 h-10 rounded-full bg-gray-50 border border-gray-100 flex items-center justify-center text-gray-400">
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
      </div>

      {/* Step details */}
      <div className="flex-1">
        <div className="text-[13px] font-semibold text-gray-400 tracking-wide uppercase">
          {subtitle}
        </div>
        <div className="text-base font-bold text-gray-500 tracking-wide">
          {title}
        </div>
      </div>
    </div>
  )
}

export default LockedStep
