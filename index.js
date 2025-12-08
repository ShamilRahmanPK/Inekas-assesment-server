const express = require("express");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
// Assuming this file connects to your MongoDB database
require('./config/connection') 


const fs = require("fs");
const uploadDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, "uploads")),
  filename: (req, file, cb) =>
    cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded images - accessible via http://localhost:5000/uploads/filename.jpg
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// --- Mongoose Schema ---
const { Schema } = mongoose;
const orderSchema = new Schema({
  paperType: String,
  totalAmount: Number,
  discountPercent: Number,
  promoCode: String,
  images: [
    {
      filename: String,     // Multer-generated unique filename (includes extension)
      originalname: String, // The original name from the user's computer
      quantity: Number,
      size: String,
    },
  ],
  name: String,
  phone: String,
  street: String,
  city: String,
  emirate: String,
  paymentId: String,
}, { timestamps: true });

const Order = mongoose.model("Order", orderSchema);

// --- POST order API ---
app.post("/api/order", upload.array("images"), async (req, res) => {
  try {
    const {
      paperType,
      totalAmount,
      discountPercent,
      promoCode,
      name,
      phone,
      street,
      city,
      emirate,
      paymentId,
    } = req.body;

    const images = req.files.map((file, index) => {
      const quantity = req.body[`quantity_${index}`] || 1; 
      const size = req.body[`size_${index}`] || 'Unknown Size'; 
      
      return {
        filename: file.filename,
        originalname: file.originalname, // Save the original name for downloads
        quantity: Number(quantity), 
        size: size,
      };
    });

    const newOrder = new Order({
      paperType,
      totalAmount,
      discountPercent,
      promoCode,
      images,
      name,
      phone,
      street,
      city,
      emirate,
      paymentId,
    });

    await newOrder.save();
    res.status(200).json({ message: "Order saved successfully", order: newOrder });
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ 
        message: "Server error saving order. Check console for details.", 
        error: err.message 
    });
  }
});

// --- GET All Orders API for Admin Page ---
app.get("/api/orders", async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });

    const enhancedOrders = orders.map(order => ({
      ...order.toObject(),
      images: order.images.map(img => ({
        ...img,
        // The path is relative to the server's base URL /uploads
        path: `uploads/${img.filename}`, 
      }))
    }));
    
    res.status(200).json({ 
        message: "Orders fetched successfully", 
        orders: enhancedOrders 
    });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ 
        message: "Server error fetching orders.", 
        error: err.message 
    });
  }
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));