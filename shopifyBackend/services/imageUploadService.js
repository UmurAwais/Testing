import fetch from "node-fetch";
import { IMAGE_UPLOAD_CONFIG } from "../config/constants.js";

/**
 * Upload images to Shopify Files with specific naming (bannerstore1.png, bannerstore2.png)
 */
export const uploadBannerImagesToShopifyFiles = async (imageUrls, shopDomain, accessToken) => {
    if (!imageUrls || imageUrls.length === 0) {
        console.warn("⚠️ No images provided for upload");
        return [];
    }

    console.log("🚀 Starting Shopify Files upload process");
    console.log("📍 Shop domain:", shopDomain);
    console.log("🖼️ Number of images received:", imageUrls.length);

    const results = [];
    const maxImages = Math.min(imageUrls.length, IMAGE_UPLOAD_CONFIG.MAX_BANNER_IMAGES);

    for (let i = 0; i < maxImages; i++) {
        const imageUrl = imageUrls[i];
        console.log(`🔍 Processing image ${i + 1}:`, imageUrl);

        if (!imageUrl) {
            console.warn(`⚠️ Image ${i + 1} URL is empty, skipping`);
            results.push({ success: false, error: "Empty URL" });
            continue;
        }

        try {
            console.log(`📥 Step 1: Fetching image ${i + 1}...`);
            const response = await fetch(imageUrl);
            if (!response.ok) {
                console.error(`❌ Failed to fetch image ${i + 1}: HTTP ${response.status}`);
                results.push({ success: false, error: `Fetch failed with status ${response.status}` });
                continue;
            }

            const buffer = await response.arrayBuffer();
            const file = Buffer.from(buffer);

            // Extract file extension from URL
            const urlParts = imageUrl.split(".");
            let extension = urlParts[urlParts.length - 1].split(/\#|\?/)[0].toLowerCase();
            if (!IMAGE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(extension)) {
                extension = IMAGE_UPLOAD_CONFIG.DEFAULT_EXTENSION;
            }

            const fileName = `bannerstore${i + 1}.${extension}`;
            console.log(`📦 Step 2: Creating staged upload target for ${fileName}...`);

            // Step 1: Create staged upload target
            const stagedUploadsQuery = `
        mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets {
              resourceUrl
              url
              parameters {
                name
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

            const stagedUploadsVariables = {
                input: [
                    {
                        filename: fileName,
                        httpMethod: "POST",
                        mimeType: `image/${extension}`,
                        resource: "FILE",
                    },
                ],
            };

            const stagedResponse = await fetch(
                `https://${shopDomain}/admin/api/2025-01/graphql.json`,
                {
                    method: "POST",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: stagedUploadsQuery,
                        variables: stagedUploadsVariables,
                    }),
                }
            );

            const stagedData = await stagedResponse.json();
            if (!stagedResponse.ok || stagedData.errors) {
                console.error(`❌ Failed to create staged upload for image ${i + 1}:`, stagedData);
                results.push({ success: false, error: "Staged upload creation failed" });
                continue;
            }

            const target = stagedData.data.stagedUploadsCreate.stagedTargets[0];
            const { url, resourceUrl, parameters } = target;

            console.log(`☁️ Step 3: Uploading file to Shopify's AWS storage...`);

            // Step 2: Upload file to temporary AWS bucket
            const FormData = (await import("form-data")).default;
            const form = new FormData();
            parameters.forEach(({ name, value }) => form.append(name, value));
            form.append("file", file, { filename: fileName });

            const formHeaders = form.getHeaders();
            const uploadResponse = await fetch(url, {
                method: "POST",
                headers: formHeaders,
                body: form,
            });

            if (!uploadResponse.ok) {
                console.error(`❌ Failed to upload file to AWS for image ${i + 1}`);
                results.push({ success: false, error: "AWS upload failed" });
                continue;
            }

            console.log(`🧾 Step 4: Creating Shopify file from resource URL...`);

            // Step 3: Create the actual Shopify File record
            const createFileQuery = `
        mutation fileCreate($files: [FileCreateInput!]!) {
          fileCreate(files: $files) {
            files {
              id
              alt
              createdAt
              preview {
                image {
                  url
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

            const createFileVariables = {
                files: [
                    {
                        alt: `Banner Store ${i + 1}`,
                        contentType: "IMAGE",
                        originalSource: resourceUrl,
                    },
                ],
            };

            const createResponse = await fetch(
                `https://${shopDomain}/admin/api/2025-01/graphql.json`,
                {
                    method: "POST",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: createFileQuery,
                        variables: createFileVariables,
                    }),
                }
            );

            const createData = await createResponse.json();
            if (!createResponse.ok || createData.errors) {
                console.error(`❌ Failed to create Shopify file for image ${i + 1}:`, createData);
                results.push({ success: false, error: "File creation failed" });
                continue;
            }

            const uploadedFileUrl = createData.data.fileCreate.files[0].preview.image.url;
            console.log(`✅ Upload successful for image ${i + 1}!`);
            console.log(`🖼️ File URL: ${uploadedFileUrl}`);

            results.push({
                success: true,
                fileName,
                url: uploadedFileUrl,
                originalUrl: imageUrl
            });

        } catch (err) {
            console.error(`❌ Failed to upload image ${i + 1}:`, err.message);
            results.push({ success: false, error: err.message });
        }
    }

    console.log("📊 Shopify Files upload process completed:", results);
    return results;
};

/**
 * Upload multiRow images to Shopify Files with specific naming (multirow1.png, multirow2.png, multirow3.png)
 */
