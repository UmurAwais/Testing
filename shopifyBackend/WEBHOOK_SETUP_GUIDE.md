# Shopify App Webhook Configuration Guide

## 🎯 Quick Start: Using Shopify CLI (Recommended)

The `shopify.toml` file has been created to automatically register webhooks during deployment. This is the **recommended method** as it ensures webhooks are properly registered and verified.

### Prerequisites:
1. Install Shopify CLI:
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. Login to Shopify CLI:
   ```bash
   shopify auth login
   ```

### Register Webhooks Using CLI:

1. **Navigate to your app directory** (where `shopify.toml` is located)

2. **Deploy webhooks** (this registers them automatically):
   ```bash
   shopify app deploy
   ```
   
   Or specifically for webhooks:
   ```bash
   shopify app generate webhook
   ```

3. **Verify webhooks are registered**:
   - Go to your Shopify Partner Dashboard
   - Navigate to App Setup → Compliance webhooks
   - You should see all three webhooks registered automatically ✅

### Benefits of Using Shopify CLI:
- ✅ Automatic webhook registration
- ✅ Proper webhook configuration
- ✅ Better integration with Shopify's deployment system
- ✅ Automated checks will pass more reliably

---

## ✅ Mandatory GDPR Compliance Webhooks

Your app now has the following webhook endpoints implemented:

### 1. Customer Data Request
- **URL**: `https://ecomlly.vercel.app/webhooks/customers/data_request`
- **Purpose**: Handles customer data requests (GDPR compliance)
- **Method**: POST
- **HMAC Verified**: ✅ Yes

### 2. Customer Redact
- **URL**: `https://ecomlly.vercel.app/webhooks/customers/redact`
- **Purpose**: Handles customer data deletion requests (GDPR compliance)
- **Method**: POST
- **HMAC Verified**: ✅ Yes

### 3. Shop Redact
- **URL**: `https://ecomlly.vercel.app/webhooks/shop/redact`
- **Purpose**: Handles shop data deletion (triggered 48 hours after uninstall)
- **Method**: POST
- **HMAC Verified**: ✅ Yes

---

## 📝 Alternative: Manual Configuration in Shopify Partner Dashboard

If you prefer to configure webhooks manually (or if CLI method doesn't work):

1. **Go to your Shopify Partner Dashboard**
   - Navigate to: https://partners.shopify.com/
   - Select your app

2. **Go to App Setup → Compliance webhooks**
   - Look for the "Compliance webhooks" section
   - You should see three required webhooks

3. **Add the webhook URLs:**

   **Customer data request:**
   ```
   https://ecomlly.vercel.app/webhooks/customers/data_request
   ```

   **Customer data erasure:**
   ```
   https://ecomlly.vercel.app/webhooks/customers/redact
   ```

   **Shop data erasure:**
   ```
   https://ecomlly.vercel.app/webhooks/shop/redact
   ```

4. **Save the configuration**

5. **Click "Run" button** in the automated checks section to verify

> **Note:** Using Shopify CLI with `shopify.toml` is preferred as it automatically handles webhook registration and ensures proper configuration.

---

## ⚠️ Important Notes

### Before Testing:
1. **Deploy your backend** to your hosting service (currently deployed on Vercel)
2. Make sure your backend is accessible at: `https://ecomlly.vercel.app`
3. Ensure your `.env` file has the correct `PARTNER_CLIENT_SECRET` (currently set)

### HMAC Verification:
- All webhooks are protected with HMAC signature verification
- Uses your `PARTNER_CLIENT_SECRET` from `.env` file
- Shopify will send webhooks with `X-Shopify-Hmac-Sha256` header

### Data Handling (TODO):
The current implementation logs the requests. You need to implement:

1. **For `customers/data_request`:**
   - Collect all customer data from your database
   - Send it to the customer within 30 days
   - Store the request for compliance tracking

2. **For `customers/redact`:**
   - Delete all customer personal information
   - Remove customer email, name, order history
   - Keep only anonymized data if needed for business purposes

3. **For `shop/redact`:**
   - Delete all shop-related data
   - **CRITICAL**: Delete shop access tokens
   - Remove shop settings and configurations

---

## 🧪 Testing Webhooks Locally

If you want to test webhooks locally before deploying:

1. **Use ngrok or similar tool:**
   ```bash
   ngrok http 3000
   ```

2. **Update webhook URLs temporarily:**
   ```
   https://your-ngrok-url.ngrok.io/webhooks/customers/data_request
   https://your-ngrok-url.ngrok.io/webhooks/customers/redact
   https://your-ngrok-url.ngrok.io/webhooks/shop/redact
   ```

3. **Test with Shopify's webhook testing tool** in Partner Dashboard

---

## 🚀 Deployment Checklist

### Using Shopify CLI (Recommended):
- [ ] Install Shopify CLI (`npm install -g @shopify/cli`)
- [ ] Login to Shopify CLI (`shopify auth login`)
- [ ] Deploy backend to production (Vercel)
- [ ] Verify backend is accessible at your HOST URL
- [ ] Run `shopify app deploy` to register webhooks automatically
- [ ] Click "Run" in Partner Dashboard to test automated checks
- [ ] Verify all checks pass ✅
- [ ] Implement actual data handling logic (currently just logs)

### Manual Method:
- [ ] Deploy backend to production (Vercel)
- [ ] Verify backend is accessible at your HOST URL
- [ ] Add webhook URLs in Shopify Partner Dashboard manually
- [ ] Click "Run" to test automated checks
- [ ] Verify all checks pass ✅
- [ ] Implement actual data handling logic (currently just logs)

---

## 📚 Additional Resources

- [Shopify Webhook Documentation](https://shopify.dev/docs/apps/webhooks)
- [GDPR Compliance Guide](https://shopify.dev/docs/apps/launch/privacy-compliance)
- [Webhook HMAC Verification](https://shopify.dev/docs/apps/webhooks/configuration/https#step-5-verify-the-webhook)
