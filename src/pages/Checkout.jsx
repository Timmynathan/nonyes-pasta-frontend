import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/client';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const DELIVERY_FEE = 1500;

export default function Checkout() {
  const { items, total, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    delivery_name: user ? `${user.first_name} ${user.last_name}`.trim() : '',
    delivery_phone: user?.phone || '',
    delivery_address: user?.address || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function handleChange(e) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);
    setError('');

    try {
      const res = await api.post('/orders/initiate/', {
        email: form.email,
        delivery_name: form.delivery_name,
        delivery_phone: form.delivery_phone,
        delivery_address: form.delivery_address,
        cart: items.map((i) => ({
          product_id: i.productId,
          size_id: i.sizeId || null,
          add_on_ids: i.addOnIds || [],
          quantity: i.quantity,
          spice_level: i.spiceLevel || 'mild',
        })),
      });

      clearCart();
      window.location.href = res.data.authorization_url;
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const grandTotal = total + DELIVERY_FEE;

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

        <div className="bg-brand-cream border border-brand-orange/20 rounded-xl p-4 space-y-1 text-sm">
          {items.map((i) => (
            <div key={i.productId} className="flex justify-between text-brand-dark/70">
              <span>{i.quantity}x {i.name}{i.sizeName ? ` (${i.sizeName})` : ''}</span>
              <span>₦{(i.unitPrice * i.quantity).toLocaleString()}</span>
            </div>
          ))}
          <div className="flex justify-between border-t pt-2 mt-2"><span>Subtotal</span><span>₦{total.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Delivery (Lagos)</span><span>₦{DELIVERY_FEE.toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-2 mt-1">
            <span>Total</span><span className="text-brand-red">₦{grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-red text-white font-bold py-3 rounded-full hover:bg-brand-orange transition disabled:opacity-60"
        >
          {loading ? 'Redirecting to Paystack…' : `Pay ₦${grandTotal.toLocaleString()} with Paystack`}
        </button>
      </form>
    </div>
  );
}
