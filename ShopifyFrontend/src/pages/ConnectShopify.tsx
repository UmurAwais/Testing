import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserData } from '../App';
import { ShoppingBag } from 'lucide-react';
import SuccessModal from '../Component/SuccessModal';

interface Props {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

export default function ConnectShopify({ userData, updateUserData }: Props) {
  const [adminUrl, setAdminUrl] = useState('');
  const [storeHandle, setStoreHandle] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [showManual, setShowManual] = useState(false);
  const [isAutoDetected, setIsAutoDetected] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Detect store after redirect from Shopify OAuth
  const detectStore = useCallback(() => {
    const shopParam = searchParams.get('shop');
    if (shopParam) {
      const formattedShop = shopParam.includes('myshopify.com')
        ? shopParam
        : `${shopParam}.myshopify.com`;

      // Handshake: If we are in a popup, notify the parent and close
      if (window.opener && window.opener !== window) {
        window.opener.postMessage(
          { type: 'SHOPIFY_AUTH_SUCCESS', shop: formattedShop },
          window.location.origin
        );
        window.close();
        return;
      }

      setAdminUrl(formattedShop);
      setIsAutoDetected(true);

      localStorage.setItem('connectedShop', formattedShop);
      localStorage.setItem('shopifyAdminUrl', formattedShop);
      updateUserData({ adminUrl: formattedShop, shopifyConnected: true });
    }
  }, [searchParams, updateUserData]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Security: Only trust our own domain
      if (event.origin !== window.location.origin) return;

      if (event.data.type === 'SHOPIFY_AUTH_SUCCESS') {
        const shop = event.data.shop;
        setAdminUrl(shop);
        setIsAutoDetected(true);

        localStorage.setItem('connectedShop', shop);
        localStorage.setItem('shopifyAdminUrl', shop);
        updateUserData({ adminUrl: shop, shopifyConnected: true });
        setShowSuccess(true);
      }
    };

    window.addEventListener('message', handleMessage);
    detectStore();

    if (userData.isAuthenticated) {
      localStorage.setItem('userProgress', 'connect-shopify');
    }

    return () => window.removeEventListener('message', handleMessage);
  }, [detectStore, userData.isAuthenticated, updateUserData]);

  const handleConnect = async () => {
    // If already auto-detected
    if (isAutoDetected && adminUrl) {
      setShowSuccess(true);
      return;
    }

    // If user entered store manually
    const shop = storeHandle ? (storeHandle.includes('myshopify.com') ? storeHandle : `${storeHandle}.myshopify.com`) : null;

    if (!shop) {
      // No input: open Shopify admin in a popup to help find the URL
      const width = 600;
      const height = 800;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;

      window.open(
        'https://admin.shopify.com/',
        'Shopify',
        `width=${width},height=${height},left=${left},top=${top}`
      );
      return;
    }

    setIsConnecting(true);
    try {
      const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
      const response = await fetch(`${apiUrl}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          shop: shop.trim().replace(/\/$/, ''),
          email: userData.email,
          niche: userData.niche,
          selectedBanners: userData.selectedBanners || [],
          selectedBannerImages: userData.selectedBannerImages || [],
          success_url: window.location.href, // Send the current URL so the backend can redirect back to us
        }),
      });

      if (!response.ok) throw new Error('Failed to initiate auth');

      const data = await response.json();

      if (data.authUrl) {
        // Open the auth URL in a popup
        const width = 600;
        const height = 800;
        const left = window.screenX + (window.outerWidth - width) / 2;
        const top = window.screenY + (window.outerHeight - height) / 2;

        window.open(
          data.authUrl,
          'Shopify Auth',
          `width=${width},height=${height},left=${left},top=${top}`
        );
      } else {
        throw new Error('No auth URL received');
      }
    } catch (err) {
      console.error('Auth error:', err);
      alert('Error connecting to Shopify. Please make sure the store name is correct.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleDisconnect = () => {
    setAdminUrl('');
    setIsAutoDetected(false);
    updateUserData({ adminUrl: '', shopifyConnected: false });
    localStorage.removeItem('shopifyAdminUrl');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-8 border border-slate-200">
          <div
            className="bg-gradient-to-r from-[#3B985D] to-emerald-500 h-2 rounded-full transition-all duration-500"
            style={{ width: '60%' }}
          ></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <a
            href="/"
            className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-6 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all mb-6 font-medium"
          >
            ← Back To Progress
          </a>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 mt-6">Connect Your Shopify Store</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Click below to log into Shopify and select your store
          </p>
        </div>

        {/* Shopify Connect Card */}
        <div className="max-w-md mx-auto p-4">
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-200 text-center">
            {/* Shopify Logo */}
            <div className="w-20 h-20 bg-[#3B985D] rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-md">
              <ShoppingBag className="w-10 h-10 text-white" />
            </div>

            {/* Main Content */}
            <div className="mb-8">
              {isAutoDetected && adminUrl ? (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 mb-6 text-left">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                      Store Linked
                    </span>
                    <button
                      onClick={handleDisconnect}
                      className="text-[10px] font-bold text-red-600 hover:text-red-700 uppercase tracking-wider"
                    >
                      Use Different Store
                    </button>
                  </div>
                  <p className="text-slate-900 font-bold truncate">{adminUrl}</p>
                  <p className="text-emerald-700 text-xs mt-1">Ready to proceed with setup.</p>
                </div>
              ) : (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-10 transition-all hover:bg-slate-100">
                    <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <ShoppingBag className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-slate-900 font-bold text-xl mb-2">No store connected yet</h3>
                    <p className="text-slate-500 text-sm mb-6 max-w-[280px] mx-auto leading-relaxed">
                      Click below to log into Shopify and select your store
                    </p>

                    {/* Connect Button */}
                    <button
                      onClick={handleConnect}
                      disabled={isConnecting}
                      className={`w-full py-3 mb-3 rounded-xl ${isConnecting
                          ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                          : 'bg-[#3B985D] text-white font-bold hover:bg-emerald-600 active:scale-95 transition-all'
                        }`}
                    >
                      {isConnecting ? (
                        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto"></div>
                      ) : (
                        <span>Connect Store</span>
                      )}
                    </button>

                    {/* Manual Entry */}
                    {!showManual ? (
                      <button
                        onClick={() => setShowManual(true)}
                        className="text-[#3B985D] text-sm font-bold hover:underline"
                      >
                        Enter store name manually
                      </button>
                    ) : (
                      <div className="flex items-center space-x-2 bg-white p-2 rounded-xl border border-slate-200 focus-within:ring-2 focus-within:ring-[#3B985D]/20 focus-within:border-[#3B985D] transition-all">
                        <input
                          type="text"
                          value={storeHandle}
                          onChange={(e) => setStoreHandle(e.target.value)}
                          placeholder="your-store-name"
                          className="flex-1 px-4 py-2 bg-transparent border-none focus:outline-none text-slate-900 font-medium"
                        />
                        <span className="pr-4 text-slate-400 font-bold text-sm">.myshopify.com</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Security Note */}
            <div className="bg-slate-50 rounded-lg p-4 text-left mt-6 border border-slate-200">
              <h4 className="font-medium text-slate-900 mb-2">🔒 Secure Connection</h4>
              <p className="text-sm text-slate-600">Your store URL is stored securely for setup.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Connected Successfully 🎉"
        message="Redirecting to subscription page..."
        onRedirect={() => {
          setShowSuccess(false);
          navigate('/subscribe');
        }}
        redirectDelay={2000}
      />
    </div>
  );
}