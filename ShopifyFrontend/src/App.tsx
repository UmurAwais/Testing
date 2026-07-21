import { useState, useEffect, useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";

import {
} from "lucide-react";

import LoginSignup from "./pages/LoginSignup";
import HomePage from "./pages/HomePage";
import ProfilePage from "./pages/ProfilePage";
import ChooseNiche from "./pages/ChooseNiche";
import ChooseBanner from "./pages/ChooseBanner";
import ConnectShopify from "./pages/ConnectShopify";
import ChooseTheme from "./pages/ChooseTheme";
import CustomizeStore from "./pages/CustomizeStore";
import ProgressPage from "./pages/ProgressList";
import AccessShopify from "./pages/AccessShopify";
import Subscribe from "./pages/Subscribe";
import Live from "./pages/Live";
import Grow from "./pages/Grow";
import PrivacyPolicy from "./pages/PrivacyPolicy.jsx";
import InstallAppCard from "./pages/InstallAppCard.js";
import AddProductsPage from "./pages/AddProductsPage.jsx";
import TermsOfService from "./pages/TermsOfService.jsx";


export interface UserData {
  isAuthenticated: boolean;
  niche: string;
  selectedBanners: string[];
  selectedBannerImages?: string[]; // Banner image URLs
  shopifyConnected: boolean;
  selectedTheme: string;
  email?: string;
  picture?: string;
  name?: string;
  adminUrl?: string; // Shopify admin URL
}

const defaultUserData: UserData = {
  isAuthenticated: false,
  niche: "",
  selectedBanners: [],
  shopifyConnected: false,
  selectedTheme: "",
};

function App() {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [restored, setRestored] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current route is a public route
  const isPublicRoute = ["/PrivacyPolicy", "/login"].includes(location.pathname);

  // Load user data and restore last page if on root
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        const email = parsedUser.email ?? "";

        // Also ensure userEmail is set in localStorage
        if (email) {
          localStorage.setItem("userEmail", email);
        }

        setUserData({
          isAuthenticated: parsedUser.isAuthenticated ?? false,
          niche: parsedUser.niche ?? "",
          selectedBanners: Array.isArray(parsedUser.selectedBanners)
            ? parsedUser.selectedBanners
            : [],
          shopifyConnected: parsedUser.shopifyConnected ?? false,
          selectedTheme: parsedUser.selectedTheme ?? "",
          email: email,
          picture: parsedUser.picture,
          name: parsedUser.name,
          adminUrl: parsedUser.adminUrl ?? localStorage.getItem("shopifyAdminUrl") ?? "",
        });

        // 🚩 Only auto-redirect after login, not when user manually visits "/"
        if (
          parsedUser.isAuthenticated &&
          location.pathname === "/" && // only redirect if user is literally at root
          !restored &&
          !localStorage.getItem("userProgress") // first login only
        ) {
          navigate("/", { replace: true });
          setRestored(true);
        }
      } else {
        // Don't redirect to login if user is on a public route
        if (!isPublicRoute) {
          navigate("/login", { replace: true });
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      localStorage.removeItem("user");
      setUserData(defaultUserData);
      if (!isPublicRoute) {
        navigate("/login", { replace: true });
      }
    }
  }, [navigate, restored, location.pathname, isPublicRoute]);

  const updateUserData = useCallback((updates: Partial<UserData>) => {
    setUserData((prev) => {
      const updated = { ...prev, ...updates };
      try {
        localStorage.setItem("user", JSON.stringify(updated));
        if (updated.email) localStorage.setItem("userEmail", updated.email);
      } catch (error) {
        console.error("Failed to save user data:", error);
      }
      return updated;
    });
  }, []);

  const handleLogout = useCallback(() => {
    setUserData(defaultUserData);
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("userEmail");
      localStorage.removeItem("userProgress");
    } catch (error) {
      console.error("Failed to clear localStorage:", error);
    }
    navigate("/login");
  }, [navigate]);

  const requireAuth = useCallback(
    (element: JSX.Element) =>
      userData.isAuthenticated ? element : <Navigate to="/login" replace />,
    [userData.isAuthenticated]
  );

  return (
    <div className="min-h-screen bg-white from-slate-50 via-blue-50 to-indigo-100">
      <Routes>
        {/* Public Routes */}
        <Route path="/PrivacyPolicy" element={<PrivacyPolicy />} />
        <Route path="/TermsOfService" element={<TermsOfService />} />
        <Route
          path="/login"
          element={
            userData.isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <LoginSignup userData={userData} updateUserData={updateUserData} />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={requireAuth(
            <ProgressPage userData={userData} updateUserData={updateUserData} />
          )}
        />

        <Route
          path="/profile"
          element={requireAuth(
            <ProfilePage userData={userData} updateUserData={updateUserData} onLogout={handleLogout} />
          )}
        />

        <Route
          path="/home"
          element={requireAuth(
            <HomePage userData={userData} />
          )}
        />

        <Route
          path="/progress"
          element={requireAuth(
            <ProgressPage userData={userData} updateUserData={updateUserData} />
          )}
        />

        <Route
          path="/niche"
          element={requireAuth(
            <ChooseNiche userData={userData} updateUserData={updateUserData} />
          )}
        />

        <Route
          path="/accessShopify"
          element={requireAuth(
            <AccessShopify />
          )}
        />

        <Route path="/subscribe" element={requireAuth(<Subscribe />)} />
        <Route path="/InstallAppCard" element={requireAuth(<InstallAppCard />)} />
        <Route path="/live" element={requireAuth(<Live />)} />
        <Route path="/grow" element={requireAuth(<Grow />)} />
        <Route path="/AddProductsPage" element={requireAuth(<AddProductsPage />)} />
        <Route
          path="/banners/:niche"
          element={requireAuth(
            <ChooseBanner userData={userData} updateUserData={updateUserData} />
          )}
        />
        <Route
          path="/banners"
          element={requireAuth(
            <ChooseBanner userData={userData} updateUserData={updateUserData} />
          )}
        />
        <Route
          path="/connect-shopify"
          element={requireAuth(
            <ConnectShopify userData={userData} updateUserData={updateUserData} />
          )}
        />
        <Route
          path="/themes"
          element={requireAuth(
            <ChooseTheme userData={userData} updateUserData={updateUserData} />
          )}
        />
        <Route path="/customize" element={requireAuth(<CustomizeStore />)} />

        {/* Catch-all */}
        <Route
          path="*"
          element={
            <Navigate
              to={
                userData.isAuthenticated
                  ? localStorage.getItem("userProgress") || "/"
                  : "/login"
              }
              replace
            />
          }
        />

      </Routes>

      {/* User Profile Dropdown */}
      {userData.isAuthenticated && !isPublicRoute && (
        <UserProfileDropdown userData={userData} onLogout={handleLogout} />
      )}
    </div>
  );
}

