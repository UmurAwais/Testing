import React, { useEffect } from "react";
import { ExternalLink, CheckCircle2, Trophy, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SuccessModal from '../Component/SuccessModal';

export default function ShopifyLive() {
  const [showSuccess, setShowSuccess] = React.useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.setItem("userProgress", "grow");
  }, []);

  const handleAccessStore = () => {
    window.open("https://www.shopify.com/login", "_blank");
    setShowSuccess(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-lg overflow-hidden border border-slate-200">

        {/* Header Section */}
        <div className="px-8 py-8">
          <a
            href="/"
            className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-6 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all mb-6 font-medium"
          >
            ← Back To Progress
          </a>
          {/* Success Icons */}
          <div className="flex justify-center items-center mb-6 mt-6">
            <div className="w-12 h-12 bg-[#3B985D]/10 rounded-full flex items-center justify-center mr-3 border border-[#3B985D]/20">
              <CheckCircle2 className="w-6 h-6 text-[#3B985D]" />
            </div>
            <Sparkles className="w-8 h-8 text-yellow-500" />
          </div>

          {/* Main Title */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center bg-[#3B985D]/10 text-[#3B985D] px-4 py-2 rounded-full text-sm font-medium mb-4 border border-[#3B985D]/20">
              <Trophy className="w-4 h-4 mr-2" />
              Store Successfully Created!
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-3">
              🎉 Your Store is Ready to Grow!
            </h1>
            <p className="text-lg text-slate-600 leading-relaxed max-w-3xl mx-auto">
              Congratulations! Your Shopify store has been successfully set up.<br />
              Now it's time to manage your products, customize your theme, and start reaching customers.
            </p>
          </div>

          {/* Shopify Store Preview */}
          <div className="bg-gradient-to-br from-[#3B985D] to-emerald-700 rounded-2xl p-8 mb-8 text-white relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute top-4 right-4 opacity-20">
              <div className="w-32 h-32 bg-white/10 rounded-full"></div>
            </div>
            <div className="absolute bottom-4 left-4 opacity-10">
              <div className="w-24 h-24 bg-white/10 rounded-full"></div>
            </div>

            <div className="relative z-10 text-center">
              <img src="/image.png" alt="Shopify Store Preview" className="mx-auto rounded-lg shadow-2xl max-w-full h-auto" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <button
              onClick={handleAccessStore}
              className="w-full bg-gradient-to-r from-[#3B985D] to-emerald-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-[#2F7A4B] hover:to-emerald-700 transform hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-3"
            >
              <span>Access My Shopify Store</span>
              <ExternalLink className="w-5 h-5" />
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 p-4 bg-[#3B985D]/10 rounded-xl border border-[#3B985D]/20">
            <p className="text-sm text-[#3B985D] text-center font-medium">
              💡 Pro tip: Log into your Shopify admin to start adding products and collections!
            </p>
          </div>
        </div>
      </div>

      {/* Professional Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Success! 🎉"
        message="Your store is ready. Redirecting you to the dashboard..."
        onRedirect={() => {
          setShowSuccess(false);
          navigate("/");
        }}
        redirectDelay={2000}
      />
    </div>
  );
}