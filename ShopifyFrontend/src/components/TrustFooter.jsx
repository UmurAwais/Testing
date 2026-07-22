import React from 'react'

const trustItems = [
  'No credit card',
  'Launch in minutes',
  '100% yours'
]

const TrustFooter = ({ className = 'pt-5 border-t border-ecomlly-line' }) => {
  return (
    <div className={`flex items-center justify-center flex-nowrap gap-4 ${className}`}>
      {trustItems.map((item, index) => (
        <div 
          key={index}
          className="flex items-center gap-1.5 text-[14px] text-ecomlly-muted font-sans tracking-[0.04em] whitespace-nowrap"
        >
          <svg 
            className="text-[#5E8E3E] flex-none" 
            width="13" 
            height="13" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {item}
        </div>
      ))}
    </div>
  )
}

export default TrustFooter
