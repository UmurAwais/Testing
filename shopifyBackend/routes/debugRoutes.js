import express from "express";
import { findUserByEmail } from "../services/userService.js";

const router = express.Router();

/**
 * @desc    Debug endpoint to check user's Shopify connection status
 * @route   GET /api/debug/user/:email
 * @access  Public (should be protected in production)
 */
router.get("/user/:email", async (req, res) => {
    try {
        const { email } = req.params;
        console.log(`🔍 Debug: Checking user ${email}`);

        const user = await findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Return sanitized debug info
        const debugInfo = {
            email: user.email,
            niche: user.niche,
            shopName: user.shopName,
            shopify: {
                shopDomain: user.shopify?.shopDomain || "Not set",
                connected: user.shopify?.connected || false,
                hasAccessToken: !!user.shopify?.accessToken,
                accessTokenLength: user.shopify?.accessToken?.length || 0,
                accessTokenPrefix: user.shopify?.accessToken?.substring(0, 10) || "None",
            },
            banners: {
                banner1: !!user.BannerImage1,
                banner2: !!user.BannerImage2,
            }
        };

        console.log("📊 Debug info:", debugInfo);
        res.json(debugInfo);
    } catch (err) {
        console.error("❌ Debug error:", err);
        res.status(500).json({ error: "Failed to fetch debug info" });
    }
});

/**
 * @desc    Clear user's Shopify connection (for testing)
 * @route   POST /api/debug/clear-connection
 * @access  Public (should be protected in production)
 */
router.post("/clear-connection", async (req, res) => {
    try {
        const { email } = req.body;
        console.log(`🧹 Debug: Clearing Shopify connection for ${email}`);

        const User = (await import("../models/User.js")).default;
        const result = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    "shopify.accessToken": null,
                    "shopify.connected": false,
                }
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            success: true,
            message: "Connection cleared. Please reconnect your store.",
            shopDomain: result.shopify?.shopDomain
        });
    } catch (err) {
        console.error("❌ Clear connection error:", err);
        res.status(500).json({ error: "Failed to clear connection" });
    }
});

/**
 * @desc    Manually update access token (for testing with custom app tokens)
 * @route   POST /api/debug/update-token
 * @access  Public (should be protected in production)
 */
router.post("/update-token", async (req, res) => {
    try {
        const { email, accessToken } = req.body;

        if (!email || !accessToken) {
            return res.status(400).json({ error: "Email and accessToken are required" });
        }

        console.log(`🔧 Debug: Updating access token for ${email}`);

        const User = (await import("../models/User.js")).default;
        const result = await User.findOneAndUpdate(
            { email },
            {
                $set: {
                    "shopify.accessToken": accessToken.trim(),
                    "shopify.connected": true,
                }
            },
            { new: true }
        );

        if (!result) {
            return res.status(404).json({ error: "User not found" });
        }

        res.json({
            success: true,
            message: "Access token updated successfully",
            shopDomain: result.shopify?.shopDomain,
            tokenLength: accessToken.length
        });
    } catch (err) {
        console.error("❌ Update token error:", err);
        res.status(500).json({ error: "Failed to update token" });
    }
});

export default router;
