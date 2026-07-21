import fetch from "node-fetch";
import crypto from "crypto";
import { SHOPIFY_CONFIG, THEME_CONFIG } from "../config/constants.js";
import User from "../models/User.js";
import ShopifyStore from "../models/ShopifyStore.js";
import Niche from "../models/Niche.js";
import { uploadBannerImagesToShopifyFiles, uploadMultiRowImagesToShopifyFiles } from "./imageUploadService.js";

/**
 * Normalize shop domain to myshopify.com format
 */
export const normalizeShopDomain = (shopDomain) => {
    if (!shopDomain) return "";

    // Remove https:// or http:// if present
    let cleanDomain = shopDomain.replace(/^https?:\/\//, "").replace(/\/$/, "");

    if (!cleanDomain.includes("myshopify.com")) {
        try {
            // Check for admin.shopify.com/store/store-name format
            const match = cleanDomain.match(/\/store\/([^\/]+)(\/|$)/) || cleanDomain.match(/^admin\.shopify\.com\/store\/([^\/]+)(\/|$)/);

            if (match) {
                const storeName = match[1];
                return `${storeName}.myshopify.com`;
            }

            // If it's just a store name without dot, assume it's the handle
            if (!cleanDomain.includes(".")) {
                return `${cleanDomain}.myshopify.com`;
            }

            return cleanDomain;
        } catch (err) {
            console.error("⚠️ Error normalizing shop domain:", err.message);
            return cleanDomain;
        }
    }
    return cleanDomain;
};

/**
 * Verify Shopify HMAC signature
 */
export const verifyHMAC = (params, hmac) => {
    const message = Object.keys(params)
        .sort()
        .map((key) => `${key}=${params[key]}`)
        .join("&");

    const generatedHash = crypto
        .createHmac("sha256", SHOPIFY_CONFIG.CLIENT_SECRET)
        .update(message)
        .digest("hex");

    return generatedHash === hmac;
};

/**
 * Exchange authorization code for access token
 */
export const exchangeCodeForToken = async (shop, code) => {
    const tokenizeResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            client_id: SHOPIFY_CONFIG.CLIENT_ID,
            client_secret: SHOPIFY_CONFIG.CLIENT_SECRET,
            code,
        }),
    });

    const data = await tokenizeResponse.json();
    return data.access_token;
};

/**
 * Create metafield for banner images
 * @param {string} customKey - Optional custom key name (e.g., 'bannerstore1')
 */
export const createBannerMetafield = async (shop, accessToken, bannerImage, index, customKey = null) => {
    const key = customKey || `store_banner_${index + 1}`;

    const response = await fetch(`https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/metafields.json`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": accessToken?.trim(),
        },
        body: JSON.stringify({
            metafield: {
                namespace: "custom",
                key: key, // Use custom key if provided, otherwise default
                value: bannerImage,
                type: "single_line_text_field",
            },
        }),
    });

    const resJson = await response.json().catch(() => ({}));
    if (!response.ok) {
        console.error(`❌ Failed to add metafield (Status: ${response.status}):`, JSON.stringify(resJson));
        return { success: false, error: resJson, status: response.status };
    }

    console.log(`✅ Banner metafield created: ${key} (ID: ${resJson.metafield?.id})`);
    return { success: true, data: resJson };
};

/**
 * Register compliance webhooks for a shop
 * These are mandatory GDPR compliance webhooks
 */
