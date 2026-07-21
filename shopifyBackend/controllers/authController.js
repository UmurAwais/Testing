import crypto from "crypto";
import { OAuth2Client } from 'google-auth-library';
import { SHOPIFY_CONFIG, REDIRECT_URLS, GOOGLE_CONFIG } from "../config/constants.js";
import User from "../models/User.js";
import ShopifyStore from "../models/ShopifyStore.js";
import Niche from "../models/Niche.js";
import * as userService from "../services/userService.js";
import * as shopifyService from "../services/shopifyService.js";

// Initialize Google OAuth client
const googleClient = new OAuth2Client(
    GOOGLE_CONFIG.CLIENT_ID,
    GOOGLE_CONFIG.CLIENT_SECRET
);

/**
 * @desc    Handle Google user login/signup
 * @route   POST /google
 * @access  Public
 */
export const handleGoogleLogin = async (req, res) => {
    try {
        const { email, name, picture, sub, token } = req.body;

        // Validate required fields
        if (!email || !sub) {
            return res.status(400).json({ error: "Invalid Google user data: email and sub are required" });
        }

        // Try to find user by sub (Google ID) first
        let user = await userService.findUserBySub(sub);

        // If not found by sub, try to find by email
        if (!user) {
            user = await userService.findUserByEmail(email);

            if (user) {
                // Update existing user with Google sub
                user = await userService.updateUserWithGoogle(user, sub, name, picture);
            } else {
                // Create new user with Google authentication
                user = await userService.createGoogleUser(email, name, picture, sub);
            }
        } else {
            // Update existing user info if needed
            if (name && user.name !== name) user.name = name;
            if (picture && user.picture !== picture) user.picture = picture;
            if (user.email !== email) user.email = email;
            await user.save();
        }

        // Return user data
        const userResponse = userService.formatUserResponse(user, email, name, picture, sub);

        console.log("✅ Google login successful for user:", user.email);
        console.log("📤 Sending response to frontend:", userResponse);
        res.json(userResponse);
    } catch (err) {
        console.error("❌ Google login error:", err);

        // Handle duplicate key error
        if (err.code === 11000) {
            const field = Object.keys(err.keyPattern)[0];
            return res.status(400).json({
                error: `User with this ${field} already exists. Please try logging in with email/password.`
            });
        }

        res.status(500).json({ error: "Failed to authenticate with Google" });
    }
};


/**
 * @desc    Initiate Shopify OAuth flow
 * @route   POST /auth
 * @access  Public
 */
export const initiateShopifyAuth = async (req, res) => {
    try {
        const { shop, email, niche, selectedBanners = [], selectedBannerImages = [] } = req.body;

        console.log("👉 initiateShopifyAuth called");
        console.log("Received body:", { shop, email, niche, selectedBanners, selectedBannerImages });

        if (!shop || !email) {
            console.log("❌ Missing shop or email:", { shop, email });
            return res.status(400).json({ error: "Missing shop or email parameter" });
        }

        // Normalize shop domain
        const shopDomain = shopifyService.normalizeShopDomain(shop);
        console.log("✅ Normalized shopDomain:", shopDomain);

        const state = crypto.randomBytes(16).toString("hex");
        console.log("Generated OAuth state:", state);

        // Map banners into schema fields
        const Banner1 = selectedBanners[0]
            ? {
                id: `banner-1`,
                name: selectedBanners[0],
                image: selectedBannerImages[0] || "",
            }
            : null;

        const Banner2 = selectedBanners[1]
            ? {
                id: `banner-2`,
                name: selectedBanners[1],
                image: selectedBannerImages[1] || "",
            }
            : null;

        // Update user
        console.log("🔍 Updating user in DB...");

        // Extract shop handle for reliable lookup during callback
        // shopDomain is already normalized to "ubiwear.myshopify.com"
        const shopHandle = shopDomain.replace(".myshopify.com", "");
        console.log("📝 Extracted shop handle:", shopHandle);

        const user = await userService.updateUserShopifyInfo(
            email,
            niche,
            shopHandle,  // Save just "ubiwear" instead of full URL
            shopDomain,  // Save "ubiwear.myshopify.com" in shopify.shopDomain
            Banner1,
            Banner2,
            selectedBannerImages[0] || "",
            selectedBannerImages[1] || ""
        );

        console.log("DB update result:", user);

        if (!user) {
            console.log("❌ User not found with this email:", email);
            return res.status(404).json({ error: "User not found with this email" });
        }

        // Encode success URL, email, and state into a single string for Shopify OAuth
        const successUrl = req.body.success_url || REDIRECT_URLS.SUCCESS;
        const statePayload = Buffer.from(JSON.stringify({
            nonce: state,
            successUrl: successUrl,
            email: email
        })).toString('base64');

        console.log("Encoded state payload:", statePayload);

        // Generate Shopify OAuth URL
        const authUrl = `https://${shopDomain}/admin/oauth/authorize?client_id=${SHOPIFY_CONFIG.CLIENT_ID}&scope=${SHOPIFY_CONFIG.SCOPES}&redirect_uri=${encodeURIComponent(
            SHOPIFY_CONFIG.REDIRECT_URI
        )}&state=${statePayload}`;

        console.log("✅ Generated authUrl:", authUrl);

        res.json({ authUrl });
    } catch (err) {
        console.error("🔥 initiateShopifyAuth error:", err);
        res.status(500).json({ error: "Failed to initiate Shopify auth" });
    }
};

