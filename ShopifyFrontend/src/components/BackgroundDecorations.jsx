import React from 'react'

export const BackgroundDecorations = () => {
  return (
    <>
      {/* Desktop Background (Fixed, Left Half) */}
      <div 
        className="fixed inset-y-0 left-0 w-1/2 z-0 pointer-events-none overflow-hidden hidden min-[901px]:block"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 20% 40%, rgba(47,158,100,.14) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 80% 10%, rgba(127,217,164,.16) 0%, transparent 55%)'
        }}
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(31,107,66,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(31,107,66,.14) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
            maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 80%)',
            WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 80%)'
          }}
        />
      </div>
    </>
  )
}

export const MobileBackgroundDecorations = () => {
  return (
    <>
      {/* Mobile background gradient decorations (left panel overlay) */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none min-[901px]:hidden"
        style={{
          background: 'radial-gradient(ellipse 90% 80% at 20% 40%, rgba(47,158,100,.14) 0%, transparent 65%), radial-gradient(ellipse 60% 50% at 80% 10%, rgba(127,217,164,.16) 0%, transparent 55%), #FAFDF8'
        }}
      />
      <div 
        className="absolute inset-0 z-0 pointer-events-none min-[901px]:hidden"
        style={{
          backgroundImage: 'linear-gradient(rgba(31,107,66,.14) 1px, transparent 1px), linear-gradient(90deg, rgba(31,107,66,.14) 1px, transparent 1px)',
          backgroundSize: '48px 48px',
          maskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 80%)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 80% at 30% 50%, black 20%, transparent 80%)'
        }}
      />
    </>
  )
}
