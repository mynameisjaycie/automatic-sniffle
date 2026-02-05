import { useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import type { Product } from '../types';

type CartItem = {
  productId: string;
  quantity: number;
};

// Keep currency display consistent across the cart.
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Seeded items for demo and assessment flow.
const seededCartItems: CartItem[] = [
  { productId: 'prod1', quantity: 1 },
  { productId: 'prod3', quantity: 2 },
];

/**
 * Cart page that resolves product details for seeded cart items and
 * displays line totals with a cart summary and a place-order action.
 */
export default function Cart() {
  const [cartItems] = useState<CartItem[]>(seededCartItems);
  const [productsById, setProductsById] = useState<Map<string, Product>>(new Map());
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [orderStatusMessage, setOrderStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    // Fetch product details needed to render cart line items.
    async function loadProducts() {
      try {
        const products = await api.getProducts();
        if (!isActive) return;
        const productMap = new Map(products.map((product) => [product.id, product]));
        setProductsById(productMap);
        setErrorMessage(null);
      } catch (error) {
        if (!isActive) return;
        const message = error instanceof Error ? error.message : 'Unable to load products.';
        setErrorMessage(message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadProducts();

    return () => {
      isActive = false;
    };
  }, []);

  // Resolve cart items into display-ready line items.
  const lineItems = useMemo(() => {
    return cartItems.map((cartItem) => {
      const product = productsById.get(cartItem.productId) ?? null;
      const unitPrice = product?.price ?? 0;
      const lineTotal = unitPrice * cartItem.quantity;

      return {
        ...cartItem,
        product,
        unitPrice,
        lineTotal,
      };
    });
  }, [cartItems, productsById]);

  // Sum line totals to show the cart total.
  const cartTotal = useMemo(() => {
    return lineItems.reduce((total, item) => total + item.lineTotal, 0);
  }, [lineItems]);

  // Send the order to the backend and report success or failure.
  async function handlePlaceOrder() {
    setIsPlacingOrder(true);
    setOrderStatusMessage(null);

    try {
      const orderPayload = {
        items: cartItems.map((cartItem) => ({
          productId: cartItem.productId,
          quantity: cartItem.quantity,
        })),
      };

      await api.createOrder(orderPayload);
      setOrderStatusMessage('Order placed successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unable to place order.';
      setOrderStatusMessage(message);
    } finally {
      setIsPlacingOrder(false);
    }
  }

  return (
    <div>
      <h1>Cart</h1>
      {isLoading && <p>Loading cart...</p>}

      {!isLoading && errorMessage && (
        <p role="alert">Error: {errorMessage}</p>
      )}

      {!isLoading && !errorMessage && (
        <>
          {lineItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <>
              <ul>
                {lineItems.map((item) => (
                  <li key={item.productId}>
                    <div>
                      <strong>{item.product?.name ?? 'Unknown product'}</strong>
                    </div>
                    <div>Quantity: {item.quantity}</div>
                    <div>Unit price: {currencyFormatter.format(item.unitPrice)}</div>
                    <div>Line total: {currencyFormatter.format(item.lineTotal)}</div>
                  </li>
                ))}
              </ul>
              <p>
                <strong>Total: {currencyFormatter.format(cartTotal)}</strong>
              </p>
              <button type="button" onClick={() => void handlePlaceOrder()} disabled={isPlacingOrder}>
                {isPlacingOrder ? 'Placing order...' : 'Place order'}
              </button>
              {orderStatusMessage && (
                <p role="status">{orderStatusMessage}</p>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
