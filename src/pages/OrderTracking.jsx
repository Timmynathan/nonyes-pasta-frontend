import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/client';

const BANK_ACCOUNTS = [
  { bank: 'Moniepoint', number: '8125006987', name: 'Attah Chukwunonyelum Divine' },
  { bank: 'GTBank', number: '0847691543', name: 'Attah Chukwunonyelum Divine' },
];

function buildWhatsappUrl(order) {
  const lines = (order.items || [])
    .map((i) => `- ${i.quantity}x ${i.product_name}${i.size_name ? ` (${i.size_name})` : ''}`)
    .join('\n');
  const msg =
    `Hi Nonye's Pasta! I've placed an order and made my transfer. Here are my details:\n\n` +
    `Order: ${order.order_number}\n` +
    `Name: ${order.delivery_name}\n` +
    `Area: ${order.delivery_area || ''}\n` +
    `Address: ${order.delivery_address}\n\n` +
    `Items:\n${lines}\n\n` +
    `Total: ₦${Number(order.total).toLocaleString()}\n\n` +
    `I've attached my transfer receipt.`;
  return `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
}

export default function OrderTracking() {
  const { orderNumber: routeOrderNumber } = useParams();
  const [inputNumber, setInputNumber] = useState('');
  const [orderNumber, setOrderNumber] = useState(routeOrderNumber || '');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!orderNumber) return;
    setLoading(true);
    setError('');
    setOrder(null);
    api.get(`/orders/${orderNumber}/`)
      .then((res) => setOrder(res.data))
      .catch(() => setError('Order not found. Please check your order number or contact us on WhatsApp.'))
      .finally(() => setLoading(false));
  }, [orderNumber]);

  function copy(text, key) {
    navigator.clipboard?.writeText(text).then(() => {
      setCopied(key);
      setTimeout(() => setCopied(null), 1500);
    });
  }

  return (
    <div className="max-w-2xl mx-auto px-4 pt-28 pb-10">
      <h1 className="text-2xl font-bold mb-6">Your Order</h1>

      {loading && (
        <div className="mb-6 flex items-center gap-3 bg-brand-cream border border-brand-orange/30 rounded-xl px-4 py-3">
          <span className="w-5 h-5 border-2 border-brand-red border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-brand-dark/80">Loading your order…</p>
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
          {/* Confirmation banner */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5 mb-6 text-center">
            <div className="text-4xl mb-2">📝</div>
            <h2 className="text-xl font-bold text-green-800 mb-1">Order Placed!</h2>
            <p className="text-sm text-green-700">
              Order <span className="font-semibold">#{order.order_number}</span> received. Please complete your bank transfer below to confirm it.
            </p>
          </div>

          {/* Order summary */}
          <div className="border rounded-xl p-4 bg-white shadow-sm mb-6">
            <p className="font-bold mb-3">Order Summary</p>
            {order.items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm py-1">
                <span>{item.quantity}x {item.product_name}{item.size_name ? ` (${item.size_name})` : ''}</span>
                <span>₦{Number(item.line_total).toLocaleString()}</span>
              </div>
            ))}
            <div className="flex justify-between text-sm py-1 text-brand-dark/60">
              <span>Delivery{order.delivery_area ? ` (${order.delivery_area})` : ''}</span>
              <span>₦{Number(order.delivery_fee).toLocaleString()}</span>
            </div>
            <div className="border-t mt-2 pt-2 flex justify-between font-bold text-base">
              <span>Amount to Transfer</span>
              <span className="text-brand-red">₦{Number(order.total).toLocaleString()}</span>
            </div>
          </div>

          {/* Bank accounts */}
          <div className="mb-6">
            <p className="font-bold mb-1">Pay by bank transfer</p>
            <p className="text-sm text-brand-dark/60 mb-3">
              Transfer <span className="font-semibold text-brand-dark">₦{Number(order.total).toLocaleString()}</span> to either account below, then tap the WhatsApp button to send your receipt.
            </p>
            <div className="space-y-3">
              {BANK_ACCOUNTS.map((acct) => (
                <div key={acct.bank} className="border border-brand-orange/30 rounded-xl p-4 bg-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-wide text-brand-dark/50">{acct.bank}</p>
                      <p className="text-lg font-bold tracking-wider text-brand-dark">{acct.number}</p>
                      <p className="text-sm text-brand-dark/70">{acct.name}</p>
                    </div>
                    <button
                      onClick={() => copy(acct.number, acct.bank)}
                      className="text-sm font-semibold text-brand-red border border-brand-red/40 rounded-full px-4 py-1.5 hover:bg-brand-red/5 transition"
                    >
                      {copied === acct.bank ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery + preorder note */}
          <div className="bg-brand-cream border border-brand-orange/30 rounded-xl p-4 mb-6 text-sm text-brand-dark/80 leading-relaxed">
            <p className="mb-1"><span className="font-semibold">Delivering to:</span> {order.delivery_address}</p>
            <p>📅 This is a pre-order — freshly made on your delivery day. We'll confirm timing on WhatsApp once your transfer is received.</p>
          </div>

          {/* WhatsApp CTA */}
          <a
            href={buildWhatsappUrl(order)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 text-white font-bold py-3 rounded-full hover:bg-green-600 transition"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
            </svg>
            Send receipt &amp; order to WhatsApp
          </a>
          <p className="text-center text-xs text-brand-dark/50 mt-3">
            Your order is confirmed once we receive your transfer.
          </p>
        </div>
      )}
    </div>
  );
}
