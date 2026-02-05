import { useEffect, useMemo, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../state/cartContext';
import type { Product } from '../types';

// Keep currency display consistent across the product detail view.
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

/**
 * Product detail page that loads a single product by id and renders
 * clear loading and error states.
 */
export default function ProductDetail() {
  const [searchParams] = useSearchParams();
  const { id } = useParams<{ id: string }>();
  const productId = useMemo(() => id?.trim() ?? '', [id]);
  const { addToCart, lastAddedProductId } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const shouldSimulateFailure =
    import.meta.env.DEV && searchParams.get('fail') === 'true';

  useEffect(() => {
    let isActive = true;

    async function loadProduct() {
      if (!productId) {
        setErrorMessage('Product not found.');
        setIsLoading(false);
        return;
      }

      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (shouldSimulateFailure) {
          throw new Error('Simulated request failure.');
        }
        const fetchedProduct = await api.getProduct(productId);
        if (!isActive) return;
        setProduct(fetchedProduct);
        setErrorMessage(null);
      } catch (error) {
        if (!isActive) return;
        const message = error instanceof Error ? error.message : 'Unable to load product.';
        setErrorMessage(message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadProduct();

    return () => {
      isActive = false;
    };
  }, [productId, shouldSimulateFailure]);

  return (
    <div>
      <h1>Product Detail</h1>

      {isLoading && <p>Loading product...</p>}

      {!isLoading && errorMessage && (
        <div role="alert">
          <p>Error: {errorMessage}</p>
          <Link to="/products">Back to products</Link>
        </div>
      )}

      {!isLoading && !errorMessage && product && (
        <section>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <p>
            <strong>{currencyFormatter.format(product.price)}</strong>
          </p>
          <button
            type="button"
            onClick={() => addToCart(product.id)}
          >
            Add to cart
          </button>
          {lastAddedProductId === product.id && (
            <span role="status"> Added to cart.</span>
          )}
          <p>{product.inStock ? 'In stock' : 'Out of stock'}</p>
          <p>Category: {product.categoryId}</p>
          <p>Tags: {product.tags.join(', ')}</p>
        </section>
      )}
    </div>
  );
}
