import mongoose from "mongoose";

// Item Schema (each uploaded image entry)
const ItemSchema = new mongoose.Schema({
  size: { type: String },
  quantity: { type: Number }
});

// Address Schema
const AddressSchema = new mongoose.Schema({
  name: { type: String, default: "" },
  phone: { type: String, default: "" },
  street: { type: String, default: "" },
  city: { type: String, default: "" },
  emirate: { type: String, default: "" }
});

// Main Order Schema
const OrderSchema = new mongoose.Schema(
  {
    paperType: { type: String },
    totalAmount: { type: Number },
    paymentMethod: { type: String, default: "Demo Payment" },

    deliveryAddress: { type: AddressSchema, default: {} },

    items: { type: [ItemSchema], default: [] }
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);

