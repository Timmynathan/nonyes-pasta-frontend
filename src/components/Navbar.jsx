import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';

// anchor: true means scroll to a section on the home page
const links = [
  { to: '/',          label: 'Home' },
  { to: 'main-menu', label: 'Main Menu', anchor: true },
  { to: 'about',     label: 'About',     anchor: true },
  { to: 'contact',   label: 'Contact',   anchor: true },
];

export default function Navbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [visible, setVisible] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 1.1);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  function handleAnchor(id, close = false) {
    if (close) setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      // Navigate home first, then scroll after page loads
      navigate('/');
      setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }
  }

  const linkClass = 'hover:underline underline-offset-4';

  function renderLink(l, close = false) {
    if (l.anchor) {
      return (
        <button
          key={l.to}
          onClick={() => handleAnchor(l.to, close)}
          className={linkClass}
        >
          {l.label}
        </button>
      );
    }
    return (
      <NavLink
        key={l.to}
        to={l.to}
        onClick={close ? () => setMenuOpen(false) : undefined}
        className={({ isActive }) =>
          isActive ? `underline ${linkClass}` : linkClass
        }
      >
        {l.label}
      </NavLink>
    );
  }

  const showLogo = !isHome || visible;
  const headerBg = isHome ? '' : 'bg-brand-red';

  return (
    <header className={`text-white fixed top-0 left-0 right-0 z-50 ${headerBg}`}>
      <div className="max-w-6xl mx-auto px-4 py-3 min-h-[88px] flex flex-col justify-center">

        {/* ── Mobile row ── */}
        <div className="flex items-center justify-between md:hidden">
          <button
            onClick={() => setMenuOpen((o) => !o)}
            className="flex flex-col gap-1.5 p-1"
            aria-label="Toggle menu"
          >
            <span className="block w-6 h-0.5 bg-white rounded" />
            <span className="block w-6 h-0.5 bg-white rounded" />
            <span className="block w-6 h-0.5 bg-white rounded" />
          </button>

          {showLogo && (
            <Link to="/" className="absolute left-1/2 -translate-x-1/2">
              <img src="/logo.png" alt="Nonye's Pasta" className="h-20 w-auto object-contain" />
            </Link>
          )}

          <div className="flex items-center gap-4">
            <button onClick={() => setSearchOpen(true)} aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            <Link to="/cart" className="relative" aria-label="Cart">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13l-1.4 7h12.8M7 13H5.4M9 21a1 1 0 100-2 1 1 0 000 2zm10 0a1 1 0 100-2 1 1 0 000 2z" />
              </svg>
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-brand-orange text-white text-xs rounded-full w-4 h-4 flex items-center justify-center leading-none">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ── Desktop row ── */}
        <div className="hidden md:flex items-center justify-between">
          {showLogo ? (
            <Link to="/" className="flex items-center">
              <img src="/logo.png" alt="Nonye's Pasta" className="h-20 w-auto object-contain" />
            </Link>
          ) : (
            <div />
          )}
          <nav className="flex gap-5 text-sm font-medium">
            {links.map((l) => renderLink(l))}
          </nav>
          <div className="flex items-center gap-4 text-sm">
            <button onClick={() => setSearchOpen(true)} aria-label="Search" className="hover:opacity-80">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="11" cy="11" r="7" />
                <path strokeLinecap="round" d="M21 21l-4.35-4.35" />
              </svg>
            </button>
            {user ? (
              <>
                <Link to="/account" className="hover:underline">{user.first_name || user.username}</Link>
                <button onClick={logout} className="hover:underline">Logout</button>
              </>
            ) : (
              <Link to="/login" className="hover:underline">Login</Link>
            )}
            <Link to="/cart" className="relative font-semibold">
              Cart
              {count > 0 && (
                <span className="absolute -top-2 -right-3 bg-brand-orange text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {count}
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Mobile dropdown ── */}
      {menuOpen && (
        <div className="md:hidden bg-brand-red border-t border-white/20 px-4 py-4 flex flex-col gap-4 text-sm font-medium">
          {links.map((l) => renderLink(l, true))}
          <div className="border-t border-white/20 pt-3">
            {user ? (
              <>
                <Link to="/account" onClick={() => setMenuOpen(false)} className="block mb-2 hover:underline">
                  {user.first_name || user.username}
                </Link>
                <button onClick={() => { logout(); setMenuOpen(false); }} className="hover:underline">Logout</button>
              </>
            ) : (
              <Link to="/login" onClick={() => setMenuOpen(false)} className="hover:underline">Login</Link>
            )}
          </div>
        </div>
      )}

      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