export const registerComplianceWebhooks = async (shop, accessToken) => {
    const endpoint = `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/graphql.json`;
    const APP_URL = process.env.HOST || 'https://ecomlly-nu.vercel.app';
    
    const webhooks = [
        {
            topic: 'CUSTOMERS_DATA_REQUEST',
            uri: `${APP_URL}/webhooks/customers/data_request`
        },
        {
            topic: 'CUSTOMERS_REDACT',
            uri: `${APP_URL}/webhooks/customers/redact`
        },
        {
            topic: 'SHOP_REDACT',
            uri: `${APP_URL}/webhooks/shop/redact`
        }
    ];

    const results = [];

    for (const webhook of webhooks) {
        const mutation = `
            mutation webhookSubscriptionCreate($topic: WebhookSubscriptionTopic!, $webhookSubscription: WebhookSubscriptionInput!) {
                webhookSubscriptionCreate(topic: $topic, webhookSubscription: $webhookSubscription) {
                    webhookSubscription {
                        id
                        callbackUrl
                        format
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const variables = {
            topic: webhook.topic,
            webhookSubscription: {
                callbackUrl: webhook.uri,
                format: 'JSON'
            }
        };

        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-Shopify-Access-Token': accessToken.trim()
                },
                body: JSON.stringify({ query: mutation, variables })
            });

            const data = await response.json();
            
            if (data.errors) {
                console.error(`❌ Error registering ${webhook.topic}:`, data.errors);
                results.push({ topic: webhook.topic, success: false, error: data.errors });
            } else if (data.data?.webhookSubscriptionCreate?.userErrors?.length > 0) {
                console.error(`❌ User errors for ${webhook.topic}:`, data.data.webhookSubscriptionCreate.userErrors);
                results.push({ topic: webhook.topic, success: false, error: data.data.webhookSubscriptionCreate.userErrors });
            } else {
                console.log(`✅ Registered compliance webhook: ${webhook.topic} -> ${webhook.uri}`);
                results.push({ topic: webhook.topic, success: true });
            }
        } catch (error) {
            console.error(`❌ Failed to register ${webhook.topic}:`, error.message);
            results.push({ topic: webhook.topic, success: false, error: error.message });
        }
    }

    return results;
};

/**
 * Create product in Shopify store using GraphQL API
 */
export const createProduct = async (shop, accessToken, product, niche, tags = []) => {
    const endpoint = `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/graphql.json`;

    // Handle multiple images
    let productImages = [];
    if (product.imageUrls && Array.isArray(product.imageUrls) && product.imageUrls.length > 0) {
        productImages = product.imageUrls
            .filter(url => url && url.trim() !== "")
            .map(url => url.trim());
    } else if (product.imageUrl && product.imageUrl.trim() !== "") {
        productImages = [product.imageUrl.trim()];
    }

    const price = product.discountedPrice || product.price;
    const compareAtPrice = product.price;

    console.log(`💰 Price info for "${product.name}":`, {
        originalPrice: product.price,
        discountedPrice: product.discountedPrice,
        sellingPrice: price,
        compareAtPrice: compareAtPrice
    });

    // Build the GraphQL mutation - using the correct format for 2025-01 API
    // Note: In newer API versions, variants are created automatically with productOptions
    const mutation = `
        mutation {
            productCreate(product: {
                title: ${JSON.stringify(product.name)},
                descriptionHtml: ${JSON.stringify(product.description || "")},
                vendor: ${JSON.stringify(niche)},
                productType: ${JSON.stringify(niche)},
                status: ACTIVE,
                tags: ${JSON.stringify(tags)},
                productOptions: [{
                    name: "Title",
                    values: [{name: "Default"}]
                }]
            }) {
                product {
                    id
                    title
                    variants(first: 1) {
                        edges {
                            node {
                                id
                            }
                        }
                    }
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken?.trim(),
            },
            body: JSON.stringify({ query: mutation }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error("❌ GraphQL request failed:", response.status, errorText);
            return { success: false, error: `HTTP ${response.status}: ${errorText}` };
        }

        const data = await response.json();

        // Check for GraphQL errors
        if (data.errors) {
            console.error("❌ GraphQL errors:", data.errors);
            return { success: false, error: data.errors };
        }

        // Check for user errors
        if (data?.data?.productCreate?.userErrors?.length > 0) {
            console.error("❌ Product creation user errors:", data.data.productCreate.userErrors);
            return { success: false, error: data.data.productCreate.userErrors };
        }

        const created = data?.data?.productCreate?.product;
        if (!created) {
            console.error("❌ No product returned:", data);
            return { success: false, error: "No product returned from API" };
        }

        console.log("✅ Product created:", created.id);

        // Now update the variant with price and SKU
        const variantId = created.variants?.edges?.[0]?.node?.id;
        if (variantId && (price || compareAtPrice)) {
            const priceUpdateResult = await updateVariantPrice(shop, accessToken, variantId, price, compareAtPrice, `PROD-${product._id}`);
            if (!priceUpdateResult.success) {
                console.error("⚠️ Product created but price update failed:", priceUpdateResult.error);
            }
        } else {
            console.warn("⚠️ No variant ID or price found, skipping price update");
        }

        // Add product images if available
        if (productImages.length > 0) {
            await addProductImages(shop, accessToken, created.id, productImages);
        }

        // ✅ Publish product to sales channels (Online Store and Point of Sale)
        const publicationResult = await publishProductToChannels(shop, accessToken, created.id);

        return {
            success: true,
            data: created,
            publications: publicationResult
        };

    } catch (error) {
        console.error("❌ Exception in createProduct:", error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Update variant price, compareAtPrice, and SKU using REST API
 */
const updateVariantPrice = async (shop, accessToken, variantId, price, compareAtPrice, sku) => {
    // Extract numeric ID from GraphQL ID (gid://shopify/ProductVariant/12345 -> 12345)
    const numericId = variantId.split('/').pop();
    const endpoint = `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/variants/${numericId}.json`;

    const variantData = {
        variant: {
            id: parseInt(numericId),
            price: price?.toString() || "0",
            compare_at_price: compareAtPrice?.toString() || null,
            sku: sku
        }
    };

    try {
        console.log(`🔄 Updating variant price via REST API: ${numericId}`);
        console.log(`   Sending price: $${price}, compareAt: $${compareAtPrice}`);

        const response = await fetch(endpoint, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken?.trim(),
            },
            body: JSON.stringify(variantData),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`❌ HTTP Error updating variant price (${response.status}):`, errorText);
            return { success: false, error: `HTTP ${response.status}: ${errorText}` };
        }

        const data = await response.json();

        if (data.errors) {
            console.error("❌ Errors updating variant price:", data.errors);
            return { success: false, error: data.errors };
        }

        const variant = data.variant;
        if (!variant) {
            console.error("❌ No variant returned from price update");
            return { success: false, error: "No variant returned" };
        }

        console.log("✅ Variant price updated successfully:", {
            price: `$${variant.price}`,
            compareAtPrice: variant.compare_at_price ? `$${variant.compare_at_price}` : 'Not set',
            sku: variant.sku
        });

        return { success: true, variant };
    } catch (error) {
        console.error("❌ Exception updating variant price:", error.message);
        return { success: false, error: error.message };
    }
};

/**
 * Add images to a product using GraphQL
 */
const addProductImages = async (shop, accessToken, productId, imageUrls) => {
    const endpoint = `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/graphql.json`;

    // Build media array
    const mediaArray = imageUrls.map(url => `{
        originalSource: ${JSON.stringify(url)},
        mediaContentType: IMAGE
    }`).join(', ');

    const mutation = `
        mutation {
            productCreateMedia(productId: ${JSON.stringify(productId)}, media: [${mediaArray}]) {
                media {
                    ... on MediaImage {
                        id
                        image {
                            url
                        }
                    }
                }
                mediaUserErrors {
                    field
                    message
                }
            }
        }
    `;

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken?.trim(),
            },
            body: JSON.stringify({ query: mutation }),
        });

        const data = await response.json();

        if (data?.data?.productCreateMedia?.mediaUserErrors?.length > 0) {
            console.error("⚠️ Failed to add product images:", data.data.productCreateMedia.mediaUserErrors);
        } else {
            console.log(`✅ Added ${imageUrls.length} image(s) to product`);
        }
    } catch (error) {
        console.error("⚠️ Error adding product images:", error.message);
    }
};

