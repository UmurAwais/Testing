import React, { useState, useEffect } from 'react'
import { BackgroundDecorations } from '../components/BackgroundDecorations'
import LockedStep from '../components/LockedStep'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import InputField from '../components/InputField'
import { useNavigate } from 'react-router-dom'
import SuccessOverlay from '../components/SuccessOverlay'
import StepsProgress from '../components/StepsProgress'

const MakeUnique = ({ userData, updateUserData }) => {
  const [saving, setSaving] = useState(true)
  const [success, setSuccess] = useState(false)
  const [progressStep, setProgressStep] = useState(0)
  const navigate = useNavigate()

  const themeStepsList = [
    'Initializing Shopify Theme copy...',
    'Duplicating Dawn theme framework...',
    'Customizing layout configuration...',
    'Injecting niche-specific assets...',
    'Publishing theme live...'
  ]

  useEffect(() => {
    // Start progress steps animation
    const interval = setInterval(() => {
      setProgressStep((prev) => {
        if (prev >= themeStepsList.length - 1) {
          clearInterval(interval)
          return prev
        }
        return prev + 1
      })
    }, 850)

    const publishTheme = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
      const userEmail = userData.email || localStorage.getItem("userEmail")
      const shop = userData.adminUrl || localStorage.getItem("shopifyAdminUrl")

      try {
        await fetch(`${apiUrl}/api/theme`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email: userEmail, shop: shop })
        })
      } catch (err) {
        console.warn("Theme creation ran into an issue or timeout, proceeding to products simulation.", err);
      } finally {
        clearInterval(interval)
        setSuccess(true)
        localStorage.setItem("userProgress", "add-products")
        setTimeout(() => {
          navigate('/add-products')
        }, 1200)
      }
    }

    publishTheme()

    return () => clearInterval(interval)
  }, [userData.adminUrl, userData.email, navigate])



  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <BackgroundDecorations />

      <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 py-6 min-[481px]:py-8 min-[901px]:py-10 flex-1 flex flex-col items-center justify-center">
        <Logo className="mb-6" />

        {/* Steps Progress Indicator */}
        <StepsProgress activeStep={6} />

        {/* Step 6 Card: Make Your Store Unique */}
        <div className="relative w-full bg-white border border-ecomlly-line rounded-[24px] p-5 min-[481px]:p-6 min-[901px]:p-8 shadow-sm mb-5">
          
          {success && (
            <SuccessOverlay />
          )}

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-8 h-8 rounded-full bg-linear-to-b from-[#34B073] to-ecomlly-v-deep text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none shadow-[0_2px_8px_rgba(52,176,115,0.2)]">
              6
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Make Your Store Unique
            </h2>
          </div>

          <p className="text-ecomlly-muted text-base mb-8 leading-relaxed">
            We are applying niche-specific color schemes, duplicating the premium theme templates, and copying high-converting banner configurations directly to your Shopify store. Please wait...
          </p>

          {/* Sync Progress Status Text */}
          <div className="w-full text-center mb-6">
            <p className="text-[14px] font-sans font-semibold text-ecomlly-v-soft animate-pulse">
              {themeStepsList[progressStep]}
            </p>
            <div className="w-full h-1 bg-ecomlly-line rounded-full overflow-hidden mt-3 max-w-[320px] mx-auto">
              <div
                className="h-full bg-ecomlly-v-soft rounded-full transition-all duration-500"
                style={{ width: `${((progressStep + 1) / themeStepsList.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Centered Loading Spinner Graphic */}
          <div className="w-full flex items-center justify-center gap-12 bg-[#FAFDF8] border border-ecomlly-line-s/60 rounded-2xl py-8 px-4 relative overflow-hidden mb-2">
            <div className={`w-12 h-12 rounded-full border-4 border-ecomlly-line-s border-t-ecomlly-v-soft animate-spin`} />
          </div>
        </div>

        {/* Locked Next Step */}
        <LockedStep
          stepNumber={7}
          title="Add Top Selling Products"
        />
      </div>

      <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
    </div>
  )
}

export default MakeUnique
