import { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

function lineKey(item) {
  return `${item.productId}-${item.sizeId || 'default'}-${(item.addOnIds || []).sort().join(',')}`;
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  function addItem(newItem) {
    setItems((prev) => {
      const key = lineKey(newItem);
      const existing = prev.find((i) => lineKey(i) === key);
      if (existing) {
        return prev.map((i) =>
          lineKey(i) === key ? { ...i, quantity: i.quantity + newItem.quantity } : i
        );
      }
      return [...prev, newItem];
    });
  }

  function updateQuantity(item, quantity) {
    setItems((prev) =>
      prev
        .map((i) => (lineKey(i) === lineKey(item) ? { ...i, quantity } : i))
        .filter((i) => i.quantity > 0)
    );
  }

  function removeItem(item) {
    setItems((prev) => prev.filter((i) => lineKey(i) !== lineKey(item)));
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const count = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, updateQuantity, removeItem, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