/**
 * Publish product to sales channels (Online Store, Point of Sale, etc.)
 */
const publishProductToChannels = async (shop, accessToken, productId) => {
    const endpoint = `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/graphql.json`;

    try {
        console.log(`📢 Publishing product ${productId} to sales channels...`);

        // First, get all available publications (sales channels)
        const publicationsQuery = `
            query {
                publications(first: 10) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
        `;

        const pubResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken?.trim(),
            },
            body: JSON.stringify({ query: publicationsQuery }),
        });

        const pubData = await pubResponse.json();
        const publications = pubData?.data?.publications?.edges || [];

        if (publications.length === 0) {
            console.log("⚠️ No publications found, product may not be visible in sales channels");
            return { success: false, channels: [] };
        }

        console.log(`📋 Found ${publications.length} sales channel(s):`);
        publications.forEach(pub => {
            console.log(`   - ${pub.node.name} (${pub.node.id})`);
        });

        // Publish to each channel individually using productPublish mutation
        const publishedChannels = [];
        const failedChannels = [];

        for (const publication of publications) {
            const publishMutation = `
                mutation {
                    productPublish(
                        input: {
                            id: "${productId}",
                            productPublications: [{
                                publicationId: "${publication.node.id}"
                            }]
                        }
                    ) {
                        product {
                            id
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `;

            const publishResponse = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": accessToken?.trim(),
                },
                body: JSON.stringify({ query: publishMutation }),
            });

            const publishData = await publishResponse.json();

            // Log the full response for debugging
            console.log(`   📊 Response for ${publication.node.name}:`, JSON.stringify(publishData, null, 2));

            if (publishData?.data?.productPublish?.userErrors?.length > 0) {
                console.error(`   ❌ Failed to publish to ${publication.node.name}:`, publishData.data.productPublish.userErrors);
                failedChannels.push({
                    name: publication.node.name,
                    id: publication.node.id,
                    error: publishData.data.productPublish.userErrors
                });
            } else if (publishData?.errors) {
                console.error(`   ❌ GraphQL errors for ${publication.node.name}:`, publishData.errors);
                failedChannels.push({
                    name: publication.node.name,
                    id: publication.node.id,
                    error: publishData.errors
                });
            } else {
                console.log(`   ✅ Published to ${publication.node.name}`);
                publishedChannels.push({
                    name: publication.node.name,
                    id: publication.node.id
                });
            }
        }

        console.log(`✅ Product published to ${publishedChannels.length}/${publications.length} sales channel(s)`);

        return {
            success: publishedChannels.length > 0,
            channels: publishedChannels,
            failed: failedChannels,
            total: publications.length
        };
    } catch (error) {
        console.error("⚠️ Error publishing product to channels:", error.message);
        return { success: false, channels: [], error: error.message };
    }
};

