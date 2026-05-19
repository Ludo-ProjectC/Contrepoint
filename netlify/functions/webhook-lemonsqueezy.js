// netlify/functions/webhook-lemonsqueezy.js
// Reçoit et vérifie les webhooks LemonSqueezy (HMAC-SHA256)
// Note: Netlify Functions reçoit le body en string — pas besoin de express.raw()

const crypto = require('crypto');

const rateLimitMap = new Map();
const RATE_LIMIT = 100;
const RATE_WINDOW_MS = 15 * 60 * 1000;

function checkRateLimit(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now - entry.start > RATE_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, start: now });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (!checkRateLimit(ip)) {
    return { statusCode: 429, body: JSON.stringify({ error: 'Too many requests' }) };
  }

  // Vérification signature HMAC-SHA256
  const sig = event.headers['x-signature'];
  const secret = process.env.LS_WEBHOOK_SECRET;

  if (!sig || !secret) {
    console.error('[webhook] Signature ou secret manquant');
    return { statusCode: 401, body: JSON.stringify({ error: 'Unauthorized' }) };
  }

  const rawBody = event.body;
  const computed = crypto
    .createHmac('sha256', secret)
    .update(rawBody)
    .digest('hex');

  if (sig !== computed) {
    console.error('[webhook] Signature invalide');
    return { statusCode: 401, body: JSON.stringify({ error: 'Invalid signature' }) };
  }

  // Parser le body
  let payload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const eventType = payload?.meta?.event_name || 'unknown';
  console.log('[webhook] Event reçu:', eventType);

  // Gérer les events
  switch (eventType) {
    case 'order_created':
      // Commande créée — la clé sera envoyée par email automatiquement par LemonSqueezy
      console.log('[webhook] Nouvelle commande créée');
      break;

    case 'license_key_created':
      // Clé de licence générée — peut servir à logger ou notifier
      console.log('[webhook] Nouvelle clé de licence créée');
      break;

    case 'order_refunded':
      // Remboursement — à terme: invalider la clé en base de données
      console.log('[webhook] Commande remboursée');
      break;

    default:
      console.log('[webhook] Event non géré:', eventType);
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};
