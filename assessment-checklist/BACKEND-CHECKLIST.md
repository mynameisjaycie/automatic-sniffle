# Backend Checklist (Requirements + Commands)

Each item maps the requirement to a concrete API check in the same order.

1. [ ] `GET /api/health` returns success.
   ```
   curl -s http://localhost:3001/api/health | jq .
   ```

2. [ ] `GET /api/products` returns a list of products.
   ```
   curl -s http://localhost:3001/api/products | jq '.[0:3]'
   ```

3. [ ] `GET /api/products/:id` returns the product when found.
   ```
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/products/prod1
   curl -s http://localhost:3001/api/products/prod1 | jq .
   ```

4. [ ] `GET /api/products/:id` returns `404` with `{ error: 'Product not found' }` when missing.
   ```
   curl -s -o /dev/null -w "%{http_code}\n" http://localhost:3001/api/products/does-not-exist
   curl -s http://localhost:3001/api/products/does-not-exist | jq .
   ```

5. [ ] `POST /api/orders` accepts valid input and succeeds (201). (Confirms middleware called `next()`.)
   ```
   curl -s -o /dev/null -w "%{http_code}\n" \
     -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"prod1","quantity":2}]}' \
     http://localhost:3001/api/orders
   curl -s -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"prod1","quantity":2}]}' \
     http://localhost:3001/api/orders | jq .
   ```

6. [ ] `POST /api/orders` validation rejects when `items` is missing, not an array, or empty.
   ```
   curl -s -o /dev/null -w "%{http_code}\n" \
     -H "Content-Type: application/json" \
     -d '{}' \
     http://localhost:3001/api/orders
   curl -s -H "Content-Type: application/json" \
     -d '{}' \
     http://localhost:3001/api/orders | jq .
   curl -s -o /dev/null -w "%{http_code}\n" \
     -H "Content-Type: application/json" \
     -d '{"items":[]}' \
     http://localhost:3001/api/orders
   curl -s -H "Content-Type: application/json" \
     -d '{"items":[]}' \
     http://localhost:3001/api/orders | jq .
   ```

7. [ ] `POST /api/orders` validation rejects when any item is missing `productId` or `quantity`.
   ```
   curl -s -o /dev/null -w "%{http_code}\n" \
     -H "Content-Type: application/json" \
     -d '{"items":[{"quantity":2}]}' \
     http://localhost:3001/api/orders
   curl -s -H "Content-Type: application/json" \
     -d '{"items":[{"quantity":2}]}' \
     http://localhost:3001/api/orders | jq .
   curl -s -o /dev/null -w "%{http_code}\n" \
     -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"prod1"}]}' \
     http://localhost:3001/api/orders
   curl -s -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"prod1"}]}' \
     http://localhost:3001/api/orders | jq .
   ```

8. [ ] `POST /api/orders` validation rejects when `productId` is not a non-empty string.
   ```
   curl -s -o /dev/null -w "%{http_code}\n" \
     -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"","quantity":1}]}' \
     http://localhost:3001/api/orders
   curl -s -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"","quantity":1}]}' \
     http://localhost:3001/api/orders | jq .
   ```

9. [ ] `POST /api/orders` validation rejects when `quantity` is not a positive integer.
   ```
   curl -s -o /dev/null -w "%{http_code}\n" \
     -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"prod1","quantity":0}]}' \
     http://localhost:3001/api/orders
   curl -s -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"prod1","quantity":0}]}' \
     http://localhost:3001/api/orders | jq .
   curl -s -o /dev/null -w "%{http_code}\n" \
     -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"prod1","quantity":1.5}]}' \
     http://localhost:3001/api/orders
   curl -s -H "Content-Type: application/json" \
     -d '{"items":[{"productId":"prod1","quantity":1.5}]}' \
     http://localhost:3001/api/orders | jq .
   ```