/**
 * Create theme in Shopify store
 */
export const createTheme = async (shopDomain, accessToken, themeName, themeUrl) => {
    const cleanShop = normalizeShopDomain(shopDomain);
    const shopifyApiUrl = `https://${cleanShop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/themes.json`;
    console.log("🚀 Sending request to Shopify API to create theme...", shopifyApiUrl);

    const trimmedToken = accessToken?.trim();

    const createThemeResponse = await fetch(shopifyApiUrl, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "X-Shopify-Access-Token": trimmedToken,
        },
        body: JSON.stringify({
            theme: {
                name: themeName,
                src: themeUrl,
                role: "unpublished",
            },
        }),
    });

    const createThemeData = await createThemeResponse.json().catch(() => ({}));

    if (!createThemeResponse.ok) {
        console.log(`❌ Failed to create theme (Status: ${createThemeResponse.status}):`, JSON.stringify(createThemeData));
        throw new Error(`Failed to create theme: ${createThemeResponse.status} ${JSON.stringify(createThemeData.errors || createThemeData)}`);
    }

    console.log(`✅ Theme created successfully: ${createThemeData.theme.name} (ID: ${createThemeData.theme.id})`);
    return createThemeData.theme;
};

/**
 * Wait for theme installation to complete
 */
export const waitForThemeInstallation = async (shopDomain, accessToken, themeId) => {
    console.log("⏳ Waiting for theme installation to complete...");
    let themeReady = false;
    let attempts = 0;

    while (!themeReady && attempts < THEME_CONFIG.MAX_THEME_WAIT_ATTEMPTS) {
        await new Promise(resolve => setTimeout(resolve, THEME_CONFIG.THEME_CHECK_INTERVAL));
        attempts++;

        console.log(`🔍 Checking theme status (attempt ${attempts}/${THEME_CONFIG.MAX_THEME_WAIT_ATTEMPTS})...`);
        const themeCheckResponse = await fetch(
            `https://${shopDomain.split("/")[0]}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/themes/${themeId}.json`,
            {
                headers: {
                    "X-Shopify-Access-Token": accessToken,
                },
            }
        );

        if (themeCheckResponse.ok) {
            const themeCheck = await themeCheckResponse.json();
            console.log("📋 Theme status:", themeCheck.theme.name, "Role:", themeCheck.theme.role, "Processing:", themeCheck.theme.processing);

            // Check if theme is ready (not processing and has proper role)
            if (!themeCheck.theme.processing && themeCheck.theme.role) {
                themeReady = true;
                console.log("✅ Theme installation complete!");

                // Theme is uploaded as unpublished, no more automatic publication
                // if (themeCheck.theme.role !== 'main') {
                //     await publishThemeAsMain(shopDomain, accessToken, themeId);
                // }
            } else {
                console.log("⏳ Theme still processing, waiting...");
            }
        } else {
            console.log("⏳ Theme not ready yet, waiting...");
        }
    }

    if (!themeReady) {
        console.log("⚠️ Theme installation taking longer than expected, proceeding anyway...");
    }

    return themeReady;
};

