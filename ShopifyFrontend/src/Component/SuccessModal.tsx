import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Sparkles, Loader } from "lucide-react";

interface SuccessModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onClose?: () => void;
  redirectDelay?: number;
  onRedirect?: () => void;
}

// Confetti particles for celebration
const ConfettiParticle = ({ delay, x, color }: { delay: number; x: number; color: string }) => {
  return (
    <motion.div
      className="absolute w-2 h-2 rounded-full"
      style={{ backgroundColor: color, left: `${x}%`, top: "50%" }}
      initial={{ y: 0, opacity: 1, scale: 0, rotate: 0 }}
      animate={{
        y: [0, -100, -200],
        opacity: [1, 1, 0],
        scale: [0, 1, 0],
        rotate: [0, 180, 360],
        x: [0, Math.random() * 200 - 100],
      }}
      transition={{
        duration: 2,
        delay,
        ease: "easeOut",
      }}
    />
  );
};

export default function SuccessModal({
  isOpen,
  title,
  message,
  onClose,
  redirectDelay = 2000,
  onRedirect,
}: SuccessModalProps) {
  useEffect(() => {
    if (isOpen && onRedirect) {
      const timer = setTimeout(() => {
        onRedirect();
      }, redirectDelay);

      return () => clearTimeout(timer);
    }
  }, [isOpen, onRedirect, redirectDelay]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={onClose}
          >
            {/* Confetti Container */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => {
                const colors = ["#10b981", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#ef4444", "#84cc16"];
                return (
                  <ConfettiParticle
                    key={i}
                    delay={i * 0.03}
                    x={(i * 100) / 50}
                    color={colors[i % colors.length]}
                  />
                );
              })}
            </div>

            {/* Modal */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.5, opacity: 0, y: 50 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 25,
              }}
              className="relative bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4 z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Success Icon with Animation */}
              <div className="flex justify-center mb-6 relative">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{
                    type: "spring",
                    stiffness: 200,
                    damping: 10,
                    delay: 0.2,
                  }}
                  className="relative"
                >
                  <motion.div
                    className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(16, 185, 129, 0.4)",
                        "0 0 0 20px rgba(16, 185, 129, 0)",
                      ],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{
                        type: "spring",
                        stiffness: 300,
                        damping: 20,
                        delay: 0.4,
                      }}
                    >
                      <CheckCircle2 className="w-12 h-12 text-white" strokeWidth={3} />
                    </motion.div>
                  </motion.div>

                  {/* Sparkles around icon */}
                  {[0, 1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      className="absolute"
                      style={{
                        top: "50%",
                        left: "50%",
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0],
                        x: Math.cos((i * Math.PI * 2) / 4) * 60,
                        y: Math.sin((i * Math.PI * 2) / 4) * 60,
                      }}
                      transition={{
                        duration: 1.5,
                        delay: 0.6 + i * 0.1,
                        repeat: Infinity,
                        repeatDelay: 2,
                      }}
                    >
                      <Sparkles className="w-6 h-6 text-yellow-400" />
                    </motion.div>
                  ))}
                </motion.div>
              </div>

              {/* Title */}
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-3xl font-bold text-gray-900 text-center mb-3"
              >
                {title}
              </motion.h2>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="text-gray-600 text-center mb-6"
              >
                {message}
              </motion.p>

              {/* Loading indicator */}
              {onRedirect && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.7 }}
                  className="flex items-center justify-center space-x-2 text-gray-500"
                >
                  <Loader className="w-5 h-5 animate-spin" />
                  <span className="text-sm">Redirecting...</span>
                </motion.div>
              )}

              {/* Progress bar */}
              {onRedirect && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-4 w-full bg-gray-200 rounded-full h-2 overflow-hidden"
                >
                  <motion.div
                    className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: redirectDelay / 1000, ease: "linear" }}
                  />
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

