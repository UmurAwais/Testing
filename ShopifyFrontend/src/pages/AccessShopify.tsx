import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ShoppingBag } from "lucide-react";
import SuccessModal from '../Component/SuccessModal';
// import shopifyImage from "../assets/shopify-connect.png"; // <-- save your uploaded image in /src/assets

export default function AccessShopify() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    localStorage.setItem("userProgress", "accessShopify");
  }, [])


  const handleAccessShopify = () => {
    window.open("https://shopify.pxf.io/c/3474818/1295401/13624", "_blank");
    // Show success modal before navigating
    setShowSuccess(true);
  };
  const handleback = () => {

    localStorage.setItem("userProgress", "accessShopify");

    navigate("/ ");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-200">
        {/* Shopify Icon */}
        <div className="w-20 h-20 bg-[#3B985D] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
          <ShoppingBag className="w-10 h-10 text-white" />
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Shopify</h1>
        <p className="text-slate-600 mb-8">
          Follow these steps to connect your Shopify store:
        </p>

        {/* Steps */}
        <ol className="text-left space-y-3 text-slate-700 mb-8">
          <li>
            <strong>1)</strong> Click{" "}
            <span className="font-medium text-[#3B985D]">"Access Shopify"</span> at the bottom of this page. A new tab will open with the Shopify signup screen (see example below).
          </li>
          <img
            src={"./access.jpg"}
            alt="Shopify Signup Example"
            className="rounded-xl shadow-md mb-8 border border-slate-200"
          />

          <li>
            <strong>2)</strong> Enter your email address in the field provided.
          </li>
          <li>
            <strong>3)</strong> Complete the Shopify sign-up process.
          </li>
          <li>
            <strong>4)</strong> Once done, return to this tab and click{" "}
            <span className="font-medium text-[#3B985D]">"Done"</span> to continue building your professional Shopify store with us.
          </li>
        </ol>

        {/* Buttons */}
        <button
          onClick={handleAccessShopify}
          className="w-full bg-gradient-to-r from-[#3B985D] to-emerald-600 text-white py-3 rounded-lg font-semibold hover:from-[#2F7A4B] hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 mb-4"
        >
          <ExternalLink className="w-5 h-5" />
          <span>Access Shopify</span>
        </button>
        <a
          onClick={handleback}
          className="w-full bg-white text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 border border-slate-200 transform hover:scale-105 transition-all duration-200 shadow-sm flex items-center justify-center space-x-2 cursor-pointer"
        >
          ← Back To Progress
        </a>
      </div>

      {/* Professional Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Shopify Account Opened 🎉"
        message="Please complete your Shopify signup, then return here..."
        onRedirect={() => {
          setShowSuccess(false);
          navigate("/connect-shopify");
        }}
        redirectDelay={3000}
      />
    </div>
  );
}
