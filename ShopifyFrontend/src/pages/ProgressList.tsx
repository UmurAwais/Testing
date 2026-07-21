import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { UserData } from "../App";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  Check,
  Loader,
  Sparkles,
  Store,
  Palette,
  Target,
  Link,
  Lock,
} from "lucide-react";

interface Props {
  userData: UserData;
  updateUserData: (updates: Partial<UserData>) => void;
}

// Confetti Particle Component
const ConfettiParticle = ({ delay, x, color }: { delay: number; x: number; color: string }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color, left: `${x}%` }}
      initial={{ y: -10, opacity: 1, scale: 0 }}
      animate={{
        y: [0, 100, 200],
        opacity: [1, 1, 0],
        scale: [0, 1, 0],
        rotate: [0, 180, 360],
      }}
      transition={{
        duration: 2,
        delay,
        ease: "easeOut",
      }}
    />
  );
};

// Confetti Effect Component
const ConfettiEffect = ({ isActive }: { isActive: boolean }) => {
  const colors = ["#3B985D", "#10b981", "#059669", "#34d399", "#6ee7b7", "#047857"];

  if (!isActive) return null;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 30 }).map((_, i) => (
        <ConfettiParticle
          key={i}
          delay={i * 0.05}
          x={(i * 100) / 30}
          color={colors[i % colors.length]}
        />
      ))}
    </div>
  );
};

