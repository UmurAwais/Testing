import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ExternalLink, ShoppingBag } from "lucide-react";
import SuccessModal from '../Component/SuccessModal';

export default function AccessShopify() {
    const navigate = useNavigate();
    const [adminurl, setAdminURL] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);


    // ✅ Save current step on mount
    useEffect(() => {
        const shopifyAdminUrl = localStorage.getItem("shopifyAdminUrl");
        setAdminURL(shopifyAdminUrl)
        localStorage.setItem("userProgress", "subscribe");
    }, []);

    const handleAccessShopify = async () => {

        localStorage.setItem("userProgress", "subscribe");
        window.open(
            `${adminurl}/subscription/pick_period/basic/monthly?online=true&selected=true`,
            "_blank"
        );
        // Show professional success modal
        setShowSuccess(true);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center px-4 py-8">
            <div className="max-w-2xl w-full bg-white rounded-2xl shadow-lg p-8 text-center border border-slate-200">
                {/* Shopify Icon */}
                <div className="w-20 h-20 bg-[#3B985D] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
                    <ShoppingBag className="w-10 h-10 text-white" />
                </div>

                <h1 className="text-3xl font-bold text-slate-900 mb-4">Access Shopify Plans</h1>
                <p className="text-slate-600 mb-8">
                    Follow these steps to connect your Shopify store:
                </p>

                {/* Steps */}
                <ol className="text-left space-y-3 text-slate-700 mb-8">
                    <li>
                        <strong>1)</strong> Click The{" "}
                        <span className="font-medium text-[#3B985D]">Access Shopify Plans</span> button at the bottom of this page.
                    </li>
                    <img
                        src={"./imag.png"}
                        alt="Shopify Signup Example"
                        className="rounded-xl shadow-md mb-8 border border-slate-200"
                    />
                    <li>
                        <strong>2)</strong> Select the BASIC Monthly Plan (the most affordable option – you can change it anytime).
                    </li>
                    <li>
                        <strong>3)</strong> Enter your business address.
                    </li>
                    <li>
                        <strong>4)</strong> Choose Credit Card as your payment method. Fill in your credit card details.
                    </li>
                    <li>
                        <strong>5)</strong> Finally, click "Subscribe" on the right side of the screen (see image above).
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
                    href="/"
                    className="w-full bg-white text-slate-700 py-3 rounded-lg font-medium hover:bg-slate-50 border border-slate-200 transform hover:scale-105 transition-all duration-200 shadow-sm flex items-center justify-center space-x-2"
                >
                    ← Back To Progress
                </a>
            </div>

            {/* Professional Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                title="Subscribe Successfully 🎉"
                message="Redirecting to next page..."
                onRedirect={() => {
                    setShowSuccess(false);
                    navigate("/");
                }}
                redirectDelay={2000}
            />
        </div>
    );
}
