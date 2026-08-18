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
SESSION_SECRET = cebd8ed511d092d64090a2cca34a75cb2e8e6e51a5d1dcba08f95086711655fc0a7f6ef0be08080300c83e0a0c87d0bb
```

Étapes exactes :
1. Sur `app.netlify.com`, ouvrez votre projet (`laflam`)
2. **Project configuration** → **Environment variables**
3. **Add a variable** → clé `SESSION_SECRET`, valeur celle ci-dessus (ou une
   autre chaîne aléatoire longue de votre choix)
4. Enregistrez, puis redéclenchez un déploiement (Deploys → Trigger deploy →
   Deploy site) pour que la nouvelle valeur soit prise en compte

Sans cela, une valeur par défaut intégrée au code est utilisée — elle
fonctionne pour tester, mais n'importe qui ayant accès à ce code source la
connaît aussi, donc à changer avant d'inviter du monde. Une fois changée, les
personnes déjà connectées devront simplement se reconnecter une fois (leurs
données, elles, ne sont pas affectées).

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

## Fonctionnalités incluses

Tronc commun (vision, mission, plan d'action), diagnostic de croissance à 6
capacités, module ikigai (avec le schéma visuel), suivi journalier
d'habitudes (heure, durée, clôture), séries de constance, historique,
rappels calendrier (.ics), export de la carte en PDF et en image.

