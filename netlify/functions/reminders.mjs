import * as db from '../../lib/db.mjs';
import * as auth from '../../lib/auth.mjs';
import { buildICS } from '../../lib/ics.mjs';
import { json } from '../../lib/http.mjs';

export default async (req) => {
  const username = auth.getSessionUsername(req);
  if (!username) return json({ error: 'Non connecté.' }, { status: 401 });
  const record = await db.getUser(username);
  if (!record) return json({ error: 'Session invalide.' }, { status: 401 });

  const withTime = record.habits.filter((h) => h.status !== 'cloturee' && h.heure);
  if (withTime.length === 0) {
    return json({ error: "Ajoute une heure à au moins une habitude d'abord." }, { status: 400 });
  }

  const ics = buildICS(withTime);
  return new Response(ics, {
    status: 200,
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="rappels.ics"',
    },
  });
};

export const config = { path: '/api/ics' };
