import { useEffect, useState } from "react";
import { CheckCircle, Loader, Download, Sparkles } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import SuccessModal from '../Component/SuccessModal';

export default function InstallAppCard() {
  const navigate = useNavigate();
  const [isInstalling, setIsInstalling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    localStorage.setItem("userProgress", "InstallAppCard");
  }, []);

  const handleInstall = async () => {
    const shopifyAdminUrl = localStorage.getItem("shopifyAdminUrl");
    const email = localStorage.getItem("userEmail") || '';
    const niche = localStorage.getItem("selectedNiche") || '';

    // Get banners from URL params first, then fallback to localStorage
    let selectedBanners = searchParams.get('banners')?.split(',') || [];
    let selectedBannerImages = searchParams.get('images')?.split(',').map(decodeURIComponent) || [];

    // If no banners from URL params, try to get from localStorage
    if (selectedBanners.length === 0) {
      const savedBanners = localStorage.getItem("selectedBanners");
      const savedBannerImages = localStorage.getItem("selectedBannerImages");
      if (savedBanners) {
        selectedBanners = JSON.parse(savedBanners);
      }
      if (savedBannerImages) {
        selectedBannerImages = JSON.parse(savedBannerImages);
      }
    }

    // Save banners to localStorage for future use
    if (selectedBanners.length > 0) {
      localStorage.setItem("selectedBanners", JSON.stringify(selectedBanners));
    }
    if (selectedBannerImages.length > 0) {
      localStorage.setItem("selectedBannerImages", JSON.stringify(selectedBannerImages));
    }

    console.log("🔍 DEBUG: Selected banners:", selectedBanners);
    console.log("🔍 DEBUG: Selected banner images:", selectedBannerImages);

    if (!shopifyAdminUrl) {
      setError("No Shopify admin URL found. Please connect your store first.");
      return;
    }

    setIsInstalling(true);
    setError(null);

    try {
      const response = await fetch("https://ecomlly.vercel.app/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          shop: shopifyAdminUrl.trim().replace(/\/$/, ''),
          niche,
          email,
          selectedBanners,
          selectedBannerImages,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      console.log(data);

      if (data && data.authUrl) {
        // Show success modal before redirecting
        setShowSuccess(true);
        // Redirect to Shopify auth URL after a short delay
        setTimeout(() => {
          window.location.href = data.authUrl;
        }, 2000);
      } else {
        throw new Error("No auth URL returned");
      }
    } catch (err) {
      console.error("❌ Error installing Shopify app:", err);
      setError("Error installing the app. Please try again.");
      setIsInstalling(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
        {/* Header */}
        <div className="text-center mb-6">
          <a
            href="/"
            className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-6 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all mb-6 font-medium"
          >
            ← Back To Progress
          </a>
          {/* Success Icons */}
          <div className="flex justify-center items-center mb-4 mt-6">
            <div className="w-12 h-12 bg-[#3B985D]/10 rounded-full flex items-center justify-center mr-3 border border-[#3B985D]/20">
              <CheckCircle className="w-6 h-6 text-[#3B985D]" />
            </div>
            <Download className="w-8 h-8 text-[#3B985D]" />
            <Sparkles className="w-6 h-6 text-yellow-500 ml-2" />
          </div>

          <h2 className="text-3xl font-bold text-slate-900 mb-2">Install Build Your Store App</h2>
          <p className="text-slate-600">Complete the final step to activate your store</p>
        </div>

        {/* Steps */}
        <ol className="list-decimal ml-10 mt-4 space-y-2 text-slate-700 font-medium">
          <li>
            Click <span className="font-semibold text-[#3B985D]">"Install app"</span> below.
          </li>
          <li>
            Click <span className="font-semibold text-[#3B985D]">"Install"</span> on the Shopify page.
          </li>
        </ol>

        {/* Screenshot */}
        <div className="mt-6 border border-slate-200 rounded-xl overflow-hidden shadow-md">
          <img
            src="/install.png"
            alt="Install App Screenshot"
            className="w-full"
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-4 text-red-600 text-sm font-medium">{error}</div>
        )}

        {/* Button */}
        <div className="mt-6">
          <button
            onClick={handleInstall}
            disabled={isInstalling}
            className={`w-full py-3 rounded-xl font-semibold transition flex items-center justify-center space-x-2 shadow-lg ${isInstalling
              ? "bg-slate-400 text-white cursor-not-allowed"
              : "bg-gradient-to-r from-[#3B985D] to-emerald-600 text-white hover:from-[#2F7A4B] hover:to-emerald-700 hover:shadow-xl"
              }`}
          >
            {isInstalling ? (
              <>
                <Loader className="w-5 h-5 animate-spin" />
                <span>Installing...</span>
              </>
            ) : (
              <span>Install App</span>
            )}
          </button>
        </div>
      </div>

      {/* Professional Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Installed Successfully 🎉"
        message="Redirecting to Shopify..."
        onRedirect={() => {
          setShowSuccess(false);
        }}
        redirectDelay={2000}
      />
    </div>
  );
}