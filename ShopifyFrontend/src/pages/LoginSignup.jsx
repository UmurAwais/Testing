import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Sparkles, ShoppingBag, Star } from "lucide-react";
import Google from "../Component/Google";

export default function LoginSignup({ userData, updateUserData }) {
  const [isLogin, setIsLogin] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Get API URL from environment variable, fallback to production URL
  const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      const endpoint = isLogin
        ? `${apiUrl}/api/auth/login`
        : `${apiUrl}/api/auth/signup`;

      // Fallback name from email prefix
      const fallbackName = email.split("@")[0];

      const body = isLogin
        ? { email, password }
        : { name: fallbackName, email, password };

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Something went wrong");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("userEmail", data.user.email);
      updateUserData({ isAuthenticated: true, ...data.user });
      navigate("/niche");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      alert("Please enter your email first.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${apiUrl}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send reset email");

      alert("Password reset instructions have been sent to your email.");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06040A] text-ecom-text font-body relative overflow-hidden flex flex-col selection:bg-ecom-violet/30 selection:text-white">
      {/* Main Grid container: split 50/50 on desktop */}
      <div className="flex-grow grid grid-cols-1 lg:grid-cols-2 relative z-10">
        
        {/* LEFT COLUMN - Marketing/Details */}
        <div className="relative flex flex-col justify-between p-8 sm:p-12 lg:p-16 xl:p-20 order-2 lg:order-1 lg:border-r border-white/10 overflow-hidden bg-[#06040A]">
          {/* Glowing gradients behind the content */}
          {/* A large, soft purple glow centered at the top-left (logo & main header) */}
          <div className="absolute top-[-10%] left-[-10%] w-[100%] h-[80%] rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(139,92,246,0.22)_0%,rgba(139,92,246,0.06)_45%,transparent_80%)] pointer-events-none z-0 filter blur-2xl"></div>
          {/* A secondary blue/indigo glow near the middle/bottom to enrich color palette */}
          <div className="absolute bottom-[10%] left-[-10%] w-[80%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.08)_0%,transparent_70%)] pointer-events-none z-0 filter blur-xl"></div>
          
          {/* Grid pattern overlay */}
          <div className="absolute inset-0 bg-grid-pattern opacity-100 z-0 pointer-events-none"></div>

          {/* Content Wrapper */}
          <div className="relative z-10 flex flex-col justify-between h-full w-full">
            <div>
              {/* Logo */}
              <div className="flex items-center mb-8 lg:mb-12">
                <span className="font-display font-extrabold text-2xl tracking-tight text-white select-none">
                  ecom<span className="text-ecom-violet-soft">lly</span>
                </span>
              </div>

              {/* Tagline */}
              <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-[52px] xl:text-[56px] text-white tracking-tight leading-[1.08] mb-5">
                Your Shopify store.<br />
                <span className="bg-gradient-to-r from-ecom-violet-soft via-[#9D7BFF] to-ecom-violet bg-clip-text text-transparent">Built by AI.</span><br />
                Live in minutes.
              </h1>

              {/* Description */}
              <p className="text-[#9A92AE] text-sm sm:text-base leading-relaxed max-w-lg mb-8 font-light">
                Pick a niche, walk away with a real store — high-converting theme, 10 winning products loaded, ready to sell in minutes.
              </p>

              {/* Shopify Partner & Expert official logos */}
              <div className="flex flex-wrap items-center gap-4 mb-10">
                <div className="border border-white/10 bg-white/[0.02] px-9 py-4 rounded-full flex items-center justify-center hover:bg-white/[0.04] transition-all duration-200">
                  <img
                    src="/partner.svg"
                    alt="Shopify Partner"
                    className="h-7 w-auto object-contain select-none"
                    onError={(e) => {
                      console.error("Failed to load partner logo:", e.target.src);
                    }}
                  />
                </div>
                <div className="border border-white/10 bg-white/[0.02] px-9 py-4 rounded-full flex items-center justify-center hover:bg-white/[0.04] transition-all duration-200">
                  <img
                    src="/expert.png"
                    alt="Shopify Expert"
                    className="h-7 w-auto object-contain select-none"
                    onError={(e) => {
                      console.error("Failed to load expert logo:", e.target.src);
                    }}
                  />
                </div>
              </div>

              {/* What you get list */}
              <div>
                <h3 className="font-display font-bold text-lg text-white mb-5">What you get?</h3>
                <div className="space-y-3.5">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center font-mono font-bold text-[13px] text-ecom-violet-soft shrink-0">
                      $0
                    </div>
                    <span className="text-sm text-[#E6E1F2] font-light">Zero cost to launch — keep 100% of profits</span>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-sm shrink-0">
                      🎨
                    </div>
                    <span className="text-sm text-[#E6E1F2] font-light">High-converting theme, tuned to your niche</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-sm shrink-0">
                      📦
                    </div>
                    <span className="text-sm text-[#E6E1F2] font-light">10 winning products pre-loaded</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-sm shrink-0">
                      📄
                    </div>
                    <span className="text-sm text-[#E6E1F2] font-light">Product & policy pages built automatically</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-center text-sm shrink-0">
                      ⚡
                    </div>
                    <span className="text-sm text-[#E6E1F2] font-light">Live in under 5 minutes</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Testimonial Box */}
            <div className="bg-white/[0.01] border border-white/5 p-6 rounded-2xl max-w-md mt-10">
              <div className="flex text-ecom-gold gap-0.5 mb-3">
                <Star className="w-3.5 h-3.5 fill-ecom-gold text-ecom-gold" />
                <Star className="w-3.5 h-3.5 fill-ecom-gold text-ecom-gold" />
                <Star className="w-3.5 h-3.5 fill-ecom-gold text-ecom-gold" />
                <Star className="w-3.5 h-3.5 fill-ecom-gold text-ecom-gold" />
                <Star className="w-3.5 h-3.5 fill-ecom-gold text-ecom-gold" />
              </div>
              <p className="text-xs text-[#E6E1F2] italic leading-relaxed mb-4">
                "My store was live and making sales within the same day. I didn't touch a single line of code."
              </p>
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#8B5CF6] to-ecom-violet-deep flex items-center justify-center text-xs font-bold text-white mr-3 shrink-0">
                  J
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white leading-none mb-0.5">Jahir K.</h4>
                  <p className="text-[10px] text-ecom-muted font-light">Fashion Boutique Owner</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - Form */}
        <div className="relative flex flex-col justify-center p-8 sm:p-12 lg:p-16 xl:p-20 order-1 lg:order-2 overflow-hidden bg-[#06040A]">
          {/* Subtle glow behind the form */}
          <div className="absolute top-[20%] right-[-10%] w-[80%] h-[60%] rounded-full bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.06)_0%,transparent_70%)] pointer-events-none z-0 filter blur-2xl"></div>
          
          <div className="relative z-10 w-full max-w-sm mx-auto my-auto flex flex-col justify-center py-6 sm:py-12">
            <h2 className="text-2xl font-display font-extrabold text-white text-center mb-8">
              {isLogin ? "Welcome back" : "Get your free Shopify store"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4.5">
              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-mono uppercase tracking-wider text-ecom-lav">Email</label>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ecom-muted">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full pl-10 pr-4 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-ecom-muted/40 focus:outline-none focus:ring-2 focus:ring-ecom-violet/40 focus:border-ecom-violet transition-all text-sm"
                    placeholder="Enter your email address"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1.5 mt-4">
                <div className="flex justify-between items-center">
                  <label className="block text-xs font-mono uppercase tracking-wider text-ecom-lav">Password</label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="text-[11px] font-medium text-ecom-violet-soft hover:underline"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ecom-muted">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full pl-10 pr-10 py-3 bg-white/[0.02] border border-white/10 rounded-xl text-white placeholder-ecom-muted/40 focus:outline-none focus:ring-2 focus:ring-ecom-violet/40 focus:border-ecom-violet transition-all text-sm"
                    placeholder={isLogin ? "Your password" : "Create a password"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ecom-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-ecom-violet to-[#9D7BFF] text-white font-bold text-sm tracking-wide shadow-lg shadow-ecom-violet/20 hover:shadow-xl hover:shadow-ecom-violet/30 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer mt-6"
              >
                {loading ? (
                  <span className="flex items-center gap-2 justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : (
                  <>
                    {isLogin ? "Sign In" : "Build my free store →"}
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/5"></div>
              </div>
              <div className="relative flex justify-center text-xs font-mono uppercase tracking-wider">
                <span className="px-3 bg-[#06040A] text-ecom-muted text-[10px]">Or</span>
              </div>
            </div>

            {/* Google Sign In Component */}
            <div className="h-12 w-full relative z-20">
              <Google
                isLogin={isLogin}
                onSuccess={() => {
                  updateUserData({ isAuthenticated: true });
                }}
                onError={(error) => {
                  alert(error);
                }}
              />
            </div>

            {/* Switch Account Switcher */}
            <div className="mt-6 text-center text-sm text-ecom-muted font-light">
              {isLogin ? (
                <span>
                  Don't have an account?{" "}
                  <button
                    onClick={() => { setIsLogin(false); }}
                    className="font-semibold text-ecom-violet-soft hover:underline"
                  >
                    Sign up free
                  </button>
                </span>
              ) : (
                <span>
                  Already have an account?{" "}
                  <button
                    onClick={() => { setIsLogin(true); }}
                    className="font-semibold text-ecom-violet-soft hover:underline"
                  >
                    Log in
                  </button>
                </span>
              )}
            </div>

            {/* Checklist Monospace Footer */}
            <div className="text-[11px] font-mono text-ecom-muted flex flex-wrap gap-x-6 gap-y-2 justify-center mt-8 select-none">
              <span className="flex items-center gap-1"><span className="text-[#34D399] font-bold">✓</span> No credit card</span>
              <span className="flex items-center gap-1"><span className="text-[#34D399] font-bold">✓</span> Launch in minutes</span>
              <span className="flex items-center gap-1"><span className="text-[#34D399] font-bold">✓</span> 100% yours</span>
            </div>
          </div>
        </div>

      </div>

      {/* Global Footer (Compact) */}
      <footer className="w-full px-8 py-5 border-t border-white/10 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-ecom-muted font-light relative z-10 bg-[#06040A]">
        <div className="flex flex-wrap items-center gap-6 justify-center">
          <a href="/PrivacyPolicy" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="/TermsOfService" className="hover:text-white transition-colors">Terms of Service</a>
          <a href="mailto:support@ecomlly.com" className="hover:text-white transition-colors flex items-center gap-1.5">
            <Mail className="w-3.5 h-3.5" /> support@ecomlly.com
          </a>
        </div>
        <div className="text-center sm:text-right">
          Ecomlly © 2026. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
