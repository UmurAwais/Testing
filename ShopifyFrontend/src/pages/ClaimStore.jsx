import React, { useState, useEffect } from 'react'
import { BackgroundDecorations } from '../components/BackgroundDecorations'
import LockedStep from '../components/LockedStep'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import SuccessOverlay from '../components/SuccessOverlay'
import { useNavigate } from 'react-router-dom'
import StepsProgress from '../components/StepsProgress'

const ClaimStore = ({ userData, updateUserData }) => {
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Restore or initialize step state if needed
  }, [])

  const handleClaimClick = () => {
    setSaving(true)
    setError('')

    setTimeout(() => {
      setSuccess(true)
      localStorage.setItem("userProgress", "grab-discount")
      setTimeout(() => {
        navigate('/grab-discount')
      }, 1500)
    }, 1000)
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <BackgroundDecorations />

      {/* Main content wrapper */}
      <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 py-6 min-[481px]:py-8 min-[901px]:py-10 flex-1 flex flex-col items-center justify-center">

        {/* Logo Header */}
        <Logo className="mb-6" />

        {/* Steps Progress Indicator */}
        <StepsProgress activeStep={3} />

        {/* Step 3 Card: Claim Store */}
        <div className="relative w-full bg-white border border-ecomlly-line rounded-[24px] p-5 min-[481px]:p-6 min-[901px]:p-8 shadow-sm mb-5">

          {success && (
            <SuccessOverlay />
          )}

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-b from-[#34B073] to-ecomlly-v-deep text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none shadow-[0_2px_8px_rgba(52,176,115,0.2)]">
              3
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Your store is ready. One click to own it!
            </h2>
          </div>

          <p className="text-ecomlly-muted text-base mb-6 max-w-[70ch]">
            We’ve built your store — now just click "Claim store" on the next screen and it’s yours. We’ll bring you straight back to launch.
          </p>

          {/* ══ MOCK SHOPIFY BROWSER PREVIEW NATIVE CARD ══ */}
          <div className="w-full rounded-2xl overflow-hidden border border-[#D5EAD5]/40 bg-[#FAFDF8] shadow-inner mb-8 flex flex-col aspect-[16/11] max-w-[650px] mx-auto">
            {/* Header top bar */}
            <div className="bg-[#133A24] h-11 px-4 flex items-end gap-1.5">
              {/* BuildYour tab */}
              <div className="bg-[#18482E] text-white text-[12px] font-semibold px-3.5 py-2.25 rounded-t-xl flex items-center gap-1.5 pointer-events-none select-none opacity-90">
                <span className="text-[12px]">🛍</span>
                <span>BuildYour...</span>
              </div>
              {/* Shopify.com active tab */}
              <div className="bg-[#FAFDF8] text-[#133A24] text-[12px] font-bold px-4 py-2.25 rounded-t-xl flex items-center gap-1.5 -mb-px z-10 pointer-events-none select-none shadow-[0_-2px_6px_rgba(0,0,0,0.06)]">
                <span className="text-[12px] text-[#5E8E3E]">🟢</span>
                <span>shopify.com</span>
              </div>
            </div>

            {/* Browser client content */}
            <div className="bg-[#FAFDF8] p-6 min-[480px]:p-10 flex flex-col items-center justify-center border-t border-gray-100 flex-1 relative select-none">

              {/* Shopify Logo */}
              <div className="flex items-center justify-center gap-1.5 mb-2.5">
                <span className="text-3xl">🛍</span>
                <span className="font-sans font-extrabold text-[24px] tracking-tight text-[#1a4d2e]">shopify</span>
              </div>

              <div className="text-[14px] font-semibold text-gray-500 mb-6 text-center">
                Where would you like to sell?
              </div>

              {/* Checkbox item skeletons */}
              <div className="w-full max-w-[420px] flex flex-col gap-2.5 mb-10">
                <div className="h-9 bg-[#F0F7ED]/70 rounded-xl w-full flex items-center justify-between px-4 border border-[rgba(31,107,66,0.05)]">
                  <div className="h-2 w-1/3 bg-gray-200/80 rounded-md" />
                  <div className="w-3.5 h-3.5 border border-gray-300 rounded" />
                </div>
                <div className="h-9 bg-[#F0F7ED]/70 rounded-xl w-full flex items-center justify-between px-4 border border-[rgba(31,107,66,0.05)]">
                  <div className="h-2 w-1/2 bg-gray-200/80 rounded-md" />
                  <div className="w-3.5 h-3.5 border border-gray-300 rounded" />
                </div>
              </div>

              {/* Skip button with cursor */}
              <div className="absolute bottom-6 left-6 min-[480px]:bottom-8 min-[480px]:left-8">
                <div className="relative">
                  <button
                    type="button"
                    className="bg-[#112415] text-[#86DDAB] px-5 py-2.25 rounded-full font-bold text-[13px] tracking-wide pointer-events-none flex items-center justify-center"
                  >
                    Skip
                  </button>
                  {/* Cursor Arrow */}
                  <svg
                    className="absolute bottom-[-16px] right-[-14px] w-6 h-6 text-[#4CC183] drop-shadow-md select-none transform rotate-[15deg] pointer-events-none"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M4.5 3v15.2l3.8-3.8 2.5 5.8 2.6-1.1-2.5-5.8 4.6.1L4.5 3z" />
                  </svg>
                </div>
              </div>

            </div>
          </div>

          {/* What happens next timeline */}
          <div className="mb-8">
            <h3 className="font-sans font-extrabold text-[17px] text-ecomlly-text mb-5 tracking-wide">
              What happens next:
            </h3>

            {/* Timeline container */}
            <div className="relative pl-6 flex flex-col gap-5.5 before:content-[''] before:absolute before:left-[4px] before:top-2 before:bottom-2 before:w-[2px] before:bg-ecomlly-v-soft">

              {/* Timeline Item 1 */}
              <div className="relative flex items-center text-base font-semibold text-ecomlly-text">
                <div className="absolute left-[-26px] w-[10px] h-[10px] rounded-full bg-ecomlly-v-soft shadow-[0_0_8px_rgba(31,138,82,0.6)]" />
                <span>You’re taken to Shopify</span>
              </div>

              {/* Timeline Item 2 */}
              <div className="relative flex items-center text-base font-semibold text-ecomlly-text">
                <div className="absolute left-[-26px] w-[10px] h-[10px] rounded-full bg-ecomlly-v-soft shadow-[0_0_8px_rgba(31,138,82,0.6)]" />
                <span>Click “Claim Store” - one button</span>
              </div>

              {/* Timeline Item 3 */}
              <div className="relative flex items-center text-base font-semibold text-ecomlly-text">
                <div className="absolute left-[-26px] w-[10px] h-[10px] rounded-full bg-ecomlly-v-soft shadow-[0_0_8px_rgba(31,138,82,0.6)]" />
                <span>We bring you back here</span>
              </div>

            </div>
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mb-4 font-semibold">{error}</p>
          )}

          {/* Action Link & Button */}
          <a
            href="https://www.shopify.com/signup"
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleClaimClick}
            className="w-full block no-underline"
          >
            <button
              type="button"
              disabled={saving}
              className="w-full bg-gradient-to-b from-[#34B073] to-ecomlly-v-deep hover:from-[#2e9e68] hover:to-[#175b37] text-white py-3 min-[481px]:py-3.75 px-6 rounded-xl font-sans font-bold text-[16px] min-[481px]:text-[18px] tracking-wide shadow-[0_8px_24px_rgba(27,107,66,0.25)] flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {saving ? 'Opening Shopify...' : 'Claim my Store'}
            </button>
          </a>

          <div className="text-center text-[13px] text-ecomlly-muted mt-2.5 font-semibold">
            takes less than 10 seconds
          </div>

        </div>

        {/* Locked Next Step */}
        <LockedStep
          stepNumber={4}
          title="Grab Your Shopify Discount"
        />

      </div>

      <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
    </div>
  )
}

export default ClaimStore
