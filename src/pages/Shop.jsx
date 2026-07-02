import { useEffect, useState } from 'react';
import api from '../api/client';
import ProductCard from '../components/ProductCard';

const PASTA_CATS    = ['alfredo', 'lasagna', 'rigatoni', 'stir-fry', 'native', 'jollof-spag', 'linguine', 'healthy'];
const NONPASTA_CATS = ['non-pasta'];
const PROTEIN_CATS  = ['protein'];
const DRINKS_CATS   = ['drinks'];

const SECTIONS = [
  { label: 'Pasta',      cats: PASTA_CATS },
  { label: 'Non-Pasta',  cats: NONPASTA_CATS },
  { label: 'Protein',    cats: PROTEIN_CATS },
  { label: 'Drinks',     cats: DRINKS_CATS },
];

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    api.get('/store/products/').then((res) => setProducts(res.data));
  }, []);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  const getSection = (cats) =>
    filtered.filter((p) => cats.includes(p.category?.slug));

  const isSearching = search.trim().length > 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-2">Our Menu</h1>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
        <p className="text-sm text-brand-dark/60">
          📅 Preorders open <strong>Thursday</strong> for Saturday &amp; <strong>Friday</strong> for Sunday.
        </p>
        <a
          href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Nonye's Pasta! I'd like to enquire about catering services.")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-4 py-1.5 hover:bg-green-100 transition w-fit"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Catering &amp; Enquiries
        </a>
      </div>

      <input
        type="text"
        placeholder="Search menu..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full md:w-80 border border-brand-orange/40 rounded-lg px-4 py-2 mb-10 focus:outline-none focus:ring-2 focus:ring-brand-orange"
      />

      {/* Search results — flat grid */}
      {isSearching ? (
        <div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {filtered.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
          {filtered.length === 0 && <p className="text-brand-dark/60">No products found.</p>}
        </div>
      ) : (
        /* Sectioned layout */
        <div className="space-y-14">
          {SECTIONS.map(({ label, cats }) => {
            const items = getSection(cats);
            if (items.length === 0) return null;
            return (
              <div key={label}>
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="text-xl font-bold text-brand-dark whitespace-nowrap">{label}</h2>
                  <div className="flex-1 h-px bg-brand-dark/10" />
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  {items.map((p) => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
