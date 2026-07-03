import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import api from '../api/client';
import ProductCard from '../components/ProductCard';
import VideoScrollHero from '../components/VideoScrollHero';
import { imgUrl } from '../utils/imageUrl';

gsap.registerPlugin(ScrollTrigger);

const PASTA_CATS    = ['alfredo', 'lasagna', 'rigatoni', 'stir-fry', 'native', 'jollof-spag', 'linguine', 'healthy'];
const NONPASTA_CATS = ['non-pasta'];
const PROTEIN_CATS  = ['protein'];
const DRINKS_CATS   = ['drinks'];

const SECTIONS = [
  { label: 'Pasta',     cats: PASTA_CATS },
  { label: 'Non-Pasta', cats: NONPASTA_CATS },
  { label: 'Protein',   cats: PROTEIN_CATS },
  { label: 'Drinks',    cats: DRINKS_CATS },
];

const FEATURED_SLUGS = [
  'nonyes-penne-alfredo-pasta',
  'nonyes-stir-fry-pasta',
  'nonyes-vodka-rigatoni',
  'nonyes-shrimp-alfredo-fettuccine-pasta',
];

export default function Home() {
  const [allProducts, setAllProducts] = useState([]);
  const [loadingMenu, setLoadingMenu] = useState(true);
  const pageRef = useRef(null);

  useEffect(() => {
    api.get('/store/products/')
      .then((res) => setAllProducts(res.data))
      .finally(() => setLoadingMenu(false));
  }, []);

  useEffect(() => {
    if (allProducts.length === 0) return;

    const ctx = gsap.context(() => {
      gsap.set('.fade-up', { y: 40, autoAlpha: 0 });
      gsap.set('.product-card-anim', { y: 60, autoAlpha: 0 });

      gsap.utils.toArray('.fade-up').forEach((el) => {
        gsap.to(el, {
          y: 0, autoAlpha: 1,
          scrollTrigger: { trigger: el, start: 'top 88%', end: 'top 60%', scrub: 1 },
        });
      });

      gsap.utils.toArray('.product-card-anim').forEach((el, i) => {
        gsap.to(el, {
          y: 0, autoAlpha: 1,
          delay: i * 0.06,
          scrollTrigger: { trigger: el, start: 'top 92%', end: 'top 65%', scrub: 1.2 },
        });
      });
    }, pageRef);

    return () => ctx.revert();
  }, [allProducts]);

  const featured = FEATURED_SLUGS.map((slug) => allProducts.find((p) => p.slug === slug)).filter(Boolean);
  const getSection = (cats) => allProducts.filter((p) => cats.includes(p.category?.slug));

  return (
    <div ref={pageRef}>

      <VideoScrollHero />

      {/* ── Tagline strip ─────────────────────────────────── */}
      <section className="py-6 px-4 text-center bg-black/30">
        <p className="text-white/80 text-xs uppercase tracking-[0.25em] font-medium">
          Fresh to order &bull; Made with love &bull; Lagos, Nigeria
        </p>
      </section>

      {/* ── Fan Favorites ─────────────────────────────────── */}
      <section className="py-16 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="fade-up text-white text-2xl md:text-3xl font-bold text-center mb-10">
            Fan Favorites
          </h2>
          {loadingMenu ? (
            <div className="flex flex-col items-center gap-3 py-8 text-white/80">
              <span className="w-8 h-8 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              <p className="text-sm">Warming up the kitchen… loading the menu.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {featured.map((p) => (
                <div key={p.id} className="product-card-anim">
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Hot & Fresh ───────────────────────────────────── */}
      <section className="py-20 px-4 text-center bg-black/20">
        <div className="max-w-xl mx-auto">
          <h2 className="fade-up text-white text-3xl md:text-4xl font-bold mb-4">
            Hot. Fresh. Every time.
          </h2>
          <p className="fade-up text-white/70 text-base leading-relaxed">
            Every dish leaves our kitchen piping hot, made the moment you order.
            No reheated leftovers — ever.
          </p>
        </div>
      </section>

      {/* ── Main Menu ─────────────────────────────────────── */}
      <section id="main-menu" className="py-16 px-4 bg-black/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="fade-up text-white text-2xl md:text-3xl font-bold text-center mb-12">
            Main Menu
          </h2>

          <div className="space-y-14">
            {SECTIONS.map(({ label, cats }) => {
              const items = getSection(cats);
              if (items.length === 0) return null;
              return (
                <div key={label}>
                  <div className="flex items-center gap-4 mb-6">
                    <h3 className="text-white text-lg font-semibold whitespace-nowrap">{label}</h3>
                    <div className="flex-1 h-px bg-white/20" />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
                    {items.map((p) => (
                      <div key={p.id} className="product-card-anim">
                        <ProductCard product={p} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="text-center mt-14 fade-up">
            <p className="text-white/50 text-xs mb-2 uppercase tracking-widest">
              📅 Preorders open Thursday for Saturday &bull; Friday for Sunday
            </p>
            <a
              href={`https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Nonye's Pasta! I'd like to enquire about catering services.")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm font-medium text-white border border-white/30 rounded-full px-6 py-2 hover:bg-white/10 transition"
            >
              Catering &amp; Enquiries → WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── About ─────────────────────────────────────────── */}
      <section id="about" className="relative overflow-hidden" style={{ backgroundColor: '#c73e1d' }}>
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 min-h-[520px]">

          {/* Left — text */}
          <div className="flex flex-col justify-center px-8 md:px-16 py-16">
            <h2
              style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
              className="text-7xl md:text-8xl font-black text-white uppercase tracking-tight leading-none mb-8"
            >
              About
            </h2>
            <p className="text-white font-bold text-lg md:text-xl uppercase leading-snug mb-6">
              Welcome to Nonye's Pasta — Lagos' go-to destination for bold, handcrafted pasta made fresh to order. If you're craving rich Alfredo, hearty Lasagna, or a uniquely Nigerian pasta experience, we've got you covered.
            </p>
            <div className="w-24 h-px bg-white/50 mb-6" />
            <p className="text-white/80 text-sm leading-relaxed mb-3">
              Our menu blends classic Italian pasta techniques with rich Nigerian flavors, creating dishes like our Suya Jollof Spag and Native Spaghetti that you simply won't find anywhere else.
            </p>
            <p className="text-white/80 text-sm leading-relaxed mb-3">
              Every dish leaves our kitchen piping hot, made the moment you order. No reheated leftovers — ever.
            </p>
            <p className="text-white/80 text-sm leading-relaxed">
              So why wait? Place a pre-order and treat yourself to a food experience that will leave you wanting to come back for seconds.
            </p>
            <div className="mt-8">
              <img src="/logo.png" alt="Nonye's Pasta" className="h-16 w-auto object-contain" />
            </div>
          </div>

          {/* Right — image */}
          <div className="relative hidden md:block">
            {allProducts.find(p => p.slug === 'nonyes-stir-fry-pasta')?.image && (
              <img
                src={imgUrl(allProducts.find(p => p.slug === 'nonyes-stir-fry-pasta').image, { width: 900 })}
                alt="Nonye's Pasta"
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}
          </div>

        </div>
      </section>

    </div>
  );
}
