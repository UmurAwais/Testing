import React from 'react'

const Footer = ({ className = 'col-span-full flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3' }) => {
  return (
    <footer className={className}>
      <div className="flex items-center gap-6 flex-wrap">
        <a 
          href="/privacy" 
          className="text-ecomlly-muted transition-colors duration-200 hover:text-ecomlly-text"
        >
          Privacy Policy
        </a>
        <a 
          href="/terms" 
          className="text-ecomlly-muted transition-colors duration-200 hover:text-ecomlly-text"
        >
          Terms of Service
        </a>
        <span className="flex items-center gap-1.5">
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
          support@ecomlly.com
        </span>
      </div>
      <div className="text-ecomlly-muted">
        Ecomlly &copy; {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer
