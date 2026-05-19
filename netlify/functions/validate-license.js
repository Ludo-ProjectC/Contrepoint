// netlify/functions/validate-license.js
// Vérifie une clé LemonSqueezy côté serveur — ne retourne jamais les données sensibles

const rateLimitMap = new Map();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 15 * 60 * 1000; // 15 min

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

// Regex format LSQ- (LSQ- suivi de 8+ caractères alphanumériques)
const LSQ_REGEX = /^LSQ-[A-Z0-9]{8,}$/i;

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const headers = {
    'Access-Control-Allow-Origin': 'https://contrepoint.app',
    'Content-Type': 'application/json',
  };

  const ip = event.headers['x-forwarded-for']?.split(',')[0] || 'unknown';
  if (!checkRateLimit(ip)) {
    return { statusCode: 429, headers, body: JSON.stringify({ valid: false, message: 'Trop de tentatives.' }) };
  }

  let body;
  try {
    body = JSON.parse(event.body);
  } catch {
    return { statusCode: 400, headers, body: JSON.stringify({ valid: false }) };
  }

  const { key } = body;

  // Validation format
  if (!key || !LSQ_REGEX.test(key)) {
    console.log('[validate-license] Format invalide depuis IP:', ip);
    return { statusCode: 200, headers, body: JSON.stringify({ valid: false }) };
  }

  try {
    const resp = await fetch('https://api.lemonsqueezy.com/v1/licenses/validate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
      },
      body: JSON.stringify({
        license_key: key,
        store_id: process.env.LS_STORE_ID,
      }),
    });

    const data = await resp.json();

    if (data.valid || data.activated) {
      return { statusCode: 200, headers, body: JSON.stringify({ valid: true }) };
    }

    console.log('[validate-license] Clé invalide rejetée — IP:', ip);
    return { statusCode: 200, headers, body: JSON.stringify({ valid: false }) };
  } catch {
    return { statusCode: 502, headers, body: JSON.stringify({ valid: false, message: 'Erreur réseau.' }) };
  }
};
