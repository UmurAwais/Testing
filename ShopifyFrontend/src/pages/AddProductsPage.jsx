import React, { useEffect, useState } from "react";
import { CheckCircle, Loader, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";
import SuccessModal from '../Component/SuccessModal';

export default function AddProductsPage() {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [error, setError] = useState(null);
    const [productsAdded, setProductsAdded] = useState(false);
    const [productCount, setProductCount] = useState(0);

    useEffect(() => {
        localStorage.setItem("userProgress", "AddProductsPage");
    }, [])

    const handleAddProducts = async () => {
        const email = localStorage.getItem("userEmail");
        const shopUrl = localStorage.getItem("shopifyAdminUrl");

        console.log("🔍 Debug - localStorage values:");
        console.log("   Email:", email);
        console.log("   Shop URL:", shopUrl);

        if (!email || !shopUrl) {
            setError("Missing user information. Please complete the setup first.");
            return;
        }


        // Extract shop domain from various URL formats
        let shop = shopUrl;

        // Remove protocol (http://, https://)
        shop = shop.replace(/^https?:\/\//, '');

        // Remove trailing slash
        shop = shop.replace(/\/$/, '');

        // Handle admin.shopify.com/store/STORENAME format
        if (shop.includes('admin.shopify.com/store/')) {
            const match = shop.match(/admin\.shopify\.com\/store\/([^\/]+)/);
            if (match && match[1]) {
                shop = `${match[1]}.myshopify.com`;
                console.log("   🔄 Extracted store name from admin URL:", shop);
            }
        }
        // If it already has myshopify.com, extract just the domain
        else if (shop.includes('myshopify.com')) {
            // Remove any paths after the domain
            if (shop.includes('/')) {
                shop = shop.split('/')[0];
            }
        }
        // If it's just admin.shopify.com without /store/, it's invalid
        else if (shop.includes('admin.shopify.com')) {
            console.error("   ❌ Invalid shop URL - missing store name");
            setError("Invalid shop URL. Please complete the setup again.");
            setIsAdding(false);
            return;
        }

        console.log("   Normalized shop:", shop);

        setIsAdding(true);
        setError(null);

        try {
            console.log("📦 Calling API to add products...");
            console.log("   Endpoint: /api/products/add-top-selling");
            console.log("   Email:", email);
            console.log("   Shop:", shop);

            const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
            const response = await fetch(`${apiUrl}/api/products/add-top-selling`, {
                // const response = await fetch("http://localhost:3000/api/products/add-top-selling", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email,
                    shop
                })
            });

            console.log("   Response status:", response.status);

            if (!response.ok) {
                const errorData = await response.json();
                console.error("   Error response:", errorData);
                if (errorData.error && errorData.error.includes("Store not connected")) {
                    throw new Error("⚠️ Please complete the 'Install App' step first before adding products.");
                }

                throw new Error(errorData.error || `Failed to add products: ${response.status}`);
            }

            const data = await response.json();
            console.log("✅ Products added successfully:", data);

            setProductCount(data.productsCount || 0);
            setProductsAdded(true);
            setShowSuccess(true);
        } catch (err) {
            console.error("❌ Error adding products:", err);
            setError(err.message || "Failed to add products. Please try again.");
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="flex justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
            <div className="bg-white rounded-2xl shadow-lg max-w-3xl w-full p-8">
                {/* Header */}
                <div className="flex items-start gap-3 mb-6">
                    <Package className="text-green-500 w-8 h-8 mt-1" />
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">Add Authorized Niche Products</h2>
                        <p className="text-gray-600 mt-1">Add 15 pre-selected, authorized products to your store</p>
                    </div>
                </div>

                {/* Status Message */}
                {productsAdded && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                            <CheckCircle className="text-green-600 w-5 h-5" />
                            <p className="text-green-800 font-medium">
                                ✅ {productCount} products added successfully!
                            </p>
                        </div>
                    </div>
                )}

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-red-800 mb-3">{error}</p>
                        {error.includes("Install App") && (
                            <button
                                onClick={() => navigate("/InstallAppCard")}
                                className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                Go to Install App
                            </button>
                        )}
                    </div>
                )}

                {/* Steps */}
                <ol className="list-decimal ml-10 mt-4 space-y-6 text-gray-700">
                    <li>
                        <strong>Click "Add Products"</strong> to add 15 pre-verified products to your store.
                    </li>

                    <li>
                        These items are sourced through authorized channels like <strong>Printify</strong> and can be managed in our Shopify admin.
                        <div className="grid grid-cols-2 gap-4 mt-3">
                            <img
                                src="/pnt1.png"
                                alt="Step 3a"
                                className="rounded-lg border shadow-sm"
                            />
                            <img
                                src="/pnt2.png"
                                alt="Step 3b"
                                className="rounded-lg border shadow-sm"
                            />
                        </div>
                    </li>

                    <li>
                        Click <span className="font-semibold">" Add Printify Products "</span> to move forward.
                    </li>
                </ol>

                {/* Buttons */}
                <div className="mt-8 flex flex-col gap-4">
                    {!productsAdded ? (
                        <button
                            className="w-full text-white bg-green-600 py-4 rounded-xl font-bold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed text-lg shadow-lg shadow-green-200"
                            onClick={handleAddProducts}
                            disabled={isAdding}
                        >
                            {isAdding ? (
                                <>
                                    <Loader className="w-6 h-6 animate-spin" />
                                    <span>Uploading to Store...</span>
                                </>
                            ) : (
                                <>
                                    <Package className="w-6 h-6" />
                                    <span>Add Printify Products</span>
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            className="w-full text-white bg-emerald-600 py-4 rounded-xl font-bold hover:bg-emerald-700 transition flex items-center justify-center gap-2 text-lg shadow-lg shadow-emerald-200"
                            onClick={() => setShowSuccess(true)}
                        >
                            <CheckCircle className="w-6 h-6" />
                            <span>Continue to Dashboard</span>
                        </button>
                    )}

                    {/* <p className="text-center text-sm text-gray-500 mt-2">
                        Don't have an account? <a href="https://printify.com/signup/" target="_blank" rel="noopener noreferrer" className="text-green-600 font-semibold hover:underline">Register to Printify</a>
                    </p> */}
                </div>

                {/* Info Box */}
                {/* <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                    <p className="text-sm text-blue-800">
                        <strong>💡 Tip:</strong> This process takes about 10-15 seconds. Products will be created in parallel for faster setup!
                    </p>
                </div> */}
            </div>

            {/* Professional Success Modal */}
            <SuccessModal
                isOpen={showSuccess}
                title={`${productCount} Products Added Successfully 🎉`}
                message="Redirecting to next step..."
                onRedirect={() => {
                    setShowSuccess(false);
                    navigate("/live");
                }}
                redirectDelay={2000}
            />
        </div>
    );
}
