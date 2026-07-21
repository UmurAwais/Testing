import mongoose from "mongoose";

const shopifyStoreSchema = new mongoose.Schema({
    shop: { type: String, required: true, unique: true },
    accessToken: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    createdAt: { type: Date, default: Date.now },
});

const ShopifyStore = mongoose.model("ShopifyStore", shopifyStoreSchema);

export default ShopifyStore;
