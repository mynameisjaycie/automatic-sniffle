import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div>
      <h1>Welcome to DecryptCode Shop</h1>
      <p>Browse products and complete the assessment tasks.</p>
      <Link to="/products">View products</Link>
      {import.meta.env.DEV && (
        <div>
          <Link
            to="/products"
            state={{ simulateFailure: true }}
          >
            View products (simulate failure)
          </Link>
        </div>
      )}
    </div>
  );
}
