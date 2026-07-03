import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import FAQ from './pages/FAQ';
import Testimonials from './pages/Testimonials';
import Gallery from './pages/Gallery';
import OrderTracking from './pages/OrderTracking';

const NO_FOOTER_PATHS = ['/cart', '/checkout'];

function App() {
  const location = useLocation();
  const hideFooter = NO_FOOTER_PATHS.includes(location.pathname)
    || location.pathname.startsWith('/product/')
    || location.pathname.startsWith('/track');

  return (
    <div className="min-h-screen flex flex-col">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/product/:slug" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/testimonials" element={<Testimonials />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/track/:orderNumber" element={<OrderTracking />} />
          <Route path="/track" element={<OrderTracking />} />
        </Routes>
      </main>
      {!hideFooter && <Footer />}
      <WhatsAppButton />
    </div>
  );
}

export default App;
