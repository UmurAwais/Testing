import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: String,
    price: Number,
    description: String,
    imageUrl: String, // Keep for backward compatibility
    imageUrls: [String], // Array of image URLs
    discountedPrice: Number
});

const nicheSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    bannerImages: [String], // array of image URLs
    multiRowImages: [String], // array of multi-row image URLs (max 3: multirow1, multirow2, multirow3)
    products: [productSchema], // embedded products
    themeFileUrl: String // URL to theme CSS/JS
}, { timestamps: true });

export default mongoose.model("Niche", nicheSchema);
