import React, { useState, useEffect } from 'react'
import { BackgroundDecorations } from '../components/BackgroundDecorations'
import LockedStep from '../components/LockedStep'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import SuccessOverlay from '../components/SuccessOverlay'
import StepsProgress from '../components/StepsProgress'
import { useNavigate } from 'react-router-dom'

const InstallApp = ({ userData, updateUserData }) => {
  const [shopUrl, setShopUrl] = useState('')
  const [installing, setInstalling] = useState(false)
  const [installStep, setInstallStep] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const shop = params.get('shop')
    if (shop) {
      updateUserData({ shopifyConnected: true, adminUrl: shop })
      localStorage.setItem('shopifyAdminUrl', shop)
      localStorage.setItem('userProgress', 'make-unique')
      setSuccess(true)
      // Automatically redirect to Step 6 after 1.5 seconds success screen display
      setTimeout(() => {
        navigate('/make-unique')
      }, 1500)
    } else if (userData.shopifyConnected || localStorage.getItem('shopifyAdminUrl')) {
      setSuccess(true)
    }
  }, [userData.shopifyConnected, updateUserData, navigate])

  const installStepsList = [
    'Connecting to Shopify App Store...',
    'Detecting your logged-in store...',
    'Preparing your niche theme & products...',
    'Waiting for app installation...',
    'Finalising secure connection...'
  ]

  const handleInstall = async () => {
    if (success || userData.shopifyConnected || localStorage.getItem('shopifyAdminUrl')) {
      localStorage.setItem("userProgress", "make-unique")
      navigate('/make-unique')
      return
    }

    setInstalling(true)
    setError('')
    setInstallStep(0)

    // Simulate progress ticks
    const interval = setInterval(() => {
      setInstallStep((prev) => {
        if (prev >= installStepsList.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 700)

    const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
    const userEmail = userData.email || localStorage.getItem("userEmail")
    const userNiche = userData.niche || localStorage.getItem("selectedNiche")
    const userBanners = userData.selectedBanners || JSON.parse(localStorage.getItem("selectedBanners") || "[]")

    try {
      const response = await fetch(`${apiUrl}/auth`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          shop: "admin.shopify.com",
          email: userEmail,
          niche: userNiche,
          selectedBanners: userBanners,
          selectedBannerImages: userBanners,
          success_url: `${window.location.origin}/install-app`
        })
      })

      const data = await response.json()

      if (response.ok && data.authUrl) {
        // Clean URL from admin.shopify.com/admin/oauth/authorize to admin.shopify.com/oauth/authorize
        const finalAuthUrl = data.authUrl.replace('admin.shopify.com/admin/oauth/authorize', 'admin.shopify.com/oauth/authorize')
        setTimeout(() => {
          clearInterval(interval)
          window.location.href = finalAuthUrl
        }, 1500)
      } else {
        clearInterval(interval)
        setError(data.error || 'Failed to initiate installation. Please try again.')
        setInstalling(false)
      }
    } catch (err) {
      clearInterval(interval)
      setError('Network error connecting to Shopify.')
      setInstalling(false)
    }
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <BackgroundDecorations />

      <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 py-6 min-[481px]:py-8 min-[901px]:py-10 flex-1 flex flex-col items-center justify-center">
        <Logo className="mb-6" />

        {/* Steps Progress Indicator */}
        <StepsProgress activeStep={5} />

        {/* Step 5 Card: Install App */}
        <div className="relative w-full bg-white border border-ecomlly-line rounded-[24px] p-5 min-[481px]:p-6 min-[901px]:p-8 shadow-sm mb-5">

          {success && (
            <SuccessOverlay />
          )}

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-8 h-8 rounded-full bg-linear-to-b from-[#34B073] to-ecomlly-v-deep text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none shadow-[0_2px_8px_rgba(52,176,115,0.2)]">
              5
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Connect Your Shopify Store
            </h2>
          </div>

          <p className="text-ecomlly-muted text-base mb-8 leading-relaxed">
            Make sure you're logged into your Shopify store in this browser, then click the button below. 
            Shopify will automatically detect your store and ask you to install the Ecomlly app — 
            one click and everything syncs automatically.
          </p>

          {/* How it works */}
          <div className="w-full rounded-2xl bg-[#FAFDF8] border border-ecomlly-line-s p-4 min-[481px]:p-5 mb-7">
            <h3 className="font-sans font-bold text-[14px] text-ecomlly-v-deep mb-3 uppercase tracking-wider">
              How it works
            </h3>
            <div className="flex flex-col gap-2.5">
              {[
                'You get redirected to Shopify App Store',
                'Shopify detects your logged-in store automatically',
                'Click "Install" to grant access',
                'Your theme, banners & products are synced instantly'
              ].map((step, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-ecomlly-v-soft text-white flex items-center justify-center font-sans font-extrabold text-[10px] flex-none">
                    {i + 1}
                  </div>
                  <span className="text-[14px] font-semibold text-ecomlly-text">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Connection Sync Graphic */}
          <div className="w-full flex items-center justify-center gap-8 min-[481px]:gap-12 mb-8 bg-[#FAFDF8] border border-ecomlly-line-s/60 rounded-2xl py-8 px-4 relative overflow-hidden">
            {/* Left Badge: Ecomlly */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-16 h-16 rounded-2xl bg-white border border-ecomlly-line shadow-sm flex items-center justify-center font-sans font-extrabold text-[18px] text-ecomlly-v-deep">
                E
              </div>
              <span className="text-[12px] font-bold text-ecomlly-text">Ecomlly</span>
            </div>

            {/* Syncing Center Arrows */}
            <div className="flex-1 max-w-[120px] flex flex-col items-center justify-center relative">
              <div className="w-full h-0.5 bg-dashed border-t border-gray-300 relative">
                {installing && (
                  <div className="absolute top-1/2 left-0 w-2.5 h-2.5 rounded-full bg-ecomlly-v-soft -translate-y-1/2 animate-ping" style={{ animationDuration: '1.5s' }} />
                )}
              </div>

              <div className={`w-8 h-8 rounded-full bg-white border border-ecomlly-line flex items-center justify-center shadow-xs mt-[-16px] z-10 ${installing ? 'animate-spin' : ''}`} style={{ animationDuration: '3s' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67" />
                </svg>
              </div>
            </div>

            {/* Right Badge: Shopify */}
            <div className="flex flex-col items-center gap-2 z-10">
              <div className="w-16 h-16 rounded-2xl bg-[#96bf48] shadow-sm flex items-center justify-center font-sans font-extrabold text-[18px] text-white">
                S
              </div>
              <span className="text-[12px] font-bold text-ecomlly-text">Shopify</span>
            </div>
          </div>

          {/* Sync Progress Status Text */}
          {installing && (
            <div className="w-full text-center mb-6">
              <p className="text-[14px] font-sans font-semibold text-ecomlly-v-soft animate-pulse">
                {installStepsList[installStep]}
              </p>
              <div className="w-full h-1 bg-ecomlly-line rounded-full overflow-hidden mt-3 max-w-[320px] mx-auto">
                <div
                  className="h-full bg-ecomlly-v-soft rounded-full transition-all duration-500"
                  style={{ width: `${((installStep + 1) / installStepsList.length) * 100}%` }}
                />
              </div>
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center mb-4 font-semibold">{error}</p>
          )}

          {/* CTA Action Button */}
          <button
            type="button"
            id="install-shopify-app-btn"
            onClick={handleInstall}
            disabled={installing}
            className="w-full bg-linear-to-b from-[#34B073] to-ecomlly-v-deep hover:from-[#2e9e68] hover:to-[#175b37] text-white py-3.5 min-[481px]:py-4 px-6 rounded-xl font-sans font-bold text-[16px] min-[481px]:text-[18px] tracking-wide shadow-[0_8px_24px_rgba(27,107,66,0.25)] border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            {installing ? (
              <>
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Redirecting to Shopify...
              </>
            ) : success ? (
              'Continue to Customize Store \u2794'
            ) : (
              'Install App & Sync Store'
            )}
          </button>

          <p className="text-center text-[12px] text-ecomlly-muted mt-3 font-semibold">
            Make sure you're already logged into your Shopify store before clicking
          </p>
        </div>

        {/* Locked Next Step */}
        <LockedStep
          stepNumber={6}
          title="Make Your Store Unique"
        />
      </div>

      <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
    </div>
  )
}

export default InstallApp
