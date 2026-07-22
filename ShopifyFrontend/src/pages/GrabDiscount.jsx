import React from 'react'
import { BackgroundDecorations } from '../components/BackgroundDecorations'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import StepsProgress from '../components/StepsProgress'
import LockedStep from '../components/LockedStep'
import { useNavigate } from 'react-router-dom'

const GrabDiscount = ({ userData, updateUserData }) => {
  const navigate = useNavigate()

  return (
    <div className="relative min-h-screen flex flex-col justify-between">
      <BackgroundDecorations />

      <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 py-6 min-[481px]:py-8 min-[901px]:py-10 flex-1 flex flex-col items-center justify-center">
        <Logo className="mb-6" />

        {/* Steps Progress Indicator */}
        <StepsProgress activeStep={4} />

        {/* Step 4 Card: Grab Discount */}
        <div className="relative w-full bg-white border border-ecomlly-line rounded-[24px] p-5 min-[481px]:p-6 min-[901px]:p-8 shadow-sm mb-5">
          
          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-8 h-8 rounded-full bg-linear-to-b from-[#34B073] to-ecomlly-v-deep text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none shadow-[0_2px_8px_rgba(52,176,115,0.2)]">
              4
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Grab Your Shopify Discount
            </h2>
          </div>

          <p className="text-ecomlly-muted text-base mb-6 leading-relaxed">
            Congratulations! Your high-converting Shopify store has been successfully built and claimed. Get started today with a special promotion.
          </p>

          {/* Shopify Discount Special Offer Banner */}
          <div className="w-full rounded-2xl border border-ecomlly-line-s bg-ecomlly-bg-2 p-4 min-[481px]:p-5 mb-6 flex flex-col min-[481px]:flex-row min-[481px]:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-12 h-12 rounded-xl bg-white border border-ecomlly-line flex items-center justify-center text-2xl flex-none shadow-xs">
                🎉
              </div>
              <div>
                <h3 className="font-sans font-extrabold text-[16px] min-[481px]:text-[17px] text-ecomlly-text tracking-wide">
                  Shopify $1/month Promo
                </h3>
                <p className="text-ecomlly-muted text-[13px] mt-0.5 font-semibold">
                  Enjoy 3 months of Shopify for just $1/month on select plans.
                </p>
              </div>
            </div>
            <div className="text-[11px] font-extrabold text-ecomlly-v-soft uppercase tracking-wider bg-[rgba(31,107,66,0.08)] px-3.5 py-1.75 rounded-lg text-center flex-none">
              Active Offer
            </div>
          </div>

          <p className="text-ecomlly-muted text-base mb-6 leading-relaxed">
            Click the button below to pick your subscription and claim this discount directly inside your Shopify store's admin settings page.
          </p>

          {/* Action Link & Buttons */}
          <div className="flex flex-col gap-3">
            <a 
              href="https://admin.shopify.com/settings/plan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="w-full block no-underline"
            >
              <button
                type="button"
                className="w-full bg-linear-to-b from-[#34B073] to-ecomlly-v-deep hover:from-[#2e9e68] hover:to-[#175b37] text-white py-3.5 min-[481px]:py-4 px-6 rounded-xl font-sans font-bold text-[16px] min-[481px]:text-[18px] tracking-wide shadow-[0_8px_24px_rgba(27,107,66,0.25)] border-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 flex items-center justify-center gap-2"
              >
                Get $1/month Plan
              </button>
            </a>

            <button
              type="button"
              onClick={() => {
                localStorage.setItem("userProgress", "install-app");
                navigate('/install-app');
              }}
              className="w-full bg-gray-100 hover:bg-gray-200/80 text-ecomlly-text py-3.5 px-6 rounded-xl font-sans font-bold text-[16px] tracking-wide transition-all duration-200 flex items-center justify-center gap-2 border-none cursor-pointer"
            >
              Continue to Step 5
            </button>
          </div>
        </div>

        {/* Locked Next Step */}
        <LockedStep
          stepNumber={5}
          title="Install Build Your Store App"
        />
      </div>

      <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
    </div>
  )
}

export default GrabDiscount
