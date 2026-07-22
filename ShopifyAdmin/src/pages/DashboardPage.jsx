import React, { useState, useEffect } from 'react';
import { useToast } from '../ToastContext';

const API = (import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app") + "/api/niches";

const NICHES_MAP = {
  fashion: 'Clothing & Accessories',
  pets: 'Pet Supplies',
  electronics: 'Gadgets & Tech',
  home: 'Home Decor',
  sport: 'Fitness & Outdoors',
  not_sure: 'Not Sure Yet',
};

function StatCard({ icon, label, value, gradient, loading }) {
  return (
    <div className="bg-ecomlly-surface border border-ecomlly-line rounded-[20px] p-5 shadow-[0_2px_12px_rgba(31,107,66,0.06)] flex items-center gap-4 hover:shadow-[0_8px_24px_rgba(31,107,66,0.1)] hover:-translate-y-0.5 transition-all duration-200">
      <div className={`w-[50px] h-[50px] rounded-[14px] flex items-center justify-center flex-none ${gradient}`}>
        {icon}
      </div>
      <div>
        <div className="font-sans font-extrabold text-[28px] leading-none text-ecomlly-text tracking-[-0.03em]">
          {loading ? (
            <span className="inline-block w-8 h-6 bg-ecomlly-line rounded animate-pulse" />
          ) : value}
        </div>
        <div className="font-sans text-[13px] text-ecomlly-muted mt-1 font-medium">{label}</div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const toast = useToast();
  const [stats, setStats] = useState({ niches: 0, banners: 0, products: 0 });
  const [recentProducts, setRecentProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
      try {
        const res = await fetch(`${apiUrl}/api/niches`);
        const niches = await res.json();
        
        let productsCount = 0;
        let bannersCount = 0;
        const allProducts = [];
        
        niches.forEach(n => {
          if (n.products) {
            productsCount += n.products.length;
            n.products.forEach(p => {
              allProducts.push({
                _id: p._id,
                title: p.name,
                price: p.price,
                image: p.imageUrl || p.imageUrls?.[0] || '',
                niche: n.name
              });
            });
          }
          if (n.bannerImages) {
            bannersCount += n.bannerImages.length;
          }
        });
        
        setStats({ niches: niches.length, banners: bannersCount, products: productsCount });
        setRecentProducts(allProducts.slice(-6).reverse());
      } catch {
        toast('Failed to load dashboard data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const quickLinks = [
    {
      to: '/niches',
      emoji: '🏷️',
      title: 'Manage Niches',
      desc: 'Add or remove store categories that merchants can choose from during wizard setup.',
    },
    {
      to: '/banners',
      emoji: '🖼️',
      title: 'Upload Banners',
      desc: 'Add homepage banner images. Merchants select one during their store wizard.',
    },
    {
      to: '/products',
      emoji: '📦',
      title: 'Add Products',
      desc: 'Add products per niche that merchants can import into their Shopify store.',
    },
  ];

  return (
    <div className="max-w-[1100px]">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-4 gap-4 mb-7">
        <StatCard
          loading={loading}
          value={stats.niches}
          label="Active Niches"
          gradient="bg-gradient-to-br from-[#E8F7F0] to-[#C3E8D5]"
          icon={
            <svg className="w-6 h-6 text-ecomlly-v-soft" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
          }
        />
        <StatCard
          loading={loading}
          value={stats.banners}
          label="Homepage Banners"
          gradient="bg-gradient-to-br from-[#EFF6FF] to-[#BFDBFE]"
          icon={
            <svg className="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          }
        />
        <StatCard
          loading={loading}
          value={stats.products}
          label="Available Products"
          gradient="bg-gradient-to-br from-[#F5F3FF] to-[#DDD6FE]"
          icon={
            <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          }
        />
        <StatCard
          loading={loading}
          value="Live"
          label="System Status"
          gradient="bg-gradient-to-br from-[#FFF7ED] to-[#FED7AA]"
          icon={
            <svg className="w-6 h-6 text-orange-500" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
        />
      </div>

      {/* Two column layout */}
      <div className="grid grid-cols-1 min-[900px]:grid-cols-[1fr_340px] gap-6">
        {/* Recent Products Table */}
        <div className="bg-ecomlly-surface border border-ecomlly-line rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(31,107,66,0.06)]">
          <div className="flex items-center justify-between px-6 py-4 border-b border-ecomlly-line">
            <div>
              <h2 className="font-sans font-extrabold text-[15px] text-ecomlly-text">Recently Added Products</h2>
              <p className="text-[12px] text-ecomlly-muted mt-0.5">Latest products added to the catalog</p>
            </div>
            <a
              href="/products"
              className="text-[13px] font-semibold text-ecomlly-v-soft hover:text-ecomlly-v-deep transition-colors"
            >
              View all →
            </a>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <div className="w-6 h-6 rounded-full border-2 border-ecomlly-line-s border-t-ecomlly-v-soft animate-spin" />
              <span className="text-ecomlly-muted text-sm">Loading...</span>
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-ecomlly-surface-2 flex items-center justify-center">
                <svg className="w-6 h-6 text-ecomlly-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="font-sans font-bold text-[15px] text-ecomlly-text">No products yet</h3>
              <p className="text-[13px] text-ecomlly-muted max-w-[220px]">Go to the Products page to add your first product.</p>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ecomlly-bg">
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-ecomlly-muted uppercase tracking-[0.06em]">Product</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-ecomlly-muted uppercase tracking-[0.06em]">Niche</th>
                  <th className="text-left px-6 py-3 text-[11px] font-semibold text-ecomlly-muted uppercase tracking-[0.06em]">Price</th>
                </tr>
              </thead>
              <tbody>
                {recentProducts.map((product, i) => (
                  <tr key={product._id} className={`border-t border-ecomlly-line hover:bg-ecomlly-bg transition-colors`}>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-10 h-10 rounded-xl object-cover border border-ecomlly-line flex-none bg-ecomlly-bg"
                          onError={e => { e.target.style.background = '#EDF7EC'; e.target.src = ''; }}
                        />
                        <span className="font-semibold text-ecomlly-text text-[13px] leading-tight">{product.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[11px] font-semibold text-ecomlly-v-deep bg-ecomlly-surface-2 border border-ecomlly-line-s px-2.5 py-1 rounded-full">
                        {NICHES_MAP[product.niche] || product.niche}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="font-extrabold text-[13px] text-ecomlly-v-soft">{product.price}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Links */}
        <div className="flex flex-col gap-4">
          <div className="bg-ecomlly-surface border border-ecomlly-line rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(31,107,66,0.06)]">
            <div className="px-5 py-4 border-b border-ecomlly-line">
              <h2 className="font-sans font-extrabold text-[15px] text-ecomlly-text">Quick Actions</h2>
            </div>
            <div className="p-4 flex flex-col gap-3">
              {quickLinks.map(link => (
                <a
                  key={link.to}
                  href={link.to}
                  className="flex items-start gap-3 p-3.5 rounded-[14px] bg-ecomlly-bg border border-ecomlly-line hover:bg-ecomlly-surface-2 hover:border-ecomlly-line-s transition-all duration-200 group"
                >
                  <span className="text-2xl flex-none mt-0.5">{link.emoji}</span>
                  <div>
                    <div className="font-sans font-bold text-[13px] text-ecomlly-text group-hover:text-ecomlly-v-deep transition-colors">{link.title}</div>
                    <div className="text-[12px] text-ecomlly-muted leading-relaxed mt-0.5">{link.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>

          {/* Info Card */}
          <div className="bg-gradient-to-br from-[#34B073] to-ecomlly-v-deep rounded-[20px] p-5 shadow-[0_8px_24px_rgba(27,107,66,0.2)]">
            <div className="text-white font-sans font-extrabold text-[15px] mb-1">Ecomlly Admin</div>
            <p className="text-white/75 text-[12px] leading-relaxed mb-4">
              Changes you make here update the wizard instantly for all new merchants.
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-white/60 shadow-[0_0_6px_rgba(255,255,255,0.6)]" />
              <span className="text-white/80 text-[12px] font-medium">Backend Connected · {new URL(API).hostname}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
