import fetch from "node-fetch";
import { THEME_CONFIG } from "../config/constants.js";
import User from "../models/User.js";
import Niche from "../models/Niche.js";
import ShopifyStore from "../models/ShopifyStore.js";
import * as userService from "../services/userService.js";
import * as shopifyService from "../services/shopifyService.js";

/**
 * @desc    Add top-selling products to store
 * @route   POST /api/products/add-top-selling
 * @access  Public
 */
export const addTopSellingProducts = async (req, res) => {
    try {
        console.log("📦 Adding top-selling products...");
        const { email, shop } = req.body;

        if (!email || !shop) {
            return res.status(400).json({ error: "Missing email or shop parameter" });
        }

        // Get user and niche
        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const { niche } = user;
        console.log(`   👤 User: ${user.email}`);
        console.log(`   🎨 Niche: ${niche}`);
        console.log(`   🏪 Shop: ${shop}`);

        // Normalize shop domain
        let shopDomain = shop;
        if (shop.includes('admin.shopify.com/store/')) {
            const match = shop.match(/\/store\/([^\/]+)/);
            if (match && match[1]) {
                shopDomain = `${match[1]}.myshopify.com`;
                console.log(`   🔄 Extracted from admin URL: ${shopDomain}`);
            }
        } else if (shop.includes('myshopify.com')) {
            shopDomain = shop;
        } else {
            shopDomain = `${shop}.myshopify.com`;
        }

        console.log(`   🌐 Using shop domain: ${shopDomain}`);

        // ✅ Get access token from ShopifyStore collection (primary) or User collection (fallback)
        let accessToken = user.shopify?.accessToken;

        try {
            const shopifyStoreDoc = await ShopifyStore.findOne({ shop: shopDomain });
            if (shopifyStoreDoc && shopifyStoreDoc.accessToken) {
                console.log(`   🔄 Found token in ShopifyStore collection`);
                accessToken = shopifyStoreDoc.accessToken;
            } else {
                console.log(`   ⚠️ No ShopifyStore document found, using User collection token`);
            }
        } catch (storeErr) {
            console.error(`   ⚠️ Error fetching ShopifyStore:`, storeErr.message);
        }

        if (!accessToken) {
            console.error("❌ No access token found for user");
            return res.status(404).json({
                error: "Store not connected. Please complete the 'Install App' step first."
            });
        }

        console.log(`   🔑 Access token found: ${accessToken.substring(0, 10)}...`);

        // Get niche products
        const nicheDoc = await Niche.findOne({ name: niche?.toLowerCase() });

        if (!nicheDoc) {
            return res.status(404).json({ error: "Niche not found in database" });
        }

        const products = nicheDoc.products || [];
        console.log(`📦 Adding ${products.length} products from niche: ${niche}`);

        // Create products in parallel for speed
        const results = await Promise.all(
            products.map(async (product, index) => {
                try {
                    console.log(`   ${index + 1}/${products.length} Creating: ${product.name}`);
                    const result = await shopifyService.createProduct(shopDomain, accessToken, product, niche, ["Trending"]);
                    return {
                        success: true,
                        product: product.name,
                        publications: result.publications
                    };
                } catch (err) {
                    console.error(`   ❌ Failed to create ${product.name}:`, err.message);
                    return { success: false, product: product.name, error: err.message };
                }
            })
        );

        const successful = results.filter(r => r.success).length;
        const failed = results.filter(r => !r.success).length;

        // Collect publication info
        const publicationSummary = results
            .filter(r => r.success && r.publications)
            .map(r => ({
                product: r.product,
                channels: r.publications.channels || [],
                failed: r.publications.failed || []
            }));

        console.log(`✅ Products added: ${successful} successful, ${failed} failed`);

        // ✅ NEW: Update Trendings Products Section
        if (successful > 0) {
            try {
                console.log("🔥 Updating Trending Products section...");

                // 1. Ensure "Trending" collection exists
                const collection = await shopifyService.ensureSmartCollection(
                    shopDomain,
                    accessToken,
                    "Trending Products",
                    "trending-products",
                    [{ column: 'tag', relation: 'equals', condition: 'Trending' }]
                );

                // 2. Publish collection to all sales channels (including Point of Sale)
                if (collection && collection.id) {
                    const collectionGid = `gid://shopify/Collection/${collection.id}`;
                    await shopifyService.publishCollectionToChannels(shopDomain, accessToken, collectionGid);
                }

                // 2. Find active theme
                const themes = await shopifyService.getThemes(shopDomain, accessToken);
                const activeTheme = themes.find(t => t.role === 'main');

                if (activeTheme) {
                    // 3. Get index.json
                    const asset = await shopifyService.getThemeAsset(shopDomain, accessToken, activeTheme.id, 'templates/index.json');
                    if (asset && asset.value) {
                        let indexJson = JSON.parse(asset.value);
                        let updated = false;

                        // 4. Find the section for "Trending Products"
                        // Look for a section of type 'featured-collection' that has "Trending" in its settings or ID
                        for (const sectionId in indexJson.sections) {
                            const section = indexJson.sections[sectionId];
                            if (section.type === 'featured-collection' || section.type === 'ds-featured-collection') {
                                if (section.settings?.title?.toLowerCase().includes('trending') || sectionId.toLowerCase().includes('trending')) {
                                    console.log(`   📍 Found trending section: ${sectionId}`);
                                    section.settings.collection = 'trending-products';
                                    updated = true;
                                    break;
                                }
                            }
                        }

                        // If not found by name, try to find any featured-collection
                        if (!updated) {
                            for (const sectionId in indexJson.sections) {
                                if (indexJson.sections[sectionId].type === 'featured-collection' || indexJson.sections[sectionId].type === 'ds-featured-collection') {
                                    console.log(`   📍 Falling back to first featured-collection: ${sectionId}`);
                                    indexJson.sections[sectionId].settings.collection = 'trending-products';
                                    updated = true;
                                    break;
                                }
                            }
                        }

                        if (updated) {
                            await shopifyService.updateThemeAsset(
                                shopDomain,
                                accessToken,
                                activeTheme.id,
                                'templates/index.json',
                                JSON.stringify(indexJson, null, 2)
                            );
                            console.log("   ✅ Theme index.json updated successfully");
                        }
                    }
                }
            } catch (themeErr) {
                console.error("⚠️ Failed to update theme trending section:", themeErr.message);
                // Continue anyway, products were added
            }
        }

        res.json({
            success: true,
            message: `${successful} products added successfully`,
            productsCount: successful,
            failed: failed,
            publications: publicationSummary,
            results
        });
    } catch (err) {
        console.error("❌ Error adding products:", err);
        res.status(500).json({ error: "Failed to add products", details: err.message });
    }
};

