import crypto from "crypto";

/**
 * Middleware to validate Shopify HMAC signature
 */
export const verifyShopifyRequest = (req, res, next) => {
    const { hmac, ...params } = req.query;

    if (!hmac) {
        return res.status(400).send("Missing HMAC");
    }

    const message = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");

    const generatedHmac = crypto
        .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
        .update(message)
        .digest("hex");

    if (generatedHmac !== hmac) {
        return res.status(401).send("Invalid HMAC signature");
    }

    next();
};
