// src/Component/Google.tsx
import { useRef, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface GoogleLoginProps {
  onSuccess?: () => void;
  onError?: (error: string) => void;
  isLogin?: boolean;
}

export default function Google({ onSuccess, onError, isLogin = false }: GoogleLoginProps) {
  const navigate = useNavigate();
  const googleLoginRef = useRef<HTMLDivElement>(null);

  // Get API URL from environment variable, fallback to production URL
  const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly.vercel.app";

  const handleSuccess = async (credentialResponse: any) => {
    if (credentialResponse.credential) {
      try {
        const details: any = jwtDecode(credentialResponse.credential);
        console.log("Google user details:", details);

        // Prepare payload for backend
        const payload = {
          email: details.email,
          name: details.name,
          picture: details.picture,
          sub: details.sub,
          token: credentialResponse.credential, // raw JWT
        };

        const res = await fetch(`${apiUrl}/google`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }

        const data = await res.json();
        console.log("Backend response:", data);
        console.log("User email from backend:", data.email);

        // Ensure email is present
        if (!data.email) {
          throw new Error("Email not received from server");
        }

        // Save user in localStorage with isAuthenticated flag
        const userData = {
          ...data,
          isAuthenticated: true,
        };

        console.log("Saving to localStorage:", userData);
        localStorage.setItem("user", JSON.stringify(userData));

        // Also save email separately (used in other parts of the app)
        localStorage.setItem("userEmail", data.email);

        // Verify what was saved
        const saved = localStorage.getItem("user");
        const savedEmail = localStorage.getItem("userEmail");
        console.log("✅ Saved to localStorage - user:", saved);
        console.log("✅ Saved to localStorage - userEmail:", savedEmail);

        // Call optional onSuccess callback
        if (onSuccess) {
          onSuccess();
        }

        // Navigate to niche page
        navigate("/niche");

        // Reload to ensure state is updated
        window.location.reload();

      } catch (err: any) {
        console.error("Error saving user:", err);
        const errorMessage = err.message || "Failed to authenticate with Google";

        // Call optional onError callback
        if (onError) {
          onError(errorMessage);
        } else {
          alert(errorMessage);
        }
      }
    }
  };

  // Use useEffect to ensure the button is available after render
  // This is especially important in production where GoogleLogin might take longer to initialize
  useEffect(() => {
    // Ensure the GoogleLogin component is rendered
    const container = googleLoginRef.current;
    if (container) {
      let checkCount = 0;
      const maxChecks = 50; // Check for up to 5 seconds (50 * 100ms)

      // Force a re-render to ensure GoogleLogin initializes
      const checkForButton = setInterval(() => {
        checkCount++;
        const googleButton = container.querySelector('button') ||
          container.querySelector('div[role="button"]') ||
          container.querySelector('[role="button"]');

        if (googleButton) {
          console.log("✅ Google login button initialized successfully");
          clearInterval(checkForButton);
        } else if (checkCount >= maxChecks) {
          console.warn("⚠️ Google login button not found after initialization period");
          clearInterval(checkForButton);
        }
      }, 100);

      return () => clearInterval(checkForButton);
    }
  }, []);

  const handleCustomButtonClick = () => {
    // Retry mechanism for production builds where GoogleLogin might take longer to initialize
    let retryCount = 0;
    const maxRetries = 10;
    const retryDelay = 200; // Start with 200ms, increase with each retry

    const tryClickButton = () => {
      const container = googleLoginRef.current;
      if (!container) {
        if (retryCount < maxRetries) {
          retryCount++;
          setTimeout(tryClickButton, retryDelay * retryCount);
          return;
        } else {
          console.error("Container not found");
          if (onError) {
            onError("Google login not initialized. Please refresh and try again.");
          }
          return;
        }
      }

      // Try multiple strategies to find the Google button
      // Strategy 1: Direct button search
      let googleButton: HTMLElement | null = container.querySelector('button');

      // Strategy 2: Search for div with role="button"
      if (!googleButton) {
        googleButton = container.querySelector('div[role="button"]') as HTMLElement;
      }

      // Strategy 3: Search recursively through all children
      if (!googleButton) {
        const allButtons = container.querySelectorAll('button, div[role="button"], [role="button"]');
        googleButton = (allButtons[0] as HTMLElement) || null;
      }

      // Strategy 4: Search for any clickable element
      if (!googleButton) {
        const clickableElements = container.querySelectorAll('button, [onclick], [role="button"], a');
        for (let i = 0; i < clickableElements.length; i++) {
          const el = clickableElements[i] as HTMLElement;
          // Check if it's a Google button by looking for common Google button attributes
          if (el.getAttribute('id')?.includes('google') ||
            el.getAttribute('class')?.includes('google') ||
            el.getAttribute('aria-label')?.toLowerCase().includes('google') ||
            el.textContent?.toLowerCase().includes('google') ||
            el.textContent?.toLowerCase().includes('sign in')) {
            googleButton = el;
            break;
          }
        }
      }

      // Strategy 5: Find any button in the container (last resort)
      if (!googleButton) {
        const allButtons = container.getElementsByTagName('button');
        googleButton = (allButtons[0] as HTMLElement) || null;
      }

      if (googleButton) {
        try {
          // Try to click the button
          if (googleButton.tagName === 'BUTTON' || googleButton.getAttribute('role') === 'button') {
            (googleButton as HTMLElement).click();
            console.log("✅ Successfully triggered Google login button");
          } else {
            // Create a synthetic click event
            const clickEvent = new MouseEvent('click', {
              bubbles: true,
              cancelable: true,
              view: window
            });
            googleButton.dispatchEvent(clickEvent);
            console.log("✅ Successfully triggered Google login via synthetic event");
          }
        } catch (err) {
          console.error("Error clicking button:", err);
          if (retryCount < maxRetries) {
            retryCount++;
            setTimeout(tryClickButton, retryDelay * retryCount);
          } else {
            if (onError) {
              onError("Failed to trigger Google login. Please try again.");
            }
          }
        }
      } else {
        // Button not found, retry
        if (retryCount < maxRetries) {
          retryCount++;
          console.log(`Retrying to find Google button (attempt ${retryCount}/${maxRetries})...`);
          setTimeout(tryClickButton, retryDelay * retryCount);
        } else {
          console.error("Could not find Google login button after", maxRetries, "attempts");
          console.log("Container HTML:", container.innerHTML.substring(0, 500));
          if (onError) {
            onError("Google login button not found. Please refresh the page and try again.");
          }
        }
      }
    };

    // Start the retry process
    tryClickButton();
  };

  return (
    <div className="w-full relative" style={{ minHeight: '48px', height: 'auto' }}>
      {/* GoogleLogin component - rendered normally but will be covered by our custom button */}
      {/* Use visibility: hidden instead of opacity: 0 to allow Google to initialize properly */}
      <div
        ref={googleLoginRef}
        className="absolute inset-0 z-0"
        style={{
          width: '100%',
          minHeight: '48px',
          visibility: 'hidden' as const, // Hidden but still takes space and allows initialization
          position: 'absolute',
          top: 0,
          left: 0
        }}
      >
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => {
            const errorMessage = "Google Login Failed";
            console.log(errorMessage);

            // Call optional onError callback
            if (onError) {
              onError(errorMessage);
            }
          }}
        />
      </div>

      {/* Custom styled Google Sign-in button matching the image - positioned on top */}
      <button
        type="button"
        onClick={handleCustomButtonClick}
        className="absolute inset-0 z-10 w-full bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl py-3 px-4 flex items-center justify-center space-x-3 transition-colors duration-200 cursor-pointer"
        style={{ minHeight: '48px' }}
      >
        {/* Google "G" Logo - multicolored */}
        <div className="relative w-6 h-6 flex-shrink-0">
          <svg viewBox="0 0 24 24" className="w-6 h-6">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
        </div>

        {/* Text */}
        <span className="text-white font-semibold text-sm">
          {isLogin ? "Sign in with Google" : "Sign up with Google"}
        </span>
      </button>
    </div>
  );
}
