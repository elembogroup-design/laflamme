import { json } from '../../lib/http.mjs';
import * as db from '../../lib/db.mjs';
import * as auth from '../../lib/auth.mjs';

export default async (req) => {
  if (req.method !== 'POST') return json({ error: 'Méthode non autorisée.' }, { status: 405 });
  const username = auth.getSessionUsername(req);
  if (!username) return json({ error: 'Non connecté.' }, { status: 401 });
  const record = await db.getUser(username);
  if (!record) return json({ error: 'Session invalide.' }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  if (!body.label || !String(body.label).trim()) return json({ error: 'Nom manquant.' }, { status: 400 });

  const habit = {
    id: 'h' + Date.now() + Math.random().toString(36).slice(2, 8),
    label: String(body.label).trim(),
    heure: body.heure || '',
    dureeSession: body.dureeSession || '',
    dureeEngagementJours: body.dureeEngagementJours || 30,
    createdDate: new Date().toISOString().slice(0, 10),
    status: 'active',
  };
  record.habits.push(habit);
  await db.saveUser(record);
  return json({ profile: record.profile, habits: record.habits, logs: record.logs, displayName: record.displayName });
};

export const config = { path: '/api/habits' };
