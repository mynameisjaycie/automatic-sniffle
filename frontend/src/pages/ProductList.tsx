import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Product } from '../types';

// Keep currency display consistent across the list.
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 * Product list page that loads all products and renders
 * clear loading and error states.
 */
export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    async function loadProducts() {
      try {
        const fetchedProducts = await api.getProducts();
        if (!isActive) return;
        setProducts(fetchedProducts);
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

  return (
    <div>
      <h1>Products</h1>

      {isLoading && <p>Loading products...</p>}

      {!isLoading && errorMessage && (
        <p role="alert">Error: {errorMessage}</p>
      )}

      {!isLoading && !errorMessage && (
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              <Link to={`/products/${product.id}`}>{product.name}</Link>{' '}
              <span>{currencyFormatter.format(product.price)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
