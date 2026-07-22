import React, { useState, useEffect } from 'react';
import { useToast } from '../ToastContext';

const API = (import.meta.env.VITE_API_URL || "https://ecomlly-nu.vercel.app") + "/api";

const nicheIcons = {
  Shirt: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v3m0 0a3 3 0 00-3 3v1m6-4a3 3 0 01-3 3v1m0 0H7.5A2.5 2.5 0 005 11.5V19a2 2 0 002 2h10a2 2 0 002-2v-7.5a2.5 2.5 0 00-2.5-2.5H12" />
    </svg>
  ),
  Paw: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 14a3 3 0 100-6 3 3 0 000 6zM6 8a2 2 0 100-4 2 2 0 000 4zM18 8a2 2 0 100-4 2 2 0 000 4zM4 14a2.5 2.5 0 100-5 2.5 2.5 0 000 5zM20 14a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" />
    </svg>
  ),
  Cpu: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 3H6a2 2 0 00-2 2v3m0 6v3a2 2 0 002 2h3m6 0h3a2 2 0 002-2v-3m0-6V5a2 2 0 00-2-2h-3M9 9h6v6H9V9z" />
    </svg>
  ),
  Home: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Activity: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  ),
  HelpCircle: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

function Modal({ title, subtitle, onClose, children }) {
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5 animate-fade-in" style={{ background: 'rgba(22,36,28,0.45)', backdropFilter: 'blur(4px)' }}>
      <div className="bg-ecomlly-surface rounded-[24px] w-full max-w-[440px] shadow-[0_24px_64px_rgba(0,0,0,0.15)] animate-slide-up p-7" onClick={e => e.stopPropagation()}>
        <h3 className="font-sans font-extrabold text-[20px] text-ecomlly-text tracking-[-0.02em] mb-1">{title}</h3>
        {subtitle && <p className="text-[13px] text-ecomlly-muted mb-5">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}

function FormInput({ label, id, placeholder, value, onChange, required, type = 'text' }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-[13px] font-semibold text-ecomlly-text mb-1.5 tracking-[0.01em]">
        {label}
      </label>
      <input
        type={type}
        id={id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full bg-ecomlly-surface border border-ecomlly-line-s rounded-xl text-ecomlly-text font-sans text-sm py-3 px-3.5 outline-none transition-all duration-200 placeholder-[#5c6b62]/55 focus:border-ecomlly-violet focus:bg-ecomlly-surface-2 focus:ring-3 focus:ring-[rgba(47,158,100,0.18)]"
      />
    </div>
  );
}

function FormSelect({ label, id, value, onChange, children }) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block text-[13px] font-semibold text-ecomlly-text mb-1.5 tracking-[0.01em]">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={onChange}
        className="w-full bg-ecomlly-surface border border-ecomlly-line-s rounded-xl text-ecomlly-text font-sans text-sm py-3 px-3.5 outline-none transition-all duration-200 focus:border-ecomlly-violet focus:bg-ecomlly-surface-2 focus:ring-3 focus:ring-[rgba(47,158,100,0.18)] appearance-none"
      >
        {children}
      </select>
    </div>
  );
}

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
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-2 bg-ecomlly-surface border border-ecomlly-line-s rounded-xl text-ecomlly-muted font-sans font-semibold text-[14px] py-2.5 px-5 cursor-pointer transition-all duration-200 hover:bg-ecomlly-surface-2 hover:border-ecomlly-line-s hover:text-ecomlly-v-deep"
    >
      {children}
    </button>
  );
}

function DangerBtn({ children, onClick, disabled }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-1.5 bg-red-50 border border-red-200 text-red-600 font-sans font-semibold text-[12px] py-1.5 px-3 rounded-xl transition-all duration-200 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-red-100 hover:border-red-300'}`}
    >
      {children}
    </button>
  );
}