export default function ConnectShopify({ userData, updateUserData }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<string | null>(null);
  const [hoveredStep, setHoveredStep] = useState<string | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());
  const [showConfetti, setShowConfetti] = useState(false);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const prevProgressRef = useRef<string | null>(null);

  // Get saved connect URL before using it in steps array
  const savedConnectUrl = typeof window !== 'undefined' ? localStorage.getItem("connectShopifyUrl") : null;

  const steps = [
    { id: "niche", label: "Select Niche", path: "/niche", icon: Target, description: "Define your target market" },
    { id: "ChooseBanner", label: "Choose Banner", path: `/banners/${userData.niche || ""}`, icon: Palette, description: "Pick your store design" },
    { id: "accessShopify", label: "Shopify Store", path: "/accessShopify", icon: Store, description: "Create Your Shopify Account" },
    { id: "connect-shopify", label: "Connect Shopify", path: savedConnectUrl || "/connect-shopify", icon: Link, description: "Link Your Shopify Store" },
    { id: "subscribe", label: "Grab Your Shopify Discount", path: "/subscribe", icon: Link, description: " " },
    { id: "InstallAppCard", label: "Install Build Your Store App", path: "/InstallAppCard", icon: Link, description: " " },
    { id: "customize", label: "Make Your Store Unique", path: "/customize", icon: Link, description: "" },
    { id: "AddProductsPage", label: "Add Top Selling Products", path: "/AddProductsPage", icon: Link, description: " " },
    { id: "live", label: " Your Shopify Store is Live ", path: "/live", icon: Link, description: " " },
    { id: "grow", label: " Grow Your Store", path: "/grow", icon: Link, description: " " },
  ];

  useEffect(() => {
    const savedProgress = localStorage.getItem("userProgress");
    if (savedProgress) {
      setProgress(savedProgress);
      prevProgressRef.current = savedProgress;
    }
  }, []);

  useEffect(() => {
    if (progress) {
      localStorage.setItem("userProgress", progress);

      // Detect new completed steps and trigger confetti
      if (prevProgressRef.current !== progress) {
        const newCompletedSteps = new Set<string>();
        const cleanProgress = progress.startsWith('/') ? progress.slice(1) : progress;
        const currentIndex = steps.findIndex((s) => s.id === cleanProgress);

        if (currentIndex >= 0) {
          let hasNewCompletion = false;
          steps.slice(0, currentIndex + 1).forEach((step) => {
            newCompletedSteps.add(step.id);
            if (!completedSteps.has(step.id)) {
              // New completion detected
              hasNewCompletion = true;
            }
          });

          if (hasNewCompletion) {
            setShowConfetti(true);
            setTimeout(() => setShowConfetti(false), 2000);
          }
        }

        setCompletedSteps(newCompletedSteps);
        prevProgressRef.current = progress;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress]);

  const handleConnect = () => {
    setIsLoading(true);
    setTimeout(() => {
      setProgress("connect-shopify");
      setIsLoading(false);
      navigate("/customize");
    }, 1500);
  };

  const isChecked = (stepId: string) => {
    if (!progress) return false;

    // ✅ Handle progress values that start with "/" (like "/connect-shopify")
    const cleanProgress = progress.startsWith('/') ? progress.slice(1) : progress;

    const currentIndex = steps.findIndex((s) => s.id === cleanProgress);
    const stepIndex = steps.findIndex((s) => s.id === stepId);
    return stepIndex <= currentIndex;
  };

  const currentStepIndex = progress ? steps.findIndex((s) => s.id === (progress.startsWith('/') ? progress.slice(1) : progress)) : -1;
  const progressPercentage = currentStepIndex >= 0 ? ((currentStepIndex + 1) / steps.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 font-sans p-6 flex items-center justify-center relative">
      {/* Overlay */}
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-0"></div>

      <div className="w-full max-w-2xl relative z-10">
        {/* Floating Header Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200 p-8 mb-8 relative overflow-hidden">
          {/* Animated Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-slate-100/50 via-blue-50/30 to-slate-100/50 animate-pulse"></div>

          <div className="relative z-10">
            <div className="flex items-center justify-center space-x-4 mb-6">
              <div className="relative">
                <ShoppingBag className="w-12 h-12 text-slate-700" />
                <Sparkles className="w-6 h-6 text-blue-500 absolute -top-2 -right-2 animate-bounce" />
              </div>
              <div className="text-center">
                <h1 className="text-3xl font-bold text-slate-900 tracking-tight">
                  Launch your FREE AI-built Shopify store <br /> in less than <span className="text-[#3B985D]">5 minutes</span>
                </h1>
                <p className="text-slate-600 mt-2 font-medium">Kickstart your eCommerce journey today. Just sign up and let our AI handle the entire store setup.</p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-semibold text-slate-700">Setup Progress</span>
                <motion.span
                  key={Math.round(progressPercentage)}
                  initial={{ scale: 1.2, color: "#3B985D" }}
                  animate={{ scale: 1, color: "#3B985D" }}
                  className="text-sm font-bold text-[#3B985D]"
                >
                  {Math.round(progressPercentage)}%
                </motion.span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden relative border border-slate-200">
                <motion.div
                  className="h-3 bg-gradient-to-r from-[#3B985D] to-emerald-500 rounded-full relative overflow-hidden"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-full"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                  {/* Shimmer effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent"
                    animate={{
                      x: ["-100%", "100%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </div>
          </div>
        </div>

        {/* Steps Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-lg border border-slate-200 p-8 relative overflow-hidden">
          {/* Subtle background pattern */}
          <div className="absolute inset-0 opacity-5">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-600 to-blue-600"></div>
          </div>

          <div className="relative z-10 space-y-6">
            <ConfettiEffect isActive={showConfetti} />
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isCompleted = isChecked(step.id);
              const isCurrent = progress === step.id || progress === `/${step.id}`;
              const isHovered = hoveredStep === step.id;
              const isNewlyCompleted = completedSteps.has(step.id) && isCompleted;

              // 🔒 Step lock logic
              const canAccessStep = index === 0 || isChecked(steps[index - 1].id);

              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    scale: isCompleted ? [1, 1.02, 1] : 1,
                  }}
                  transition={{
                    duration: 0.5,
                    delay: index * 0.1,
                    scale: isNewlyCompleted ? { duration: 0.6, times: [0, 0.5, 1] } : { duration: 0 }
                  }}
                  whileHover={canAccessStep ? { scale: 1.02, y: -2 } : {}}
                  className={`group relative p-6 rounded-2xl transition-all duration-300 
        ${canAccessStep
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"} 
        ${isCompleted
                      ? "bg-[#3B985D]/5 border-2 border-[#3B985D]/20 hover:border-[#3B985D]/40 shadow-sm"
                      : isCurrent
                        ? "bg-white border-2 border-[#3B985D] shadow-lg shadow-[#3B985D]/10"
                        : "bg-slate-50 border-2 border-slate-200 hover:border-slate-300 hover:bg-white"
                    }`}
                  onClick={() => {
                    if (canAccessStep) navigate(step.path); // ✅ Only navigate if unlocked
                  }}
                  onMouseEnter={() => setHoveredStep(step.id)}
                  onMouseLeave={() => setHoveredStep(null)}
                >
                  {/* Step Number/Check Indicator */}
                  <div className="flex items-center space-x-4">
                    <motion.div
                      className={`relative flex items-center justify-center w-12 h-12 rounded-full 
          ${isCompleted
                          ? "bg-[#3B985D] shadow-lg shadow-[#3B985D]/30"
                          : isCurrent
                            ? "bg-white border-2 border-[#3B985D] shadow-lg"
                            : "bg-slate-200"
                        }`}
                      initial={{ scale: 0.8, rotate: -180 }}
                      animate={{
                        scale: 1,
                        rotate: 0,
                        boxShadow: isCompleted
                          ? "0 10px 25px -5px rgba(59, 152, 93, 0.4), 0 10px 10px -5px rgba(59, 152, 93, 0.2)"
                          : isCurrent
                            ? "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)"
                            : "0 0 0 0"
                      }}
                      transition={{
                        duration: 0.6,
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                    >
                      <AnimatePresence mode="wait">
                        {isCompleted ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{
                              type: "spring",
                              stiffness: 300,
                              damping: 20
                            }}
                          >
                            <Check className="w-6 h-6 text-white" />
                          </motion.div>
                        ) : (
                          <motion.span
                            key="number"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`font-bold text-lg ${isCurrent ? "text-[#3B985D]" : "text-gray-500"}`}
                          >
                            {index + 1}
                          </motion.span>
                        )}
                      </AnimatePresence>

                      {/* Success ripple effect */}
                      {isNewlyCompleted && (
                        <>
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-[#3B985D]"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 2, opacity: 0 }}
                            transition={{ duration: 0.8 }}
                          />
                          <motion.div
                            className="absolute inset-0 rounded-full border-2 border-emerald-400"
                            initial={{ scale: 1, opacity: 1 }}
                            animate={{ scale: 2.5, opacity: 0 }}
                            transition={{ duration: 1, delay: 0.2 }}
                          />
                        </>
                      )}
                    </motion.div>

                    <motion.div
                      className="flex-1"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.2 }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          animate={isCompleted ? {
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          } : {}}
                          transition={{ duration: 0.6 }}
                        >
                          <StepIcon className={`w-6 h-6 transition-colors duration-300 
              ${isCompleted ? "text-[#3B985D]" : isCurrent ? "text-[#3B985D]" : "text-slate-400"}
            `} />
                        </motion.div>
                        <motion.h3
                          className={`text-lg font-bold transition-colors duration-300 
              ${isCompleted ? "text-[#3B985D]" : isCurrent ? "text-slate-900" : "text-slate-600"}
            `}
                          animate={isNewlyCompleted ? {
                            scale: [1, 1.05, 1]
                          } : {}}
                          transition={{ duration: 0.4 }}
                        >
                          {step.label}
                        </motion.h3>
                      </div>
                      <motion.p
                        className={`text-sm mt-1 transition-colors duration-300 font-medium
            ${isCompleted ? "text-[#3B985D]/80" : isCurrent ? "text-slate-600" : "text-slate-400"}
          `}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                      >
                        {step.description}
                      </motion.p>
                    </motion.div>

                    {/* Arrow indicator */}
                    {canAccessStep ? (
                      <motion.div
                        animate={isHovered ? { x: 5 } : { x: 0 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                      >
                        <ArrowRight className={`w-5 h-5 transition-colors duration-300 ${isHovered ? "text-[#3B985D]" : "text-slate-300"}`} />
                      </motion.div>
                    ) : (
                      <div className="flex items-center justify-center w-5 h-5 text-slate-400">
                        <Lock className="w-4 h-4" />
                      </div>
                    )}
                  </div>

                  {/* Progress connector line */}
                  {index < steps.length - 1 && (
                    <motion.div
                      className="absolute left-11 top-20 w-0.5 h-8 bg-gradient-to-b from-slate-200 to-transparent"
                      initial={{ height: 0 }}
                      animate={{
                        height: isCompleted ? 32 : 0,
                        background: isCompleted
                          ? "linear-gradient(to bottom, rgba(59, 152, 93, 0.5), transparent)"
                          : "linear-gradient(to bottom, rgba(226, 232, 240, 0.8), transparent)"
                      }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    />
                  )}
                </motion.div>
              );
            })}

          </div>

          {/* Action Section */}
          <div className="relative z-10 mt-10 pt-8 border-t border-gray-200/50">
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Ready to Connect?</h3>
              <p className="text-gray-600">Securely link your Shopify store to unlock all features</p>
            </div>


            {/* Security badges */}
            <div className="flex items-center justify-center space-x-6 mt-6 text-xs text-slate-500 font-medium">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-[#3B985D] rounded-full animate-pulse"></div>
                <span>Secure Connection</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-[#10b981] rounded-full animate-pulse"></div>
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-[#059669] rounded-full animate-pulse"></div>
                <span>GDPR Compliant</span>
              </div>
            </div>
          </div>
        </div>

        {/* Floating Success Message */}
        {/* {progress === "connect-shopify" || progress === "/connect-shopify" && (
            <div className="fixed top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-green-500/30 flex items-center space-x-2 animate-bounce">
              <Check className="w-5 h-5" />
              <span className="font-medium">Store Connected!</span>
            </div>
          )} */}
      </div>
    </div>
  );
}