/**
 * @desc    Delete all existing products from store
 * @route   POST /api/products/delete-all
 * @access  Public
 */
export const deleteAllProducts = async (req, res) => {
    try {
        console.log("🗑️ Deleting all existing products...");
        const { email, shop } = req.body;

        if (!email || !shop) {
            return res.status(400).json({ error: "Missing email or shop parameter" });
        }

        // Get user
        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log(`   👤 User: ${user.email}`);
        console.log(`   🏪 Shop: ${shop}`);

        // Get access token from user record
        const accessToken = user.shopify?.accessToken;

        if (!accessToken) {
            console.error("❌ No access token found for user");
            return res.status(404).json({
                error: "Store not connected. Please complete the 'Install App' step first."
            });
        }

        // Normalize shop domain
        let shopDomain = shop;
        if (shop.includes('admin.shopify.com/store/')) {
            const match = shop.match(/\/store\/([^\/]+)/);
            if (match && match[1]) {
                shopDomain = `${match[1]}.myshopify.com`;
            }
        } else if (shop.includes('myshopify.com')) {
            shopDomain = shop;
        } else {
            shopDomain = `${shop}.myshopify.com`;
        }

        console.log(`   🌐 Using shop domain: ${shopDomain}`);

        // Fetch all products
        const response = await fetch(
            `https://${shopDomain}/admin/api/2025-01/products.json?limit=250`,
            {
                headers: {
                    "X-Shopify-Access-Token": accessToken,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Failed to fetch products: ${response.status}`);
        }

        const { products } = await response.json();
        console.log(`   📦 Found ${products.length} existing products`);

        if (products.length === 0) {
            return res.json({
                success: true,
                message: "No products to delete",
                deletedCount: 0
            });
        }

        // Delete all products in parallel
        const deleteResults = await Promise.all(
            products.map(async (product) => {
                try {
                    console.log(`   🗑️ Deleting: ${product.title}`);
                    const deleteResponse = await fetch(
                        `https://${shopDomain}/admin/api/2025-01/products/${product.id}.json`,
                        {
                            method: "DELETE",
                            headers: {
                                "X-Shopify-Access-Token": accessToken
                            }
                        }
                    );

                    if (deleteResponse.ok) {
                        return { success: true, product: product.title };
                    } else {
                        return { success: false, product: product.title, error: "Delete failed" };
                    }
                } catch (err) {
                    console.error(`   ❌ Failed to delete ${product.title}:`, err.message);
                    return { success: false, product: product.title, error: err.message };
                }
            })
        );

        const deleted = deleteResults.filter(r => r.success).length;
        const failedDeletes = deleteResults.filter(r => !r.success).length;

        console.log(`✅ Deleted: ${deleted} products, ${failedDeletes} failed`);

        res.json({
            success: true,
            message: `${deleted} products deleted successfully`,
            deletedCount: deleted,
            failed: failedDeletes,
            results: deleteResults
        });
    } catch (err) {
        console.error("❌ Error deleting products:", err);
        res.status(500).json({ error: "Failed to delete products", details: err.message });
    }
};

