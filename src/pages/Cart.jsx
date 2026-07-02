import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function Cart() {
  const { items, updateQuantity, removeItem, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Your cart is empty</h1>
        <Link to="/shop" className="text-brand-red font-semibold hover:underline">
          Browse the menu &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 pt-28 pb-10">
      <h1 className="text-2xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-4">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between border-b pb-4">
            <div>
              <p className="font-semibold">{item.name}</p>
              {item.sizeName && <p className="text-sm text-brand-dark/60">{item.sizeName}</p>}
              <p className="text-brand-red font-bold">₦{item.unitPrice.toLocaleString()}</p>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => updateQuantity(item, item.quantity - 1)} className="w-8 h-8 border rounded">-</button>
              <span>{item.quantity}</span>
              <button onClick={() => updateQuantity(item, item.quantity + 1)} className="w-8 h-8 border rounded">+</button>
              <button onClick={() => removeItem(item)} className="text-sm text-red-600 ml-3">Remove</button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center mt-8">
        <p className="text-xl font-bold">Total: ₦{total.toLocaleString()}</p>
        <Link to="/checkout" className="bg-brand-red text-white font-bold px-6 py-3 rounded-full hover:bg-brand-orange transition">
          Checkout
        </Link>
      </div>
    </div>
  );
}
