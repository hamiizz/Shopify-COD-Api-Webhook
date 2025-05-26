# Shopify to COD Solution Integration App

This app receives order webhooks from Shopify and sends order data to the COD Solution API.

## Features
- Handles `orders/create` and `orders/fulfilled` webhooks
- Sends order data to COD API on creation
- Logs fulfillment event for future COD update

## Requirements
- Node.js
- ngrok
- Shopify developer account

## Setup Instructions

1. **Clone and install dependencies**
```bash
npm install
```

2. **Configure environment**
Rename `.env.example` to `.env` and fill in:
- Shopify webhook secret
- COD login email/password
- COD client_id

3. **Run the server**
```bash
node server.js
```

4. **Expose with ngrok**
```bash
ngrok http 3000
```
Copy the HTTPS URL provided.

5. **Add webhooks to Shopify**
Go to Shopify Admin > Settings > Notifications > Webhooks
- orders/create → `https://your-ngrok-url/webhooks/orders/create`
- orders/fulfilled → `https://your-ngrok-url/webhooks/orders/fulfilled`

## Notes
- Fulfillment webhook only logs event for now (COD API has no update endpoint)
- Make sure to verify Shopify webhook signature using your shared secret