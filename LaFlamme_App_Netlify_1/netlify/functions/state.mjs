import { json } from '../../lib/http.mjs';
import * as db from '../../lib/db.mjs';
import * as auth from '../../lib/auth.mjs';

export default async (req) => {
  const username = auth.getSessionUsername(req);
  if (!username) return json({ error: 'Non connecté.' }, { status: 401 });
  const record = await db.getUser(username);
  if (!record) return json({ error: 'Session invalide.' }, { status: 401 });
  return json({ profile: record.profile, habits: record.habits, logs: record.logs, displayName: record.displayName });
};

export const config = { path: '/api/state' };