/**
 * Publish theme as main theme
 */
export const publishThemeAsMain = async (shopDomain, accessToken, themeId) => {
    console.log("📢 Publishing theme to make it active...");
    const publishResponse = await fetch(
        `https://${shopDomain.split("/")[0]}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/themes/${themeId}.json`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken,
            },
            body: JSON.stringify({
                theme: {
                    id: themeId,
                    role: "main"
                }
            }),
        }
    );

    if (publishResponse.ok) {
        console.log("✅ Theme published successfully");
        await new Promise(resolve => setTimeout(resolve, 2000));
        return { success: true };
    } else {
        const publishError = await publishResponse.json();
        console.error("❌ Failed to publish theme:", publishError);
        return { success: false, error: publishError };
    }
};

/**
 * Upload all images (banners and multirow) to Shopify
 */
export const uploadAllImages = async (user, nicheDoc, shopDomain, accessToken) => {
    const results = {
        banners: [],
        multirow: []
    };

    // Upload banner images
    const userBannerImages = [user.BannerImage1, user.BannerImage2].filter(Boolean);
    const nicheBannerImages = nicheDoc?.bannerImages || [];
    const allBannerImages = [...userBannerImages, ...nicheBannerImages]
        .map(url => url ? url.trim().replace(/[\r\n\t]/g, '') : url)
        .filter(Boolean);

    console.log("🖼️ Uploading banner images to Shopify Files:", allBannerImages);

    if (allBannerImages.length > 0) {
        results.banners = await uploadBannerImagesToShopifyFiles(
            allBannerImages,
            shopDomain.split("/")[0],
            accessToken
        );
        console.log("📊 Banner upload results to Shopify Files:", results.banners);
    }

    // Upload multirow images
    const nicheMultiRowImages = nicheDoc?.multiRowImages || [];
    const allMultiRowImages = nicheMultiRowImages
        .map(url => url ? url.trim().replace(/[\r\n\t]/g, '') : url)
        .filter(Boolean);

    console.log("🖼️ Uploading multi-row images to Shopify Files:", allMultiRowImages);

    if (allMultiRowImages.length > 0) {
        results.multirow = await uploadMultiRowImagesToShopifyFiles(
            allMultiRowImages,
            shopDomain.split("/")[0],
            accessToken
        );
        console.log("📊 Multi-row images upload results to Shopify Files:", results.multirow);
    }

    return results;
};

/**
 * Get all themes for a shop
 */
export const getThemes = async (shop, accessToken) => {
    const response = await fetch(`https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/themes.json`, {
        headers: { "X-Shopify-Access-Token": accessToken?.trim() }
    });
    const data = await response.json();
    return data.themes || [];
};

/**
 * Get a specific theme asset
 */
export const getThemeAsset = async (shop, accessToken, themeId, key) => {
    const response = await fetch(
        `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/themes/${themeId}/assets.json?asset[key]=${key}`,
        {
            headers: { "X-Shopify-Access-Token": accessToken?.trim() }
        }
    );
    const data = await response.json();
    return data.asset;
};

/**
 * Update a theme asset
 */
export const updateThemeAsset = async (shop, accessToken, themeId, key, value) => {
    const response = await fetch(
        `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/themes/${themeId}/assets.json`,
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken?.trim(),
            },
            body: JSON.stringify({
                asset: {
                    key: key,
                    value: value
                }
            }),
        }
    );

    if (!response.ok) {
        const error = await response.json();
        console.error(`❌ Failed to update asset ${key}:`, error);
        return { success: false, error };
    }

    return { success: true };
};

