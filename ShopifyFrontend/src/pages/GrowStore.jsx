import React, { useState } from 'react'
import { BackgroundDecorations } from '../components/BackgroundDecorations'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import StepsProgress from '../components/StepsProgress'
import SuccessOverlay from '../components/SuccessOverlay'

const growthSteps = [
  {
    id: 1,
    title: 'Configure Custom Domain',
    text: 'Link your custom domain (e.g., www.mybrand.com) in Shopify Settings -> Domains to establish a professional brand identity.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ecomlly-v-soft">
        <circle cx="12" cy="12" r="10" />
        <line x1="2" y1="12" x2="22" y2="12" />
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
      </svg>
    )
  },
  {
    id: 2,
    title: 'Set Up Payment Gateways',
    text: 'Activate Shopify Payments or preferred payment gateways in Settings -> Payments to accept customer credit cards.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ecomlly-v-soft">
        <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
        <line x1="1" y1="10" x2="23" y2="10" />
      </svg>
    )
  },
  {
    id: 3,
    title: 'Integrate Marketing Pixels',
    text: 'Install Meta Pixel, Google Analytics, and TikTok Pixel inside Online Store -> Preferences to monitor conversions.',
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ecomlly-v-soft">
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6" y1="20" x2="6" y2="14" />
      </svg>
    )
  },
  {
    id: 4,
    title: 'Launch Ad Campaigns',
    text: "Leverage Ecomlly's recommended ad templates and launch targeted campaigns on TikTok and Instagram to drive buyers.",
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-ecomlly-v-soft">
        <path d="M6 12L3.269 3.125A.5.5 0 0 1 3.74 2.5H20.26a.5.5 0 0 1 .471.625L18 12l2.731 8.875a.5.5 0 0 1-.47.625H3.74a.5.5 0 0 1-.471-.625L6 12z" />
        <line x1="6" y1="12" x2="18" y2="12" />
      </svg>
    )
  }
]

const GrowStore = ({ userData, updateUserData }) => {
  const [success, setSuccess] = useState(false)

  const getStoreUrl = () => {
    const rawShop = userData.adminUrl || localStorage.getItem('shopifyAdminUrl') || '';
    if (!rawShop) {
      return '';
    }
    
    let cleanShop = rawShop.replace(/^https?:\/\//, '').replace(/\/$/, '');
    let storeName = '';
    const storeMatch = cleanShop.match(/\/store\/([^\/]+)/) || cleanShop.match(/^admin\.shopify\.com\/store\/([^\/]+)/);
    
    if (storeMatch) {
      storeName = storeMatch[1];
    } else {
      storeName = cleanShop.replace('.myshopify.com', '');
      if (storeName.includes('.')) {
        storeName = storeName.split('.')[0];
      }
      if (storeName.includes('/')) {
        storeName = storeName.split('/')[0];
      }
    }
    
    if (storeName) {
      return `https://${storeName}.myshopify.com`;
    }
    
    return '';
  };

  const handleComplete = () => {
    setSuccess(true);
    const url = getStoreUrl();
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <BackgroundDecorations />

      <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 py-6 min-[481px]:py-8 min-[901px]:py-10 flex-1 flex flex-col items-center justify-center">
        <Logo className="mb-6" />

        {/* Steps Progress Indicator */}
        <StepsProgress activeStep={9} />

        {/* Step 9 Card: Grow Your Store */}
        <div className="relative w-full bg-white border border-ecomlly-line rounded-[24px] p-5 min-[481px]:p-6 min-[901px]:p-8 shadow-sm mb-5">
          
          {success && (
            <SuccessOverlay />
          )}

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#35B577] to-[#248B57] text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none">
              9
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Grow Your Store
            </h2>
          </div>

          <p className="text-ecomlly-muted text-base mb-6 leading-relaxed">
            Your store is live! To maximize sales and drive traffic, configure the following recommended setup details inside your Shopify admin.
          </p>

          {/* Growth Steps List */}
          <div className="flex flex-col gap-4 mb-8">
            {growthSteps.map((step) => (
              <div 
                key={step.id}
                className="p-4 border border-ecomlly-line rounded-xl flex items-center gap-4 bg-[#FAFDF8]/20 transition-all duration-200 hover:border-ecomlly-line-s/60 hover:bg-[#FAFDF8]/50"
              >
                {/* Custom Icon Container */}
                <div className="w-10 h-10 rounded-xl bg-white border border-ecomlly-line flex items-center justify-center flex-none shadow-xs">
                  {step.icon}
                </div>

                <div className="flex-1">
                  <h4 className="font-sans font-extrabold text-[15px] text-ecomlly-text tracking-wide">
                    {step.title}
                  </h4>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            type="button"
            onClick={handleComplete}
            disabled={success}
            className="w-full bg-gradient-to-br from-[#35B577] to-[#248B57] text-white py-3.5 min-[481px]:py-4 px-6 rounded-xl font-sans font-bold text-[16px] min-[481px]:text-[18px] tracking-wide border-none cursor-pointer transition-all duration-200 hover:brightness-105 flex items-center justify-center gap-2"
          >
            {success ? "Setup Complete! Let's Sell! 💰" : "Start Selling Now! 💸"}
          </button>
        </div>
      </div>

      <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
    </div>
  )
}

export default GrowStore
