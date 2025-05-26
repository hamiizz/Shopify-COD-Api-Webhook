require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const webhookRoutes = require('./routes/webhooks');
const testRoutes = require('./routes/test');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json({
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));
 
// Routes
app.use('/webhooks', webhookRoutes);

// Test Route
app.use('/test', testRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.set('ngrok-skip-browser-warning', 'true');
  res.send('Shopify COD Integration App');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});