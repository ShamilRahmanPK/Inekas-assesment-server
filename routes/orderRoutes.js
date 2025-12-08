import express from "express";
import multer from "multer";
import Order from "../models/Order.js";

const router = express.Router();

// ⚡ Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// ⚡ POST order (multiple photos)
router.post("/", upload.array("images"), async (req, res) => {
  try {
    const { paperType, totalAmount, paymentMethod, deliveryAddress } = req.body;

    // Parse items meta data (size + quantity)
    const items = JSON.parse(req.body.items);

    // Match files to items
    const finalItems = items.map((item, idx) => ({
      ...item,
      image: req.files[idx] ? req.files[idx].path : null,
    }));

    const order = await Order.create({
      paperType,
      totalAmount,
      paymentMethod,
      deliveryAddress,
      items: finalItems,
    });

    res.json({ success: true, order });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Server error" });
  }
});

export default router;
