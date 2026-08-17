import { json } from '../../lib/http.mjs';
import * as db from '../../lib/db.mjs';
import * as auth from '../../lib/auth.mjs';

export default async (req, context) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, { status: 405 });
  const username = auth.getSessionUsername(req);
  if (!username) return json({ error: 'Non connecté.' }, { status: 401 });
  const record = await db.getUser(username);
  if (!record) return json({ error: 'Session invalide.' }, { status: 401 });

  const date = context.params.date;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date || '')) return json({ error: 'Date invalide.' }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const day = record.logs[date] || { checks: {}, comment: '' };
  if (body.toggleHabitId) {
    day.checks = Object.assign({}, day.checks, { [body.toggleHabitId]: !day.checks[body.toggleHabitId] });
  }
  if (typeof body.comment === 'string') {
    day.comment = body.comment;
  }
  record.logs[date] = day;

  await db.saveUser(record);
  return json({ profile: record.profile, habits: record.habits, logs: record.logs, displayName: record.displayName });
};

export const config = { path: '/api/logs/:date' };
