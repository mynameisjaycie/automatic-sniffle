const { products } = require('../data/mockData');

function listProducts(_req, res) {
  res.json(products);
}

/**
 * Get a single product by id.
 * Responds with the product JSON when found; otherwise returns 404 with
 * `{ error: 'Product not found' }`.
 */
function getProductById(req, res) {
  const { id } = req.params;
  const product = products.find((item) => item.id === id);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  return res.json(product);
}

module.exports = { listProducts, getProductById };
