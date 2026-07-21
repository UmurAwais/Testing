import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PARTNER_CLIENT_ID = process.env.PARTNER_CLIENT_ID;
const PARTNER_CLIENT_SECRET = process.env.PARTNER_CLIENT_SECRET;
const PARTNER_API_ACCESS_TOKEN = process.env.PARTNER_API_ACCESS_TOKEN;
const PARTNER_ORG_ID = process.env.PARTNER_ORG_ID;
const APP_URL = process.env.HOST || 'https://ecomlly.vercel.app';

// Webhook configurations
const WEBHOOKS = [
  {
    topic: 'customers/data_request',
    uri: `${APP_URL}/webhooks/customers/data_request`,
    format: 'json',
    api_version: '2025-01'
  },
  {
    topic: 'customers/redact',
    uri: `${APP_URL}/webhooks/customers/redact`,
    format: 'json',
    api_version: '2025-01'
  },
  {
    topic: 'shop/redact',
    uri: `${APP_URL}/webhooks/shop/redact`,
    format: 'json',
    api_version: '2025-01'
  }
];

/**
 * Register webhooks using Shopify Partner API
 * Note: Compliance webhooks must be registered in Partner Dashboard
 * This script helps verify/register regular webhooks
 */
async function registerWebhooks() {
  if (!PARTNER_API_ACCESS_TOKEN || !PARTNER_ORG_ID) {
    console.error('❌ Missing PARTNER_API_ACCESS_TOKEN or PARTNER_ORG_ID in .env');
    console.log('\n📝 For compliance webhooks, you need to register them manually:');
    console.log('   1. Go to https://partners.shopify.com/');
    console.log('   2. Select your app');
    console.log('   3. Navigate to App Setup → Compliance webhooks');
    console.log('   4. Add the webhook URLs manually');
    return;
  }

  console.log('🚀 Registering webhooks...\n');

  for (const webhook of WEBHOOKS) {
    try {
      console.log(`📌 Registering: ${webhook.topic}`);
      console.log(`   URL: ${webhook.uri}\n`);

      // Note: Compliance webhooks (customers/data_request, customers/redact, shop/redact)
      // must be registered in Partner Dashboard, not via API
      // This is a placeholder to show what needs to be registered
      
      console.log(`   ⚠️  Note: Compliance webhooks must be registered in Partner Dashboard`);
      console.log(`   ✅ Configuration ready for manual registration\n`);
    } catch (error) {
      console.error(`   ❌ Error registering ${webhook.topic}:`, error.message);
    }
  }

  console.log('\n✅ Webhook registration guide complete!');
  console.log('\n📋 Next Steps:');
  console.log('   1. Go to https://partners.shopify.com/');
  console.log('   2. Select your app');
  console.log('   3. Navigate to App Setup → Compliance webhooks');
  console.log('   4. Add these URLs:');
  WEBHOOKS.forEach(wh => {
    console.log(`      - ${wh.topic}: ${wh.uri}`);
  });
  console.log('\n   5. Click "Save" and then "Run" to verify');
}

registerWebhooks().catch(console.error);