/**
 * @desc    Handle Shopify OAuth callback
 * @route   GET /auth/callback
 * @access  Public
 */
export const handleShopifyCallback = async (req, res) => {
    const { code, hmac, shop, state } = req.query;

    if (!code || !shop || !state) {
        return res.status(400).send("Missing required params");
    }

    // Verify HMAC
    const params = { ...req.query };
    delete params.hmac;

    if (!shopifyService.verifyHMAC(params, hmac)) {
        return res.status(400).send("HMAC validation failed");
    }

    try {
        console.log(`📥 Received Shopify callback for shop: ${shop}`);

        // Exchange code for access token
        const accessToken = await shopifyService.exchangeCodeForToken(shop, code);

        if (!accessToken) {
            console.error("❌ No access token received from Shopify exchange");
            return res.status(400).send("No access token received from Shopify.");
        }

        console.log("✅ Token exchanged successfully");

        // Extract shop handle
        const shopHandleFromUrl = shop.replace(".myshopify.com", "").toLowerCase();
        console.log(`🔍 Extracting shop handle: ${shopHandleFromUrl} from ${shop}`);

        // Decode state to get email fallback
        let emailFromState = null;
        try {
            if (state) {
                const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
                if (decodedState.email) {
                    emailFromState = decodedState.email;
                }
            }
        } catch (e) {
            console.error("⚠️ Error decoding state in callback:", e.message);
        }

        // Find user linked to this shop
        let user = await userService.findUserByShopName(shopHandleFromUrl);

        // Fallback 1: If not found by shopName, try finding by shopify.shopDomain
        if (!user) {
            console.log(`⚠️ User not found by shopName, trying shopify.shopDomain...`);
            const User = (await import("../models/User.js")).default;
            user = await User.findOne({
                "shopify.shopDomain": { $regex: new RegExp(shopHandleFromUrl, "i") }
            });
        }

        // Fallback 2: If still not found, search by email from state (auto-detected store flow)
        if (!user && emailFromState) {
            console.log(`⚠️ User not found by shop domain, looking up by email from state: ${emailFromState}`);
            const User = (await import("../models/User.js")).default;
            user = await User.findOne({ email: { $regex: new RegExp(`^${emailFromState}$`, "i") } });
            if (user) {
                // Update user with the auto-detected shop details on the fly
                user.shopName = shopHandleFromUrl;
                if (!user.shopify) user.shopify = {};
                user.shopify.shopDomain = shop;
                await user.save();
                console.log(`✅ Linked auto-detected shop ${shop} to user ${emailFromState}`);
            }
        }

        if (!user) {
            console.error(`❌ User not found in database for shop handle: ${shopHandleFromUrl}`);
            console.error(`   Check if the user started the auth flow with this store.`);
            return res.status(404).send(`User not found for shop ${shopHandleFromUrl}. Please ensure you are logged in.`);
        }

        const { niche, email } = user;
        console.log(`✅ Found user: ${email} (Niche: ${niche})`);

        // Save store + token in ShopifyStore
        await ShopifyStore.findOneAndUpdate(
            { shop },
            { shop, accessToken, user: user._id },
            { upsert: true, new: true }
        );

        // Save accessToken inside user.shopify.accessToken
        const updatedUser = await userService.updateUserAccessToken(user._id, accessToken, shop);

        console.log("✅ Access token saved successfully!");

        // Register compliance webhooks for this shop
        try {
            console.log("📋 Registering compliance webhooks...");
            const webhookResults = await shopifyService.registerComplianceWebhooks(shop, accessToken);
            const successCount = webhookResults.filter(r => r.success).length;
            console.log(`✅ Registered ${successCount}/3 compliance webhooks`);
            if (successCount < 3) {
                console.log("⚠️  Some webhooks failed to register. They may already exist or need to be registered in Partner Dashboard.");
            }
        } catch (error) {
            console.error("⚠️  Error registering compliance webhooks:", error.message);
            console.log("ℹ️  Webhooks can also be registered in Partner Dashboard during app submission.");
        }
        console.log("📊 Updated user shopify data:", {
            shopDomain: updatedUser?.shopify?.shopDomain,
            connected: updatedUser?.shopify?.connected,
            hasToken: !!updatedUser?.shopify?.accessToken,
            tokenPrefix: updatedUser?.shopify?.accessToken?.substring(0, 10)
        });
        console.log("🎉 Installation complete! Redirecting...");
        console.log("ℹ️  Products will be added via 'Add Top-Selling Products' page");
        console.log("ℹ️  Banners will be uploaded via 'Customize My Store' (theme upload)");

        // ✅ DYNAMIC REDIRECT
        // Decode state to get the original success URL
        let finalSuccessUrl = REDIRECT_URLS.SUCCESS;
        try {
            if (state) {
                const decodedState = JSON.parse(Buffer.from(state, 'base64').toString());
                if (decodedState.successUrl) {
                    finalSuccessUrl = decodedState.successUrl;
                }
            }
        } catch (e) {
            console.error("⚠️ Error decoding state for success redirect:", e.message);
        }

        const redirectWithShop = new URL(finalSuccessUrl);
        redirectWithShop.searchParams.set('shop', shop);

        console.log("🎉 Installation complete! Redirecting to:", redirectWithShop.toString());
        res.redirect(redirectWithShop.toString());
    } catch (err) {
        console.error("❌ Error processing Shopify setup:", err.message);
        return res.status(500).send("Error processing Shopify setup");
    }
};

