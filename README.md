# Team Task Manager (Express + MongoDB Atlas + Render)

Backend Node.js pour gérer les tâches d’une équipe avec rôles admin et  member .

## ⚙️ Stack
- Node.js 18+, Express
- MongoDB Atlas (Mongoose)
- Auth **JWT**, mots de passe **bcrypt**
- Middleware: helmet, cors
- Déploiement **Render**
- Structure **MVC** (models, controllers, routes, middlewares)

## 🧱 Structure
```
task-manager-backend/
├─ server.js
├─ render.yaml
├─ .env.example
├─ package.json
├─ src/
│  ├─ config/
│  │  └─ db.js
│  ├─ controllers/
│  │  ├─ admin.controller.js
│  │  ├─ auth.controller.js
│  │  └─ user.controller.js
│  ├─ middlewares/
│  │  ├─ auth.js
│  │  └─ error.js
│  ├─ models/
│  │  ├─ Task.js
│  │  └─ User.js
│  └─ routes/
│     ├─ admin.routes.js
│     ├─ auth.routes.js
│     └─ user.routes.js
└─ seed/
   └─ seed.js
```

## 🚀 Installation locale
1. **Cloner** le repo (ou extraire le ZIP fourni).
2. Copier `.env` et remplir :
   ```env
   PORT=4000
   MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<dbName>?retryWrites=true&w=majority
   JWT_SECRET=super_secret_jwt_key_change_me
   JWT_EXPIRES_IN=7d
   NODE_ENV=development
   ```
3. Installer les dépendances :
   ```bash
   npm install
   ```
4. (Option) **Seeder** la base :
   ```bash
   npm run seed
   ```
5. Lancer le serveur :
   ```bash
   npm run dev
   ```
   Serveur sur `http://localhost:4000`

## 🔐 Authentification
- `POST /auth/register` – body: `{ name, email, password, role? }` (role par défaut: `member`)
- `POST /auth/login` – body: `{ email, password }`
- **Réponse**: `{ user, token }`
- Pour les routes protégées, envoyer l’en-tête : `Authorization: Bearer <token>`

## 👑 Rôles & permissions
- **admin**: CRUD **utilisateurs** + CRUD **toutes** les tâches (préfixe `/admin`)
- **member**: CRUD **ses propres** tâches (préfixe `/user`)

## 📦 Routes principales

### Admin (`/admin`)
- **HTML**: `GET /admin/dashboard` (nécessite token admin)
- **Users:**
  - `POST /admin/users`
  - `GET /admin/users`
  - `GET /admin/users/:id`
  - `PUT /admin/users/:id`
  - `DELETE /admin/users/:id`
- **Tasks (toutes):**
  - `POST /admin/tasks`
  - `GET /admin/tasks?status=done&priority=high&page=1&limit=10&owner=<userId>`
  - `GET /admin/tasks/:id`
  - `PUT /admin/tasks/:id`
  - `DELETE /admin/tasks/:id`

### Member (`/user`)
- **HTML**: `GET /user/dashboard` (token requis)
- **Mes tâches uniquement:**
  - `POST /user/tasks`
  - `GET /user/tasks?status=todo&priority=low&page=2&limit=5`
  - `GET /user/tasks/:id`
  - `PUT /user/tasks/:id`
  - `DELETE /user/tasks/:id`

### Redirections simples
- Navigation vers `/admin` redirige vers `/admin/dashboard` (token admin requis).
- Navigation vers `/user` redirige vers `/user/dashboard` (token requis).
- Le dashboard **admin** liste les **utilisateurs** et les **dernières tâches**.
- Le dashboard **user** affiche **toutes les tâches** (selon la consigne), la gestion fine se fait via `/user/tasks`.

## 🔎 Pagination & filtres
- Pagination: `page` (par défaut 1), `limit` (par défaut 10)
- Filtres: `status` ∈ `todo | in_progress | done`, `priority` ∈ `low | medium | high`
- Admin peut filtrer aussi par `owner=<userId>`

## 🧪 Tester avec Postman
1. **Auth:**
   - `POST /auth/register` ou utilisez les identifiants seedés :
     - admin: `admin@example.com` / `Admin@123`
   - `POST /auth/login` → récupérer `token`
2. **Headers**: ajouter `Authorization: Bearer <token>`
3. **Admin**: requêtes sur `/admin/users` et `/admin/tasks`
4. **Member**: requêtes sur `/user/tasks`

## ☁️ Déploiement sur Render
1. Pousser ce dossier sur GitHub.
2. Sur Render: **New +** → **Web Service** → connecter le repo.
3. Render lit `render.yaml`. Renseigner les **Environment Variables** :
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `JWT_EXPIRES_IN` (optionnel)
   - `NODE_ENV=production`
4. Déployer. Vérifier les logs : `✅ MongoDB connected` et `✅ Server running...`

> Astuce: pour les dashboards `/admin/dashboard` et `/user/dashboard`, vous devez envoyer le **token** dans l’en-tête. Depuis le navigateur, utilisez une extension pour définir `Authorization` ou servez un petit front. (Pour une démo rapide via Postman, ouvrez l’onglet **Preview**.)

## 🧹 Scripts utiles
- `npm run seed` : insère un **admin** + 2 **members** + quelques **tasks**
- `npm run dev` : démarre avec nodemon
- `npm start` : démarre en production

## ✅ Données de test (seed)
- Admin: `admin@example.com` / `Admin@123`
- Membres: `diallo@example.com`, `diallo@example.com` (mdp: `Password1!`)
- Tâches d’exemple: voir `seed/seed.js`

---

#MERCI A TOUS 
