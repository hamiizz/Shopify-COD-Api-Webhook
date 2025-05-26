const axios = require('axios');

async function getCODToken() {
 const response = await axios.post(
    `https://codsolution.co/ship/Api/loginApi?email=${process.env.COD_EMAIL}&password=${process.env.COD_PASSWORD}`,
    {}, 
    {
      headers: {
        'ngrok-skip-browser-warning': 'true'
      }
    }
  );
  console.log(response.data);
  return response.data;
}

async function sendOrderToCOD(order) {
  const token = await getCODToken();

  // Format line items with quantity and name
  const itemDescriptions = order.line_items
    .map(item => `${item.quantity}x ${item.name}`)
    .join(', ');

  // Check if payment is COD
  const isCOD = order.payment_gateway_names.includes('Cash on Delivery (COD)');

  // Set description and amount based on payment method
  let description = `Shopify Order - Items: ${itemDescriptions}`;
  let amount = order.total_price;

  if (!isCOD) {
    amount = '0.00';
    description += `\nThe order is paid via online payment. Order amount: ${order.total_price}`;
  }
 
  const payload = {
    name: order.shipping_address?.name || order.customer?.first_name || 'Unknown',
    customer_name: order.shipping_address?.name || order.customer?.first_name || 'Unknown',
    reference: order.id,
    customer_email: order.email || 'dummy@test.com',
    number: order.phone || order.shipping_address?.phone || '',
    service: 1,
    address: order.shipping_address?.address1 || '',
    city: order.shipping_address?.city || '',
    amount: amount,
    description: description,
    branded_content: "No",
    country: "2",
    whatsapp: order.phone || order.shipping_address?.phone || '',
    insurance: "No",
    client_id: token.user_data.id,
    location: ""
  };

  console.log("payload::: ", payload);

  const response = await axios.post('https://codsolution.co/ship/Api/order_create', payload, {
    headers: {
      Authorization: `Bearer ${token.bearer_token}`,
      'Content-Type': 'application/json'
    }
  });

  console.log('Order sent to COD:', response.data);
  return response.data;
}

module.exports = {
  sendOrderToCOD
};