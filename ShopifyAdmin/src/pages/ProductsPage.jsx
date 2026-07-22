import React, { useState, useEffect } from 'react';
import { useToast } from '../ToastContext';

const API = (import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app") + "/api/niches";

const NICHES_MAP = {
  fashion: 'Clothing & Accessories',
  pets: 'Pet Supplies',
  electronics: 'Gadgets & Tech',
  home: 'Home Decor',
  sport: 'Fitness & Outdoors',
  not_sure: "Not Sure Yet",
};

const NICHE_COLORS = {
  fashion: 'bg-purple-50 text-purple-700 border-purple-200',
  pets: 'bg-orange-50 text-orange-700 border-orange-200',
  electronics: 'bg-blue-50 text-blue-700 border-blue-200',
  home: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  sport: 'bg-green-50 text-green-700 border-green-200',
  not_sure: 'bg-gray-50 text-gray-600 border-gray-200',
};

function PrimaryBtn({ children, onClick, type = 'button', disabled }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center gap-2 bg-gradient-to-b from-[#34B073] to-ecomlly-v-deep text-white font-sans font-bold text-[14px] py-2.5 px-5 rounded-xl border-none shadow-[0_8px_20px_-6px_rgba(27,107,66,0.35)] transition-all duration-200 ${disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_12px_28px_-8px_rgba(27,107,66,0.45)]'}`}
    >
      {children}
    </button>
  );
}

function GhostBtn({ children, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex items-center gap-2 bg-ecomlly-surface border border-ecomlly-line-s rounded-xl text-ecomlly-muted font-sans font-semibold text-[14px] py-2.5 px-5 cursor-pointer transition-all duration-200 hover:bg-ecomlly-surface-2 hover:text-ecomlly-v-deep">
      {children}
    </button>
  );
}

function DangerBtn({ children, onClick, disabled }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 font-sans font-semibold text-[12px] py-1.5 px-3 rounded-xl transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-red-100'}`}>
      {children}
    </button>
  );
}

