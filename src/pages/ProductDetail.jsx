import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/client';
import { imgUrl } from '../utils/imageUrl';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { user } = useAuth();

  const [product, setProduct] = useState(null);
  const [sizeId, setSizeId] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [spiceLevel, setSpiceLevel] = useState('mild');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  function loadProduct() {
    api.get(`/store/products/${slug}/`).then((res) => {
      setProduct(res.data);
      const def = res.data.sizes.find((s) => s.is_default) || res.data.sizes[0];
      setSizeId(def ? def.id : null);
    });
  }

  useEffect(() => {
    loadProduct();
  }, [slug]);

  if (!product) return <div className="max-w-4xl mx-auto px-4 py-10">Loading...</div>;

  const size = product.sizes.find((s) => s.id === sizeId);
  const unitPrice = size ? Number(size.price) : Number(product.base_price);

  function handleAddToCart() {
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sizeId: size ? size.id : null,
      sizeName: size ? size.name : null,
      addOnIds: [],
      unitPrice,
      quantity,
      spiceLevel,
    });
    navigate('/cart');
  }

  async function submitReview(e) {
    e.preventDefault();
    await api.post('/store/reviews/', { product: product.id, rating, comment });
    setComment('');
    loadProduct();
  }

  return (
    <div className="max-w-4xl mx-auto px-4 pt-28 pb-10 grid md:grid-cols-2 gap-10">
      <div className="aspect-square bg-brand-orange/10 rounded-xl flex items-center justify-center">
        {product.image ? (
          <img src={imgUrl(product.image, { width: 800 })} alt={product.name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <span className="text-6xl">🍝</span>
        )}
      </div>
      <div>
        <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
        <p className="text-brand-dark/70 mb-4">{product.description}</p>
        <p className="text-2xl font-bold text-brand-red mb-4">₦{unitPrice.toLocaleString()}</p>

        {product.sizes.length > 0 && (
          <div className="mb-4">
            <p className="font-semibold mb-2">Size</p>
            <div className="flex gap-2 flex-wrap">
              {product.sizes.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSizeId(s.id)}
                  className={`px-3 py-1.5 rounded-full border text-sm ${
                    sizeId === s.id ? 'bg-brand-red text-white border-brand-red' : 'border-brand-orange/40'
                  }`}
                >
                  {s.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Spice level */}
        <div className="mb-4">
          <p className="text-brand-red font-black text-xs uppercase tracking-widest mb-3">Spice Level</p>
          <button
            onClick={() => setSpiceLevel((s) => s === 'extra' ? 'mild' : 'extra')}
            className="flex items-center gap-3 group"
          >
            <span className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition ${
              spiceLevel === 'extra'
                ? 'border-brand-red bg-brand-red'
                : 'border-brand-dark/30 bg-white group-hover:border-brand-red'
            }`}>
              {spiceLevel === 'extra' && (
                <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              )}
            </span>
            <span className="font-bold text-brand-dark text-sm">Make It Spicy</span>
          </button>
        </div>

        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setQuantity((q) => Math.max(1, q - 1))} className="w-8 h-8 border rounded">-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity((q) => q + 1)} className="w-8 h-8 border rounded">+</button>
        </div>

        {/* Preorder schedule notice */}
        <p className="text-xs text-brand-dark/50 mb-4 bg-brand-orange/10 rounded-lg px-3 py-2">
          📅 Preorders open <strong>Thursday</strong> for Saturday delivery &amp; <strong>Friday</strong> for Sunday delivery.
        </p>

        <button
          onClick={handleAddToCart}
          className="bg-brand-red text-white font-bold px-6 py-3 rounded-full hover:bg-brand-orange transition"
        >
          Add to Cart (Pre-order)
        </button>

        <div className="mt-10">
          <h2 className="font-bold mb-3">Reviews</h2>
          {product.reviews.length === 0 && <p className="text-brand-dark/60 text-sm">No reviews yet.</p>}
          <ul className="space-y-2 mb-4">
            {product.reviews.map((r) => (
              <li key={r.id} className="text-sm border-b pb-2">
                <span className="font-semibold">{r.username}</span> - ★ {r.rating}
                <p className="text-brand-dark/70">{r.comment}</p>
              </li>
            ))}
          </ul>
          {user ? (
            <form onSubmit={submitReview} className="space-y-2">
              <select value={rating} onChange={(e) => setRating(Number(e.target.value))} className="border rounded px-2 py-1">
                {[5, 4, 3, 2, 1].map((n) => (
                  <option key={n} value={n}>{n} stars</option>
                ))}
              </select>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write a review..."
                className="w-full border rounded px-2 py-1"
              />
              <button type="submit" className="bg-brand-dark text-white px-4 py-1.5 rounded text-sm">
                Submit Review
              </button>
            </form>
          ) : (
            <p className="text-sm text-brand-dark/60">Log in to leave a review.</p>
          )}
        </div>
      </div>
    </div>
  );
}
