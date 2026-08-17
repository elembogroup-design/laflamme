import { json } from '../../lib/http.mjs';
import * as db from '../../lib/db.mjs';
import * as auth from '../../lib/auth.mjs';

export default async (req, context) => {
  const username = auth.getSessionUsername(req);
  if (!username) return json({ error: 'Non connecté.' }, { status: 401 });
  const record = await db.getUser(username);
  if (!record) return json({ error: 'Session invalide.' }, { status: 401 });

  const id = context.params.id;

  if (req.method === 'DELETE') {
    record.habits = record.habits.filter((h) => h.id !== id);
  } else if (req.method === 'PATCH') {
    const body = await req.json().catch(() => ({}));
    record.habits = record.habits.map((h) => (h.id === id ? Object.assign({}, h, body) : h));
  } else {
    return json({ error: 'Méthode non autorisée.' }, { status: 405 });
  }

  await db.saveUser(record);
  return json({ profile: record.profile, habits: record.habits, logs: record.logs, displayName: record.displayName });
};

export const config = { path: '/api/habits/:id' };
