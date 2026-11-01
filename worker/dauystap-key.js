/**
 * DauysTap key server — Cloudflare Worker "dauystap-key".
 *
 * - Visitors sign in with Google on aqsuek.kz; the page sends the Google ID token here.
 * - The token is verified (signature, audience, expiry) against Google's public keys.
 * - Each person has a daily limit, counted in the D1 database bound as DB.
 * - Only then a single-use, 5-minute Soniox key is issued. The real Soniox key
 *   (secret SONIOX_API_KEY) never leaves Cloudflare.
 *
 * Deployed from this file through the Cloudflare API; bindings: DB (D1 "aqsuek"),
 * SONIOX_API_KEY (secret).
 */
const GOOGLE_CLIENT_ID = '686521879720-6g85tps9nta4ok1bcdc5bvgfin4jt690.apps.googleusercontent.com';
const ALLOWED_ORIGINS = ['https://aqsuek.kz', 'https://www.aqsuek.kz'];
const LIMITS = { transcribe_websocket: 40, tts_rt: 50 };
const UNLIMITED = ['ekunat00@gmail.com'];
const SESSION_SECONDS = { transcribe_websocket: 600, tts_rt: 120 };
const PER_MINUTE = 20;
// Guests (not signed in) can try a few times a day, counted per hashed IP, with a site-wide daily cap.
const GUEST_LIMITS = { transcribe_websocket: 3, tts_rt: 3 };
const GUEST_SESSION_SECONDS = { transcribe_websocket: 60, tts_rt: 60 };
const GUEST_DAILY_CAP = 400;
const hits = new Map();
let jwksCache = { keys: null, until: 0 };

function cors(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin'
  };
}
function json(body, status, origin) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json', ...cors(origin) } });
}
function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
}
function today() {
  // Almaty day (UTC+5) so the limit resets at local midnight
  return new Date(Date.now() + 5 * 3600 * 1000).toISOString().slice(0, 10);
}

async function googleKeys() {
  if (jwksCache.keys && jwksCache.until > Date.now()) return jwksCache.keys;
  const res = await fetch('https://www.googleapis.com/oauth2/v3/certs');
  const data = await res.json();
  const maxAge = Number((res.headers.get('cache-control') || '').match(/max-age=(\d+)/)?.[1] || 3600);
  jwksCache = { keys: data.keys, until: Date.now() + maxAge * 1000 };
  return data.keys;
}

async function verifyGoogle(token) {
  const parts = String(token || '').split('.');
  if (parts.length !== 3) throw new Error('bad token');
  const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[0])));
  const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(parts[1])));
  if (header.alg !== 'RS256') throw new Error('alg');
  const jwk = (await googleKeys()).find((k) => k.kid === header.kid);
  if (!jwk) throw new Error('kid');
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(parts[2]), new TextEncoder().encode(parts[0] + '.' + parts[1]));
  if (!ok) throw new Error('signature');
  const now = Math.floor(Date.now() / 1000);
  if (payload.aud !== GOOGLE_CLIENT_ID) throw new Error('aud');
  if (payload.iss !== 'accounts.google.com' && payload.iss !== 'https://accounts.google.com') throw new Error('iss');
  if (!payload.exp || payload.exp < now - 30) throw new Error('expired');
  if (!payload.email_verified) throw new Error('email');
  return payload;
}

async function quota(env, sub) {
  const { results } = await env.DB.prepare('SELECT kind, count FROM usage WHERE day = ?1 AND sub = ?2').bind(today(), sub).all();
  const used = Object.fromEntries((results || []).map((r) => [r.kind, r.count]));
  return Object.fromEntries(Object.entries(LIMITS).map(([k, limit]) => [k, { limit, used: used[k] || 0 }]));
}

async function bump(env, sub, kind, limit) {
  const row = await env.DB.prepare('INSERT INTO usage (day, sub, kind, count) VALUES (?1, ?2, ?3, 1) ON CONFLICT(day, sub, kind) DO UPDATE SET count = count + 1 RETURNING count')
    .bind(today(), sub, kind).first();
  if (row.count > limit) { await unbump(env, sub, kind); return false; }
  return true;
}
async function unbump(env, sub, kind) {
  await env.DB.prepare('UPDATE usage SET count = count - 1 WHERE day = ?1 AND sub = ?2 AND kind = ?3').bind(today(), sub, kind).run();
}
async function sha(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return [...new Uint8Array(buf)].slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('');
}

