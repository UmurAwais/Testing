import { useEffect, useState } from "react";
import { ExternalLink, CheckCircle2, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SuccessModal from '../Component/SuccessModal';
// Reusable navigate function


export default function ShopifyLive() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  function navigateTo(url: string, newTab = true) {
    console.log("navigateTo called with URL:", url); // Debug log

    // Validate URL before opening
    if (!url || url === 'https:' || !url.startsWith('http')) {
      console.error("Invalid URL provided:", url);
      alert("Invalid store URL. Please reconnect your Shopify store.");
      return;
    }

    if (newTab) {
      window.open(url, "_blank", "noopener,noreferrer");
      navigate("/grow");
    } else {
      window.location.href = url;
    }
  }

  // Function to get the user's store URL
  const getUserStoreUrl = () => {
    const shopifyAdminUrl = localStorage.getItem("shopifyAdminUrl");
    console.log("🔍 DEBUG: Stored shopifyAdminUrl:", shopifyAdminUrl);
    console.log("🔍 DEBUG: Type of shopifyAdminUrl:", typeof shopifyAdminUrl);
    console.log("🔍 DEBUG: Length of shopifyAdminUrl:", shopifyAdminUrl?.length);

    if (!shopifyAdminUrl) {
      console.log("❌ No shopifyAdminUrl found, using fallback");
      return "https://www.shopify.com/login"; // fallback
    }

    let cleanUrl = shopifyAdminUrl.trim();
    console.log("🔍 DEBUG: Cleaned URL:", cleanUrl);

    // Handle Shopify admin URL format: https://admin.shopify.com/store/storename
    if (cleanUrl.includes('admin.shopify.com/store/')) {
      console.log("✅ Detected admin.shopify.com/store/ format");
      const storeNameMatch = cleanUrl.match(/admin\.shopify\.com\/store\/([^\/\?]+)/);
      console.log("🔍 DEBUG: Store name match result:", storeNameMatch);

      if (storeNameMatch && storeNameMatch[1]) {
        const storeName = storeNameMatch[1];
        const finalUrl = `https://${storeName}.myshopify.com/`;
        console.log("✅ Extracted store name:", storeName);
        console.log("✅ Final store URL:", finalUrl);
        return finalUrl;
      } else {
        console.log("❌ Failed to extract store name from admin URL");
      }
    }

    // Handle direct store URL format: https://storename.myshopify.com/admin
    if (cleanUrl.includes('.myshopify.com')) {
      console.log("✅ Detected .myshopify.com format");
      // If it doesn't start with http, add https://
      if (!cleanUrl.startsWith('http')) {
        cleanUrl = 'https://' + cleanUrl;
        console.log("🔍 DEBUG: Added https://, new URL:", cleanUrl);
      }

      // Remove trailing slash and any admin paths
      cleanUrl = cleanUrl.replace(/\/admin.*$/, '');
      cleanUrl = cleanUrl.replace(/\/$/, '');
      console.log("🔍 DEBUG: After removing admin paths:", cleanUrl);

      // Add trailing slash for the final URL
      const finalUrl = cleanUrl + '/';
      console.log("✅ Final store URL:", finalUrl);
      return finalUrl;
    }

    console.log("❌ Invalid store URL format, using fallback");
    console.log("🔍 DEBUG: URL doesn't match any expected patterns");
    return "https://www.shopify.com/login";
  };

  useEffect(() => {
    localStorage.setItem("userProgress", "live");
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-200">
        <a
          href="/"
          className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-6 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all mb-6 font-medium"
        >
          ← Back To Progress
        </a>
        {/* Success Icon */}
        <div className="flex justify-center items-center mb-4 mt-6">
          <CheckCircle2 className="w-8 h-8 text-[#3B985D] mr-2" />
          <Trophy className="w-8 h-8 text-yellow-500" />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-slate-900 mb-4">
          🎉 Your Shopify Store Is Live!
        </h1>

        {/* Steps */}
        <ol className="text-left text-slate-700 space-y-3 mb-6">
          <li>
            <strong>1)</strong> All set! Access your store using the button
            below.
          </li>
          <li>
            <strong>2)</strong> Return to this tab and get access to the{" "}
            <span className="font-medium text-[#3B985D]">
              free Shopify Dropshipping Course 2025
            </span>{" "}
            and learn how to grow your business!
          </li>
        </ol>

        {/* Password Info Box */}
        <div className="bg-[#3B985D]/10 border border-[#3B985D]/20 rounded-lg p-4 mb-8 text-left">
          <p className="text-slate-800 font-semibold mb-1">
            Want to remove the password from your store so everyone can see it?
          </p>
          <p className="text-slate-600 text-sm">
            Go to{" "}
            <span className="font-medium">
              Shopify Admin &gt; Settings &gt; Preferences &gt;{" "}
            </span>
            <a
              href="https://help.shopify.com/manual/online-store/preferences/password-protection"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#3B985D] underline"
            >
              Store Password
            </a>
          </p>
        </div>

        {/* Debug Button - Temporary */}


        {/* Access Store Button */}
        <button
          onClick={() => {
            setShowSuccess(true);
          }}
          className="w-full bg-gradient-to-r from-[#3B985D] to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-[#2F7A4B] hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
        >
          <span>Access my store</span>
          <ExternalLink className="w-5 h-5" />
        </button>
      </div>

      {/* Professional Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Store Access Opened 🎉"
        message="Opening your Shopify store in a new tab..."
        onRedirect={() => {
          setShowSuccess(false);
          navigateTo(getUserStoreUrl());
        }}
        redirectDelay={2000}
      />
    </div>
  );
}
