import React from 'react'

const benefits = [
  {
    icon: '$0',
    text: 'Zero cost to launch — keep 100% of profits'
  },
  {
    icon: '🎨',
    text: 'High-converting theme, tuned to your niche'
  },
  {
    icon: '📦',
    text: '10 winning products pre-loaded'
  },
  {
    icon: '📄',
    text: 'Product & policy pages built automatically'
  },
  {
    icon: '⚡',
    text: 'Live in under 5 minutes'
  }
]

const BenefitsList = ({ className = 'mb-12' }) => {
  return (
    <>
      <p className="font-sans font-extrabold text-[28px] tracking-[-0.02em] text-ecomlly-text mb-[22px]">
        What you get?
      </p>
      <ul className={`flex flex-col gap-3.5 ${className}`} role="list">
        {benefits.map((benefit, index) => (
          <li 
            key={index} 
            className="flex items-center gap-3.5 text-base font-semibold text-ecomlly-text"
          >
            <div className="flex-none w-[30px] h-[30px] rounded-lg bg-[rgba(47,158,100,0.12)] border border-ecomlly-line-s flex items-center justify-center text-base text-ecomlly-v-soft">
              {benefit.icon}
            </div>
            <span>{benefit.text}</span>
          </li>
        ))}
      </ul>
    </>
  )
}

export default BenefitsList
