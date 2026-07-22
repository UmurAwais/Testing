import React from 'react';
import { NavLink } from 'react-router-dom';

const navItems = [
  {
    to: '/',
    label: 'Dashboard',
    icon: (
      <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </svg>
    ),
  },
  {
    to: '/niches',
    label: 'Niches',
    icon: (
      <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h6M7 17h8" />
      </svg>
    ),
  },
  {
    to: '/banners',
    label: 'Banners',
    icon: (
      <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 15l4-4 3 3 4-5 4 6" />
      </svg>
    ),
  },
  {
    to: '/products',
    label: 'Products',
    icon: (
      <svg className="w-4 h-4 flex-none" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
      </svg>
    ),
  },
];

export default function Sidebar({ counts }) {
  const countMap = {
    '/niches': counts?.niches,
    '/banners': counts?.banners,
    '/products': counts?.products,
  };

  return (
    <aside className="fixed top-0 left-0 h-screen w-[220px] bg-ecomlly-surface border-r border-ecomlly-line flex flex-col z-50">

      {/* Logo */}
      <div className="px-5 pt-6 pb-5">
        <a href="/" className="inline-flex items-center gap-0 font-sans font-extrabold text-[22px] tracking-[-0.03em] text-ecomlly-text leading-none">
          eCom<span className="text-ecomlly-v-soft">elly</span>
        </a>
        <p className="text-[10px] text-ecomlly-muted font-medium mt-1 tracking-[0.06em] uppercase">Admin</p>
      </div>

      {/* Divider */}
      <div className="mx-4 h-px bg-ecomlly-line" />

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-2.5 px-3 py-2.5 rounded-lg font-sans text-[13px] font-medium mb-px transition-all duration-150 ${
                isActive
                  ? 'bg-ecomlly-surface-2 text-ecomlly-v-deep font-semibold'
                  : 'text-ecomlly-muted hover:bg-ecomlly-bg hover:text-ecomlly-text'
              }`
            }
          >
            {item.icon}
            <span className="flex-1">{item.label}</span>
            {countMap[item.to] !== undefined && countMap[item.to] > 0 && (
              <span className="text-[10px] font-bold text-ecomlly-muted tabular-nums">
                {countMap[item.to]}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4 border-t border-ecomlly-line">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-[#34B073]" />
          <span className="text-[11px] text-ecomlly-muted">Connected to backend</span>
        </div>
      </div>
    </aside>
  );
}
