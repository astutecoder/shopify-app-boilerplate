const dotenv = require('dotenv');
dotenv.config();

const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const fetch = require('node-fetch');
const ShopModel = require('./models/Shop.model');

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('DB connected');

    const app = express();
    const port = process.env.PORT || 3546;

    app.use(cors());
    app.use(express.json());

    app.get('/', (req, res, next) => {
      res.json({ a: 1 });
    });

    app.post('/auth/check-me', async (req, res, next) => {
      const { shop: shopQuery } = req.body;
      const shop = await ShopModel.findOne({ domain: shopQuery });

      if (!shop) {
        return res.json({ isAuthenticated: false, accessToken: null });
      }

      const accessToken = jwt.sign(
        { shop: shop._id },
        process.env.SHOPIFY_CLIENT_SECRET
      );
      return res.json({ accessToken, isAuthenticated: true });
    });

    app.post('/auth/get-shopify-token', async (req, res, next) => {
      const { shop: shopQuery, code } = req.body;

      const authUrl = `https://${shopQuery}/admin/oauth/access_token?code=${code}&client_id=${process.env.SHOPIFY_CLIENT_ID}&client_secret=${process.env.SHOPIFY_CLIENT_SECRET}`;
      const response = await fetch(authUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const { access_token, scope } = await response.json();

      const shop = await ShopModel.create({
        domain: shopQuery,
        password: access_token,
        scope,
      });

      if (!shop) {
        return res.json({ isAuthenticated: false, accessToken: null });
      }

      const accessToken = jwt.sign(
        { shop: shop._id },
        process.env.SHOPIFY_CLIENT_SECRET
      );
      return res.json({ accessToken, isAuthenticated: true });
    });

    app.listen(port, () => {
      console.log('🚀 app server listening to port:', port);
    });
  })
  .catch((err) => {
    console.log(err);
  });
