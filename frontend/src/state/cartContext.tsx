import { createContext, useContext, useMemo, useState } from 'react';
import type { ReactNode } from 'react';

export type CartItem = {
  productId: string;
  quantity: number;
};

type CartContextValue = {
  cartItems: CartItem[];
  addToCart: (productId: string) => void;
  lastAddedProductId: string | null;
};

const CartContext = createContext<CartContextValue | null>(null);

/**
 * Cart provider that keeps cart items in memory for the session.
 */
export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [lastAddedProductId, setLastAddedProductId] = useState<string | null>(null);

  function addToCart(productId: string) {
    setCartItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.productId === productId);
      if (!existingItem) {
        setLastAddedProductId(productId);
        return [...currentItems, { productId, quantity: 1 }];
      }

      setLastAddedProductId(productId);
      return currentItems.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    });
  }

  const value = useMemo(
    () => ({ cartItems, addToCart, lastAddedProductId }),
    [cartItems, lastAddedProductId]
  );

  return (
    <CartContext.Provider value={value}>{children}</CartContext.Provider>
  );
}

/**
 * Access cart state and actions. Must be used inside CartProvider.
 */
export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider.');
  }
  return context;
}
