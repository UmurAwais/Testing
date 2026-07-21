import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: function () {
                // Only require password if user doesn't have Google sub (Google-authenticated users don't need password)
                return !this.sub;
            },
        },
        name: {
            type: String,
        },
        accessToken: {
            type: String,
        },
        picture: {
            type: String,
        },
        sub: {
            type: String,
            unique: true,
            sparse: true, // Allows null values but ensures uniqueness when present
        },

        // New fields
        niche: {
            type: String,
        },

        // Banner selections (not an array anymore)
        Banner1: {
            id: { type: String },
            name: { type: String },
            image: { type: String },
        },
        Banner2: {
            id: { type: String },
            name: { type: String },
            image: { type: String },
        },

        shopName: { type: String },

        // Banner images
        BannerImage1: {
            type: String,
        },
        BannerImage2: {
            type: String,
        },

        shopify: {
            shopDomain: { type: String },
            accessToken: { type: String },
            connected: { type: Boolean, default: false },
        },
    },
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
