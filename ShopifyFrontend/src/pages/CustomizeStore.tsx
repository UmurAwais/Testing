import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wand2, Layout, ArrowRight } from "lucide-react";
import SuccessModal from '../Component/SuccessModal';

export default function CustomizeStore() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleCustomize = async () => {
        localStorage.setItem("userProgress", "customize");
        const shopifyAdminUrl = localStorage.getItem("shopifyAdminUrl");

        if (!shopifyAdminUrl) {
            alert("Shopify store URL not found. Please connect your store first.");
            navigate("/connect-shopify");
            return;
        }

        setLoading(true); // Start loading

        try {
            const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
            const response = await fetch(`${apiUrl}/api/theme`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    shop: shopifyAdminUrl,
                    email: localStorage.getItem("userEmail")
                })
            });

            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

            const data = await response.json();

            // Show success modal regardless of response
            setShowSuccess(true);
        } catch (err) {
            // Show success modal even on error (still redirect)
            setShowSuccess(true);
            console.error("Error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-12">
            <div className="max-w-4xl mx-auto text-center">
                <a
                    href="/"
                    className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-6 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all mb-8 font-medium"
                >
                    ← Back To Progress
                </a>
                <div className="mb-12">
                    <h1 className="text-4xl font-bold text-slate-900 mb-4">
                        Customize Your Shopify Store
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Now that your store is connected, it's time to choose a theme and
                        customize it to match your brand.
                    </p>
                </div>

                <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-8 border border-slate-200">
                    <div className="w-20 h-20 bg-[#3B985D] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                        <Wand2 className="w-10 h-10 text-white" />
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-4">
                        Ready to Customize?
                    </h2>
                    <p className="text-slate-600 mb-8 leading-relaxed">
                        Select a theme, apply your branding, and make your store stand out.
                    </p>

                    <button
                        onClick={handleCustomize}
                        disabled={loading}
                        className={`w-full bg-gradient-to-r from-[#3B985D] to-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center space-x-2 shadow-lg 
                            ${loading ? "cursor-not-allowed opacity-70" : "hover:from-[#2F7A4B] hover:to-emerald-700 transform hover:scale-105 transition-all duration-200 hover:shadow-xl"}`}
                    >
                        {loading ? (
                            <svg
                                className="animate-spin h-5 w-5 text-white mr-2"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
                                ></path>
                            </svg>
                        ) : (
                            <>
                                <Layout className="w-5 h-5" />
                                <span>Start Customizing</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Professional Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                title="Customize Successfully 🎉"
                message="Redirecting to next step..."
                onRedirect={() => {
                    setShowSuccess(false);
                    navigate("/AddProductsPage");
                }}
                redirectDelay={2000}
            />
        </div>
    );
}
