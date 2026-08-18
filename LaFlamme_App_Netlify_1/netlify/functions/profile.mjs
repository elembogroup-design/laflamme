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
  record.profile = Object.assign({}, record.profile, body);
  if (!record.profile.startDate && record.profile.cible) {
    record.profile.startDate = new Date().toISOString().slice(0, 10);
  }
  // Amorce le plan avec la Cible du CAP 90 si aucune habitude n'existe encore
  if (record.habits.length === 0 && record.profile.cible && record.profile.cible.trim()) {
    record.habits.push({
      id: 'seed-cible',
      label: record.profile.cible.trim(),
      heure: '',
      dureeSession: '',
      dureeEngagementJours: 90,
      createdDate: record.profile.startDate,
      status: 'active',
    });
  }

  await db.saveUser(record);
  return json({ profile: record.profile, habits: record.habits, logs: record.logs, displayName: record.displayName });
};

export const config = { path: '/api/profile' };
