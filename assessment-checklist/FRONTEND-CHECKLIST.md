# Frontend Checklist

This checklist covers every frontend requirement from `ASSESSMENT.md`.

## Product List Page (`/products`)

1. [X] Fetches products from `GET /api/products` on load.
2. [ ] Shows a loading state while fetching.
3. [ ] Shows an error message on request failure.
4. [ ] Displays product name, price, and a link to the product detail page.

## Product Detail Page (`/products/:id`)

1. [ ] Uses the route param to fetch `GET /api/products/:id`.
2. [ ] Shows a loading state while fetching.
3. [ ] Shows an error state if the request fails.
4. [ ] Shows a not-found message for 404 responses.
5. [ ] Displays name, description, price, and other useful fields.

## Cart Page (`/cart`)

1. [ ] Cart items are kept in state (seeded or via add-to-cart).
2. [ ] Each cart item resolves product details from the API.
3. [ ] Displays line items: name, quantity, unit price, line total.
4. [ ] Displays a cart total (sum of line totals).

## Optional Enhancements

### Filter or Sort Products
1. [ ] Filter by category (using `GET /api/categories` as needed).
2. [ ] Sort products (e.g., by price).

### Place Order
1. [ ] “Place order” sends `POST /api/orders` with `{ customerEmail?, items }`.
2. [ ] Shows success and error feedback to the user.

## Error State Checks

1. [ ] Stop backend and confirm list/detail/cart show error states.
