import { json } from '../../lib/http.mjs';
import * as db from '../../lib/db.mjs';
import * as auth from '../../lib/auth.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, { status: 405 });
  const body = await req.json().catch(() => ({}));
  const uname = String(body.username || '').trim();
  const pwd = String(body.password || '');

  const record = await db.getUser(uname);
  if (!record || !auth.verifyPassword(pwd, record.passwordHash)) {
    return json({ error: 'Nom ou mot de passe incorrect.' }, { status: 401 });
  }

  const cookie = auth.setSessionCookieHeader(record.username);
  return json(
    { user: { username: record.username, displayName: record.displayName } },
    { headers: { 'Set-Cookie': cookie } }
  );
};

export const config = { path: '/api/login' };
