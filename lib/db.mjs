// lib/db.mjs — Couche de données pour Netlify (stockage Netlify Blobs).
// Même forme d'API que la version fichier de l'app autonome, pour que la
// logique des fonctions reste identique.
import { getStore } from '@netlify/blobs';

function usersStore() {
  // "strong" : on veut relire une donnée juste après l'avoir écrite (ex. inscription -> connexion immédiate)
  return getStore({ name: 'laflamme-users', consistency: 'strong' });
}

export function safeUsername(username) {
  return String(username || '').trim().toLowerCase();
}

export async function userExists(username) {
  const record = await usersStore().get(safeUsername(username), { type: 'json' });
  return !!record;
}

export async function createUser(username, passwordHash) {
  const key = safeUsername(username);
  const record = {
    username: key,
    displayName: String(username).trim(),
    passwordHash,
    createdAt: new Date().toISOString(),
    profile: {
      vision: '', verbe: '', personnes: '', contribution: '', transformation: '',
      passion: '', don: '', besoin: '', ressource: '',
      cible: '', action: '', partenaire: '', engagement72: '',
      scores: {}, startDate: null,
    },
    habits: [],
    logs: {},
  };
  await usersStore().setJSON(key, record);
  return record;
}

export async function getUser(username) {
  return await usersStore().get(safeUsername(username), { type: 'json' });
}

export async function saveUser(record) {
  await usersStore().setJSON(record.username, record);
}
