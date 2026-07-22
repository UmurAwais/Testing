import React from 'react'

const NicheCard = ({
  id,
  title,
  icon,
  isSelected,
  onSelect
}) => {
  return (
    <button
      type="button"
      onClick={() => onSelect(id)}
      className={`w-full flex flex-col items-center justify-center p-6 rounded-2xl border-2 transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'bg-ecomlly-surface-2 border-ecomlly-v-soft shadow-[0_4px_16px_rgba(31,138,82,0.15)] scale-[1.02]'
          : 'bg-ecomlly-bg-2 border-transparent hover:border-ecomlly-line-s hover:bg-ecomlly-surface hover:scale-[1.01]'
      }`}
    >
      <div className={`mb-3.5 flex items-center justify-center transition-colors duration-200 ${
        isSelected ? 'text-ecomlly-v-soft' : 'text-ecomlly-muted hover:text-ecomlly-v-soft'
      }`}>
        {icon}
      </div>
      <span className="text-base font-semibold text-ecomlly-text tracking-wide text-center">
        {title}
      </span>
    </button>
  )
}

export default NicheCard