/**
 * @desc    Delete specific banner files from Shopify Files (GraphQL)
 * @route   POST /api/files/delete-banners
 * @access  Public
 */
export const deleteBannerFiles = async (req, res) => {
    try {
        console.log("🗑️ Deleting banner files from Shopify Files...");
        const { email, shop } = req.body;

        if (!email || !shop) {
            return res.status(400).json({ error: "Missing email or shop parameter" });
        }

        // Get user
        const user = await userService.findUserByEmail(email);

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        console.log(`   👤 User: ${user.email}`);
        console.log(`   🏪 Shop: ${shop}`);

        // Get access token from user record
        const accessToken = user.shopify?.accessToken;

        if (!accessToken) {
            console.error("❌ No access token found for user");
            return res.status(404).json({
                error: "Store not connected. Please complete the 'Install App' step first."
            });
        }

        // Normalize shop domain
        let shopDomain = shop;
        if (shop.includes('admin.shopify.com/store/')) {
            const match = shop.match(/\/store\/([^\/]+)/);
            if (match && match[1]) {
                shopDomain = `${match[1]}.myshopify.com`;
            }
        } else if (shop.includes('myshopify.com')) {
            shopDomain = shop;
        } else {
            shopDomain = `${shop}.myshopify.com`;
        }

        console.log(`   🌐 Using shop domain: ${shopDomain}`);

        // GraphQL query to fetch files (bannerstore* and multirow*)
        const filesQuery = `
            query {
                files(first: 250, query: "filename:bannerstore* OR filename:multirow*") {
                    edges {
                        node {
                            ... on MediaImage {
                                id
                                alt
                                image {
                                    url
                                }
                            }
                        }
                    }
                }
            }
        `;

        // Fetch files using GraphQL
        const response = await fetch(
            `https://${shopDomain}/admin/api/2025-01/graphql.json`,
            {
                method: "POST",
                headers: {
                    "X-Shopify-Access-Token": accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: filesQuery })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ Failed to fetch files:", errorText);
            throw new Error(`Failed to fetch files: ${response.status}`);
        }

        const { data, errors } = await response.json();

        if (errors) {
            console.error("❌ GraphQL errors:", errors);
            throw new Error(`GraphQL errors: ${JSON.stringify(errors)}`);
        }

        const files = data?.files?.edges || [];
        console.log(`   📁 Found ${files.length} banner files`);

        if (files.length === 0) {
            return res.json({
                success: true,
                message: "No banner files found to delete",
                deletedCount: 0
            });
        }

        // Delete files using GraphQL mutation
        const deleteResults = await Promise.all(
            files.map(async ({ node }) => {
                try {
                    const fileId = node.id;
                    const fileName = node.alt || 'unknown';
                    const fileUrl = node.image?.url || 'unknown';

                    console.log(`   🗑️ Deleting file: ${fileName}`);
                    console.log(`      URL: ${fileUrl}`);

                    const deleteMutation = `
                        mutation {
                            fileDelete(fileIds: ["${fileId}"]) {
                                deletedFileIds
                                userErrors {
                                    field
                                    message
                                }
                            }
                        }
                    `;

                    const deleteResponse = await fetch(
                        `https://${shopDomain}/admin/api/2025-01/graphql.json`,
                        {
                            method: "POST",
                            headers: {
                                "X-Shopify-Access-Token": accessToken,
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ query: deleteMutation })
                        }
                    );

                    const deleteData = await deleteResponse.json();

                    if (deleteData.data?.fileDelete?.deletedFileIds?.length > 0) {
                        console.log(`      ✅ Deleted successfully`);
                        return { success: true, file: fileName, url: fileUrl, id: fileId };
                    } else {
                        const errors = deleteData.data?.fileDelete?.userErrors || [];
                        console.error(`      ❌ Failed:`, errors);
                        return { success: false, file: fileName, url: fileUrl, id: fileId, errors };
                    }
                } catch (err) {
                    console.error(`   ❌ Error:`, err.message);
                    return { success: false, file: node.alt, error: err.message };
                }
            })
        );

        const deleted = deleteResults.filter(r => r.success).length;
        const failed = deleteResults.filter(r => !r.success).length;

        console.log(`✅ Deleted: ${deleted} files, ${failed} failed`);

        res.json({
            success: true,
            message: `${deleted} banner files deleted successfully`,
            deletedCount: deleted,
            failed: failed,
            results: deleteResults
        });
    } catch (err) {
        console.error("❌ Error deleting banner files:", err);
        res.status(500).json({ error: "Failed to delete banner files", details: err.message });
    }
};