/**
 * @desc    Signup new user
 * @route   POST /signup
 * @access  Public
 */
export const signup = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        console.log("Signup attempt:", email, "Name:", name);

        let user = await userService.findUserByEmail(email);

        if (user) {
            console.log("Signup failed: user already exists ->", email);
            return res.status(400).json({ message: "User already exists" });
        }

        user = await userService.createUser(name, email, password);
        console.log("User saved successfully:", email);

        res.status(201).json({ user: { name: user.name, email: user.email } });
    } catch (err) {
        console.error("Signup error:", err);
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc    Login user
 * @route   POST /login
 * @access  Public
 */
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        const isMatch = await userService.verifyPassword(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }

        res.json({ user: { email: user.email } });
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};

/**
 * @desc    Get user data by email
 * @route   GET /api/user/:email
 * @access  Public
 */
export const getUserData = async (req, res) => {
    try {
        const { email } = req.params;

        console.log("📥 Fetching user data for:", email);

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await userService.findUserByEmail(email);

        if (!user) {
            console.log("❌ User not found:", email);
            return res.status(404).json({ error: "User not found" });
        }

        // Return user data
        const userData = {
            email: user.email,
            name: user.name,
            picture: user.picture,
            niche: user.niche,
            shopifyConnected: user.shopify?.connected || false,
            adminUrl: user.shopify?.shopDomain || "",
        };

        console.log("✅ User data found:", userData);
        res.json(userData);
    } catch (err) {
        console.error("❌ Error fetching user data:", err);
        res.status(500).json({ error: "Failed to fetch user data" });
    }
};
