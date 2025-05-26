const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const { sendOrderToCOD } = require('../services/codApi');

const app = express();
app.use(express.raw({ type: 'application/json' }));

// Middleware to verify Shopify Webhook
function verifyShopifyWebhook(req, res, next) {
  const hmac = req.get('X-Shopify-Hmac-Sha256');
  const body = req.rawBody; // Ensure this is raw
  const computedHash = crypto
    .createHmac('sha256', process.env.SHOPIFY_WEBHOOK_SECRET)
    .update(body, 'utf8', 'hex')
    .digest('base64');

  console.log('Received HMAC:', hmac);
  console.log('Computed HMAC:', computedHash);
  
  // Log the body (for debugging, ensure not logging sensitive info in production)
  console.log('Request RawBody:', body);
  console.log('Request Body:', req.body);

  // Check if the computed HMAC matches the one Shopify sent
  if (computedHash === hmac) {
    console.log('Webhook HMAC verified successfully');
    next();
  } else {
    console.log('Webhook HMAC verification failed');
    res.status(401).send('Unauthorized');
  }
}

// Order Created Webhook
router.post('/orders/create', async (req, res) => {
  const order = req.body;
  try {
    await sendOrderToCOD(order);
    res.set('ngrok-skip-browser-warning', 'true');
    res.status(200).send('Order processed');
  } catch (error) {
    console.error('Error sending order to COD:', error);
    res.set('ngrok-skip-browser-warning', 'true'); 
    res.status(500).send('Error processing order');
  }
});

router.post('/cart/update', async (req, res) => {
  try {
    const cart = req.body;

    console.log('Cart updated. Line items:');
    console.log(cart); // Log all cart line items

    res.status(200).json({ message: 'Cart update received' });
  } catch (error) {
    console.error('Error handling cart update:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


// Order Fulfilled Webhook
router.post('/orders/fulfilled', verifyShopifyWebhook, async (req, res) => {
  const order = req.body;
  console.log('Order Fulfilled webhook received. Placeholder for COD update:', order.id);
  res.status(200).send('Fulfillment received');
});

module.exports = router;