/**
 * Helper function to delete old banner and multirow files from Shopify Files
 */
async function deleteOldFiles(shopDomain, accessToken) {
    try {
        console.log("   🔍 Searching for old files...");

        // GraphQL query to fetch files
        const filesQuery = `
            query {
                files(first: 250, query: "filename:bannerstore* OR filename:multirow*") {
                    edges {
                        node {
                            ... on MediaImage {
                                id
                                alt
                            }
                        }
                    }
                }
            }
        `;

        const response = await fetch(
            `https://${shopDomain}/admin/api/2025-01/graphql.json`,
            {
                method: "POST",
                headers: {
                    "X-Shopify-Access-Token": accessToken,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ query: filesQuery })
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`   ⚠️ Failed to fetch files (Status: ${response.status}):`, errorText);
            return;
        }

        const resJson = await response.json().catch(() => ({}));
        const { data, errors } = resJson;

        if (errors) {
            console.error("   ⚠️ GraphQL errors, skipping deletion:", JSON.stringify(errors));
            return;
        }

        const files = data?.files?.edges || [];

        if (files.length === 0) {
            console.log("   ✅ No old files found");
            return;
        }

        console.log(`   🗑️ Deleting ${files.length} old files...`);

        // Delete files in parallel
        const deletePromises = files.map(async ({ node }) => {
            const deleteMutation = `
                mutation {
                    fileDelete(fileIds: ["${node.id}"]) {
                        deletedFileIds
                    }
                }
            `;

            await fetch(
                `https://${shopDomain}/admin/api/2025-01/graphql.json`,
                {
                    method: "POST",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ query: deleteMutation })
                }
            );
        });

        await Promise.all(deletePromises);
        console.log("   ✅ Old files deleted successfully");
    } catch (err) {
        console.error("   ⚠️ Error deleting old files (continuing anyway):", err.message);
    }
}

/**
 * Helper function to delete existing banner metafields
 */