function AddProductModal({ onClose, onAdded, niches }) {
  const toast = useToast();
  const [form, setForm] = useState({ title: '', price: '', image: '', niche: 'fashion' });
  const [saving, setSaving] = useState(false);

  const nicheOptions = niches.length > 0
    ? niches
    : Object.entries(NICHES_MAP).map(([id, name]) => ({ id, name }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.image || !form.niche) return;
    setSaving(true);
    
    const matchingNiche = niches.find(n => n.name?.toLowerCase() === form.niche.toLowerCase() || n._id === form.niche);
    const nicheId = matchingNiche?._id;

    if (!nicheId) {
      toast('Failed to resolve niche ID', 'error');
      setSaving(false);
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
    try {
      const res = await fetch(`${apiUrl}/api/niches/${nicheId}/product`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.title,
          price: Number(form.price) || 0,
          imageUrl: form.image,
          description: 'Trending product added from admin panel.'
        }),
      });
      if (res.ok) {
        toast('Product added!', 'success');
        onAdded();
        onClose();
      } else {
        const err = await res.json();
        toast(err.error || 'Failed to add product', 'error');
      }
    } catch {
      toast('Network error.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-ecomlly-surface border border-ecomlly-line-s rounded-xl text-ecomlly-text font-sans text-sm py-3 px-3.5 outline-none transition-all duration-200 placeholder-[#5c6b62]/55 focus:border-ecomlly-violet focus:bg-ecomlly-surface-2 focus:ring-3 focus:ring-[rgba(47,158,100,0.18)] appearance-none";
  const labelCls = "block text-[13px] font-semibold text-ecomlly-text mb-1.5 tracking-[0.01em]";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5 animate-fade-in" style={{ background: 'rgba(22,36,28,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="bg-ecomlly-surface rounded-[24px] w-full max-w-[500px] shadow-[0_24px_64px_rgba(0,0,0,0.15)] animate-slide-up p-7" onClick={e => e.stopPropagation()}>
        <h3 className="font-sans font-extrabold text-[20px] text-ecomlly-text tracking-[-0.02em] mb-1">Add New Product</h3>
        <p className="text-[13px] text-ecomlly-muted mb-5">Add a product merchants can import into their Shopify store.</p>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className={labelCls}>Product Title</label>
            <input id="product-title" className={inputCls} placeholder="e.g. Minimalist Leather Backpack" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
          </div>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div>
              <label className={labelCls}>Price</label>
              <input id="product-price" className={inputCls} placeholder="$79.99" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} required />
            </div>
            <div>
              <label className={labelCls}>Niche</label>
              <select id="product-niche" className={inputCls} value={form.niche} onChange={e => setForm(f => ({ ...f, niche: e.target.value }))}>
                {nicheOptions.map(n => (
                  <option key={n.id || n._id} value={n.id || n.name || n._id}>{n.name}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className={labelCls}>Image URL</label>
            <input id="product-image" className={inputCls} placeholder="https://images.unsplash.com/..." value={form.image} onChange={e => setForm(f => ({ ...f, image: e.target.value }))} required />
          </div>
          {form.image && (
            <div className="mb-4 flex items-center gap-3 p-3 bg-ecomlly-bg border border-ecomlly-line rounded-xl">
              <img src={form.image} alt="Preview" className="w-14 h-14 object-cover rounded-xl border border-ecomlly-line flex-none bg-ecomlly-surface" onError={e => e.target.style.display = 'none'} />
              <span className="text-[12px] text-ecomlly-muted">Image preview</span>
            </div>
          )}
          <div className="flex justify-end gap-3 mt-6">
            <GhostBtn onClick={onClose}>Cancel</GhostBtn>
            <PrimaryBtn type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add Product'}</PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function ProductsPage({ onCountChange }) {
  const toast = useToast();
  const [products, setProducts] = useState([]);
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [search, setSearch] = useState('');

  const fetchAll = async () => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
    try {
      const res = await fetch(`${apiUrl}/api/niches`);
      const nicheData = await res.json();
      setNiches(nicheData);

      const allProds = [];
      nicheData.forEach(n => {
        if (n.products) {
          n.products.forEach(p => {
            allProds.push({
              ...p,
              _id: p._id,
              title: p.name,
              price: p.price,
              description: p.description || '',
              image: p.imageUrl || p.imageUrls?.[0] || '',
              niche: n.name,
              nicheId: n._id
            });
          });
        }
      });
      setProducts(allProds);
      onCountChange?.('products', allProds.length);
    } catch {
      toast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this product?')) return;
    setDeleting(id);
    const product = products.find(p => p._id === id);
    if (!product || !product.nicheId) {
      toast('Could not find product niche.', 'error');
      setDeleting(null);
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
    try {
      const res = await fetch(`${apiUrl}/api/niches/${product.nicheId}/product/${product._id}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Product removed.', 'success');
        fetchAll();
      } else {
        toast('Failed to delete.', 'error');
      }
    } catch {
      toast('Network error.', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleAdded = () => {
    fetchAll();
  };

  const filterNiches = niches.length > 0
    ? niches.map(n => ({ id: n.id, name: n.name }))
    : Object.entries(NICHES_MAP).map(([id, name]) => ({ id, name }));

  const filtered = products.filter(p => {
    const matchesNiche = activeFilter === 'all' || p.niche === activeFilter;
    const matchesSearch = !search || p.title.toLowerCase().includes(search.toLowerCase());
    return matchesNiche && matchesSearch;
  });

  return (
    <div className="max-w-[1100px]">
      <div className="bg-ecomlly-surface border border-ecomlly-line rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(31,107,66,0.06)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ecomlly-line flex-wrap gap-3">
          <div>
            <h2 className="font-sans font-extrabold text-[15px] text-ecomlly-text">Products</h2>
            <p className="text-[12px] text-ecomlly-muted mt-0.5">{products.length} product{products.length !== 1 ? 's' : ''} across all niches</p>
          </div>
          <div className="flex items-center gap-3 flex-wrap">
            {/* Search */}
            <div className="relative">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ecomlly-muted pointer-events-none" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                id="product-search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search products..."
                className="bg-ecomlly-bg border border-ecomlly-line rounded-xl text-ecomlly-text font-sans text-[13px] py-2.5 pl-9 pr-3.5 w-[200px] outline-none transition-all focus:border-ecomlly-line-s focus:bg-ecomlly-surface focus:ring-2 focus:ring-[rgba(47,158,100,0.1)]"
              />
            </div>
            <PrimaryBtn onClick={() => setShowModal(true)}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
              </svg>
              Add Product
            </PrimaryBtn>
          </div>
        </div>

        {/* Filter chips */}
        <div className="px-6 py-3 border-b border-ecomlly-line flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 ${activeFilter === 'all' ? 'bg-gradient-to-b from-[#34B073] to-ecomlly-v-deep text-white border-transparent shadow-[0_4px_12px_rgba(27,107,66,0.25)]' : 'text-ecomlly-muted border-ecomlly-line bg-ecomlly-bg hover:border-ecomlly-line-s hover:text-ecomlly-v-deep'}`}
          >
            All ({products.length})
          </button>
          {filterNiches.map(n => {
            const count = products.filter(p => p.niche === n.id).length;
            return (
              <button
                key={n.id}
                onClick={() => setActiveFilter(n.id)}
                className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 ${activeFilter === n.id ? 'bg-gradient-to-b from-[#34B073] to-ecomlly-v-deep text-white border-transparent shadow-[0_4px_12px_rgba(27,107,66,0.25)]' : 'text-ecomlly-muted border-ecomlly-line bg-ecomlly-bg hover:border-ecomlly-line-s hover:text-ecomlly-v-deep'}`}
              >
                {n.name} ({count})
              </button>
            );
          })}
        </div>

        {/* Product grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-ecomlly-line-s border-t-ecomlly-v-soft animate-spin" />
            <span className="text-ecomlly-muted text-sm">Loading products...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-ecomlly-surface-2 flex items-center justify-center">
              <svg className="w-7 h-7 text-ecomlly-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="font-sans font-bold text-[15px] text-ecomlly-text">{search ? 'No results found' : 'No products yet'}</h3>
            <p className="text-[13px] text-ecomlly-muted max-w-[200px]">{search ? 'Try a different search term.' : 'Add your first product to get started.'}</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-2 min-[600px]:grid-cols-3 min-[800px]:grid-cols-4 min-[1000px]:grid-cols-5 gap-4">
            {filtered.map(product => {
              const nicheCls = NICHE_COLORS[product.niche] || 'bg-gray-50 text-gray-600 border-gray-200';
              return (
                <div
                  key={product._id}
                  className="bg-ecomlly-bg border border-ecomlly-line rounded-[16px] overflow-hidden hover:border-ecomlly-line-s hover:shadow-[0_6px_20px_rgba(31,107,66,0.1)] hover:-translate-y-0.5 transition-all duration-200 group"
                >
                  <div className="relative">
                    <img
                      src={product.image}
                      alt={product.title}
                      className="w-full aspect-square object-cover bg-ecomlly-surface"
                      onError={e => { e.target.style.background = '#EDF7EC'; e.target.src = ''; }}
                    />
                    <div className="absolute top-2 left-2">
                      <span className={`text-[9px] font-bold px-2 py-1 rounded-lg border ${nicheCls} leading-none`}>
                        {NICHES_MAP[product.niche] || product.niche}
                      </span>
                    </div>
                  </div>
                  <div className="p-2.5">
                    <div className="font-sans font-bold text-[12px] text-ecomlly-text leading-tight line-clamp-2 mb-1" title={product.title}>
                      {product.title}
                    </div>
                    <div className="font-extrabold text-[13px] text-ecomlly-v-soft mb-2">{product.price}</div>
                    <DangerBtn onClick={() => handleDelete(product._id)} disabled={deleting === product._id}>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      {deleting === product._id ? '...' : 'Remove'}
                    </DangerBtn>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <AddProductModal
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
          niches={niches}
        />
      )}
    </div>
  );
}
