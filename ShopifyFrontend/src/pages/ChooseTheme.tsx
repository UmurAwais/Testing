import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../App';
import { Check, Star, ArrowRight, Sparkles } from 'lucide-react';
import SuccessModal from '../Component/SuccessModal';

interface Props {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

const themes = [
  {
    id: 'dawn',
    name: 'Dawn',
    description: 'Clean, modern design perfect for any product type',
    price: 'Free',
    rating: 4.8,
    image: 'https://images.pexels.com/photos/4050325/pexels-photo-4050325.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Mobile-first design', 'Built-in SEO', 'Fast loading']
  },
  {
    id: 'impulse',
    name: 'Impulse',
    description: 'Bold and dynamic theme for fashion and lifestyle brands',
    price: '$180',
    rating: 4.9,
    image: 'https://images.pexels.com/photos/4050324/pexels-photo-4050324.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Video backgrounds', 'Instagram feed', 'Quick shop']
  },
  {
    id: 'craft',
    name: 'Craft',
    description: 'Elegant theme designed for artisans and creators',
    price: '$180',
    rating: 4.7,
    image: 'https://images.pexels.com/photos/4050323/pexels-photo-4050323.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Product galleries', 'Story sections', 'Custom fonts']
  },
  {
    id: 'warehouse',
    name: 'Warehouse',
    description: 'Minimal design focused on products and conversion',
    price: '$180',
    rating: 4.6,
    image: 'https://images.pexels.com/photos/4050322/pexels-photo-4050322.jpeg?auto=compress&cs=tinysrgb&w=400',
    features: ['Large product images', 'Quick view', 'Advanced filtering']
  }
];

export default function ChooseTheme({ userData, updateUserData }: Props) {
  const [isCompleted, setIsCompleted] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();

  const handleThemeSelect = (themeId: string) => {
    updateUserData({ selectedTheme: themeId });
  };

  const handleComplete = () => {
    if (userData.selectedTheme) {
      // Show success modal first
      setShowSuccess(true);
    }
  };

  const selectedTheme = themes.find(theme => theme.id === userData.selectedTheme);

  // Show success modal and then completion screen
  if (showSuccess && !isCompleted) {
    return (
      <>
        <SuccessModal
          isOpen={showSuccess}
          title="Theme Selected Successfully 🎉"
          message="Setting up your store..."
          onRedirect={() => {
            setShowSuccess(false);
            setIsCompleted(true);
          }}
          redirectDelay={2000}
        />
        {/* Keep the existing page visible behind modal */}
        <div className="min-h-screen px-4 py-8">
          <div className="max-w-6xl mx-auto">
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-2 mb-8">
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 h-2 rounded-full w-4/5 transition-all duration-500"></div>
            </div>
            {/* Rest of the page content */}
          </div>
        </div>
      </>
    );
  }

  if (isCompleted) {
    return (
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mx-auto mb-6 flex items-center justify-center">
            <Sparkles className="w-12 h-12 text-white" />
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Setup Complete! 🎉</h1>
          <p className="text-xl text-gray-600 mb-8">
            Your Shopify store is ready with your personalized setup:
          </p>

          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 text-left max-w-md mx-auto">
            <h3 className="font-semibold text-gray-900 mb-4">Your Configuration:</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Niche:</span>
                <span className="font-medium capitalize">{userData.niche.replace('-', ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Banners:</span>
                <span className="font-medium">{userData.selectedBanners.length} selected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shopify:</span>
                <span className="font-medium text-green-600">Connected</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Theme:</span>
                <span className="font-medium">{selectedTheme?.name}</span>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <button className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-medium hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg">
              Launch Your Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-8 border border-slate-200">
          <div className="bg-gradient-to-r from-[#3B985D] to-emerald-500 h-2 rounded-full w-4/5 transition-all duration-500"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <a
            href="/"
            className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-6 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all mb-6 font-medium"
          >
            ← Back To Progress
          </a>
          <h1 className="text-4xl font-bold text-slate-900 mb-4 mt-6">Choose Your Theme</h1>
          <p className="text-lg text-slate-600 max-w-3xl mx-auto">
            Select the perfect theme that matches your brand and business goals.
          </p>
        </div>

        {/* Themes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {themes.map((theme) => {
            const isSelected = userData.selectedTheme === theme.id;

            return (
              <div
                key={theme.id}
                onClick={() => handleThemeSelect(theme.id)}
                className={`
                  relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 border-2
                  ${isSelected
                    ? 'border-[#3B985D] shadow-lg ring-4 ring-[#3B985D]/10'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                  }
                `}
              >
                {/* Selection Indicator */}
                {isSelected && (
                  <div className="absolute top-4 right-4 z-10 w-8 h-8 bg-[#3B985D] rounded-full flex items-center justify-center shadow-lg">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}

                {/* Theme Preview */}
                <div className="aspect-video bg-slate-100 relative overflow-hidden">
                  <img
                    src={theme.image}
                    alt={theme.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity duration-300"></div>
                </div>

                {/* Theme Info */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-900">{theme.name}</h3>
                    <div className="flex items-center space-x-1">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-medium text-slate-600">{theme.rating}</span>
                    </div>
                  </div>

                  <p className="text-slate-600 mb-4 leading-relaxed">{theme.description}</p>

                  <div className="flex justify-between items-center mb-4">
                    <span className="text-2xl font-bold text-[#3B985D]">{theme.price}</span>
                    {theme.price === 'Free' && (
                      <span className="bg-[#3B985D]/10 text-[#3B985D] px-3 py-1 rounded-full text-xs font-medium border border-[#3B985D]/20">
                        Popular
                      </span>
                    )}
                  </div>

                  {/* Features */}
                  <div className="space-y-2">
                    {theme.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm text-slate-600">
                        <Check className="w-4 h-4 text-[#3B985D]" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Complete Button */}
        <div className="flex justify-center">
          <button
            onClick={handleComplete}
            disabled={!userData.selectedTheme}
            className={`
              flex items-center space-x-2 px-8 py-4 rounded-full font-semibold transition-all duration-200
              ${userData.selectedTheme
                ? 'bg-gradient-to-r from-[#3B985D] to-emerald-600 text-white hover:from-[#2F7A4B] hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <span>Complete Setup</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}