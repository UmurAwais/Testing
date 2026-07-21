import crypto from 'crypto';

/**
 * Verify Shopify webhook HMAC signature
 */
export const verifyWebhookHMAC = (req, res, next) => {
    const hmacHeader = req.get('X-Shopify-Hmac-Sha256');
    const body = req.rawBody; // We'll need to capture raw body

    if (!hmacHeader) {
        console.error('Missing HMAC header');
        return res.status(401).send('Unauthorized: Missing HMAC');
    }

    const hash = crypto
        .createHmac('sha256', process.env.PARTNER_CLIENT_SECRET)
        .update(body, 'utf8')
        .digest('base64');

    if (hash !== hmacHeader) {
        console.error('HMAC verification failed');
        return res.status(401).send('Unauthorized: Invalid HMAC');
    }

    console.log('✅ Webhook HMAC verified successfully');
    next();
};

/**
 * Handle customers/data_request webhook
 * Shopify sends this when a customer requests their data
 */
export const handleCustomerDataRequest = async (req, res) => {
    try {
        // Parse the JSON body (it's a string from express.text())
        const webhookData = typeof req.rawBody === 'string'
            ? JSON.parse(req.rawBody)
            : req.rawBody;

        const { shop_id, shop_domain, customer, orders_requested } = webhookData;

        console.log('📩 Customer Data Request received:', {
            shop_id,
            shop_domain,
            customer_email: customer?.email,
            customer_id: customer?.id,
            orders_requested
        });

        // TODO: Implement your logic to collect and send customer data
        // You have 30 days to respond to this request
        // Store this request in your database for processing

        // For now, just log it
        console.log('Customer data request logged. Implement data collection logic.');

        res.status(200).send('Customer data request received');
    } catch (error) {
        console.error('Error handling customer data request:', error);
        res.status(500).send('Internal Server Error');
    }
};

/**
 * Handle customers/redact webhook
 * Shopify sends this when a customer requests data deletion
 */
export const handleCustomerRedact = async (req, res) => {
    try {
        // Parse the JSON body (it's a string from express.text())
        const webhookData = typeof req.rawBody === 'string'
            ? JSON.parse(req.rawBody)
            : req.rawBody;

        const { shop_id, shop_domain, customer } = webhookData;

        console.log('🗑️ Customer Redact request received:', {
            shop_id,
            shop_domain,
            customer_email: customer?.email,
            customer_id: customer?.id
        });

        // TODO: Implement your logic to delete customer data
        // Delete all customer-related data from your database
        // You should delete:
        // - Customer personal information
        // - Order history
        // - Any other customer-related data

        console.log('Customer data deletion request logged. Implement deletion logic.');

        res.status(200).send('Customer redact request received');
    } catch (error) {
        console.error('Error handling customer redact:', error);
        res.status(500).send('Internal Server Error');
    }
};

/**
 * Handle shop/redact webhook
 * Shopify sends this 48 hours after a shop uninstalls your app
 */
export const handleShopRedact = async (req, res) => {
    try {
        // Parse the JSON body (it's a string from express.text())
        const webhookData = typeof req.rawBody === 'string'
            ? JSON.parse(req.rawBody)
            : req.rawBody;

        const { shop_id, shop_domain } = webhookData;

        console.log('🏪 Shop Redact request received:', {
            shop_id,
            shop_domain
        });

        // TODO: Implement your logic to delete shop data
        // Delete all shop-related data from your database
        // This includes:
        // - Shop settings
        // - Shop access tokens (IMPORTANT!)
        // - Any shop-specific configurations

        console.log('Shop data deletion request logged. Implement deletion logic.');

        res.status(200).send('Shop redact request received');
    } catch (error) {
        console.error('Error handling shop redact:', error);
        res.status(500).send('Internal Server Error');
    }
};
