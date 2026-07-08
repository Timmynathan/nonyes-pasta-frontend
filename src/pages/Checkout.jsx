import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    delivery_name: '',
    delivery_phone: '',
    delivery_address: '',
    email: '',
  });
  const [zones, setZones] = useState([]);
  const [location, setLocation] = useState(null); // { name, fee }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/orders/delivery-zones/').then((res) => setZones(res.data)).catch(() => {});
  }, []);

  const deliveryFee = location ? location.fee : 0;

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    if (!location) {
      setError('Please select a delivery location.');
      return;
    }
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/orders/place/', {
        email: form.email,
        delivery_name: form.delivery_name,
        delivery_phone: form.delivery_phone,
        delivery_address: form.delivery_address,
        delivery_zone: location.name,
        cart: items.map((i) => ({
          product_id: i.productId,
          size_id: i.sizeId || null,
          add_on_ids: i.addOnIds || [],
          quantity: i.quantity,
          spice_level: i.spiceLevel || 'mild',
        })),
      });

      clearCart();
      navigate(`/track/${res.data.order_number}`);
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const grandTotal = total + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 pt-28 pb-10 text-center">
        <p className="text-brand-dark/60 mb-4">Your cart is empty.</p>
        <button onClick={() => navigate('/')} className="text-brand-red underline">Back to menu</button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-10">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>
      {error && <p className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold mb-1">Full Name</label>
          <input
            name="delivery_name"
            value={form.delivery_name}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Phone Number</label>
          <input
            name="delivery_phone"
            value={form.delivery_phone}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Delivery Address (Lagos only)</label>
          <textarea
            name="delivery_address"
            value={form.delivery_address}
            onChange={handleChange}
            required
            rows={2}
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-1">Email (for receipt)</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand-orange"
          />
        </div>

        {/* Delivery location picker */}
        <div>
          <label className="block text-sm font-semibold mb-2">Delivery Location</label>
          <div className="border border-brand-orange/30 rounded-xl overflow-hidden max-h-96 overflow-y-auto">
            {zones.map((zone) => (
              <div key={zone.group}>
                <p className="bg-brand-cream px-4 py-2 text-xs font-bold uppercase tracking-wide text-brand-dark/60 sticky top-0">
                  {zone.group}
                </p>
                {zone.locations.map((loc) => {
                  const selected = location?.name === loc.name;
                  return (
                    <label
                      key={loc.name}
                      className={`flex items-center justify-between px-4 py-3 cursor-pointer border-t border-brand-orange/10 transition ${
                        selected ? 'bg-brand-red/5' : 'hover:bg-brand-cream/50'
                      }`}
                    >
                      <span className="flex items-center gap-3">
                        <input
                          type="radio"
                          name="location"
                          checked={selected}
                          onChange={() => setLocation(loc)}
                          className="accent-brand-red"
                        />
                        <span className="text-sm">{loc.name}</span>
                      </span>
                      <span className="text-sm font-semibold whitespace-nowrap">₦{loc.fee.toLocaleString()}</span>
                    </label>
                  );
                })}
              </div>
            ))}
          </div>
          {location && (
            <p className="text-xs text-brand-dark/60 mt-2">
              Delivering to <span className="font-semibold">{location.name}</span> · ₦{location.fee.toLocaleString()}
            </p>
          )}
        </div>

        <div className="bg-brand-cream border border-brand-orange/20 rounded-xl p-4 space-y-1 text-sm">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-brand-dark/70">
              <span>{i.quantity}x {i.name}{i.sizeName ? ` (${i.sizeName})` : ''}</span>
              <span>₦{(i.unitPrice * i.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2 mt-2"><span>Subtotal</span><span>₦{total.toLocaleString()}</span></div>
          <div className="flex justify-between">
            <span>Delivery{location ? ` (${location.name})` : ''}</span>
            <span>{location ? `₦${deliveryFee.toLocaleString()}` : '—'}</span>
          </div>
          <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
            <span>Total</span><span className="text-brand-red">₦{grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !location}
          className="w-full bg-brand-red text-white font-bold py-3 rounded-full hover:bg-brand-orange transition disabled:opacity-60"
        >
          {loading ? 'Placing your order…' : `Place Order · ₦${grandTotal.toLocaleString()}`}
        </button>
      </form>
    </div>
  );
}
