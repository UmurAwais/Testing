import React, { useState, useEffect } from 'react'
import { BackgroundDecorations } from '../components/BackgroundDecorations'
import LockedStep from '../components/LockedStep'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import { useNavigate } from 'react-router-dom'
import StepsProgress from '../components/StepsProgress'

const StoreLive = ({ userData, updateUserData }) => {
  const [storeName, setStoreName] = useState('My Shopify Store')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const shop = userData.adminUrl || localStorage.getItem('shopifyAdminUrl') || ''
    if (shop) {
      const handle = shop.replace('.myshopify.com', '')
      const formatted = handle.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      setStoreName(formatted)
    }
    setLoading(false)
  }, [userData.adminUrl])

  // Create standard subdomain and shopUrl from userData.adminUrl / localStorage
  const rawShop = userData.adminUrl || localStorage.getItem('shopifyAdminUrl') || 'my-store.myshopify.com'
  const subdomain = rawShop.replace('.myshopify.com', '')
  const shopUrl = rawShop.includes('myshopify.com') ? `https://${rawShop}` : `https://${rawShop}.myshopify.com`

  if (loading) {
    return (
      <div className="relative min-h-screen flex flex-col justify-between">
        <BackgroundDecorations />
        <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 py-6 min-[481px]:py-8 min-[901px]:py-10 flex-1 flex flex-col items-center justify-center">
          <Logo className="mb-6" />
          <div className="w-full bg-white border border-ecomlly-line rounded-[24px] p-8 shadow-sm min-h-[350px] flex items-center justify-center">
            <div className="w-8 h-8 rounded-full border-4 border-ecomlly-line-s border-t-ecomlly-v-soft animate-spin" />
          </div>
        </div>
        <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <BackgroundDecorations />

      <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 py-6 min-[481px]:py-8 min-[901px]:py-10 flex-1 flex flex-col items-center justify-center">
        <Logo className="mb-6" />

        {/* Steps Progress Indicator */}
        <StepsProgress activeStep={8} />

        {/* Step 8 Card: Store is Live */}
        <div className="relative w-full bg-white border border-ecomlly-line rounded-[24px] p-5 min-[481px]:p-6 min-[901px]:p-8 shadow-sm mb-5">
          
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-8 h-8 rounded-full bg-linear-to-b from-[#34B073] to-ecomlly-v-deep text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none shadow-[0_2px_8px_rgba(52,176,115,0.2)]">
              8
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Your Shopify Store is Live
            </h2>
          </div>

          <p className="text-ecomlly-muted text-base mb-6 leading-relaxed">
            Success! Your store has been fully configured, your custom name applied, and all selected products sync-loaded.
          </p>

          {/* Active Live Store Panel */}
          <div className="w-full rounded-2xl border border-ecomlly-line-s bg-ecomlly-bg-2 p-6 mb-8 text-center relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white border border-[#34B073]/30 rounded-full text-[12px] font-bold text-[#34B073] shadow-xs mb-3.5">
              <span className="w-2 h-2 rounded-full bg-[#34B073] animate-ping" />
              <span>Live & Active</span>
            </div>
            
            <h3 className="font-sans font-extrabold text-[22px] text-ecomlly-text tracking-wide mb-1">
              {storeName}
            </h3>

            <a 
              href={shopUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-[14px] font-semibold text-ecomlly-v-soft hover:underline flex items-center justify-center gap-1 mb-1.5"
            >
              <span>{subdomain}.myshopify.com</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>

          {/* Action Links */}
          <div className="flex flex-col gap-3">
            <a 
              href="https://admin.shopify.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full block no-underline"
            >
              <button
                type="button"
                className="w-full bg-linear-to-b from-[#34B073] to-ecomlly-v-deep hover:from-[#2e9e68] hover:to-[#175b37] text-white py-3.5 min-[481px]:py-4 px-6 rounded-xl font-sans font-bold text-[16px] min-[481px]:text-[18px] tracking-wide shadow-[0_8px_24px_rgba(27,107,66,0.25)] border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                Launch Shopify Admin
              </button>
            </a>

            <button
              type="button"
              onClick={() => navigate('/grow-store')}
              className="w-full bg-gray-100 hover:bg-gray-200/80 text-ecomlly-text py-3.5 px-6 rounded-xl font-sans font-bold text-[16px] tracking-wide transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              Continue to Step 9
            </button>
          </div>

        </div>

        {/* Locked Next Step */}
        <LockedStep
          stepNumber={9}
          title="Grow Your Store"
        />
      </div>

      <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
    </div>
  )
}

export default StoreLive
