import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { imgUrl } from '../utils/imageUrl';

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const navigate = useNavigate();

  function handleAdd(e) {
    e.preventDefault();
    addItem({
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sizeId: null,
      sizeName: null,
      addOnIds: [],
      unitPrice: Number(product.base_price),
      quantity: 1,
      spiceLevel: 'mild',
    });
    navigate('/cart');
  }

  return (
    <Link
      to={`/product/${product.slug}`}
      className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-brand-dark/5 shadow-[0_1px_2px_rgba(43,26,18,0.06)] hover:shadow-[0_12px_32px_-8px_rgba(43,26,18,0.22)] hover:-translate-y-1 transition-all duration-300 ease-out"
    >
      <div className="relative aspect-square bg-brand-orange/5 overflow-hidden">
        {product.image ? (
          <img
            src={imgUrl(product.image, { width: 400 })}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        ) : (
          <span className="absolute inset-0 flex items-center justify-center text-4xl">🍝</span>
        )}
      </div>

      <div className="flex flex-col flex-1 p-3.5">
        <h3 className="font-display font-medium text-brand-dark text-[0.95rem] leading-snug tracking-tight line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 mt-1.5">
          <p className="text-brand-red font-bold text-[0.95rem] tnum">
            ₦{Number(product.base_price).toLocaleString()}
          </p>
          {product.average_rating && (
            <span className="text-[0.7rem] text-brand-orange font-semibold">★ {product.average_rating}</span>
          )}
        </div>

        <button
          onClick={handleAdd}
          aria-label={`Add ${product.name} to cart`}
          className="mt-3 w-full bg-brand-red text-white text-xs font-semibold tracking-wide uppercase py-2.5 rounded-xl
                     hover:bg-brand-orange active:scale-[0.97]
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-red focus-visible:ring-offset-2
                     transition-all duration-200"
        >
          Add to Cart
        </button>
      </div>
    </Link>
  );
}
