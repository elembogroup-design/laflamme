import { json } from '../../lib/http.mjs';
import * as db from '../../lib/db.mjs';
import * as auth from '../../lib/auth.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, { status: 405 });
  const body = await req.json().catch(() => ({}));
  const uname = String(body.username || '').trim();
  const pwd = String(body.password || '');

  if (uname.length < 2) return json({ error: 'Le nom doit contenir au moins 2 caractères.' }, { status: 400 });
  if (pwd.length < 6) return json({ error: 'Le mot de passe doit contenir au moins 6 caractères.' }, { status: 400 });
  if (await db.userExists(uname)) {
    return json({ error: 'Ce nom est déjà utilisé. Essaie une variante (ex. avec une initiale).' }, { status: 409 });
  }

  const hash = auth.hashPassword(pwd);
  const record = await db.createUser(uname, hash);
  const cookie = auth.setSessionCookieHeader(record.username);

  return json(
    { user: { username: record.username, displayName: record.displayName } },
    { headers: { 'Set-Cookie': cookie } }
  );
};

export const config = { path: '/api/register' };
