import React, { useState, useEffect } from 'react'
import { BackgroundDecorations } from '../components/BackgroundDecorations'
import LockedStep from '../components/LockedStep'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import { useNavigate } from 'react-router-dom'
import SuccessOverlay from '../components/SuccessOverlay'
import StepsProgress from '../components/StepsProgress'

const ChooseBanners = ({ userData, updateUserData }) => {
  const [niche, setNiche] = useState('fashion')
  const [banners, setBanners] = useState([])
  const [selectedBanners, setSelectedBanners] = useState([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const activeNiche = userData.niche || localStorage.getItem("selectedNiche") || "fashion"
    setNiche(activeNiche)

    // Restore selected banners from state
    if (Array.isArray(userData.selectedBanners) && userData.selectedBanners.length > 0) {
      setSelectedBanners(userData.selectedBanners)
    }

    const fetchBanners = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
      try {
        const response = await fetch(`${apiUrl}/api/niches/GetNiche/${activeNiche}`)
        const nicheData = await response.json()

        if (response.ok && nicheData && Array.isArray(nicheData.bannerImages)) {
          setBanners(nicheData.bannerImages)
        } else {
          setError('Failed to load banners for this niche.')
        }
      } catch (err) {
        console.error('Failed to load banners from database.')
        setError('Network error loading banners.')
      } finally {
        setLoading(false)
      }
    }
    fetchBanners()
  }, [userData.niche, userData.selectedBanners])

  const handleSelectBanner = (url) => {
    setError('')
    setSuccess(false)
    if (selectedBanners.includes(url)) {
      setSelectedBanners(selectedBanners.filter(x => x !== url))
    } else {
      if (selectedBanners.length < 2) {
        setSelectedBanners([...selectedBanners, url])
      } else {
        // FIFO queue replacement behavior
        setSelectedBanners([selectedBanners[1], url])
      }
    }
  }

  const handleDone = async () => {
    if (selectedBanners.length !== 2) return

    setSaving(true)
    setError('')

    try {
      updateUserData({ 
        selectedBanners: selectedBanners,
        selectedBannerImages: selectedBanners 
      })
      localStorage.setItem("selectedBanners", JSON.stringify(selectedBanners))
      localStorage.setItem("selectedBannerImages", JSON.stringify(selectedBanners))
      localStorage.setItem("userProgress", "claim-store")

      setSuccess(true)
      setTimeout(() => {
        navigate('/claim-store')
      }, 1000)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setSaving(false)
    }
  }

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

      {/* Main content wrapper */}
      <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 py-6 min-[481px]:py-8 min-[901px]:py-10 flex-1 flex flex-col items-center justify-center">

        {/* Logo Header */}
        <Logo className="mb-6" />

        {/* Steps Progress Indicator */}
        <StepsProgress activeStep={2} />

        {/* Step 2 Card: Choose Banners */}
        <div className="relative w-full bg-white border border-ecomlly-line rounded-[24px] p-5 min-[481px]:p-6 min-[901px]:p-8 shadow-sm mb-5">

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#35B577] to-[#248B57] text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none">
              2
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Choose Banners for Your Homepage
            </h2>
          </div>

          <p className="text-ecomlly-muted text-base mb-6 leading-relaxed">
            Select <strong className="text-ecomlly-v-deep">exactly 2 banners</strong> that match your store niche aesthetics to be deployed on your home sliders.
          </p>

          {/* Banner Selector Grid */}
          <div className="grid grid-cols-1 min-[481px]:grid-cols-2 gap-4 mb-6">
            {banners.map((url, i) => {
              const isSelected = selectedBanners.includes(url)
              const selectedIndex = selectedBanners.indexOf(url)

              return (
                <div
                  key={i}
                  onClick={() => handleSelectBanner(url)}
                  className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all duration-200 aspect-[16/9] ${
                    isSelected ? 'border-ecomlly-v-soft shadow-md scale-[1.01]' : 'border-ecomlly-line hover:border-ecomlly-line-s'
                  }`}
                >
                  <img
                    src={url}
                    alt={`Store banner option ${i + 1}`}
                    className="w-full h-full object-cover select-none"
                  />

                  {/* Glassmorphic overlay for selection index indicator */}
                  {isSelected && (
                    <div className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-ecomlly-v-soft text-white flex items-center justify-center font-sans font-extrabold text-[12px] shadow-sm animate-scaleUp">
                      {selectedIndex + 1}
                    </div>
                  )}

                  {/* Soft bottom gradient overlay */}
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/25 to-transparent pointer-events-none" />
                </div>
              )
            })}
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mb-4 font-semibold">{error}</p>
          )}

          {success && (
            <SuccessOverlay />
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleDone}
            disabled={selectedBanners.length !== 2 || saving}
            className={`w-full py-3.5 min-[481px]:py-4 px-6 rounded-xl font-sans font-bold text-[16px] min-[481px]:text-[18px] tracking-wide transition-all duration-200 flex items-center justify-center gap-2 border-none ${
              selectedBanners.length === 2 && !saving
                ? 'bg-gradient-to-br from-[#35B577] to-[#248B57] text-white cursor-pointer hover:brightness-105'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {saving ? 'Saving Selection...' : 'Save & Continue'}
          </button>
        </div>

        {/* Locked Next Step */}
        <LockedStep
          stepNumber={3}
          title="Claim Your Free Shopify Store"
        />

      </div>

      <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
    </div>
  )
}

export default ChooseBanners
