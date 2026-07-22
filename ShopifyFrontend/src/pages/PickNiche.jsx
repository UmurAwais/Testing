import React, { useState, useEffect } from 'react'
import { BackgroundDecorations } from '../components/BackgroundDecorations'
import NicheCard from '../components/NicheCard'
import LockedStep from '../components/LockedStep'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import { useNavigate } from 'react-router-dom'
import SuccessOverlay from '../components/SuccessOverlay'
import StepsProgress from '../components/StepsProgress'

const nicheIcons = {
  Shirt: (
    <svg className="w-8 h-8 stroke-current" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 0a3 3 0 00-3 3v1m6-4a3 3 0 01-3 3v1m0 0H7.5A2.5 2.5 0 005 11.5V19a2 2 0 002 2h10a2 2 0 002-2v-7.5a2.5 2.5 0 00-2.5-2.5H12" />
    </svg>
  ),
  Paw: (
    <svg className="w-8 h-8 stroke-current" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 100-4 2 2 0 000 4zM18 8a2 2 0 100-4 2 2 0 000 4zM4 14a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM20 14a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    </svg>
  ),
  Cpu: (
    <svg className="w-8 h-8 stroke-current" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 18v-6a9 9 0 0118 0v6M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3M3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3" />
    </svg>
  ),
  Home: (
    <svg className="w-8 h-8 stroke-current" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6M19 6a1 1 0 011-1h1a1 1 0 011 1v3a1 1 0 01-1 1h-1a1 1 0 01-1-1V6z" />
    </svg>
  ),
  Activity: (
    <svg className="w-8 h-8 stroke-current" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 12H18M4 9v6M20 9v6M2 11h2M20 11h2M6 8v8M18 8v8" />
    </svg>
  ),
  HelpCircle: (
    <svg className="w-8 h-8 stroke-current" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M5.4 5h14.8l-1.3 7H6.7M6.7 12H19M6.7 12l-1 5M5.7 17h13.8M8.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3zM16.5 21a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
  )
}

const STATIC_NICHES = [
  { id: 'fashion', name: 'Fashion', icon: 'Shirt' },
  { id: 'electronics', name: 'Electronics', icon: 'Cpu' },
  { id: 'homedecor', name: 'Home Decor', icon: 'Home' },
  { id: 'fitness', name: 'Fitness', icon: 'Activity' },
  { id: 'pets', name: 'Pets', icon: 'Paw' },
  { id: 'other', name: 'Other', icon: 'HelpCircle' }
];

const PickNiche = ({ userData, updateUserData }) => {
  const [niches, setNiches] = useState([])
  const [selectedNiche, setSelectedNiche] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    // Restore niche selection on load
    const savedNiche = userData.niche || localStorage.getItem("selectedNiche")
    if (savedNiche) {
      setSelectedNiche(savedNiche)
    }

    const fetchNiches = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
      try {
        const response = await fetch(`${apiUrl}/api/niches`)
        const data = await response.json()
        if (response.ok && Array.isArray(data) && data.length > 0) {
          const normalized = data.map(n => {
            const lowerName = n.name?.toLowerCase() || '';
            let iconName = 'HelpCircle';
            if (lowerName === 'fashion') iconName = 'Shirt';
            else if (lowerName === 'pets') iconName = 'Paw';
            else if (lowerName === 'electronics') iconName = 'Cpu';
            else if (lowerName === 'homedecor' || lowerName === 'home') iconName = 'Home';
            else if (lowerName === 'fitness' || lowerName === 'sport') iconName = 'Activity';
            
            return {
              id: lowerName || n._id,
              name: n.name?.charAt(0).toUpperCase() + n.name?.slice(1) || 'Niche',
              icon: iconName
            };
          });
          setNiches(normalized)
        } else {
          setNiches(STATIC_NICHES)
        }
      } catch (err) {
        console.warn('Network error loading niches from database, using static fallback.')
        setNiches(STATIC_NICHES)
      } finally {
        setLoading(false)
      }
    }
    fetchNiches()
  }, [userData.niche])

  const handleSelectNiche = (id) => {
    setSelectedNiche(id)
    setError('')
  }

  const handleDone = async () => {
    if (!selectedNiche) return

    setIsSubmitting(true)
    setError('')

    try {
      // Clear old banner selections when changing niche
      if (userData.niche && userData.niche !== selectedNiche) {
        updateUserData({
          niche: selectedNiche,
          selectedBanners: [],
          selectedBannerImages: []
        })
        localStorage.removeItem("selectedBanners")
        localStorage.removeItem("selectedBannerImages")
      } else {
        updateUserData({ niche: selectedNiche })
      }

      localStorage.setItem("selectedNiche", selectedNiche)
      localStorage.setItem("userProgress", "banners")

      setSuccess(true)
      setTimeout(() => {
        navigate('/choose-banners')
      }, 1000)
    } catch (err) {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsSubmitting(false)
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
        <StepsProgress activeStep={1} />

        {/* Step 1 Card: Pick a Niche */}
        <div className="relative w-full bg-white border border-ecomlly-line rounded-[24px] p-5 min-[481px]:p-6 min-[901px]:p-8 shadow-sm mb-5">

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-8 h-8 rounded-full bg-linear-to-b from-[#34B073] to-ecomlly-v-deep text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none shadow-[0_2px_8px_rgba(52,176,115,0.2)]">
              1
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Pick a niche
            </h2>
          </div>

          {/* Grid of options */}
          <div className="grid grid-cols-1 min-[481px]:grid-cols-2 min-[768px]:grid-cols-3 gap-3.5 min-[481px]:gap-5 mb-6">
            {niches.map((niche) => (
              <NicheCard
                key={niche.id}
                id={niche.id}
                title={niche.name}
                icon={nicheIcons[niche.icon] || nicheIcons.HelpCircle}
                isSelected={selectedNiche === niche.id}
                onSelect={handleSelectNiche}
              />
            ))}
          </div>

          {error && (
            <p className="text-red-600 text-sm text-center mb-4 font-semibold">{error}</p>
          )}

          {success && (
            <SuccessOverlay />
          )}

          {/* Done Button */}
          <button
            type="button"
            onClick={handleDone}
            disabled={!selectedNiche || isSubmitting}
            className={`w-full py-3 min-[481px]:py-3.75 px-6 rounded-xl font-sans font-bold text-[16px] min-[481px]:text-[18px] tracking-wide transition-all duration-200 flex items-center justify-center gap-2 border-none ${selectedNiche && !isSubmitting
                ? 'bg-linear-to-b from-[#34B073] to-ecomlly-v-deep text-white cursor-pointer shadow-[0_8px_24px_rgba(27,107,66,0.25)] hover:-translate-y-0.5 active:translate-y-0'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
          >
            {isSubmitting ? 'Saving...' : 'Done'}
          </button>
        </div>

        {/* Locked Next Step */}
        <LockedStep
          stepNumber={2}
          title="Choose Banners for Your Homepage"
        />

      </div>

      <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
    </div>
  )
}

export default PickNiche
