const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Order = require("../models/Order.js");

const router = express.Router();

// Multer setup
const uploadDir = path.join("uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });


//  POST /api/order   (CREATE ORDER)
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const { totalAmount, discountPercent, promoCode, paymentId } = req.body;

    // -------- Address Section --------
    const deliveryAddress = {
      name: req.body.name || "",
      phone: req.body.phone || "",
      street: req.body.street || "",
      city: req.body.city || "",
      emirate: req.body.emirate || "",
      lat: Number(req.body.lat) || 0,
      lng: Number(req.body.lng) || 0,
      locationURL: req.body.locationURL || "",
    };

    // -------- Images + Meta Section --------
    const items = req.files.map((file, index) => ({
      filename: file.filename,
      originalname: file.originalname,

      size: req.body[`size_${index}`] || "",
      quantity: Number(req.body[`quantity_${index}`]) || 1,
      paperType: req.body[`paperType_${index}`] || "Normal",
    }));

    const newOrder = new Order({
      totalAmount: Number(totalAmount),
      discountPercent: Number(discountPercent) || 0,
      promoCode: promoCode || "",
      paymentId: paymentId || "DEMO_PAYMENT_ID",
      items,
      deliveryAddress,
    });

    await newOrder.save();

    res.status(200).json({ success: true, order: newOrder });

  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


// orderRoutes.js
router.get("/", async (req, res) => {
  console.log("inside getorders api backend");
  
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Error fetching orders:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
