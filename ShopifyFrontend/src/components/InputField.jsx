import React, { useState } from 'react'

const InputField = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon,
  autoComplete,
  required = false,
  className = 'mb-4'
}) => {
  const [showPwd, setShowPwd] = useState(false)
  const isPassword = type === 'password'
  const actualType = isPassword && showPwd ? 'text' : type

  return (
    <div className={className}>
      <label 
        htmlFor={id} 
        className="block text-base font-semibold text-ecomlly-text mb-1.75 tracking-[0.01em]"
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ecomlly-muted text-base pointer-events-none flex items-center">
            {icon}
          </span>
        )}
        <input
          type={actualType}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full bg-ecomlly-surface border border-ecomlly-line-s rounded-xl text-ecomlly-text font-sans text-base py-3.25 pr-3.5 pl-10 outline-none transition-all duration-200 placeholder-[#5c6b62]/55 focus:border-ecomlly-violet focus:bg-ecomlly-surface-2 focus:ring-3 focus:ring-[rgba(47,158,100,0.18)] appearance-none"
          autoComplete={autoComplete}
          required={required}
        />
        {isPassword && (
          <button 
            type="button" 
            className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-none border-none cursor-pointer text-ecomlly-muted text-base flex items-center p-1 transition-colors duration-200 hover:text-ecomlly-v-soft" 
            aria-label="Toggle password visibility" 
            onClick={() => setShowPwd(!showPwd)}
          >
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              {showPwd ? (
                <>
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-10-7-10-7a20.08 20.08 0 0 1 2.18-4.07M8.82 8.82a3 3 0 0 0 4.36 4.36M1 1l22 22" />
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                </>
              ) : (
                <>
                  <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                  <circle cx="12" cy="12" r="3" />
                </>
              )}
            </svg>
          </button>
        )}
      </div>
    </div>
  )
}

export default InputField
