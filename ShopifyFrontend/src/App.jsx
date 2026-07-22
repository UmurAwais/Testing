import React, { useState, useEffect, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginSignup from './pages/LoginSignup'
import PickNiche from './pages/PickNiche'
import ChooseBanners from './pages/ChooseBanners'
import ClaimStore from './pages/ClaimStore'
import GrabDiscount from './pages/GrabDiscount'
import InstallApp from './pages/InstallApp'
import MakeUnique from './pages/MakeUnique'
import AddProducts from './pages/AddProducts'
import StoreLive from './pages/StoreLive'
import GrowStore from './pages/GrowStore'
import PrivacyPolicy from './pages/PrivacyPolicy'
import TermsOfService from './pages/TermsOfService'

const defaultUserData = {
  isAuthenticated: false,
  niche: '',
  selectedBanners: [],
  selectedBannerImages: [],
  shopifyConnected: false,
  email: '',
  adminUrl: ''
}

const App = () => {
  const [userData, setUserData] = useState(defaultUserData)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser)
        setUserData({
          isAuthenticated: parsedUser.isAuthenticated ?? false,
          niche: parsedUser.niche ?? '',
          selectedBanners: parsedUser.selectedBanners ?? [],
          selectedBannerImages: parsedUser.selectedBannerImages ?? [],
          shopifyConnected: parsedUser.shopifyConnected ?? false,
          email: parsedUser.email ?? localStorage.getItem('userEmail') ?? '',
          adminUrl: parsedUser.adminUrl ?? localStorage.getItem('shopifyAdminUrl') ?? ''
        })
      }
    } catch (e) {
      console.error('Failed to load user data:', e)
    } finally {
      setLoading(false)
    }
  }, [])

  const updateUserData = useCallback((updates) => {
    setUserData((prev) => {
      const updated = { ...prev, ...updates }
      try {
        localStorage.setItem('user', JSON.stringify(updated))
        if (updated.email) localStorage.setItem('userEmail', updated.email)
        if (updated.adminUrl) localStorage.setItem('shopifyAdminUrl', updated.adminUrl)
      } catch (e) {
        console.error('Failed to save user data:', e)
      }
      return updated
    })
  }, [])

  const requireAuth = (element) => {
    if (loading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#FAFDF8]">
          <div className="w-8 h-8 rounded-full border-4 border-ecomlly-line-s border-t-ecomlly-v-soft animate-spin" />
        </div>
      )
    }
    return userData.isAuthenticated ? element : <Navigate to="/login" replace />
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/TermsOfService" element={<TermsOfService />} />
        <Route 
          path="/login" 
          element={
            userData.isAuthenticated ? (
              <Navigate to="/pick-a-niche" replace />
            ) : (
              <LoginSignup userData={userData} updateUserData={updateUserData} />
            )
          } 
        />

        {/* Protected Wizard Routes */}
        <Route path="/pick-a-niche" element={requireAuth(<PickNiche userData={userData} updateUserData={updateUserData} />)} />
        <Route path="/choose-banners" element={requireAuth(<ChooseBanners userData={userData} updateUserData={updateUserData} />)} />
        <Route path="/claim-store" element={requireAuth(<ClaimStore userData={userData} updateUserData={updateUserData} />)} />
        <Route path="/grab-discount" element={requireAuth(<GrabDiscount userData={userData} updateUserData={updateUserData} />)} />
        <Route path="/install-app" element={requireAuth(<InstallApp userData={userData} updateUserData={updateUserData} />)} />
        <Route path="/make-unique" element={requireAuth(<MakeUnique userData={userData} updateUserData={updateUserData} />)} />
        <Route path="/add-products" element={requireAuth(<AddProducts userData={userData} updateUserData={updateUserData} />)} />
        <Route path="/store-live" element={requireAuth(<StoreLive userData={userData} updateUserData={updateUserData} />)} />
        <Route path="/grow-store" element={requireAuth(<GrowStore userData={userData} updateUserData={updateUserData} />)} />

        {/* Catch-all */}
        <Route 
          path="*" 
          element={
            <Navigate 
              to={userData.isAuthenticated ? "/pick-a-niche" : "/login"} 
              replace 
            />
          } 
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App

