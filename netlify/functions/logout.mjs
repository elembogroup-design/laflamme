import { json } from '../../lib/http.mjs';
import * as auth from '../../lib/auth.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, { status: 405 });
  return json({ ok: true }, { headers: { 'Set-Cookie': auth.clearSessionCookieHeader() } });
};

export const config = { path: '/api/logout' };
