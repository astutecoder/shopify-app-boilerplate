const { Schema, model } = require('mongoose');

const ShopSchma = new Schema(
  {
    domain: String,
    password: String,
    scope: String,
    installedAt: { type: Date, defautl: Date.now },
  },
  {
    timestamps: true,
  }
);

module.exports = model('Shop', ShopSchma);
