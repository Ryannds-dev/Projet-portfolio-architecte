# Homii Interior

Portfolio en ligne d'un studio de conception d'espaces intérieurs. Les visiteurs peuvent consulter les réalisations filtrées par catégorie ; les administrateurs disposent d'un panel sécurisé pour gérer les projets (ajout et suppression avec nettoyage automatique des fichiers).

> Pas de lien de démonstration — la fonctionnalité d'administration nécessite un accès authentifié et ne présente pas d'intérêt en hébergement public.

---

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Installation et lancement](#installation-et-lancement)
- [Variables d'environnement](#variables-denvironnement)
- [API — Endpoints](#api--endpoints)

---

## Fonctionnalités

### Visiteurs (non connectés)

- Consulter la galerie complète des projets
- Filtrer les projets par catégorie
- Consulter la section contact

### Administrateur (connecté)

- Accéder au **panel d'édition** via la page de login
- **Ajouter un projet** avec titre, catégorie et image (jpg/png, 4 Mo max)
- **Supprimer un projet** — l'image correspondante est automatiquement effacée du serveur

---

## Stack technique

### Frontend

| Technologie      | Rôle                        |
| ---------------- | --------------------------- |
| HTML / CSS       | Structure et mise en page   |
| JavaScript       | Logique dynamique (vanilla) |
| Syne + Work Sans | Typographie (Google Fonts)  |
| Font Awesome     | Icônes                      |

### Backend

| Technologie          | Rôle                               |
| -------------------- | ---------------------------------- |
| Node.js + Express    | Serveur API REST                   |
| SQLite + Sequelize   | Base de données                    |
| JSON Web Token (JWT) | Authentification                   |
| bcrypt               | Hashage des mots de passe          |
| Multer               | Réception et stockage des images   |
| Swagger / OpenAPI    | Documentation interactive de l'API |

---

## Architecture du projet

```
Projet-portfolio-architecte/
├── FrontEnd/
│   ├── assets/
│   │   ├── style.css           # Feuille de style principale
│   │   ├── icons/              # Favicon, icône photo
│   │   └── images/             # Assets visuels statiques (banner…)
│   ├── index.html              # Page portfolio
│   ├── login.html              # Page de connexion admin
│   ├── index.js                # Galerie, filtres, panel admin, modales
│   └── login.js                # Authentification
│
└── Backend/
    ├── controllers/
    │   ├── users.controller.js      # Login
    │   ├── works.controller.js      # CRUD projets + suppression fichier
    │   └── categories.controller.js
    ├── middlewares/
    │   ├── auth.js                  # Vérification JWT
    │   ├── multer-config.js         # Upload image
    │   └── checkWork.js             # Validation des champs
    ├── models/                      # Schémas Sequelize (User, Work, Category)
    ├── routes/                      # Définition des routes API
    ├── images/                      # Images uploadées (gitignored sauf .gitkeep)
    ├── swagger.yaml                 # Documentation OpenAPI
    ├── database.sqlite              # Base de données SQLite
    └── server.js                    # Point d'entrée du serveur
```

---

## Installation et lancement

### Prérequis

- Node.js v16+
- Un éditeur avec extension **Live Server** (VS Code recommandé)

### Backend

```bash
cd Backend
npm install
npm start
```

Le serveur démarre sur `http://localhost:5678`.
**Laisser ce terminal ouvert** pendant toute la session de travail.

La documentation Swagger est accessible sur [`http://localhost:5678/api-docs`](http://localhost:5678/api-docs).

### Frontend

Ouvrir `FrontEnd/index.html` avec **Live Server** depuis l'éditeur.

---

## Variables d'environnement

### Backend — `Backend/.env`

```env
TOKEN_SECRET=votre_secret_jwt
```

---

## API — Endpoints

### Authentification

| Méthode | Route              | Description  | Auth |
| ------- | ------------------ | ------------ | ---- |
| `POST`  | `/api/users/login` | Se connecter | Non  |

### Catégories

| Méthode | Route             | Description                     | Auth |
| ------- | ----------------- | ------------------------------- | ---- |
| `GET`   | `/api/categories` | Récupérer toutes les catégories | Non  |

### Projets

| Méthode  | Route            | Description                             | Auth |
| -------- | ---------------- | --------------------------------------- | ---- |
| `GET`    | `/api/works`     | Récupérer tous les projets              | Non  |
| `POST`   | `/api/works`     | Ajouter un projet (multipart/form-data) | Oui  |
| `DELETE` | `/api/works/:id` | Supprimer un projet et son image        | Oui  |

> Les routes protégées nécessitent un header `Authorization: Bearer <token>`.

---

_Homii Interior — Conception d'espaces intérieurs_
