import React, { createContext, useContext, useState, useCallback } from 'react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3500);
  }, []);

  return (
    <ToastContext.Provider value={addToast}>
      {children}
      {/* Toast container */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-3">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`animate-slide-in-right flex items-center gap-3 px-4 py-3 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.12)] font-sans text-sm font-semibold min-w-[280px] border ${
              t.type === 'success'
                ? 'bg-ecomlly-surface border-ecomlly-line-s text-ecomlly-v-deep'
                : 'bg-white border-red-200 text-red-700'
            }`}
          >
            {t.type === 'success' ? (
              <svg className="w-5 h-5 text-ecomlly-violet flex-none" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 text-red-500 flex-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
