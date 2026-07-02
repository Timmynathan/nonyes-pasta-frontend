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
      className="block bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden border border-brand-orange/20"
    >
      <div className="aspect-square bg-brand-orange/10 flex items-center justify-center">
        {product.image ? (
          <img src={imgUrl(product.image, { width: 400 })} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
        ) : (
          <span className="text-4xl">🍝</span>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-brand-dark text-sm leading-tight">{product.name}</h3>
        <p className="text-brand-red font-bold mt-1 text-sm">₦{Number(product.base_price).toLocaleString()}</p>
        {product.average_rating && (
          <p className="text-xs text-yellow-600 mt-1">★ {product.average_rating}</p>
        )}
        <button
          onClick={handleAdd}
          className="mt-3 w-full bg-brand-red text-white text-xs font-semibold py-2 rounded-lg hover:bg-brand-orange transition"
        >
          + Add
        </button>
      </div>
    </Link>
  );
}
