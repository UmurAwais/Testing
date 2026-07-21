import dotenv from "dotenv";

dotenv.config();

export const SHOPIFY_CONFIG = {
    SCOPES: "write_products,read_products,write_themes,read_themes,write_files,read_files,write_publications,read_publications",
    REDIRECT_URI: "https://ecomlly.vercel.app/auth/callback",
    API_VERSION: "2025-01",
    CLIENT_ID: process.env.PARTNER_CLIENT_ID,
    CLIENT_SECRET: process.env.PARTNER_CLIENT_SECRET,
};

export const GOOGLE_CONFIG = {
    CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
};

export const IMAGE_UPLOAD_CONFIG = {
    MAX_BANNER_IMAGES: 2,
    MAX_MULTIROW_IMAGES: 3,
    ALLOWED_EXTENSIONS: ["png", "jpg", "jpeg"],
    DEFAULT_EXTENSION: "png",
};

export const THEME_CONFIG = {
    DEFAULT_THEME_URL: "https://github.com/Shopify/dawn/archive/refs/heads/main.zip",
    MAX_THEME_WAIT_ATTEMPTS: 10,
    THEME_CHECK_INTERVAL: 3000, // 3 seconds
};

export const REDIRECT_URLS = {
    SUCCESS: "https://aistorebuilder.ecomlly.com/",
};
