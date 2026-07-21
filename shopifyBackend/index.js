import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/database.js";
import authRoutes from "./routes/authRoutes.js";
import nicheRoutes from "./routes/nicheRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import debugRoutes from "./routes/debugRoutes.js";
import webhookRoutes from "./routes/webhookRoutes.js";
import { verifyShopifyRequest } from "./middlewares/shopifyVerification.js";

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// Initialize Express app
const app = express();

// Test route
app.get("/demi", (req, res) => {
  res.json({
    message: "Hello World"
  });
});

// CORS configuration allowing all origins
const corsOptions = {
  origin: true, // Allow all origins
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Middleware to capture raw body for webhook HMAC verification
// This MUST come before express.json() for webhooks
app.use('/webhooks', express.text({ type: 'application/json' }), (req, res, next) => {
  // Store the raw body for HMAC verification
  req.rawBody = req.body;
  next();
});

// Regular JSON parsing for all other routes
app.use(express.json());

// Shopify OAuth callback route with HMAC verification
app.get("/shopify/callback", verifyShopifyRequest, (req, res) => {
  const { shop, code } = req.query;

  if (!shop || !code) {
    return res.status(400).send("Missing shop or code");
  }

  // HMAC is verified at this point
  // Exchange code for access token
  res.send("HMAC Verified! Now exchange code for access token.");
});

// Shopify auth route
app.get("/shopify/auth", (req, res) => {
  console.log("Shopify Auth Route accessed");
  res.json({
    message: "Shopify Auth Route"
  });
});

// Mount routes
app.use("/webhooks", webhookRoutes);
app.use("/", authRoutes);
app.use("/api/niches", nicheRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/debug", debugRoutes);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);
