import React from 'react'

const stepsGroup1 = [
  { id: 1, title: 'Pick Niche', desc: 'Step 1' },
  { id: 2, title: 'Banners', desc: 'Step 2' },
  { id: 3, title: 'Claim Store', desc: 'Step 3' },
  { id: 4, title: 'Discount', desc: 'Step 4' }
]

const stepsGroup2 = [
  { id: 5, title: 'Install App', desc: 'Step 5' },
  { id: 6, title: 'Unique Store', desc: 'Step 6' },
  { id: 7, title: 'Add Products', desc: 'Step 7' },
  { id: 8, title: 'Store Live', desc: 'Step 8' },
  { id: 9, title: 'Grow Store', desc: 'Step 9' }
]

const StepsProgress = ({ activeStep = 1 }) => {
  const isPhase2 = activeStep >= 5
  const currentSteps = isPhase2 ? stepsGroup2 : stepsGroup1
  const offset = isPhase2 ? 4 : 0

  return (
    <div className="w-full border-b border-ecomlly-line pb-4.5 mb-6 select-none">
      {/* Desktop and Tablet Stepper Layout */}
      <div className="hidden min-[481px]:flex items-center justify-between gap-2.5">
        {currentSteps.map((step, index) => {
          const isCompleted = step.id < activeStep
          const isActive = step.id === activeStep
          const isPending = step.id > activeStep

          return (
            <React.Fragment key={step.id}>
              {/* Step Item */}
              <div className="flex items-center gap-2.5 flex-none">
                {/* Outline Circle Badge */}
                <div 
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-sans font-extrabold text-[12px] min-[640px]:text-[13px] transition-all duration-300 ${
                    isCompleted 
                      ? 'bg-ecomlly-v-soft border-2 border-ecomlly-v-soft text-white shadow-xs'
                      : isActive
                        ? 'border-2 border-ecomlly-v-soft text-ecomlly-v-soft bg-white shadow-[0_0_10px_rgba(31,138,82,0.12)] ring-4 ring-[#1F8A52]/10'
                        : 'border-2 border-gray-200 text-gray-400 bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <svg className="w-4 h-4 stroke-current" fill="none" stroke="currentColor" strokeWidth="4" viewBox="0 0 24 24">
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>

                {/* Inline Labels next to Circle */}
                <div className="flex flex-col text-left">
                  <span className={`text-[8px] min-[640px]:text-[9px] font-sans font-extrabold tracking-wider uppercase leading-none ${
                    isActive ? 'text-ecomlly-v-soft' : isCompleted ? 'text-ecomlly-v-deep' : 'text-gray-400/80'
                  }`}>
                    {step.desc}
                  </span>
                  <span className={`text-[12px] min-[640px]:text-[13px] font-sans tracking-wide mt-1 leading-none ${
                    isActive 
                      ? 'font-extrabold text-ecomlly-text' 
                      : isCompleted 
                        ? 'font-bold text-ecomlly-text' 
                        : 'font-semibold text-gray-400'
                  }`}>
                    {step.title}
                  </span>
                </div>
              </div>

              {/* Connecting Line (except last) */}
              {index < currentSteps.length - 1 && (
                <div className="flex-1 h-[2px] bg-gray-100 rounded-full min-w-[12px] max-w-[50px] overflow-hidden">
                  <div 
                    className={`h-full bg-ecomlly-v-soft rounded-full transition-all duration-500 ease-out ${
                      isCompleted ? 'w-full' : 'w-0'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          )
        })}
      </div>

      {/* Mobile Stepper Layout (Compact, Sleek progress line + indicator) */}
      <div className="flex min-[481px]:hidden flex-col items-center w-full px-1">
        <div className="w-full flex items-center justify-between mb-2">
          <span className="text-[12px] font-sans font-bold text-ecomlly-v-soft uppercase tracking-wider">
            Step {activeStep} of 9
          </span>
          <span className="text-[13px] font-sans font-extrabold text-ecomlly-text">
            {isPhase2 ? stepsGroup2[Math.min(activeStep, 9) - 5]?.title : stepsGroup1[Math.min(activeStep, 4) - 1]?.title}
          </span>
        </div>
        {/* Progress bar container */}
        <div className="w-full h-1.5 bg-ecomlly-line rounded-full overflow-hidden">
          <div 
            className="h-full bg-linear-to-r from-[#34B073] to-ecomlly-v-soft rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${(activeStep / 9) * 100}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default StepsProgress
