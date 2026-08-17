// lib/auth.mjs — Mots de passe (scrypt) + sessions sans état serveur
// (jeton signé, pas de table de sessions à gérer -> adapté au serverless).
import crypto from 'node:crypto';

// En production, définissez SESSION_SECRET dans les variables d'environnement
// Netlify (Site settings > Environment variables). Sans cela, une valeur par
// défaut est utilisée — suffisante pour tester, à changer avant un vrai lancement.
const SECRET = process.env.SESSION_SECRET || 'la-flamme-dev-secret-a-changer-en-production';
const COOKIE_NAME = 'session';
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180; // 180 jours

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(String(password), salt, 64).toString('hex');
  return salt + ':' + hash;
}

export function verifyPassword(password, stored) {
  const [salt, hash] = String(stored || '').split(':');
  if (!salt || !hash) return false;
  const candidate = crypto.scryptSync(String(password), salt, 64).toString('hex');
  const a = Buffer.from(candidate, 'hex');
  const b = Buffer.from(hash, 'hex');
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}

function base64url(buf) {
  return buf.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function signSession(username) {
  const payload = base64url(Buffer.from(JSON.stringify({ u: username, t: Date.now() })));
  const sig = base64url(crypto.createHmac('sha256', SECRET).update(payload).digest());
  return payload + '.' + sig;
}

export function verifySession(token) {
  if (!token) return null;
  const parts = String(token).split('.');
  if (parts.length !== 2) return null;
  const [payload, sig] = parts;
  const expectedSig = base64url(crypto.createHmac('sha256', SECRET).update(payload).digest());
  const a = Buffer.from(sig);
  const b = Buffer.from(expectedSig);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString());
    return data.u;
  } catch (e) {
    return null;
  }
}

export function parseCookies(header) {
  const out = {};
  (header || '').split(';').forEach((part) => {
    const idx = part.indexOf('=');
    if (idx === -1) return;
    const k = part.slice(0, idx).trim();
    const v = part.slice(idx + 1).trim();
    if (k) out[k] = decodeURIComponent(v);
  });
  return out;
}

export function getSessionUsername(req) {
  const cookies = parseCookies(req.headers.get('cookie'));
  return verifySession(cookies[COOKIE_NAME]);
}

export function setSessionCookieHeader(username) {
  const token = signSession(username);
  return `${COOKIE_NAME}=${token}; HttpOnly; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax; Secure`;
}

export function clearSessionCookieHeader() {
  return `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax; Secure`;
}
