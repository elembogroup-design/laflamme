# La Flamme — version Netlify

Même application que la version autonome, adaptée pour tourner sur
**Netlify** : le frontend (`public/`) est identique, mais le backend est
réécrit en **fonctions serverless Netlify** (au lieu d'un serveur qui tourne
en continu) et les données sont stockées avec **Netlify Blobs** (au lieu de
fichiers sur disque) — parce que Netlify ne garde pas de disque persistant
entre deux requêtes.

## Pourquoi ce n'est pas juste "les mêmes fichiers"

Netlify ne fait pas tourner de serveur Node classique en continu — chaque
route de l'API devient une petite fonction indépendante, invoquée à la
demande. Et il n'y a pas de disque qui persiste entre deux appels : il faut
donc un vrai service de stockage. **Netlify Blobs** est le service intégré à
Netlify pour ça (zéro compte externe à créer, ça fonctionne dès le
déploiement).

## Déployer

### Option A — via l'interface Netlify (le plus simple)
1. Créer un compte sur [netlify.com](https://netlify.com)
2. Déposer ce dossier sur GitHub (glisser-déposer sur github.com, un nouveau
   dépôt, pas besoin de ligne de commande)
3. Sur Netlify : « Add new site » → « Import an existing project » → choisir
   le dépôt GitHub
4. Netlify détecte automatiquement `netlify.toml` — laisser les réglages par
   défaut et cliquer « Deploy »

Netlify installe automatiquement `@netlify/blobs` (listé dans
`package.json`) au moment du déploiement — rien à faire de plus.

### Option B — avec la CLI Netlify (pour tester en local avant de publier)
```bash
npm install -g netlify-cli
netlify dev
```
Ouvre l'app sur `http://localhost:8888` avec les fonctions et Netlify Blobs
émulés localement.

## Variable d'environnement importante

Avant un vrai lancement (pas seulement un test), définissez une clé secrète
dans **Site settings → Environment variables** sur Netlify :

```
SESSION_SECRET = une-longue-chaine-aleatoire-et-secrete
```

Elle sert à signer les sessions de connexion. Une valeur par défaut est
utilisée si vous ne la définissez pas, ce qui fonctionne pour tester mais
n'est pas recommandé pour un usage réel avec de vraies personnes.

## Ce qui a été vérifié avant livraison

Je n'ai pas d'accès à internet dans mon environnement de travail, donc je
n'ai pas pu exécuter cette version sur l'infrastructure réelle de Netlify
(cela nécessite leur CLI et une connexion à leurs serveurs). En revanche,
j'ai :
- Vérifié la syntaxe de tous les fichiers
- Appelé directement chaque fonction (inscription, connexion, déconnexion,
  profil, habitudes, clôture, cases journalières, commentaires, export de
  rappels) avec de vraies requêtes et un stockage simulé, pour confirmer que
  toute la logique se comporte comme attendu
- Écrit le code en suivant exactement la syntaxe actuelle documentée par
  Netlify (fonctions au format moderne avec chemins personnalisés, Netlify
  Blobs)

Une fois déployé, faites un tour rapide (inscription, remplir vision/mission/
plan, cocher une habitude) pour confirmer que tout fonctionne sur
l'infrastructure réelle — étape que je vous recommande pour n'importe quel
premier déploiement, indépendamment de cet outil.

## Structure du projet

```
netlify.toml               → configuration Netlify (dossier public, fonctions)
package.json                → dépendance unique : @netlify/blobs
lib/db.mjs                  → couche de données (Netlify Blobs)
lib/auth.mjs                → mots de passe (scrypt) + sessions signées sans état serveur
lib/ics.mjs                  → génération des fichiers de rappel calendrier (.ics)
lib/http.mjs                 → petit utilitaire de réponse JSON
netlify/functions/           → une fonction par route API (/api/...)
public/                       → même frontend que la version autonome (HTML/CSS/JS, PWA)
```

## Ce qui n'est pas encore inclus

Comme pour la version autonome par serveur classique : le diagnostic à 6
capacités et le module Ikigai (présents dans la version Claude) n'ont pas
encore été portés ici.
