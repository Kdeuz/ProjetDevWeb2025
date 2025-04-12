ProjetDevWeb/
├── backend/               # Fichiers backend Flask (API, gestion de base de données, etc.)
│   ├── app.py             # Fichier principal Flask (application backend)
│   ├── routes/            # Routes de l'API Flask
│   ├── models/            # Modèles de base de données (SQLAlchemy ou autre ORM)
│   ├── database/          # Gestion des connexions à la base de données
│   ├── config.py          # Fichier de configuration pour le backend (clé API, config DB)
│   └── requirements.txt   # Dépendances Python pour le backend
│
├── frontend/              # Fichiers frontend React
│   ├── src/               # Code source du frontend (React)
│   │   ├── components/    # Composants React
│   │   ├── pages/         # Pages React (Accueil, Dashboard, etc.)
│   │   └── App.js         # Point d’entrée React
│   ├── public/            # Fichiers publics (index.html, etc.)
│   ├── package.json       # Dépendances frontend (React, etc.)
│   ├── package-lock.json  # Assure une installation cohérente des dépendances
│   ├── styles/            # Fichiers CSS personnalisés
│   └── node_modules/      # Modules Node.js (générés automatiquement, à ignorer dans Git)
│
├── database/              # Fichiers de gestion de base de données (SQL, migrations, etc.)
│   ├── schema.sql         # Schéma de la base de données (tables, relations, etc.)
│   ├── migrations/        # Dossier pour les migrations de base de données
│   └── init_db.py         # Script d'initialisation de la base de données
│
├── virtualenv/            # Environnement virtuel Python
├── README.md              # Documentation du projet
├── .gitignore             # Fichier .gitignore (à ignorer node_modules, fichiers secrets, etc.)
├── LICENSE                # Licence du projet (par exemple, MIT)
└── config.py              # Configuration globale du projet (API keys, paths, etc.)

Pour tester admin : 

admin@exemple.com
admin12345


Pour tester un user: 

user@exemple.com
user12345


INSERT INTO users VALUES
(1, 'admin@exemple.com', 'admin-1', '$2b$12$gO4/Gk0UmksGAp3z0zukZuCMNb68CKVe1RR5yridTQaPaEH8hK8IS', 1, 'AdminFirst', 'AdminLast', 35, '9876543210'),
(2, 'user@exemple.com', 'user-1', '$2b$12$1m52Gg3WCfhkhPOJDmMZpeeUGekMwEyYrAUdfWgFbx3JfgLhlAqKq', 0, 'user', '1', 20, '123456789'),
(3, 'user2@exemple.com', 'user2', '$2b$12$joeqFiPeAWiomzelPK.6De5t6qPXC8DJykIeIA3jX2zOkN/O9eRP6', 0, 'user2', 'user2', 22, '222222222'),
(4, 'user3@exemple.com', 'user3', '$2b$12$ni9IUlzwlsbuB.l.0Xppx.tKT5WPNan5LD1BrnAJ2LluR1csu0Li6', 0, 'user3', 'user3', 33, '123456');
