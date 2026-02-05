/**
 * Validate the POST /api/orders request body.
 * Ensures a non-empty items array where each item has a non-empty productId
 * and a positive integer quantity; otherwise responds with 400.
 */
function validateOrderBody(req, res, next) {
  const requestBody = req.body;
  const orderItems = requestBody?.items;

  if (!Array.isArray(orderItems) || orderItems.length === 0) {
    return res.status(400).json({ error: 'Items must be a non-empty array.' });
  }

  const hasOnlyValidItems = orderItems.every((orderItem) => {
    if (!orderItem || typeof orderItem !== 'object') return false;

    const productId = orderItem.productId;
    const quantity = orderItem.quantity;

    const hasValidProductId =
      typeof productId === 'string' && productId.trim().length > 0;
    const hasValidQuantity =
      Number.isInteger(quantity) && quantity > 0;

    return hasValidProductId && hasValidQuantity;
  });

  if (!hasOnlyValidItems) {
    return res.status(400).json({
      error: 'Each item must have a non-empty productId and a positive integer quantity.',
    });
  }

  return next();
}

module.exports = { validateOrderBody };
