import bcrypt from "bcryptjs";
import User from "../models/User.js";

/**
 * Find user by email
 */
export const findUserByEmail = async (email) => {
    return await User.findOne({ email });
};

/**
 * Find user by Google sub (ID)
 */
export const findUserBySub = async (sub) => {
    return await User.findOne({ sub });
};

/**
 * Find user by shop name
 */
export const findUserByShopName = async (shopHandle) => {
    console.log(`🔍 Finding user for shop handle: ${shopHandle}`);
    return await User.findOne({
        $or: [
            // Match in shopName (where they might have stored the full URL)
            { shopName: { $regex: new RegExp(shopHandle, "i") } },
            // Match in shopify.shopDomain
            { "shopify.shopDomain": { $regex: new RegExp(shopHandle, "i") } },
            // Fallback for direct match if they stored just the handle
            { shopName: shopHandle }
        ]
    });
};

/**
 * Create new user with Google authentication
 */
export const createGoogleUser = async (email, name, picture, sub) => {
    const user = new User({
        email,
        name,
        picture,
        sub
    });
    return await user.save();
};

/**
 * Update user with Google information
 */
export const updateUserWithGoogle = async (user, sub, name, picture) => {
    user.sub = sub;
    user.name = name || user.name;
    user.picture = picture || user.picture;
    return await user.save();
};

/**
 * Update user's Shopify information
 */
export const updateUserShopifyInfo = async (email, niche, shop, shopDomain, Banner1, Banner2, BannerImage1, BannerImage2) => {
    return await User.findOneAndUpdate(
        { email },
        {
            $set: {
                niche,
                shopName: shop,
                Banner1,
                Banner2,
                BannerImage1,
                BannerImage2,
                "shopify.shopDomain": shopDomain,
                "shopify.connected": false,
            },
        },
        { new: true }
    );
};

/**
 * Update user's Shopify access token
 */
export const updateUserAccessToken = async (userId, accessToken, shopDomain) => {
    const trimmedToken = accessToken ? accessToken.trim() : accessToken;
    return await User.findByIdAndUpdate(userId, {
        $set: {
            "shopify.accessToken": trimmedToken,
            "shopify.shopDomain": shopDomain,
            "shopify.connected": true,
            updatedAt: new Date()
        },
    }, { new: true }); // Return the updated document
};

/**
 * Create new user with email and password
 */
export const createUser = async (name, email, password) => {
    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashed });
    return await user.save();
};

/**
 * Verify user password
 */
export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};

/**
 * Format user response for frontend
 */
export const formatUserResponse = (user, email, name, picture, sub) => {
    return {
        email: user.email || email,
        name: user.name || name,
        picture: user.picture || picture,
        sub: user.sub || sub,
        niche: user.niche || "",
        selectedBanners: [],
        shopifyConnected: user.shopify?.connected || false,
        selectedTheme: "",
    };
};
