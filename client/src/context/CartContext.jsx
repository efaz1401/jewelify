import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';

const CartContext = createContext(null);
const STORAGE_KEY = 'jewelify_cart';

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = (product, qty = 1) => {
    setItems((curr) => {
      const idx = curr.findIndex((i) => i.productId === product._id);
      if (idx >= 0) {
        const next = [...curr];
        next[idx] = { ...next[idx], qty: Math.min(next[idx].qty + qty, 20) };
        return next;
      }
      const price = Math.round((product.price - (product.price * (product.discountPercent || 0)) / 100) * 100) / 100;
      return [
        ...curr,
        {
          productId: product._id,
          name: product.name,
          slug: product.slug,
          image: product.images?.[0],
          price,
          originalPrice: product.price,
          discountPercent: product.discountPercent || 0,
          qty,
        },
      ];
    });
    toast.success(`${product.name} added to cart`);
  };

  const updateQty = (productId, qty) => {
    setItems((curr) =>
      curr
        .map((i) => (i.productId === productId ? { ...i, qty: Math.max(0, Math.min(20, qty)) } : i))
        .filter((i) => i.qty > 0)
    );
  };

  const removeItem = (productId) => {
    setItems((curr) => curr.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const { subtotal, totalItems } = useMemo(() => {
    const st = items.reduce((a, i) => a + i.price * i.qty, 0);
    const ti = items.reduce((a, i) => a + i.qty, 0);
    return { subtotal: Math.round(st * 100) / 100, totalItems: ti };
  }, [items]);

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, subtotal, totalItems }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
