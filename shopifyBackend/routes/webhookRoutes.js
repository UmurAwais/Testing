import express from 'express';
import {
    verifyWebhookHMAC,
    handleCustomerDataRequest,
    handleCustomerRedact,
    handleShopRedact
} from '../controllers/webhookController.js';

const router = express.Router();

/**
 * Mandatory GDPR Compliance Webhooks
 * These are required by Shopify for all apps
 */

// Customer data request webhook
router.post('/customers/data_request', verifyWebhookHMAC, handleCustomerDataRequest);

// Customer redact webhook
router.post('/customers/redact', verifyWebhookHMAC, handleCustomerRedact);

// Shop redact webhook (triggered 48 hours after app uninstall)
router.post('/shop/redact', verifyWebhookHMAC, handleShopRedact);

export default router;