function AddNicheModal({ onClose, onAdded }) {
  const toast = useToast();
  const [form, setForm] = useState({ id: '', name: '', icon: 'Shirt', description: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.id || !form.name || !form.description) return;
    setSaving(true);
    try {
      const res = await fetch(`${API}/niches`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        const data = await res.json();
        toast('Niche added successfully!', 'success');
        onAdded(data);
        onClose();
      } else {
        const err = await res.json();
        toast(err.error || 'Failed to add niche', 'error');
      }
    } catch {
      toast('Network error. Check backend is running.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-5 animate-fade-in" style={{ background: 'rgba(22,36,28,0.45)', backdropFilter: 'blur(4px)' }} onClick={onClose}>
      <div className="bg-ecomlly-surface rounded-[24px] w-full max-w-[440px] shadow-[0_24px_64px_rgba(0,0,0,0.15)] animate-slide-up p-7" onClick={e => e.stopPropagation()}>
        <h3 className="font-sans font-extrabold text-[20px] text-ecomlly-text tracking-[-0.02em] mb-1">Add New Niche</h3>
        <p className="text-[13px] text-ecomlly-muted mb-5">Create a store category merchants can select in the wizard.</p>
        <form onSubmit={handleSubmit}>
          <FormInput label="Niche ID (slug)" id="niche-id" placeholder="e.g. fashion" value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value.toLowerCase().replace(/\s+/g, '_') }))} required />
          <FormInput label="Display Name" id="niche-name" placeholder="e.g. Clothing & Accessories" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} required />
          <FormSelect label="Icon" id="niche-icon" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))}>
            <option value="Shirt">👕 Shirt (Fashion)</option>
            <option value="Paw">🐾 Paw (Pets)</option>
            <option value="Cpu">💻 CPU (Electronics)</option>
            <option value="Home">🏠 Home (Decor)</option>
            <option value="Activity">🏃 Activity (Fitness)</option>
            <option value="HelpCircle">❓ Help Circle (Not Sure)</option>
          </FormSelect>
          <FormInput label="Description" id="niche-desc" placeholder="Brief description of this niche..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} required />
          <div className="flex justify-end gap-3 mt-6">
            <GhostBtn onClick={onClose}>Cancel</GhostBtn>
            <PrimaryBtn type="submit" disabled={saving}>{saving ? 'Adding...' : 'Add Niche'}</PrimaryBtn>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function NichesPage({ onCountChange }) {
  const toast = useToast();
  const [niches, setNiches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState(null);

  const fetchNiches = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/niches`);
      const data = await res.json();
      setNiches(data);
      onCountChange?.('niches', data.length);
    } catch {
      toast('Failed to load niches', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNiches(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this niche?')) return;
    setDeleting(id);
    try {
      const res = await fetch(`${API}/niches/${id}`, { method: 'DELETE' });
      if (res.ok) {
        const updated = niches.filter(n => n._id !== id);
        setNiches(updated);
        onCountChange?.('niches', updated.length);
        toast('Niche removed.', 'success');
      } else {
        toast('Failed to delete niche.', 'error');
      }
    } catch {
      toast('Network error.', 'error');
    } finally {
      setDeleting(null);
    }
  };

  const handleAdded = (niche) => {
    const updated = [...niches, niche];
    setNiches(updated);
    onCountChange?.('niches', updated.length);
  };

  return (
    <div className="max-w-[800px]">
      {/* Header Card */}
      <div className="bg-ecomlly-surface border border-ecomlly-line rounded-[20px] overflow-hidden shadow-[0_2px_12px_rgba(31,107,66,0.06)]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-ecomlly-line">
          <div>
            <h2 className="font-sans font-extrabold text-[15px] text-ecomlly-text">Niches</h2>
            <p className="text-[12px] text-ecomlly-muted mt-0.5">{niches.length} niche{niches.length !== 1 ? 's' : ''} available to merchants</p>
          </div>
          <PrimaryBtn onClick={() => setShowModal(true)}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Add Niche
          </PrimaryBtn>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 gap-3">
            <div className="w-6 h-6 rounded-full border-2 border-ecomlly-line-s border-t-ecomlly-v-soft animate-spin" />
            <span className="text-ecomlly-muted text-sm">Loading niches...</span>
          </div>
        ) : niches.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
            <div className="w-14 h-14 rounded-2xl bg-ecomlly-surface-2 flex items-center justify-center">
              <svg className="w-7 h-7 text-ecomlly-muted" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="font-sans font-bold text-[15px] text-ecomlly-text">No niches yet</h3>
            <p className="text-[13px] text-ecomlly-muted">Add your first niche to get started.</p>
          </div>
        ) : (
          <div>
            {niches.map((niche) => (
              <div key={niche._id} className="flex items-center gap-4 px-6 py-4 border-b border-ecomlly-line last:border-b-0 hover:bg-ecomlly-bg transition-colors group">
                {/* Icon */}
                <div className="w-10 h-10 rounded-[12px] bg-ecomlly-surface-2 border border-ecomlly-line-s flex items-center justify-center text-ecomlly-v-soft flex-none">
                  {nicheIcons[niche.icon] || nicheIcons.HelpCircle}
                </div>
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-sans font-bold text-[14px] text-ecomlly-text">{niche.name}</div>
                  <div className="font-sans text-[12px] text-ecomlly-muted truncate">{niche.description}</div>
                </div>
                {/* ID Badge */}
                <span className="text-[11px] font-semibold text-ecomlly-muted bg-ecomlly-bg border border-ecomlly-line px-2.5 py-1 rounded-full flex-none">
                  {niche.id}
                </span>
                {/* Delete */}
                <DangerBtn onClick={() => handleDelete(niche._id)} disabled={deleting === niche._id}>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  {deleting === niche._id ? '...' : 'Delete'}
                </DangerBtn>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && <AddNicheModal onClose={() => setShowModal(false)} onAdded={handleAdded} />}
    </div>
  );
}
