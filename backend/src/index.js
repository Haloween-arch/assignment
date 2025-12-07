const express = require("express");
const cors = require("cors");
const { loadCSV } = require("./utils/loadData");
const salesRoutes = require("./routes/sales.routes");

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Root route
app.get("/", (_req, res) => {
  res.json({ message: "TruEstate Retail Sales API" });
});

// Sales routes
app.use("/api/sales", salesRoutes);

// Load CSV → Start server only after data is ready
loadCSV()
  .then(() => {
    console.log("✅ Sales data loaded successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Failed to load sales data:", err);
    process.exit(1);
  });
