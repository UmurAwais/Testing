# 🔍 Where to Register Compliance Webhooks

## The Issue
You can't find "Compliance webhooks" option in Partner Dashboard.

## ✅ Where Compliance Webhooks Are Actually Registered

Compliance webhooks can be registered in **several places** depending on your app type:

### Option 1: During App Submission/Review (Most Common)
1. Go to **Partner Dashboard** → Your App
2. Navigate to **"App submission"** or **"Submit for review"** section
3. Look for:
   - **"Privacy & Compliance"** section
   - **"Compliance webhooks"** field
   - **"Mandatory webhooks"** section
   - Fields asking for webhook URLs during submission

### Option 2: App Setup → Webhooks Section
1. Go to **Partner Dashboard** → Your App
2. Navigate to **"App Setup"**
3. Look for:
   - **"Webhooks"** tab/section
   - **"Privacy webhooks"** subsection
   - **"Compliance"** subsection

### Option 3: Programmatically During Installation
Register webhooks when a shop installs your app (in your OAuth callback handler).

### Option 4: GraphQL Admin API (Per Shop)
Register webhooks using shop access tokens after installation.

---

## 📋 What URLs to Register

When you find the right place, add these three URLs:

1. **Customer data request:**
   ```
   https://ecomlly.vercel.app/webhooks/customers/data_request
   ```

2. **Customer data erasure:**
   ```
   https://ecomlly.vercel.app/webhooks/customers/redact
   ```

3. **Shop data erasure:**
   ```
   https://ecomlly.vercel.app/webhooks/shop/redact
   ```

---

## 🎯 Most Likely Location

Based on your error message showing automated checks during deployment, the webhooks are probably registered **during the app submission/review process**, not in a separate "Compliance webhooks" section.

**Try this:**
1. Go to Partner Dashboard → Your App
2. Click **"Submit for review"** or **"App submission"**
3. Look through the submission form for:
   - Privacy & Compliance fields
   - Webhook URL fields
   - Mandatory webhooks section

---

## ✅ Your Code is Ready!

- ✅ Webhook routes implemented
- ✅ HMAC verification working
- ✅ All handlers return proper responses
- ✅ Backend deployed at `https://ecomlly.vercel.app`

**You just need to find where Shopify asks for these URLs during submission!**

---

## 🆘 Still Can't Find It?

1. **Check the automated checks error page** - it might have a link to where to register
2. **Look for "Privacy & Compliance"** section anywhere in Partner Dashboard
3. **Check "App Setup" → "Webhooks"** (might be under a different name)
4. **Contact Shopify Partner Support** - they can guide you to the exact location

---

## 📝 Alternative: Register During Installation

If you can't find it in Partner Dashboard, you can register webhooks programmatically when shops install your app. See `scripts/registerComplianceWebhooks.js` for example code.
