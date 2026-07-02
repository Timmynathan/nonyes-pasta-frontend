const FAQS = [
  { q: 'How do I place an order?', a: 'Browse our Shop page, add items to your cart, and checkout securely with Paystack. All orders are pre-orders — we make your food fresh after payment.' },
  { q: 'Do you deliver outside Lagos?', a: 'Currently we deliver within Lagos only. We are growing and will expand delivery soon!' },
  { q: 'How long does delivery take?', a: 'Delivery times vary but you will be notified once your order is being prepared and when it is on its way.' },
  { q: 'Can I customize my order?', a: 'Yes! Products like the Soup Dumpling Lasagna are available in pork or beef. Contact us on WhatsApp for special requests.' },
  { q: 'What payment methods are accepted?', a: 'We accept all major cards, bank transfers, and USSD via Paystack (Naira payments only).' },
  { q: 'Can I track my order?', a: 'Yes — after placing an order you will receive an order number. Enter it on our Track Order page to see your order status.' },
  { q: 'Do you do catering/events?', a: 'Yes! Contact us via WhatsApp or email to discuss event catering bookings.' },
];

export default function FAQ() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold mb-8">Frequently Asked Questions</h1>
      <div className="space-y-4">
        {FAQS.map((item, i) => (
          <details key={i} className="bg-white rounded-xl p-5 shadow-sm group">
            <summary className="font-semibold cursor-pointer list-none flex justify-between">
              {item.q}
              <span className="text-brand-orange group-open:rotate-45 transition-transform">+</span>
            </summary>
            <p className="mt-3 text-brand-dark/70 text-sm leading-relaxed">{item.a}</p>
          </details>
        ))}
      </div>
    </div>
  );
}
