import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { GoogleOAuthProvider } from "@react-oauth/google";

// The Client ID from your Google Cloud Console screenshot
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "725672156674-lnbadh5nfgk2896iem3ultmf9ck3fjqb.apps.googleusercontent.com";

console.log("Google Client ID active:", googleClientId);

if (!googleClientId) {
  console.error("Google Client ID is missing!");
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GoogleOAuthProvider clientId={googleClientId}>
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);
