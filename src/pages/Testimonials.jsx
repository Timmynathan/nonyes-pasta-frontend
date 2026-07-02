import { useEffect, useState } from 'react';
import api from '../api/client';

export default function Testimonials() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    api.get('/store/reviews/').then((res) => setReviews(res.data));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-14">
      <h1 className="text-3xl font-bold mb-2 text-center">What People Are Saying</h1>
      <p className="text-center text-brand-dark/60 mb-10">Real reviews from real pasta lovers ❤️</p>
      {reviews.length === 0 && (
        <p className="text-center text-brand-dark/60">No reviews yet. Be the first!</p>
      )}
      <div className="grid md:grid-cols-2 gap-6">
        {reviews.map((r) => (
          <div key={r.id} className="bg-white rounded-xl p-6 shadow-sm border border-brand-orange/10">
            <div className="text-yellow-500 text-lg mb-2">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</div>
            <p className="text-brand-dark/80 italic mb-3">"{r.comment}"</p>
            <p className="text-sm font-semibold text-brand-dark/60">— {r.username}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
