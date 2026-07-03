import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

const STEPS = ['pending', 'paid', 'preparing', 'out_for_delivery', 'delivered'];
const LABELS = {
  pending: 'Order Placed',
  paid: 'Payment Confirmed',
  preparing: 'Preparing Your Food',
  out_for_delivery: 'Out for Delivery',
  delivered: 'Delivered 🎉',
};

export default function OrderTracking() {
  const { orderNumber: routeOrderNumber } = useParams();
  const [inputNumber, setInputNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState(routeOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [confirming, setConfirming] = useState(false);

  useEffect(() => {
    if (!orderNumber) return;

    let cancelled = false;
    let attempts = 0;
    // The order is created by Paystack's webhook, which can lag a few seconds
    // behind the redirect. Poll for up to ~40s before giving up.
    const maxAttempts = 20;
    setConfirming(true);
    setError('');
    setOrder(null);

    const tryFetch = () => {
      api.get(`/orders/${orderNumber}/`)
        .then((res) => {
          if (cancelled) return;
          setOrder(res.data);
          setConfirming(false);
        })
        .catch(() => {
          if (cancelled) return;
          attempts += 1;
          if (attempts >= maxAttempts) {
            setConfirming(false);
            setError('Order not found. If you were charged, contact us on WhatsApp with your payment reference and we\'ll sort it out.');
          } else {
            setTimeout(tryFetch, 2000);
          }
        });
    };
    tryFetch();

    return () => { cancelled = true; };
  }, [orderNumber]);

  const currentStep = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-10">
      <h1 className="text-2xl font-bold mb-6">Track Your Order</h1>
      {confirming && (
        <div className="mb-6 flex items-center gap-3 bg-brand-cream border border-brand-orange/30 rounded-xl px-4 py-3">
          <span className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-brand-dark/80">Confirming your payment… this can take a few seconds.</p>
        </div>
      )}
      {!routeOrderNumber && (
        <div className="flex gap-2 mb-8">
          <input
            value={inputNumber}
            onChange={(e) => setInputNumber(e.target.value)}
            placeholder="Enter order number (e.g. NP-ABC12345)"
            className="flex-1 border rounded-lg px-4 py-2"
          />
          <button onClick={() => { setOrderNumber(inputNumber.trim()); setError(''); setOrder(null); }}
            className="bg-brand-red text-white px-4 py-2 rounded-lg">
            Track
          </button>
        </div>
      )}
      {error && <p className="text-red-600">{error}</p>}
      {order && (
        <div>
          <p className="font-semibold mb-1">Order #{order.order_number}</p>
          <p className="text-sm text-brand-dark/60 mb-6">{order.delivery_address}</p>
          <div className="relative">
            <div className="absolute top-5 left-5 right-5 h-0.5 bg-brand-orange/20" />
            <ol className="relative flex justify-between">
              {STEPS.map((step, i) => (
                <li key={step} className="flex flex-col items-center">
                  <span className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold text-sm z-10 ${
                    i <= currentStep ? 'bg-brand-red border-brand-red text-white' : 'bg-white border-brand-orange/30 text-brand-dark/40'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-xs text-center mt-2 max-w-[60px] text-brand-dark/70">{LABELS[step]}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="mt-8 border rounded-xl p-4 bg-white shadow-sm">
            <p className="font-bold mb-3">Order Summary</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-1">
                <span>{item.quantity}x {item.product_name}{item.size_name ? ` (${item.size_name})` : ''}</span>
                <span>₦{Number(item.line_total).toLocaleString()}</span>
              </div>
            ))}
            <div className="border-t mt-2 pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span className="text-brand-red">₦{Number(order.total).toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
