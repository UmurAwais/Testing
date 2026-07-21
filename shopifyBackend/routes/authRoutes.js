import express from "express";
import {
    handleGoogleLogin,
    initiateShopifyAuth,
    handleShopifyCallback,
    signup,
    login,
    getUserData,
} from "../controllers/authController.js";
import {
    publishTheme,
    uploadThemeImages,
    addTopSellingProducts,
    deleteAllProducts,
    deleteBannerFiles
} from "../controllers/themeController.js";

const router = express.Router();

// Google authentication
router.post("/google", handleGoogleLogin);

// Shopify OAuth
router.post("/auth", initiateShopifyAuth);
router.get("/auth/callback", handleShopifyCallback);
router.get("/Oauth/callback", handleShopifyCallback);
router.get("/callback", handleShopifyCallback);
router.get("/some/redirect/uri", handleShopifyCallback);

// Email/Password authentication
router.post("/api/auth/signup", signup);
router.post("/api/auth/login", login);

// User data
router.get("/api/user/:email", getUserData);

// Theme operations
router.post("/api/theme", publishTheme);
router.post("/api/upload-theme-images", uploadThemeImages);

// Product operations
router.post("/api/products/add-top-selling", addTopSellingProducts);
router.post("/api/products/delete-all", deleteAllProducts);

// File operations
router.post("/api/files/delete-banners", deleteBannerFiles);

export default router;
