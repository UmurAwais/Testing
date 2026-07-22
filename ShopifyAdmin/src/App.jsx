import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import './index.css';
import { ToastProvider } from './ToastContext';
import Sidebar from './Sidebar';
import DashboardPage from './pages/DashboardPage';
import NichesPage from './pages/NichesPage';
import BannersPage from './pages/BannersPage';
import ProductsPage from './pages/ProductsPage';

const PAGE_INFO = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your Ecomlly content' },
  '/niches': { title: 'Niches', subtitle: 'Manage store categories merchants can pick' },
  '/banners': { title: 'Banners', subtitle: 'Manage homepage banners for the wizard' },
  '/products': { title: 'Products', subtitle: 'Manage products available per niche' },
};

function AdminLayout({ counts, onCountChange }) {
  const location = useLocation();
  const info = PAGE_INFO[location.pathname] || { title: 'Admin', subtitle: '' };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(to right, #FAFDF8 50%, #F3F9F1 50%)' }}>
      <Sidebar counts={counts} />

      <div className="ml-[240px] flex flex-col min-h-screen">
        {/* Topbar */}
        <header className="sticky top-0 z-40 bg-ecomlly-bg/95 backdrop-blur-sm border-b border-ecomlly-line px-8 h-[64px] flex items-center justify-between">
          <div>
            <h1 className="font-sans font-extrabold text-[18px] text-ecomlly-text tracking-[-0.02em] leading-tight">
              {info.title}
            </h1>
            {info.subtitle && (
              <p className="text-[12px] text-ecomlly-muted font-sans mt-px">{info.subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-ecomlly-surface border border-ecomlly-line-s rounded-full px-3.5 py-1.5 text-[12px] font-semibold text-ecomlly-v-soft font-sans">
              <div className="w-[7px] h-[7px] rounded-full bg-[#34B073] shadow-[0_0_6px_rgba(52,176,115,0.5)]" />
              Admin Panel
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 px-8 py-7">
          <Routes>
            <Route path="/" element={<DashboardPage />} />
            <Route path="/niches" element={<NichesPage onCountChange={onCountChange} />} />
            <Route path="/banners" element={<BannersPage onCountChange={onCountChange} />} />
            <Route path="/products" element={<ProductsPage onCountChange={onCountChange} />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="px-8 py-4 border-t border-ecomlly-line flex items-center justify-between text-[13px] text-ecomlly-muted font-sans">
          <div className="flex items-center gap-5">
            <a href="#" className="hover:text-ecomlly-text transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ecomlly-text transition-colors">Terms</a>
            <span className="flex items-center gap-1.5">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
              </svg>
              support@ecomlly.com
            </span>
          </div>
          <div>Ecomlly &copy; {new Date().getFullYear()}. All rights reserved.</div>
        </footer>
      </div>
    </div>
  );
}

function App() {
  const [counts, setCounts] = useState({ niches: 0, banners: 0, products: 0 });

  const handleCountChange = (key, value) => {
    setCounts(prev => ({ ...prev, [key]: value }));
  };

  return (
    <BrowserRouter>
      <ToastProvider>
        <AdminLayout counts={counts} onCountChange={handleCountChange} />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
