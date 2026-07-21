import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserData } from '../App';
import { Shirt, Smartphone, Home, Dumbbell, Heart, ArrowRight, FileBox } from 'lucide-react';
import SuccessModal from '../Component/SuccessModal';

interface Props {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

const niches = [
  {
    id: 'fashion',
    name: 'Fashion',
    description: 'Clothing, accessories, and style',
    icon: Shirt,
    color: 'from-pink-500 to-rose-500',
    bgImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop'
  },
  {
    id: 'electronics',
    name: 'Electronics',
    description: 'Gadgets, tech, and devices',
    icon: Smartphone,
    color: 'from-blue-500 to-indigo-500',
    bgImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&h=300&fit=crop'
  },
  {
    id: 'homedecor',
    name: 'Home Decor',
    description: 'Furniture and home essentials',
    icon: Home,
    color: 'from-green-500 to-emerald-500',
    bgImage: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400&h=300&fit=crop'
  },
  {
    id: 'fitness',
    name: 'Fitness',
    description: 'Sports, health, and wellness',
    icon: Dumbbell,
    color: 'from-orange-500 to-red-500',
    bgImage: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=300&fit=crop'
  },
  {
    id: 'pets',
    name: 'Pets',
    description: 'Pet care and accessories',
    icon: Heart,
    color: 'from-purple-500 to-pink-500',
    bgImage: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=400&h=300&fit=crop'
  },
  {
    id: 'other',
    name: 'Other',
    description: 'Miscellaneous items and services',
    icon: FileBox,
    color: 'from-yellow-500 to-yellow-600',
    bgImage: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=400&h=300&fit=crop'
  },
];

export default function ChooseNiche({ userData, updateUserData }: Props) {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);

  const handleNicheSelect = (nicheId: string) => {
    // Clear old banner selections when changing niche
    if (userData.niche && userData.niche !== nicheId) {
      console.log('🔄 Niche changed from', userData.niche, 'to', nicheId);
      console.log('🧹 Clearing old banner selections...');

      // Clear banner selections
      updateUserData({
        niche: nicheId,
        selectedBanners: [],
        selectedBannerImages: []
      });

      // Clear from localStorage
      localStorage.removeItem("selectedBanners");
      localStorage.removeItem("selectedBannerImages");
    } else {
      updateUserData({ niche: nicheId });
    }

    localStorage.setItem("selectedNiche", nicheId); // ✅ Save immediately
    console.log('✅ Niche selected:', nicheId);
  };

  useEffect(() => {
    // Save progress path
    if (userData.isAuthenticated) {
      localStorage.setItem("userProgress", "niche");
    }

    // Restore niche if available
    const savedNiche = localStorage.getItem("selectedNiche");
    if (savedNiche && !userData.niche) {
      updateUserData({ niche: savedNiche });
    }
  }, [userData.isAuthenticated, userData.niche, updateUserData]);

  const handleContinue = () => {
    if (userData.niche) {
      setShowSuccess(true);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 px-4 py-8">
      <div className="max-w-5xl mx-auto">
        {/* Progress Bar */}
        <div className="w-full bg-slate-100 rounded-full h-2 mb-8 border border-slate-200">
          <div className="bg-gradient-to-r from-[#3B985D] to-emerald-500 h-2 rounded-full w-1/5 transition-all duration-500"></div>
        </div>

        {/* Header */}
        <div className="text-center mb-12">
          <a
            href="/"
            className="inline-flex items-center bg-white hover:bg-slate-50 text-slate-700 py-2.5 px-6 rounded-full border border-slate-200 shadow-sm hover:shadow-md transition-all mb-6 font-medium"
          >
            ← Back To Progress
          </a>
          <h1 className="text-4xl font-bold text-slate-900 mb-3">Choose Your Niche</h1>
          <p className="text-lg text-slate-600">Select the category that best fits your store</p>
        </div>

        {/* Niches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {niches.map((niche) => {
            const Icon = niche.icon;
            const isSelected = userData.niche === niche.id;

            return (
              <div
                key={niche.id}
                onClick={() => handleNicheSelect(niche.id)}
                className={`
                  relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-105 border-2 h-64
                  ${isSelected
                    ? 'border-[#3B985D] shadow-lg ring-4 ring-[#3B985D]/10'
                    : 'border-slate-200 hover:border-slate-300 shadow-sm hover:shadow-md'
                  }
                `}
              >
                {/* Background Image */}
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${niche.bgImage})` }}
                >
                  {/* Dark Overlay for text readability */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/30"></div>
                </div>

                {/* Content */}
                <div className="relative z-10 h-full flex flex-col justify-end p-6">
                  {isSelected && (
                    <div className="absolute top-4 right-4 w-8 h-8 bg-[#3B985D] rounded-full flex items-center justify-center shadow-lg">
                      <div className="w-4 h-4 bg-white rounded-full"></div>
                    </div>
                  )}

                  <div className="mb-4">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mb-4 shadow-lg border-2 border-white/30">
                      <Icon className="w-8 h-8 text-white" />
                    </div>

                    <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{niche.name}</h3>
                    <p className="text-white/90 text-sm leading-relaxed drop-shadow-md">{niche.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Continue Button */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!userData.niche}
            className={`
              flex items-center space-x-2 px-8 py-4 rounded-full font-semibold transition-all duration-200
              ${userData.niche
                ? 'bg-gradient-to-r from-[#3B985D] to-emerald-600 text-white hover:from-[#2F7A4B] hover:to-emerald-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
              }
            `}
          >
            <span>Continue</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Professional Success Modal */}
      <SuccessModal
        isOpen={showSuccess}
        title="Niche Selected Successfully 🎉"
        message="Redirecting to choose banners..."
        onRedirect={() => {
          setShowSuccess(false);
          navigate(`/banners/${userData.niche}`);
        }}
        redirectDelay={2000}
      />
    </div>
  );
}
