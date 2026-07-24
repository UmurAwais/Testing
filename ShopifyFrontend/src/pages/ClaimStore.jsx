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
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#35B577] to-[#248B57] text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none">
              3
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Your store is ready. One click to own it!
            </h2>
          </div>

          <p className="text-ecomlly-muted text-base mb-6 max-w-[70ch]">
            We’ve built your store — now just click "Claim store" on the next screen and it’s yours. We’ll bring you straight back to launch.
          </p>

          {/* Instruction Video */}
          <div className="w-full mb-8 bg-black rounded-2xl overflow-hidden aspect-video border border-ecomlly-line-s/60 shadow-sm relative max-w-[650px] mx-auto">
            <video 
              className="w-full h-full object-cover"
              src="/ecomlly.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
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
              className="w-full bg-gradient-to-br from-[#35B577] to-[#248B57] text-white py-3 min-[481px]:py-3.75 px-6 rounded-xl font-sans font-bold text-[16px] min-[481px]:text-[18px] tracking-wide flex items-center justify-center gap-2 border-none cursor-pointer transition-all duration-200 hover:brightness-105 disabled:opacity-60 disabled:cursor-not-allowed"
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