async function guest(request, env, body, ip, origin) {
  const sub = 'guest:' + await sha('aqsuek-guest|' + ip + '|' + today());
  const guestQuota = async () => {
    const { results } = await env.DB.prepare('SELECT kind, count FROM usage WHERE day = ?1 AND sub = ?2').bind(today(), sub).all();
    const used = Object.fromEntries((results || []).map((r) => [r.kind, r.count]));
    return Object.fromEntries(Object.entries(GUEST_LIMITS).map(([k, limit]) => [k, { limit, used: used[k] || 0 }]));
  };
  if (body.action === 'quota') return json({ guest: true, quota: await guestQuota() }, 200, origin);
  const usage = body.usage || 'transcribe_websocket';
  if (!GUEST_LIMITS[usage]) return json({ error: 'usage' }, 400, origin);
  if (!await bump(env, 'guest:all', usage, GUEST_DAILY_CAP)) return json({ error: 'guest_quota', limit: GUEST_LIMITS[usage] }, 429, origin);
  if (!await bump(env, sub, usage, GUEST_LIMITS[usage])) { await unbump(env, 'guest:all', usage); return json({ error: 'guest_quota', limit: GUEST_LIMITS[usage] }, 429, origin); }
  const res = await fetch('https://api.soniox.com/v1/auth/temporary-api-key', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + env.SONIOX_API_KEY, 'Content-Type': 'application/json' },
    body: JSON.stringify({ usage_type: usage, expires_in_seconds: 300, single_use: true, max_session_duration_seconds: GUEST_SESSION_SECONDS[usage], client_reference_id: 'aqsuek:' + sub })
  });
  if (!res.ok) { await unbump(env, sub, usage); await unbump(env, 'guest:all', usage); return json({ error: 'upstream', status: res.status }, 502, origin); }
  const data = await res.json();
  return json({ api_key: data.api_key, expires_at: data.expires_at, guest: true, quota: await guestQuota() }, 200, origin);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get('Origin') || '';
    if (!ALLOWED_ORIGINS.includes(origin)) return new Response('Forbidden', { status: 403 });
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: cors(origin) });
    if (request.method !== 'POST') return json({ error: 'method' }, 405, origin);
    if (!env.SONIOX_API_KEY) return json({ error: 'not_configured' }, 503, origin);

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const minute = Math.floor(Date.now() / 60000);
    const entry = hits.get(ip);
    const count = entry && entry.minute === minute ? entry.count + 1 : 1;
    hits.set(ip, { minute, count });
    if (hits.size > 5000) hits.clear();
    if (count > PER_MINUTE) return json({ error: 'rate' }, 429, origin);

    let body = {};
    try { body = await request.json(); } catch {}
    const token = (request.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '') || body.token;
    if (!token) return guest(request, env, body, ip, origin);
    let user;
    try { user = await verifyGoogle(token); } catch (e) { return json({ error: 'auth', reason: String(e.message || e) }, 401, origin); }

    const now = new Date().toISOString();
    await env.DB.prepare('INSERT INTO users (sub, email, name, first_seen, last_seen) VALUES (?1, ?2, ?3, ?4, ?4) ON CONFLICT(sub) DO UPDATE SET email = ?2, name = ?3, last_seen = ?4')
      .bind(user.sub, user.email, user.name || '', now).run();

    const unlimited = UNLIMITED.includes(String(user.email).toLowerCase());
    if (body.action === 'quota') return json({ email: user.email, unlimited, quota: await quota(env, user.sub) }, 200, origin);

    const usage = body.usage || 'transcribe_websocket';
    if (!LIMITS[usage]) return json({ error: 'usage' }, 400, origin);

    if (!unlimited) {
      const row = await env.DB.prepare('INSERT INTO usage (day, sub, kind, count) VALUES (?1, ?2, ?3, 1) ON CONFLICT(day, sub, kind) DO UPDATE SET count = count + 1 RETURNING count')
        .bind(today(), user.sub, usage).first();
      if (row.count > LIMITS[usage]) {
        await env.DB.prepare('UPDATE usage SET count = count - 1 WHERE day = ?1 AND sub = ?2 AND kind = ?3').bind(today(), user.sub, usage).run();
        return json({ error: 'quota', limit: LIMITS[usage] }, 429, origin);
      }
    }

    const res = await fetch('https://api.soniox.com/v1/auth/temporary-api-key', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + env.SONIOX_API_KEY, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        usage_type: usage,
        expires_in_seconds: 300,
        single_use: true,
        max_session_duration_seconds: SESSION_SECONDS[usage],
        client_reference_id: 'aqsuek:' + user.sub
      })
    });
    if (!res.ok) {
      if (!unlimited) await env.DB.prepare('UPDATE usage SET count = count - 1 WHERE day = ?1 AND sub = ?2 AND kind = ?3').bind(today(), user.sub, usage).run();
      return json({ error: 'upstream', status: res.status }, 502, origin);
    }
    const data = await res.json();
    return json({ api_key: data.api_key, expires_at: data.expires_at, quota: await quota(env, user.sub), unlimited }, 200, origin);
  }
};