async function deleteExistingBannerMetafields(shop, accessToken) {
    try {
        console.log("🧹 Checking for existing banner metafields...");

        // Get all metafields
        const response = await fetch(
            `https://${shop}/admin/api/2025-01/metafields.json`,
            {
                headers: {
                    "X-Shopify-Access-Token": accessToken,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            console.log(`⚠️ Could not fetch metafields (Status: ${response.status}):`, errorText);
            return;
        }

        const { metafields } = await response.json().catch(() => ({ metafields: [] }));

        // Find bannerstore1 and bannerstore2
        const bannersToDelete = metafields.filter(m =>
            m.key === 'bannerstore1' || m.key === 'bannerstore2'
        );

        if (bannersToDelete.length > 0) {
            console.log(`🗑️ Deleting ${bannersToDelete.length} existing banner metafields...`);

            // Delete each one
            await Promise.all(
                bannersToDelete.map(async (metafield) => {
                    try {
                        await fetch(
                            `https://${shop}/admin/api/2025-01/metafields/${metafield.id}.json`,
                            {
                                method: "DELETE",
                                headers: {
                                    "X-Shopify-Access-Token": accessToken
                                }
                            }
                        );
                        console.log(`   ✅ Deleted: ${metafield.key}`);
                    } catch (err) {
                        console.error(`   ❌ Failed to delete ${metafield.key}:`, err.message);
                    }
                })
            );

            console.log("✅ Old banners deleted");
        } else {
            console.log("ℹ️ No existing banners to delete");
        }
    } catch (err) {
        console.error("⚠️ Error deleting old banners:", err.message);
        // Continue anyway - not critical
    }
}

/**
 * @desc    Upload theme to Shopify store based on niche
 * @route   POST /publish-theme
 * @access  Public
 */
export const publishTheme = async (req, res) => {
    try {
        console.log("🚀 Received request to upload theme");
        const { email, shop } = req.body;
        console.log("📩 Request body:", req.body);

        if (!email || !shop) {
            console.log("⚠️ Missing email or shop in request");
            return res.status(400).json({ error: "Missing email or shop parameter" });
        }

        console.log("🔍 Searching for user by email:", email);
        const user = await userService.findUserByEmail(email);

        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ User found:", { id: user._id, niche: user.niche });

        // Get Shopify store info from user document
        const shopifyStore = user.shopify;
        console.log("🔍 Retrieved Shopify store info from User:", shopifyStore);

        if (!shopifyStore || !shopifyStore.shopDomain) {
            console.log("❌ Shopify store not connected or missing shopDomain");
            return res.status(404).json({ error: "Shopify store not connected" });
        }

        let shopDomain = shopifyStore.shopDomain;
        shopDomain = shopifyService.normalizeShopDomain(shopDomain);
        console.log("🌐 Using Shopify domain:", shopDomain);

        // ✅ IMPORTANT: Get the latest access token from ShopifyStore collection
        // The token in ShopifyStore is updated during OAuth, so it's more reliable
        let accessToken = shopifyStore.accessToken;

        try {
            const shopifyStoreDoc = await ShopifyStore.findOne({ shop: shopDomain });
            if (shopifyStoreDoc && shopifyStoreDoc.accessToken) {
                console.log("🔄 Found token in ShopifyStore collection");
                accessToken = shopifyStoreDoc.accessToken;
                console.log("   Using ShopifyStore token (more recent)");
            } else {
                console.log("⚠️ No ShopifyStore document found, using User collection token");
            }
        } catch (storeErr) {
            console.error("⚠️ Error fetching ShopifyStore:", storeErr.message);
            console.log("   Falling back to User collection token");
        }

        if (!accessToken) {
            console.log("❌ No access token found in either User or ShopifyStore");
            return res.status(404).json({
                error: "Store not connected. Please complete the 'Install App' step first.",
                suggestion: "Go to 'Install App' and complete the OAuth flow."
            });
        }

        console.log("🔑 Using access token:", accessToken.slice(0, 5) + "…");

        // Normalize the incoming shop parameter for comparison
        const normalizedIncomingShop = shopifyService.normalizeShopDomain(shop);
        const shopHandle = shopDomain.replace(".myshopify.com", "");
        const incomingHandle = normalizedIncomingShop.replace(".myshopify.com", "");

        console.log("🔍 Comparing shops:");
        console.log("   Incoming (normalized):", normalizedIncomingShop);
        console.log("   Incoming handle:", incomingHandle);
        console.log("   Stored domain:", shopDomain);
        console.log("   Stored shopName:", user.shopName);
        console.log("   Shop handle:", shopHandle);

        // Check if the incoming shop matches:
        // 1. Exact match of normalized domains
        // 2. Exact match of shop handles
        const isValidShop =
            normalizedIncomingShop === shopDomain ||
            incomingHandle === shopHandle ||
            incomingHandle === user.shopName ||
            shopHandle === user.shopName;

        if (!isValidShop) {
            console.log("⚠️ Shop URL does not match user record");
            console.log("   Please ensure you're using the correct store.");
            return res.status(400).json({
                error: "Shop URL does not match user record",
                expectedShop: shopDomain,
                receivedShop: shop
            });
        }

        console.log("✅ Shop URL validated successfully");

        const nicheDoc = await Niche.findOne({ name: user.niche?.toLowerCase() });

        if (!nicheDoc) {
            console.log("❌ Niche not found:", user.niche);
            return res.status(404).json({ error: "Niche not found in database" });
        }

        // ✅ STEP 0: Validate the access token by making a simple API call
        console.log("🔐 Validating access token...");
        try {
            const testResponse = await fetch(`https://${shopDomain}/admin/api/2025-01/shop.json`, {
                headers: {
                    "X-Shopify-Access-Token": accessToken?.trim(),
                }
            });

            if (!testResponse.ok) {
                const errorText = await testResponse.text();
                console.error(`❌ Token validation failed (Status: ${testResponse.status}):`, errorText);
                return res.status(401).json({
                    error: "Invalid access token",
                    message: "The access token for this store is invalid or expired. Please reconnect your store.",
                    shopDomain: shopDomain,
                    suggestion: "Go to 'Install App' and complete the OAuth flow to get a valid token."
                });
            }
            console.log("✅ Access token is valid");
        } catch (tokenErr) {
            console.error("❌ Token validation error:", tokenErr.message);
            return res.status(401).json({
                error: "Token validation failed",
                message: "Could not validate the access token. Please reconnect your store."
            });
        }

        // ✅ STEP 0: Delete old banner and multirow files from Shopify Files
        console.log("🗑️ Deleting old banner and multirow files...");
        await deleteOldFiles(shopDomain, accessToken);

        // ✅ STEP 1: Delete old banner metafields if they exist
        await deleteExistingBannerMetafields(shopDomain, accessToken);

        // ✅ STEP 2: Upload new banners with standard names (bannerstore1, bannerstore2)
        console.log("🖼️ Uploading banner metafields...");
        const banners = [user.BannerImage1, user.BannerImage2].filter(Boolean);

        for (let i = 0; i < banners.length; i++) {
            const bannerKey = `bannerstore${i + 1}`;
            console.log(`   📤 Uploading ${bannerKey}:`, banners[i].substring(0, 50) + "...");

            await shopifyService.createBannerMetafield(
                shopDomain,
                accessToken,
                banners[i],
                i,
                bannerKey // Use standard names: bannerstore1, bannerstore2
            );
        }

        const themeUrl = nicheDoc.themeFileUrl || THEME_CONFIG.DEFAULT_THEME_URL;
        const themeName = `${nicheDoc.name.charAt(0).toUpperCase() + nicheDoc.name.slice(1)} Theme`;

        console.log(`🎨 Selected theme URL for niche '${nicheDoc.name}': ${themeUrl}`);

        // ✅ STEP 3: Create theme
        const theme = await shopifyService.createTheme(shopDomain, accessToken, themeName, themeUrl);

        // Wait for theme installation
        await shopifyService.waitForThemeInstallation(shopDomain, accessToken, theme.id);

        // Upload all images (banners and multirow)
        await shopifyService.uploadAllImages(user, nicheDoc, shopDomain, accessToken);

        console.log("🎉 Theme uploaded successfully with banners!");

        res.json({
            message: "Theme uploaded successfully",
            theme,
            bannersUploaded: banners.length,
            success: true
        });
    } catch (err) {
        console.error("❌ Error publishing theme:", err);

        // Check if it's a token-related error
        if (err.message && err.message.includes("401")) {
            return res.status(401).json({
                error: "Invalid access token",
                message: "The access token for this store is invalid or expired. Please reconnect your store.",
                details: err.message
            });
        }

        // Check if it's a theme creation error
        if (err.message && err.message.includes("Failed to create theme")) {
            return res.status(400).json({
                error: "Failed to create theme",
                message: err.message,
                suggestion: "Please check your Shopify store connection and try again."
            });
        }

        // Generic error
        res.status(500).json({
            error: "Internal server error",
            message: err.message || "An unexpected error occurred",
            details: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
};

/**
 * @desc    Upload images to Shopify Files
 * @route   POST /upload-theme-images
 * @access  Public
 */
export const uploadThemeImages = async (req, res) => {
    try {
        console.log("🚀 Received request to upload theme images");
        const { email, shop, imageUrls } = req.body;

        console.log("📩 Request body:", { email, shop, imageUrls });

        if (!email || !shop || !imageUrls || !Array.isArray(imageUrls)) {
            console.log("⚠️ Missing required parameters");
            return res.status(400).json({
                error: "Missing required parameters: email, shop, and imageUrls array"
            });
        }

        console.log("🔍 Searching for user by email:", email);
        const user = await userService.findUserByEmail(email);

        if (!user) {
            console.log("❌ User not found");
            return res.status(404).json({ error: "User not found" });
        }

        console.log("✅ User found:", { id: user._id, niche: user.niche });

        // Get Shopify store info from user document
        const shopifyStore = user.shopify;
        console.log("🔍 Retrieved Shopify store info:", shopifyStore);

        if (!shopifyStore || !shopifyStore.accessToken || !shopifyStore.shopDomain) {
            console.log("❌ Shopify store not connected or missing accessToken/shopDomain");
            return res.status(404).json({ error: "Shopify store not connected" });
        }

        let shopDomain = shopifyStore.shopDomain;
        shopDomain = shopifyService.normalizeShopDomain(shopDomain);

        console.log("🌐 Using Shopify domain:", shopDomain);

        // Normalize the incoming shop parameter for comparison
        const normalizedIncomingShop = shopifyService.normalizeShopDomain(shop);
        const shopHandle = shopDomain.replace(".myshopify.com", "");
        const incomingHandle = normalizedIncomingShop.replace(".myshopify.com", "");

        // Check if the incoming shop matches
        const isValidShop =
            normalizedIncomingShop === shopDomain ||
            incomingHandle === shopHandle ||
            incomingHandle === user.shopName ||
            shopHandle === user.shopName;

        if (!isValidShop) {
            console.log("⚠️ Shop URL does not match user record");
            return res.status(400).json({
                error: "Shop URL does not match user record",
                expectedShop: shopDomain,
                receivedShop: shop
            });
        }

        const accessToken = shopifyStore.accessToken;
        console.log("🔑 Using access token:", accessToken.slice(0, 5) + "…");

        // Get niche document for multirow images
        const nicheDoc = await Niche.findOne({ name: user.niche?.toLowerCase() });

        // Upload all images
        const uploadResults = await shopifyService.uploadAllImages(
            user,
            nicheDoc,
            shopDomain,
            accessToken
        );

        // Combine all results
        const allResults = [...uploadResults.banners, ...uploadResults.multirow];

        // Check if any uploads were successful
        const successfulUploads = allResults.filter(result => result.success);
        const failedUploads = allResults.filter(result => !result.success);

        res.json({
            message: "Theme image upload completed",
            results: allResults,
            successful: successfulUploads.length,
            failed: failedUploads.length,
            success: successfulUploads.length > 0
        });

    } catch (err) {
        console.error("❌ Error uploading theme images:", err);
        res.status(500).json({ error: "Internal server error", details: err.message });
    }
};
