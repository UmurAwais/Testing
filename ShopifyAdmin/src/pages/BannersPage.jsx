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

function AddBannerModal({ onClose, onAdded, niches }) {
  const toast = useToast();
  const [sourceType, setSourceType] = useState('link'); // 'link' or 'upload'
  const [url, setUrl] = useState('');
  const [fileBase64, setFileBase64] = useState('');
  const [fileName, setFileName] = useState('');
  const [niche, setNiche] = useState('fashion');
  const [linkUrl, setLinkUrl] = useState('');
  const [saving, setSaving] = useState(false);

  const nicheOptions = niches.length > 0
    ? niches
    : Object.entries(NICHES_MAP).map(([id, name]) => ({ id, name }));

  // Handle local file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast('Please select an image file.', 'error');
      return;
    }

    if (file.size > 4 * 1024 * 1024) {
      toast('Image file should be smaller than 4MB.', 'error');
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFileBase64(reader.result);
    };
    reader.onerror = () => {
      toast('Failed to read image file.', 'error');
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const imagePayload = sourceType === 'link' ? url.trim() : fileBase64;
    
    if (!imagePayload) {
      toast(sourceType === 'link' ? 'Please paste an image link.' : 'Please upload an image file.', 'error');
      return;
    }

    setSaving(true);
    const matchingNiche = niches.find(n => n.name?.toLowerCase() === niche.toLowerCase() || n._id === niche);
    const nicheId = matchingNiche?._id;

    if (!nicheId) {
      toast('Failed to resolve niche ID', 'error');
      setSaving(false);
      return;
    }

    const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
    try {
      const res = await fetch(`${apiUrl}/api/niches/${nicheId}/banner`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageUrl: imagePayload
        }),
      });

      if (res.ok) {
        toast('Banner added successfully!', 'success');
        onAdded();
        onClose();
      } else {
        const err = await res.json();
        toast(err.error || 'Failed to add banner', 'error');
      }
    } catch {
      toast('Network error.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full bg-ecomlly-surface border border-ecomlly-line-s rounded-xl text-ecomlly-text font-sans text-sm py-3 px-3.5 outline-none transition-all duration-200 placeholder-[#5c6b62]/55 focus:border-ecomlly-violet focus:bg-ecomlly-surface-2 focus:ring-3 focus:ring-[rgba(47,158,100,0.18)] appearance-none";
  const labelCls = "block text-[13px] font-semibold text-ecomlly-text mb-1.5 tracking-[0.01em]";

  const previewSrc = sourceType === 'link' ? url : fileBase64;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5 animate-fade-in" style={{ background: 'rgba(22,36,28,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="bg-ecomlly-surface rounded-[24px] w-full max-w-[500px] shadow-[0_24px_64px_rgba(0,0,0,0.15)] animate-slide-up p-7" onClick={e => e.stopPropagation()}>
        <h3 className="font-sans font-extrabold text-[20px] text-ecomlly-text tracking-[-0.02em] mb-1">Add New Banner</h3>
        <p className="text-[13px] text-ecomlly-muted mb-5">Create a home banner and link it to a specific niche.</p>
        
        {/* Source Toggle */}
        <div className="flex border border-ecomlly-line rounded-xl p-1 mb-4 bg-ecomlly-bg">
          <button
            type="button"
            onClick={() => setSourceType('link')}
            className={`flex-1 text-center py-2 text-[12px] font-bold rounded-lg transition-all ${sourceType === 'link' ? 'bg-white text-ecomlly-v-soft shadow-sm' : 'text-ecomlly-muted hover:text-ecomlly-text'}`}
          >
            Link Image (URL)
          </button>
          <button
            type="button"
            onClick={() => setSourceType('upload')}
            className={`flex-1 text-center py-2 text-[12px] font-bold rounded-lg transition-all ${sourceType === 'upload' ? 'bg-white text-ecomlly-v-soft shadow-sm' : 'text-ecomlly-muted hover:text-ecomlly-text'}`}
          >
            Upload Image (File)
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Niche Selection */}
          <div className="mb-4">
            <label className={labelCls}>Niche / Category</label>
            <select
              value={niche}
              onChange={e => setNiche(e.target.value)}
              className={inputCls}
            >
              {nicheOptions.map(n => (
                <option key={n.id || n._id} value={n.id || n.name || n._id}>{n.name}</option>
              ))}
            </select>
          </div>

          {/* Link Image (URL) */}
          {sourceType === 'link' && (
            <div className="mb-4">
              <label className={labelCls}>Image Link (URL)</label>
              <input
                type="url"
                value={url}
                onChange={e => setUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo-..."
                required={sourceType === 'link'}
                className={inputCls}
              />
            </div>
          )}

          {/* Upload Image (File) */}
          {sourceType === 'upload' && (
            <div className="mb-4">
              <label className={labelCls}>Select Image File</label>
              <div className="relative border-2 border-dashed border-ecomlly-line-s hover:border-ecomlly-violet rounded-xl p-6 text-center cursor-pointer transition-all bg-ecomlly-bg hover:bg-ecomlly-surface-2">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  required={sourceType === 'upload' && !fileBase64}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <svg className="w-8 h-8 text-ecomlly-muted mx-auto mb-2" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                </svg>
                <span className="text-[12px] font-bold text-ecomlly-text block">
                  {fileName ? fileName : 'Choose image to upload'}
                </span>
                <span className="text-[10px] text-ecomlly-muted block mt-1">PNG, JPG, JPEG up to 4MB</span>
              </div>
            </div>
          )}

          {/* Banner Destination Link */}
          <div className="mb-4">
            <label className={labelCls}>Destination Redirect Link (Optional)</label>
            <input
              type="url"
              value={linkUrl}
              onChange={e => setLinkUrl(e.target.value)}
              placeholder="https://yourstore.com/collections/..."
              className={inputCls}
            />
          </div>

          {/* Live Preview */}
          {previewSrc && (
            <div className="mb-4">
              <div className="text-[13px] font-semibold text-ecomlly-text mb-1.5">Live Preview</div>
              <img
                src={previewSrc}
                alt="Banner preview"
                className="w-full h-[140px] object-cover rounded-xl border border-ecomlly-line bg-ecomlly-bg"
                onError={e => { e.target.style.display = 'none'; }}
              />
            </div>
          )}

          <div className="flex justify-end gap-3 mt-6">
            <GhostBtn onClick={onClose}>Cancel</GhostBtn>
            <PrimaryBtn type="submit" disabled={saving}>
              {saving ? 'Adding...' : 'Add Banner'}
            </PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function BannersPage({ onCountChange }) {
  const toast = useToast();
  const [banners, setBanners] = useState([]);
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const fetchAll = async () => {
    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
    try {
      const res = await fetch(`${apiUrl}/api/niches`);
      const nichesData = await res.json();
      setNiches(nichesData);

      const allBanners = [];
      nichesData.forEach(n => {
        if (n.bannerImages) {
          n.bannerImages.forEach((img, idx) => {
            allBanners.push({
              _id: `${n._id}_${idx}`,
              image: img,
              niche: n.name,
              nicheId: n._id,
              index: idx
            });
          });
        }
      });
      setBanners(allBanners);
      onCountChange?.('banners', allBanners.length);
    } catch {
      toast('Failed to load banners page data', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Remove this banner?')) return;
    setDeleting(id);
    const banner = banners.find(b => b._id === id);
    if (!banner || !banner.nicheId) {
      toast('Could not find banner details.', 'error');
      setDeleting(null);
      return;
    }
    const apiUrl = import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app";
    try {
      const res = await fetch(`${apiUrl}/api/niches/${banner.nicheId}/banner/${banner.index}`, { method: 'DELETE' });
      if (res.ok) {
        toast('Banner removed successfully.', 'success');
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

  const filtered = banners.filter(b => activeFilter === 'all' || b.niche === activeFilter);

  return (
    <div className="max-w-[960px]">
      <div className="bg-ecomlly-surface border border-ecomlly-line rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(31,107,66,0.06)]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-ecomlly-line">
          <div>
            <h2 className="font-sans font-extrabold text-[15px] text-ecomlly-text">Banners</h2>
            <p className="text-[12px] text-ecomlly-muted mt-0.5">{banners.length} banner{banners.length !== 1 ? 's' : ''} available for merchants</p>
          </div>
          <PrimaryBtn onClick={() => setShowModal(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Banner
          </PrimaryBtn>
        </div>

        {/* Niche Filters */}
        <div className="px-6 py-3 border-b border-ecomlly-line flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveFilter('all')}
            className={`text-[12px] font-semibold px-3.5 py-1.5 rounded-full border transition-all duration-200 ${activeFilter === 'all' ? 'bg-gradient-to-b from-[#34B073] to-ecomlly-v-deep text-white border-transparent shadow-[0_4px_12px_rgba(27,107,66,0.25)]' : 'text-ecomlly-muted border-ecomlly-line bg-ecomlly-bg hover:border-ecomlly-line-s hover:text-ecomlly-v-deep'}`}
          >
            All ({banners.length})
          </button>
          {filterNiches.map(n => {
            const count = banners.filter(b => b.niche === n.id).length;
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

        {/* Banners Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-ecomlly-line-s border-t-ecomlly-v-soft animate-spin" />
            <span className="text-ecomlly-muted text-sm">Loading banners...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-ecomlly-surface-2 flex items-center justify-center">
              <svg className="w-7 h-7 text-ecomlly-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="font-sans font-bold text-[15px] text-ecomlly-text">No banners found</h3>
            <p className="text-[13px] text-ecomlly-muted">Add a banner for this niche to get started.</p>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 min-[600px]:grid-cols-2 min-[900px]:grid-cols-3 gap-5">
            {filtered.map((banner, idx) => {
              const nicheCls = NICHE_COLORS[banner.niche] || 'bg-gray-50 text-gray-600 border-gray-200';
              const isBase64 = banner.image.startsWith('data:image/');
              
              return (
                <div key={banner._id} className="bg-ecomlly-bg border border-ecomlly-line rounded-[16px] overflow-hidden hover:border-ecomlly-line-s hover:shadow-[0_6px_20px_rgba(31,107,66,0.08)] transition-all duration-200 group">
                  <div className="relative">
                    <img
                      src={banner.image}
                      alt={`Banner ${idx + 1}`}
                      className="w-full h-[140px] object-cover bg-ecomlly-surface-2"
                      onError={e => {
                        e.target.parentElement.innerHTML = '<div class="w-full h-[140px] bg-ecomlly-surface-2 flex items-center justify-center text-ecomlly-muted text-[12px]">Image unavailable</div>';
                      }}
                    />
                    <div className="absolute top-2 left-2 flex gap-1.5 flex-wrap">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-lg border ${nicheCls} leading-none bg-white/95`}>
                        {NICHES_MAP[banner.niche] || banner.niche}
                      </span>
                      <span className="bg-white/90 text-ecomlly-muted text-[9px] font-bold px-1.5 py-0.5 rounded-lg">
                        {isBase64 ? 'Uploaded' : 'Linked URL'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    {banner.link && (
                      <div className="text-[11px] text-ecomlly-muted truncate mb-2" title={banner.link}>
                        <span className="font-semibold text-ecomlly-text">Redirects: </span>
                        {banner.link}
                      </div>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[12px] text-ecomlly-muted font-medium">Banner #{idx + 1}</span>
                      <DangerBtn onClick={() => handleDelete(banner._id)} disabled={deleting === banner._id}>
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        {deleting === banner._id ? '...' : 'Remove'}
                      </DangerBtn>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showModal && (
        <AddBannerModal
          onClose={() => setShowModal(false)}
          onAdded={handleAdded}
          niches={niches}
        />
      )}
    </div>
  );
}
