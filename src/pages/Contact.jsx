import { useState } from 'react';
import api from '../api/client';

export default function Contact() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  async function handleNewsletter(e) {
    e.preventDefault();
    await api.post('/store/newsletter/', { email });
    setSubscribed(true);
  }

  const whatsapp = `https://wa.me/${import.meta.env.VITE_WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Nonye's Pasta! I have an enquiry.")}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold mb-8">Contact Us</h1>
      <div className="grid md:grid-cols-2 gap-10">
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold mb-1">Phone / WhatsApp</h3>
            <p className="text-brand-dark/70">0812 500 6987</p>
          </div>
          <div>
            <h3 className="font-semibold mb-1">Location</h3>
            <p className="text-brand-dark/70">Lagos, Nigeria</p>
          </div>
          <a
            href={whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block bg-green-500 text-white font-bold px-6 py-3 rounded-full hover:bg-green-600 transition"
          >
            💬 Message on WhatsApp
          </a>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Newsletter</h3>
          {subscribed ? (
            <p className="text-green-600 font-semibold">Thanks for subscribing! 🎉</p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="flex-1 border rounded-lg px-4 py-2"
              />
              <button type="submit" className="bg-brand-red text-white px-4 py-2 rounded-lg font-semibold">
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
