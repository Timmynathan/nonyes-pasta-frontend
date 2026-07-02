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
    setLoading(true);
    setError('');

    try {
      const orderPayload = {
        delivery_name: form.delivery_name,
        delivery_phone: form.delivery_phone,
        delivery_address: form.delivery_address,
        items: items.map((i) => ({
          product_id: i.productId,
          size_id: i.sizeId || null,
          add_on_ids: i.addOnIds || [],
          quantity: i.quantity,
        })),
      };
      const orderRes = await api.post('/orders/', orderPayload);
      const order = orderRes.data;

      const payRes = await api.post(`/orders/${order.order_number}/pay/`, {
        email: form.email,
        callback_url: `${window.location.origin}/track/${order.order_number}`,
      });

      const { authorization_url } = payRes.data.data;
      clearCart();
      window.location.href = authorization_url;
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong. Please try again.');
      setLoading(false);
    }
  }

  const grandTotal = total + DELIVERY_FEE;

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
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

        <div className="bg-brand-cream rounded-xl p-4 space-y-1 text-sm">
          <div className="flex justify-between"><span>Subtotal</span><span>₦{total.toLocaleString()}</span></div>
          <div className="flex justify-between"><span>Delivery (Lagos)</span><span>₦{DELIVERY_FEE.toLocaleString()}</span></div>
          <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
            <span>Total</span><span className="text-brand-red">₦{grandTotal.toLocaleString()}</span>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-brand-red text-white font-bold py-3 rounded-full hover:bg-brand-orange transition disabled:opacity-60"
        >
          {loading ? 'Processing…' : `Pay ₦${grandTotal.toLocaleString()} with Paystack`}
        </button>
      </form>
    </div>
  );
}
