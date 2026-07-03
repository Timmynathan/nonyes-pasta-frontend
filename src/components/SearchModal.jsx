import { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { imgUrl } from '../utils/imageUrl';

export default function SearchModal({ open, onClose }) {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Load products once, the first time the modal opens
  useEffect(() => {
    if (open && products.length === 0) {
      api.get('/store/products/').then((res) => setProducts(res.data)).catch(() => {});
    }
  }, [open, products.length]);

  // Focus input + lock body scroll when open; close on Escape
  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      clearTimeout(t);
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      const name = p.name?.toLowerCase() || '';
      const cat = p.category?.name?.toLowerCase() || '';
      return name.includes(q) || cat.includes(q);
    });
  }, [query, products]);

  function goto(slug) {
    onClose();
    setQuery('');
    navigate(`/product/${slug}`);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b">
          <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-brand-dark/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <circle cx="11" cy="11" r="7" />
            <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
          </svg>
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for pasta, jollof, drinks…"
            className="flex-1 text-brand-dark placeholder:text-brand-dark/40 focus:outline-none py-1"
          />
          <button onClick={onClose} aria-label="Close" className="text-brand-dark/40 hover:text-brand-dark">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {query.trim() && results.length === 0 && (
            <p className="px-4 py-6 text-sm text-brand-dark/60">No dishes match “{query}”.</p>
          )}
          {!query.trim() && (
            <p className="px-4 py-6 text-sm text-brand-dark/40">Start typing to search the menu.</p>
          )}
          {results.map((p) => (
            <button
              key={p.id}
              onClick={() => goto(p.slug)}
              className="w-full flex items-center gap-3 px-4 py-3 hover:bg-brand-cream transition text-left"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-orange/10 flex-shrink-0 overflow-hidden flex items-center justify-center">
                {p.image ? (
                  <img src={imgUrl(p.image, { width: 100 })} alt={p.name} className="w-full h-full object-cover" />
                ) : (
                  <span>🍝</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-brand-dark truncate">{p.name}</p>
                <p className="text-xs text-brand-dark/50">{p.category?.name}</p>
              </div>
              <span className="text-sm font-bold text-brand-red whitespace-nowrap">₦{Number(p.base_price).toLocaleString()}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
