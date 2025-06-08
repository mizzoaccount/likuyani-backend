const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  street: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  postalCode: { type: String, required: true }
});

const itemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  designer: { type: String, required: true },
  size: { type: String, required: true },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }
});

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customer: {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: addressSchema, required: true }
  },
  delivery: {
    method: { type: String, required: true },
    option: {
      id: { type: String, required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      time: { type: String, required: false }
    },
    cost: { type: Number, required: true }
  },
  payment: {
    method: { type: String, required: true },
    option: {
      id: { type: String, required: true },
      name: { type: String, required: true }
    }
  },
  items: [itemSchema],
  totals: {
    subtotal: { type: Number, required: true },
    shipping: { type: Number, required: true },
    tax: { type: String, required: true },
    total: { type: Number, required: true }
  },
  status: { type: String, default: 'processing', enum: ['processing', 'shipped', 'delivered', 'cancelled'] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Order', orderSchema);