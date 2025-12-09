const express = require("express");
const cors = require("cors");
const path = require("path");
const orderRoutes = require("./routes/orderRoutes");

// Import MongoDB connection
require("./config/connection"); // this runs your connection.js code

const app = express();
app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/api/order", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/orders", orderRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
