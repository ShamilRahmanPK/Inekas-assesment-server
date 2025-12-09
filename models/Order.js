const mongoose = require('mongoose');

// Each uploaded image's metadata
const ItemSchema = new mongoose.Schema({
  filename: { type: String },
  originalname: { type: String },
  size: { type: String },
  quantity: { type: Number },
  paperType: { type: String },
});

// Delivery Address
const AddressSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  emirate: { type: String, default: "" },
  lat: { type: Number },
  lng: { type: Number },
  locationURL: { type: String },
});

// Main Order schema
const OrderSchema = new mongoose.Schema(
  {
    totalAmount: { type: Number },
    discountPercent: { type: Number, default: 0 },
    promoCode: { type: String, default: "" },
    paymentId: { type: String, default: "DEMO_PAYMENT_ID" },
    items: { type: [ItemSchema], default: [] },
    deliveryAddress: { type: AddressSchema, default: {} },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
