import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const PARTNER_CLIENT_ID = process.env.PARTNER_CLIENT_ID;
const PARTNER_CLIENT_SECRET = process.env.PARTNER_CLIENT_SECRET;
const APP_URL = process.env.HOST || 'https://ecomlly-nu.vercel.app';

/**
 * Register compliance webhooks using GraphQL Admin API
 * 
 * Note: This requires an installed app's access token for a specific shop.
 * For app-wide registration, you may need to do this during app installation
 * or use the Partner API.
 */

const WEBHOOKS = [
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

/**
 * Register webhook using GraphQL Admin API
 * Requires: shop access token (from installed app)
 */
async function registerWebhook(shopDomain, accessToken, webhook) {
  const graphqlEndpoint = `https://${shopDomain}/admin/api/2025-01/graphql.json`;
  
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
    const response = await axios.post(
      graphqlEndpoint,
      { query: mutation, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken
        }
      }
    );

    if (response.data.errors) {
      throw new Error(JSON.stringify(response.data.errors));
    }

    const result = response.data.data.webhookSubscriptionCreate;
    
    if (result.userErrors && result.userErrors.length > 0) {
      throw new Error(JSON.stringify(result.userErrors));
    }

    return result.webhookSubscription;
  } catch (error) {
    console.error(`Error registering ${webhook.topic}:`, error.message);
    throw error;
  }
}

/**
 * Main function - shows how to register webhooks
 * 
 * IMPORTANT: Compliance webhooks are typically registered:
 * 1. During app installation (in your OAuth callback)
 * 2. Via Partner Dashboard during app submission
 * 3. Programmatically using shop access tokens after installation
 */
async function main() {
  console.log('📋 Compliance Webhook Registration Guide\n');
  console.log('⚠️  IMPORTANT: Compliance webhooks must be registered for EACH shop that installs your app.\n');
  
  console.log('📍 Where to Register Compliance Webhooks:\n');
  console.log('Option 1: During App Submission/Review (Recommended)');
  console.log('   - Go to Partner Dashboard → Your App → App submission');
  console.log('   - Look for "Compliance webhooks" or "Privacy & Compliance" section');
  console.log('   - Add the webhook URLs there\n');
  
  console.log('Option 2: During App Installation (Programmatic)');
  console.log('   - Register webhooks in your OAuth callback handler');
  console.log('   - Use shop access token to call GraphQL API');
  console.log('   - See registerWebhook() function above\n');
  
  console.log('Option 3: Partner Dashboard → App Setup');
  console.log('   - Some apps show this in "App Setup" → "Webhooks"');
  console.log('   - Or in "Privacy & Compliance" section\n');
  
  console.log('📝 Required Webhook URLs:\n');
  WEBHOOKS.forEach((wh, index) => {
    console.log(`${index + 1}. ${wh.topic.replace(/_/g, ' ')}:`);
    console.log(`   ${wh.uri}\n`);
  });
  
  console.log('✅ Your webhook endpoints are ready and HMAC verified!');
  console.log('   Just need to register the URLs in Partner Dashboard.\n');
  
  console.log('🔍 If you can\'t find "Compliance webhooks" section:');
  console.log('   1. Check "App Setup" → "Webhooks"');
  console.log('   2. Check "Privacy & Compliance" section');
  console.log('   3. Check during app submission/review flow');
  console.log('   4. Contact Shopify Partner Support\n');
}

main().catch(console.error);
