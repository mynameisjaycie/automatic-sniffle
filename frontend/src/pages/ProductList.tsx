import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import { useCart } from '../state/cartContext';
import type { Category, Product } from '../types';

// Keep currency display consistent across the list.
const currencyFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

// Provide explicit sort labels used by the UI dropdown.
const sortOptions = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
] as const;

type SortOption = (typeof sortOptions)[number]['value'];

/**
 * Product list page that loads all products and renders
 * clear loading and error states.
 */
export default function ProductList() {
  const [searchParams] = useSearchParams();
  const { addToCart, lastAddedProductId } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState('all');
  const [selectedSortOption, setSelectedSortOption] = useState<SortOption>('featured');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const shouldSimulateFailure =
    import.meta.env.DEV && searchParams.get('fail') === 'true';

  useEffect(() => {
    let isActive = true;

    // Fetch both products and categories for filtering and display.
    async function loadProductData() {
      try {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        if (shouldSimulateFailure) {
          throw new Error('Simulated request failure.');
        }
        const [fetchedProducts, fetchedCategories] = await Promise.all([
          api.getProducts(),
          api.getCategories(),
        ]);
        if (!isActive) return;
        setProducts(fetchedProducts);
        setCategories(fetchedCategories);
        setErrorMessage(null);
      } catch (error) {
        if (!isActive) return;
        const message = error instanceof Error ? error.message : 'Unable to load products.';
        setErrorMessage(message);
      } finally {
        if (isActive) setIsLoading(false);
      }
    }

    void loadProductData();

    return () => {
      isActive = false;
    };
  }, [shouldSimulateFailure]);

  // Derive the visible list based on category and sort selection.
  const filteredAndSortedProducts = useMemo(() => {
    const visibleProducts =
      selectedCategoryId === 'all'
        ? products
        : products.filter((product) => product.categoryId === selectedCategoryId);

    if (selectedSortOption === 'price-asc') {
      return [...visibleProducts].sort((a, b) => a.price - b.price);
    }

    if (selectedSortOption === 'price-desc') {
      return [...visibleProducts].sort((a, b) => b.price - a.price);
    }

    return visibleProducts;
  }, [products, selectedCategoryId, selectedSortOption]);

  return (
    <div>
      <h1>Products</h1>

      {isLoading && <p>Loading products...</p>}

      {!isLoading && errorMessage && (
        <p role="alert">Error: {errorMessage}</p>
      )}
      
      {!isLoading && !errorMessage && (
        <>
          {import.meta.env.DEV && (
            <section>
              <p>Developer Tools</p>
              <menu>
                <li>
                  <Link to="/products/prod1?fail=true">
                    Simulate product detail failure
                  </Link>
                </li>
              </menu>
            </section>
          )}
          
          <section>
            <label htmlFor="category-filter">Category: </label>
            <select
              id="category-filter"
              value={selectedCategoryId}
              onChange={(event) => setSelectedCategoryId(event.target.value)}
            >
              <option value="all">All categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </section>

          <section>
            <label htmlFor="sort-filter">Sort by: </label>
            <select
              id="sort-filter"
              value={selectedSortOption}
              onChange={(event) => setSelectedSortOption(event.target.value as SortOption)}
            >
              {sortOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </section>
          
          {filteredAndSortedProducts.length === 0 ? (
            <p>No products match this selection.</p>
          ) : (
            <ul>
              {filteredAndSortedProducts.map((product) => (
                <li key={product.id}>
                  <Link to={`/products/${product.id}`}>{product.name}</Link>{' '}
                  <span>{currencyFormatter.format(product.price)}</span>
                  <button
                    type="button"
                    onClick={() => addToCart(product.id)}
                  >
                    Add to cart
                  </button>
                  {lastAddedProductId === product.id && (
                    <span role="status"> Added to cart.</span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  );
}