function UserProfileDropdown({ userData, onLogout }: { userData: UserData; onLogout: () => void }) {
  const navigate = useNavigate();

  const getInitials = (name?: string, email?: string) => {
    if (name) return name.charAt(0).toUpperCase();
    if (email) return email.charAt(0).toUpperCase();
    return "U";
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <button
        onClick={() => navigate('/profile')}
        className="flex items-center space-x-2 bg-white/90 backdrop-blur-sm p-1.5 pl-3 rounded-full shadow-lg border border-slate-200 hover:border-[#3B985D] transition-all duration-300 group"
        title="View Profile"
      >
        {/* <div className="hidden sm:block text-right mr-1">
          <p className="text-xs font-bold text-slate-700 group-hover:text-[#3B985D] transition-colors">{userData.name || "User"}</p>
        </div> */}

        <div className="w-9 h-9 rounded-full overflow-hidden  group-hover:border-[#3B985D] flex items-center justify-center relative transition-all">
          {userData.picture ? (
            <img
              src={userData.picture}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Failed to load profile image:", userData.picture);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-slate-700 font-bold text-sm">{getInitials(userData.name, userData.email)}</span>
          )}
          {userData.picture && (
            <span className="absolute inset-0 flex items-center justify-center text-slate-700 font-bold text-sm opacity-0">
              {getInitials(userData.name, userData.email)}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}