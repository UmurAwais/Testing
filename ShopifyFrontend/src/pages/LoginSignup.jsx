import React, { useState } from 'react'
import { BackgroundDecorations, MobileBackgroundDecorations } from '../components/BackgroundDecorations'
import Logo from '../components/Logo'
import ShopifyBadges from '../components/ShopifyBadges'
import BenefitsList from '../components/BenefitsList'
import TestimonialCard from '../components/TestimonialCard'
import InputField from '../components/InputField'
import TrustFooter from '../components/TrustFooter'
import Footer from '../components/Footer'
import { useNavigate } from 'react-router-dom'

const LoginSignup = ({ userData, updateUserData }) => {
  const [isLogin, setIsLogin] = useState(true) // Start in Login mode since route is /login
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
    const url = isLogin 
      ? `${apiUrl}/api/auth/login` 
      : `${apiUrl}/api/auth/signup`

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (response.ok) {
        console.log(`${isLogin ? 'Login' : 'Signup'} successful:`, data)
        
        // Clear previous store connection data from local storage & context
        localStorage.removeItem('shopifyAdminUrl')
        localStorage.removeItem('connectedShop')
        localStorage.removeItem('selectedNiche')
        localStorage.removeItem('selectedBanners')
        localStorage.removeItem('userProgress')
        
        updateUserData({ 
          isAuthenticated: true, 
          email: email,
          shopifyConnected: false,
          adminUrl: '',
          niche: '',
          selectedBanners: [],
          selectedBannerImages: []
        })
        
        localStorage.setItem('userEmail', email)
        navigate('/pick-a-niche')
      } else {
        setError(data.error || 'Something went wrong. Please try again.')
      }
    } catch (err) {
      setError('Network error. Make sure the backend server is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen">
      <BackgroundDecorations />

      <div className="relative z-10 grid grid-cols-1 min-[901px]:grid-cols-2 min-h-screen max-w-[1440px] mx-auto">
        
        {/* ══ LEFT PANEL ══ */}
        <div className="relative flex flex-col justify-center px-5 py-9 min-[481px]:px-8 min-[481px]:py-12 min-[901px]:px-16 min-[901px]:py-15 overflow-hidden max-[900px]:order-1 max-[900px]:min-h-0">
          <MobileBackgroundDecorations />

          <div className="relative z-10">
            <Logo />

            {/* Headline */}
            <h1 className="font-sans font-extrabold text-[clamp(40px,4vw,58px)] max-[900px]:text-[38px] max-[480px]:text-[32px] leading-[1.06] tracking-[-0.03em] mb-4 text-ecomlly-text">
              Your Shopify store.<br />
              <span className="bg-linear-[100deg,var(--color-ecomlly-v-soft),var(--color-ecomlly-violet)_55%,#4CC183] bg-clip-text text-transparent">Built by AI.</span><br />
              Live in minutes.
            </h1>
            
            <p className="text-ecomlly-muted text-[18px] max-w-[38ch] max-[900px]:max-w-none mb-11 leading-[1.65]">
              Pick a niche, walk away with a real store — high-converting theme, 10 winning products loaded, ready to sell in minutes.
            </p>

            <ShopifyBadges />
            <BenefitsList />
            <TestimonialCard />
          </div>
        </div>

        {/* ══ RIGHT PANEL ══ */}
        <div className="flex flex-col justify-center items-center px-5 py-9 min-[481px]:px-8 min-[481px]:py-10 min-[901px]:px-14 min-[901px]:py-15 border-l border-ecomlly-line max-[900px]:order-[-1] max-[900px]:border-l-0 max-[900px]:border-b max-[900px]:border-ecomlly-line max-[900px]:bg-ecomlly-bg-2">
          <div className="w-full max-w-[480px]">

            <h2 className="font-sans font-extrabold text-[38px] max-[480px]:text-[28px] tracking-[-0.025em] leading-[1.15] mb-2 text-center text-ecomlly-text">
              Get your <span className="relative inline-block text-ecomlly-v-deep z-10">Free<span className="absolute left-[-5px] right-[-5px] bottom-[3px] h-[0.38em] bg-gradient-to-r from-[#BEEFCE] to-[#86DDAB] rounded-[3px] -rotate-[1.5deg] -z-10" /></span> Shopify Store
            </h2>
            
            {/* Subtitle commented out by the user */}
            {/* <p className="text-base text-ecomlly-muted mb-7 text-center leading-[1.5]">
              {isLogin ? (
                "Log in to manage your high-converting Shopify store and products."
              ) : (
                "Get your free Shopify store in under 5 minutes — customized high-converting theme, 10 winning products loaded, ready to sell."
              )}
            </p> */}

            <form onSubmit={handleSubmit} noValidate className="mt-6">
              {/* Email */}
              <InputField
                label="Email"
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                }
                autoComplete="email"
                required
              />

              {/* Password */}
              <InputField
                label="Password"
                id="password"
                name="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={isLogin ? "Enter your password" : "Create a password"}
                icon={
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                }
                autoComplete="new-password"
                required
              />

              {error && (
                <p className="text-red-600 text-sm text-center mb-4 font-semibold">{error}</p>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className={`w-full flex items-center justify-center gap-2 bg-gradient-to-br from-[#35B577] to-[#248B57] text-white font-sans font-bold text-18px py-3.75 px-6 rounded-xl border-none mt-2 mb-4 tracking-[0.01em] transition-all duration-200 ${
                  loading ? 'opacity-75 cursor-not-allowed' : 'cursor-pointer hover:brightness-105'
                }`}
              >
                {loading ? (isLogin ? 'Logging in...' : 'Signing up...') : (isLogin ? 'Log in' : 'Sign up')}
              </button>
            </form>

            {/* Divider */}
            {/* <div className="flex items-center gap-3 mb-4 text-ecomlly-muted text-base font-sans tracking-[0.1em] uppercase before:content-[''] before:flex-1 before:h-[1px] before:bg-ecomlly-line-s after:content-[''] after:flex-1 after:h-[1px] after:bg-ecomlly-line-s">
              or
            </div> */}

            {/* Google */}
            <button type="button" className="w-full flex items-center justify-center gap-2.5 bg-white border border-ecomlly-line-s rounded-xl text-ecomlly-text font-sans font-semibold text-base py-3.25 px-6 cursor-pointer transition-all duration-200 hover:bg-[#F1F8EF] hover:border-[rgba(31,107,66,0.4)] hover:-translate-y-px mb-7">
              <svg className="w-5 h-5 flex-none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              {isLogin ? 'Log in with Google' : 'Sign up with Google'}
            </button>

            {/* Login/Signup toggle link */}
            <p className="text-center text-base text-ecomlly-muted mb-7">
              {isLogin ? (
                <>Don't have an account? <button type="button" onClick={() => setIsLogin(false)} className="text-ecomlly-v-soft font-semibold transition-colors duration-200 hover:text-ecomlly-v-deep cursor-pointer">Sign up</button></>
              ) : (
                <>Already have an account? <button type="button" onClick={() => setIsLogin(true)} className="text-ecomlly-v-soft font-semibold transition-colors duration-200 hover:text-ecomlly-v-deep cursor-pointer">Log in</button></>
              )}
            </p>

            <TrustFooter />
          </div>
        </div>

      </div>

      <Footer />
    </div>
  )
}

export default LoginSignup
