import React, { useState, useEffect } from 'react'
import { BackgroundDecorations } from '../components/BackgroundDecorations'
import LockedStep from '../components/LockedStep'
import Footer from '../components/Footer'
import Logo from '../components/Logo'
import { useNavigate } from 'react-router-dom'
import SuccessOverlay from '../components/SuccessOverlay'
import StepsProgress from '../components/StepsProgress'

const AddProducts = ({ userData, updateUserData }) => {
  const [niche, setNiche] = useState('fashion')
  const [allProducts, setAllProducts] = useState([])
  const [selectedIds, setSelectedIds] = useState([])
  const [loading, setLoading] = useState(true)
  const [importing, setImporting] = useState(false)
  const [importProgress, setImportProgress] = useState(0)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const activeNiche = userData.niche || localStorage.getItem("selectedNiche") || "fashion"
    setNiche(activeNiche)

    const fetchProducts = async () => {
      const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
      try {
        const response = await fetch(`${apiUrl}/api/niches/GetNiche/${activeNiche}`)
        const nicheData = await response.json()

        if (response.ok && nicheData && Array.isArray(nicheData.products)) {
          const mapped = nicheData.products.map(p => ({
            _id: p._id,
            title: p.name,
            price: `$${p.price}`,
            image: p.imageUrl || p.imageUrls?.[0] || "",
            niche: activeNiche
          }))
          setAllProducts(mapped)
          setSelectedIds(mapped.map(p => p._id))
        } else {
          setError('Failed to load products for this niche.')
        }
      } catch (err) {
        console.error('Failed to load products from database.')
        setError('Network error loading products.')
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [userData.niche])

  const handleCheckboxChange = (id) => {
    setError('')
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(x => x !== id))
    } else {
      setSelectedIds([...selectedIds, id])
    }
  }

  const handleImport = async () => {
    if (selectedIds.length === 0) {
      setError('Please select at least one product to import.')
      return
    }

    setImporting(true)
    setError('')
    setImportProgress(0)

    // Simulate progress animation
    const interval = setInterval(() => {
      setImportProgress(prev => {
        if (prev >= 90) {
          return 90
        }
        return prev + 15
      })
    }, 300)

    const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
    const userEmail = userData.email || localStorage.getItem("userEmail")
    const shop = userData.adminUrl || localStorage.getItem("shopifyAdminUrl")

    try {
      const response = await fetch(`${apiUrl}/api/products/add-top-selling`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: userEmail, shop: shop })
      })

      const data = await response.json()

      if (response.ok) {
        clearInterval(interval)
        setImportProgress(100)
        setTimeout(() => {
          setSuccess(true)
          localStorage.setItem("userProgress", "store-live")
          setTimeout(() => {
            navigate('/store-live')
          }, 1200)
        }, 500)
      } else {
        clearInterval(interval)
        setError(data.error || 'Failed to import products.')
        setImporting(false)
      }
    } catch (err) {
      clearInterval(interval)
      setError('Network error. Failed to connect to backend.')
      setImporting(false)
    }
  }

  // Filter products by the current selected niche
  const filteredProducts = allProducts.filter(p => p.niche === niche)

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

      <div className="relative z-10 w-full max-w-[760px] mx-auto px-5 py-6 min-[481px]:py-8 min-[901px]:py-10 flex-1 flex flex-col items-center justify-center">
        <Logo className="mb-6" />

        {/* Steps Progress Indicator */}
        <StepsProgress activeStep={7} />

        {/* Step 7 Card: Add Products */}
        <div className="relative w-full bg-white border border-ecomlly-line rounded-[24px] p-5 min-[481px]:p-6 min-[901px]:p-8 shadow-sm mb-5">
          
          {success && (
            <SuccessOverlay />
          )}

          {/* Header */}
          <div className="flex items-center gap-3.5 mb-6">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#35B577] to-[#248B57] text-white flex items-center justify-center font-sans font-extrabold text-[14px] flex-none">
              7
            </div>
            <h2 className="font-sans font-extrabold text-[20px] min-[481px]:text-[24px] tracking-wide text-ecomlly-text">
              Add Top Selling Products
            </h2>
          </div>

          <p className="text-ecomlly-muted text-base mb-6 leading-relaxed">
            We’ve picked trending, high-margin products tailored to your selected niche. Review and import them directly to your store inventory.
          </p>

          {/* Products Grid */}
          {filteredProducts.length === 0 ? (
            <div className="w-full rounded-2xl border border-dashed border-gray-300 p-8 text-center mb-6">
              <p className="text-[15px] font-semibold text-ecomlly-muted">
                No products found in the database for this niche. Add some products from the Admin Panel!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 min-[481px]:grid-cols-2 gap-4 mb-6">
              {filteredProducts.map((p) => {
                const isSelected = selectedIds.includes(p._id)
                return (
                  <div 
                    key={p._id}
                    onClick={() => !importing && handleCheckboxChange(p._id)}
                    className={`border-2 rounded-2xl p-3.5 flex items-center gap-3.5 cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'border-ecomlly-v-soft bg-[#FAFDF8] shadow-xs' 
                        : 'border-ecomlly-line bg-white hover:border-ecomlly-line-s'
                    } ${importing ? 'pointer-events-none opacity-80' : ''}`}
                  >
                    <img 
                      src={p.image} 
                      alt={p.title} 
                      className="w-16 h-16 rounded-xl object-cover flex-none bg-gray-50 border border-gray-100"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-sans font-bold text-[14px] min-[481px]:text-[15px] text-ecomlly-text truncate">
                        {p.title}
                      </h3>
                      <div className="text-[13px] font-extrabold text-ecomlly-v-soft mt-0.5">
                        {p.price}
                      </div>
                    </div>
                    {/* Custom Checkbox */}
                    <div className={`w-5 h-5 rounded border flex items-center justify-center flex-none transition-colors ${
                      isSelected ? 'bg-ecomlly-v-soft border-ecomlly-v-soft text-white' : 'border-gray-300 bg-white'
                    }`}>
                      {isSelected && (
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {error && (
            <p className="text-red-600 text-sm text-center mb-4 font-semibold">{error}</p>
          )}

          {/* Import Loader */}
          {importing && (
            <div className="w-full mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-sans font-bold text-ecomlly-v-soft uppercase tracking-wider animate-pulse">
                  Syncing inventory...
                </span>
                <span className="text-[13px] font-sans font-extrabold text-ecomlly-text">
                  {importProgress}%
                </span>
              </div>
              <div className="w-full h-2 bg-ecomlly-line rounded-full overflow-hidden">
                <div 
                  className="h-full bg-linear-to-r from-[#35B577] to-ecomlly-v-soft rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${importProgress}%` }}
                />
              </div>
            </div>
          )}

          {/* Action Button */}
          <button
            type="button"
            onClick={handleImport}
            disabled={importing || success || filteredProducts.length === 0}
            className={`w-full text-white py-3.5 min-[481px]:py-4 px-6 rounded-xl font-sans font-bold text-[16px] min-[481px]:text-[18px] tracking-wide border-none transition-all duration-200 flex items-center justify-center gap-2 ${
              filteredProducts.length === 0
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-br from-[#35B577] to-[#248B57] cursor-pointer hover:brightness-105'
            }`}
          >
            {importing ? `Importing ${selectedIds.length} Products...` : `Import ${selectedIds.length} Products`}
          </button>
        </div>

        {/* Locked Next Step */}
        <LockedStep
          stepNumber={8}
          title="Your Shopify Store is Live"
        />
      </div>

      <Footer className="relative z-10 flex items-center justify-between py-4 px-10 border-t border-ecomlly-line text-base text-ecomlly-muted flex-wrap gap-3" />
    </div>
  )
}

export default AddProducts
