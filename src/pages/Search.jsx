import { useState, useEffect, useMemo } from 'react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';

export default function Search() {
  const [query, setQuery] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/store/products/')
      .then((res) => setProducts(res.data))
      .finally(() => setLoading(false));
  }, []);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return products.filter((p) => {
      const name = p.name?.toLowerCase() || '';
      const cat = p.category?.name?.toLowerCase() || '';
      return name.includes(q) || cat.includes(q);
    });
  }, [query, products]);

  return (
    <div className="max-w-6xl mx-auto px-4 pt-28 pb-16">
      <h1 className="text-2xl font-bold mb-6">Search the Menu</h1>

      <div className="relative mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-brand-dark/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
        </svg>
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for pasta, jollof, drinks…"
          className="w-full border rounded-full pl-12 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-brand-orange"
        />
      </div>

      {loading && <p className="text-brand-dark/50">Loading menu…</p>}

      {!loading && query.trim() && results.length === 0 && (
        <p className="text-brand-dark/60">No dishes match “{query}”. Try another word.</p>
      )}

      {!loading && !query.trim() && (
        <p className="text-brand-dark/50">Start typing to search the full menu.</p>
      )}

      {results.length > 0 && (
        <>
          <p className="text-sm text-brand-dark/50 mb-4">{results.length} result{results.length > 1 ? 's' : ''}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {results.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