/**
 * Create or get a smart collection
 */
export const ensureSmartCollection = async (shop, accessToken, title, handle, rules) => {
    // Try to find it first
    const searchResponse = await fetch(
        `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/smart_collections.json?handle=${handle}`,
        {
            headers: { "X-Shopify-Access-Token": accessToken?.trim() }
        }
    );
    const searchData = await searchResponse.json();

    if (searchData.smart_collections && searchData.smart_collections.length > 0) {
        const existing = searchData.smart_collections[0];
        console.log(`✅ Collection found: ${title}. Ensuring it is published...`);

        // Force update visibility for existing collection
        await fetch(
            `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/smart_collections/${existing.id}.json`,
            {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": accessToken?.trim(),
                },
                body: JSON.stringify({
                    smart_collection: {
                        id: existing.id,
                        published_scope: "global"
                    }
                }),
            }
        );
        return existing;
    }

    // Create it if not found
    console.log(`🆕 Creating smart collection: ${title}`);
    const createResponse = await fetch(
        `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/smart_collections.json`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken?.trim(),
            },
            body: JSON.stringify({
                smart_collection: {
                    title: title,
                    handle: handle,
                    rules: rules,
                    disjunctive: false,
                    published_scope: "global" // 🌍 Force visibility on Online Store
                }
            }),
        }
    );

    const createData = await createResponse.json();
    if (!createResponse.ok) {
        console.error("❌ Failed to create collection:", createData);
        throw new Error("Failed to create collection");
    }

    return createData.smart_collection;
};

/**
 * Publish collection to sales channels (Online Store, Point of Sale, etc.)
 */
export const publishCollectionToChannels = async (shop, accessToken, collectionId) => {
    const endpoint = `https://${shop}/admin/api/${SHOPIFY_CONFIG.API_VERSION}/graphql.json`;

    try {
        console.log(`📢 Publishing collection ${collectionId} to sales channels...`);

        // Get all available publications (sales channels)
        const publicationsQuery = `
            query {
                publications(first: 10) {
                    edges {
                        node {
                            id
                            name
                        }
                    }
                }
            }
        `;

        const pubResponse = await fetch(endpoint, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Shopify-Access-Token": accessToken?.trim(),
            },
            body: JSON.stringify({ query: publicationsQuery }),
        });

        const pubData = await pubResponse.json();
        const publications = pubData?.data?.publications?.edges || [];

        if (publications.length === 0) {
            console.log("⚠️ No publications found for collection");
            return { success: false, channels: [] };
        }

        console.log(`📋 Publishing collection to ${publications.length} channel(s)...`);

        // Publish to each channel
        const publishedChannels = [];
        const failedChannels = [];

        for (const publication of publications) {
            const publishMutation = `
                mutation {
                    collectionPublish(
                        input: {
                            id: "${collectionId}",
                            collectionPublications: [{
                                publicationId: "${publication.node.id}"
                            }]
                        }
                    ) {
                        collection {
                            id
                        }
                        userErrors {
                            field
                            message
                        }
                    }
                }
            `;

            const publishResponse = await fetch(endpoint, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-Shopify-Access-Token": accessToken?.trim(),
                },
                body: JSON.stringify({ query: publishMutation }),
            });

            const publishData = await publishResponse.json();

            if (publishData?.data?.collectionPublish?.userErrors?.length > 0) {
                console.error(`   ❌ Failed to publish collection to ${publication.node.name}:`, publishData.data.collectionPublish.userErrors);
                failedChannels.push({
                    name: publication.node.name,
                    id: publication.node.id,
                    error: publishData.data.collectionPublish.userErrors
                });
            } else {
                console.log(`   ✅ Collection published to ${publication.node.name}`);
                publishedChannels.push({
                    name: publication.node.name,
                    id: publication.node.id
                });
            }
        }

        console.log(`✅ Collection published to ${publishedChannels.length}/${publications.length} sales channel(s)`);

        return {
            success: publishedChannels.length > 0,
            channels: publishedChannels,
            failed: failedChannels
        };
    } catch (error) {
        console.error("⚠️ Error publishing collection to channels:", error.message);
        return { success: false, channels: [], error: error.message };
    }
};

