# 🔍 Where to Find Compliance Webhooks in Partner Dashboard

## The Problem
You can't find "Compliance webhooks" section in Partner Dashboard.

## ✅ Where They Actually Are

Compliance webhooks are registered in **different places** depending on your app's status:

### 🎯 Option 1: During App Submission (Most Likely)
**This is where automated checks happen!**

1. Go to **Partner Dashboard** → Your App
2. Click **"Submit for review"** or **"App submission"**
3. Look for these sections:
   - **"Privacy & Compliance"** tab/section
   - **"Mandatory webhooks"** field
   - **"Compliance webhooks"** field (might be in a form)
   - Fields asking for webhook URLs during the submission process

**The automated checks you're seeing happen during this submission process!**

### 🎯 Option 2: App Setup → Webhooks
1. Partner Dashboard → Your App
2. **"App Setup"** tab
3. Look for:
   - **"Webhooks"** section
   - **"Privacy webhooks"** subsection
   - **"Compliance"** subsection

### 🎯 Option 3: Settings → Privacy
1. Partner Dashboard → Your App
2. **"Settings"** or **"Configuration"**
3. Look for **"Privacy & Compliance"** section

---

## 📋 What URLs to Add

When you find the right place, add these three URLs:

```
1. https://ecomlly.vercel.app/webhooks/customers/data_request
2. https://ecomlly.vercel.app/webhooks/customers/redact
3. https://ecomlly.vercel.app/webhooks/shop/redact
```

---

## ✅ Automatic Registration (Already Added!)

I've added code to automatically register webhooks when shops install your app. This happens in `handleShopifyCallback` function.

**However**, the automated checks during deployment might still require webhooks to be registered at the **app level** in Partner Dashboard, not just per-shop.

---

## 🎯 Most Likely Solution

Since you're seeing automated checks **during deployment**, the webhooks are probably registered:

1. **During app submission/review** - Look for a form field asking for webhook URLs
2. **In the error message itself** - The automated checks page might have a link to where to register them
3. **In "App Setup" → "Privacy & Compliance"** - Some apps show this section

---

## 🆘 Still Can't Find It?

1. **Check the automated checks error page** - It might have a direct link
2. **Look at the error message carefully** - It might say "Register webhooks in [location]"
3. **Try submitting your app** - The submission form might ask for webhook URLs
4. **Contact Shopify Partner Support** - They can guide you to the exact location

---

## 📝 Alternative: Check App Submission Form

The automated checks happen during app submission. Try:

1. Go to Partner Dashboard → Your App
2. Click **"Submit for review"** or start a new submission
3. Go through the submission form step by step
4. Look for any field asking for webhook URLs or compliance settings

**This is most likely where you need to add them!**
