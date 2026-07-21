import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserData } from '../App';
import { ArrowRight, Check } from 'lucide-react';
import SuccessModal from '../Component/SuccessModal';

interface Props {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

export default function ChooseBanner({ userData, updateUserData }: Props) {
  const navigate = useNavigate();
  const { niche } = useParams<{ niche: string }>();
  const [banners, setBanners] = useState<{ id: string; name: string; image: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  // Fetch banners from backend when niche changes
  useEffect(() => {
    const fetchBanners = async () => {
      if (!niche) {
        setError('No niche selected');
        setLoading(false);
        return;
      }
      try {
        // console.log(`https://ecomlly.vercel.app/api/niches/GetNiche/${niche.toLowerCase()}`)
        setLoading(true);
        setError(null);
        const response = await fetch(`https://ecomlly.vercel.app/api/niches/GetNiche/${niche}`);
        if (!response.ok) {
          throw new Error('Failed to fetch banners');
        }
        const nicheData = await response.json();
        console.log(JSON.stringify(nicheData) + "ssample")
        const fetchedBanners = (nicheData.bannerImages || []).map((image: string, index: number) => ({
          id: `banner-${index + 1}`,
          name: `Banner ${index + 1}`,
          image,
        }));
        setBanners(fetchedBanners);
      } catch (err) {
        console.error('Error fetching banners:', err);
        setError('Failed to load banners. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchBanners();
    // Reset selected banners when niche changes
    updateUserData({ selectedBanners: [], selectedBannerImages: [] });
  }, [niche, updateUserData]);

  const handleBannerToggle = (bannerId: string) => {
    const currentSelection = userData.selectedBanners;
    const selectedBanner = banners.find((banner) => banner.id === bannerId);

    let newSelectedBanners: string[];
    let newSelectedBannerImages: string[];

    if (currentSelection.includes(bannerId)) {
      // Deselect banner and remove its image
      newSelectedBanners = currentSelection.filter((id) => id !== bannerId);
      newSelectedBannerImages = (userData.selectedBannerImages || []).filter(
        (image) => image !== selectedBanner?.image
      );
    } else if (currentSelection.length < 2 && selectedBanner) {
      // Select banner and add its image
      newSelectedBanners = [...currentSelection, bannerId];
      newSelectedBannerImages = [...(userData.selectedBannerImages || []), selectedBanner.image];
    } else {
      return; // No change made
    }

    // Update user data
    updateUserData({
      selectedBanners: newSelectedBanners,
      selectedBannerImages: newSelectedBannerImages,
    });

    // Save to localStorage immediately
    localStorage.setItem("selectedBanners", JSON.stringify(newSelectedBanners));
    localStorage.setItem("selectedBannerImages", JSON.stringify(newSelectedBannerImages));

    console.log("🔍 DEBUG: Saved banners to localStorage:", newSelectedBanners);
    console.log("🔍 DEBUG: Saved banner images to localStorage:", newSelectedBannerImages);
  };

  // Save progress on mount and restore banners from localStorage
  useEffect(() => {
    if (userData.isAuthenticated) {
      localStorage.setItem('userProgress', 'ChooseBanner');

      // Restore selected banners from localStorage if available
      const savedBanners = localStorage.getItem("selectedBanners");
      const savedBannerImages = localStorage.getItem("selectedBannerImages");

      if (savedBanners && savedBannerImages) {
        try {
          const parsedBanners = JSON.parse(savedBanners);
          const parsedBannerImages = JSON.parse(savedBannerImages);

          if (parsedBanners.length > 0 && parsedBannerImages.length > 0) {
            updateUserData({
              selectedBanners: parsedBanners,
              selectedBannerImages: parsedBannerImages,
            });
            console.log("🔍 DEBUG: Restored banners from localStorage:", parsedBanners);
          }
        } catch (error) {
          console.error("Error parsing saved banners:", error);
        }
      }
    }
  }, [userData.isAuthenticated, updateUserData]);

  const handleContinue = () => {
    if (userData.selectedBanners.length === 2) {
      // Save selected niche and banners
      updateUserData({ niche });

      // Build Shopify connect URL
      const connectUrl = `/connect-shopify?niche=${niche}&banners=${userData.selectedBanners.join(',')}&images=${encodeURIComponent(
        (userData.selectedBannerImages || []).join(',')
      )}`;

      // Save URL and step progress
      localStorage.setItem('connectShopifyUrl', connectUrl);
      localStorage.setItem('userProgress', 'connect-shopify');

      // Show success modal
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-8 border border-slate-200">
          <div className="bg-gradient-to-r from-[#3B985D] to-emerald-500 h-2 rounded-full w-2/5 transition-all duration-500"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <a
            href="/"
            className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-6 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all mb-6 font-medium"
          >
            ← Back To Progress
          </a>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 mt-6">Choose Your Banners</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto mb-4">
            Select exactly 2 banner templates for your <span className="font-semibold text-[#3B985D]">{niche}</span> store.
          </p>
          <div className="inline-flex items-center space-x-2 bg-[#3B985D]/10 text-[#3B985D] px-4 py-2 rounded-full text-sm font-medium border border-[#3B985D]/20">
            <span>{userData.selectedBanners.length} of 2 selected</span>
            {userData.selectedBanners.length === 2 && <Check className="w-4 h-4" />}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3B985D] mx-auto"></div>
            <p className="text-slate-600 mt-4">Loading banners...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-12">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        )}

        {/* Banners Grid */}
        {!loading && !error && banners.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {banners.map((banner) => {
              const isSelected = userData.selectedBanners.includes(banner.id);
              const canSelect = userData.selectedBanners.length < 2 || isSelected;

              return (
                <div
                  key={banner.id}
                  onClick={() => canSelect && handleBannerToggle(banner.id)}
                  className={`
                    relative group cursor-pointer transition-all duration-300 rounded-2xl overflow-hidden border-2
                    ${canSelect ? 'hover:scale-105' : 'opacity-50 cursor-not-allowed'}
                    ${isSelected ? 'ring-4 ring-[#3B985D]/20 shadow-lg border-[#3B985D]' : 'shadow-sm hover:shadow-md border-slate-200'}
                  `}
                >
                  {/* Banner Image */}
                  <div className="aspect-video bg-slate-100 relative overflow-hidden">
                    <img
                      src={banner.image}
                      alt={banner.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      onError={(e) => {
                        console.error(`Failed to load banner image: ${banner.image}`);
                        e.currentTarget.src = 'https://via.placeholder.com/600x400?text=Image+Failed';
                      }}
                    />
                    <div
                      className={`
                      absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300
                      ${isSelected ? 'bg-opacity-20' : ''}
                    `}
                    ></div>
                    {isSelected && (
                      <div className="absolute top-4 right-4 w-8 h-8 bg-[#3B985D] rounded-full flex items-center justify-center animate-pulse shadow-lg">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>

                  {/* Banner Info */}
                  <div className="p-4 bg-white">
                    <h3 className="font-semibold text-slate-900 text-center">{banner.name}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading &&
          !error && (
            <p className="text-center text-slate-500 text-lg">
              No banners available for this niche yet.
            </p>
          )
        )}

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={userData.selectedBanners.length !== 2}
            className={`
              flex items-center space-x-2 px-8 py-4 rounded-full font-semibold transition-all duration-200
              ${userData.selectedBanners.length === 2
                ? 'bg-gradient-to-r from-[#3B985D] to-emerald-600 text-white hover:from-[#2F7A4B] hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <span>Continue to Shopify</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Professional Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Banners Selected Successfully 🎉"
        message="Redirecting to Shopify setup..."
        onRedirect={() => {
          setShowSuccess(false);
          navigate('/AccessShopify');
        }}
        redirectDelay={2000}
      />
    </div>
  );
}