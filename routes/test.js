const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const axios = require('axios');
 
router.post('/login-test', async (req, res) => {
  try {
    const response = await axios.post(
      `https://codsolution.co/ship/Api/loginApi?email=${process.env.COD_EMAIL}&password=${process.env.COD_PASSWORD}`,
      {}, 
      {
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      }
    );

    res.status(200).json({
      message: 'Login successful',
      token: response.data.bearer_token,
      user: response.data.user_data,
      data: response.data
    });
  } catch (error) {
    console.error('Login failed:', error.response?.data || error.message);
    res.status(500).json({
      message: 'Login failed',
      error: error.response?.data || error.message
    });
  }
});




module.exports = router;