export const uploadMultiRowImagesToShopifyFiles = async (imageUrls, shopDomain, accessToken) => {
    if (!imageUrls || imageUrls.length === 0) {
        console.warn("⚠️ No multi-row images provided for upload");
        return [];
    }

    console.log("🚀 Starting Multi-Row Images Shopify Files upload process");
    console.log("📍 Shop domain:", shopDomain);
    console.log("🖼️ Number of multi-row images received:", imageUrls.length);

    const results = [];
    const maxImages = Math.min(imageUrls.length, IMAGE_UPLOAD_CONFIG.MAX_MULTIROW_IMAGES);

    for (let i = 0; i < maxImages; i++) {
        const imageUrl = imageUrls[i];
        console.log(`🔍 Processing multi-row image ${i + 1}:`, imageUrl);

        if (!imageUrl) {
            console.warn(`⚠️ Multi-row image ${i + 1} URL is empty, skipping`);
            results.push({ success: false, error: "Empty URL" });
            continue;
        }

        try {
            console.log(`📥 Step 1: Fetching multi-row image ${i + 1}...`);
            const response = await fetch(imageUrl);
            if (!response.ok) {
                console.error(`❌ Failed to fetch multi-row image ${i + 1}: HTTP ${response.status}`);
                results.push({ success: false, error: `Fetch failed with status ${response.status}` });
                continue;
            }

            const buffer = await response.arrayBuffer();
            const file = Buffer.from(buffer);

            // Extract file extension from URL
            const urlParts = imageUrl.split(".");
            let extension = urlParts[urlParts.length - 1].split(/\#|\?/)[0].toLowerCase();
            if (!IMAGE_UPLOAD_CONFIG.ALLOWED_EXTENSIONS.includes(extension)) {
                extension = IMAGE_UPLOAD_CONFIG.DEFAULT_EXTENSION;
            }

            const fileName = `multirow${i + 1}.${extension}`;
            console.log(`📦 Step 2: Creating staged upload target for ${fileName}...`);

            // Step 1: Create staged upload target
            const stagedUploadsQuery = `
        mutation stagedUploadsCreate($input: [StagedUploadInput!]!) {
          stagedUploadsCreate(input: $input) {
            stagedTargets {
              resourceUrl
              url
              parameters {
                name
                value
              }
            }
            userErrors {
              field
              message
            }
          }
        }
      `;

            const stagedUploadsVariables = {
                input: [
                    {
                        filename: fileName,
                        httpMethod: "POST",
                        mimeType: `image/${extension}`,
                        resource: "FILE",
                    },
                ],
            };

            const stagedResponse = await fetch(
                `https://${shopDomain}/admin/api/2025-01/graphql.json`,
                {
                    method: "POST",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: stagedUploadsQuery,
                        variables: stagedUploadsVariables,
                    }),
                }
            );

            const stagedData = await stagedResponse.json();
            if (!stagedResponse.ok || stagedData.errors) {
                console.error(`❌ Failed to create staged upload for multi-row image ${i + 1}:`, stagedData);
                results.push({ success: false, error: "Staged upload creation failed" });
                continue;
            }

            const target = stagedData.data.stagedUploadsCreate.stagedTargets[0];
            const { url, resourceUrl, parameters } = target;

            console.log(`☁️ Step 3: Uploading multi-row file to Shopify's AWS storage...`);

            // Step 2: Upload file to temporary AWS bucket
            const FormData = (await import("form-data")).default;
            const form = new FormData();
            parameters.forEach(({ name, value }) => form.append(name, value));
            form.append("file", file, { filename: fileName });

            const formHeaders = form.getHeaders();
            const uploadResponse = await fetch(url, {
                method: "POST",
                headers: formHeaders,
                body: form,
            });

            if (!uploadResponse.ok) {
                console.error(`❌ Failed to upload multi-row file to AWS for image ${i + 1}`);
                results.push({ success: false, error: "AWS upload failed" });
                continue;
            }

            console.log(`🧾 Step 4: Creating Shopify file from resource URL...`);

            // Step 3: Create the actual Shopify File record
            const createFileQuery = `
        mutation fileCreate($files: [FileCreateInput!]!) {
          fileCreate(files: $files) {
            files {
              id
              alt
              createdAt
              preview {
                image {
                  url
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

            const createFileVariables = {
                files: [
                    {
                        alt: `MultiRow ${i + 1}`,
                        contentType: "IMAGE",
                        originalSource: resourceUrl,
                    },
                ],
            };

            const createResponse = await fetch(
                `https://${shopDomain}/admin/api/2025-01/graphql.json`,
                {
                    method: "POST",
                    headers: {
                        "X-Shopify-Access-Token": accessToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        query: createFileQuery,
                        variables: createFileVariables,
                    }),
                }
            );

            const createData = await createResponse.json();
            if (!createResponse.ok || createData.errors) {
                console.error(`❌ Failed to create Shopify file for multi-row image ${i + 1}:`, createData);
                results.push({ success: false, error: "File creation failed" });
                continue;
            }

            const uploadedFileUrl = createData.data.fileCreate.files[0].preview.image.url;
            console.log(`✅ Upload successful for multi-row image ${i + 1}!`);
            console.log(`🖼️ File URL: ${uploadedFileUrl}`);

            results.push({
                success: true,
                fileName,
                url: uploadedFileUrl,
                originalUrl: imageUrl
            });

        } catch (err) {
            console.error(`❌ Failed to upload multi-row image ${i + 1}:`, err.message);
            results.push({ success: false, error: err.message });
        }
    }

    console.log("📊 Multi-Row Images Shopify Files upload process completed:", results);
    return results;
};
