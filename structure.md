ProjetDevWeb/
# Documentation du projet

## Structure du projet

### Backend
- **app/** : Contient la logique principale de l'application backend.
    - **config.py** : Fichier de configuration pour l'application.
    - **__init__.py** : Fichier d'initialisation pour le module `app`.
    - **models/** : Contient les modèles de données utilisés par l'application.
        - **Abonnement.py** : Modèle pour gérer les abonnements.
        - **Contact.py** : Modèle pour gérer les informations de contact.
        - **PageFitness.py** : Modèle pour la page dédiée au fitness.
        - **PageMusculation.py** : Modèle pour la page dédiée à la musculation.
        - **PagePiscine.py** : Modèle pour la page dédiée à la piscine.
        - **Subscriptions.py** : Modèle pour gérer les souscriptions.
        - **user.py** : Modèle pour gérer les utilisateurs.
    - **routes/** : Contient les routes de l'application.
        - **admin.py** : Routes pour les fonctionnalités administratives.
        - **auth.py** : Routes pour l'authentification.
        - **contact.py** : Routes pour la gestion des contacts.
        - **pageFitness.py** : Routes pour la page fitness.
        - **pageMusculation.py** : Routes pour la page musculation.
        - **pagePiscine.py** : Routes pour la page piscine.
        - **subscribe.py** : Routes pour la gestion des abonnements.
    - **utils/** : Contient des utilitaires pour l'application.
        - **plot_utils.py** : Utilitaires pour la génération de graphiques.
- **database/** : Contient les fichiers liés à la base de données.
    - **database.db** : Fichier de base de données SQLite.
    - **init_db.py** : Script pour initialiser la base de données.
    - **schema.sql** : Fichier SQL pour définir le schéma de la base de données.
- **requirements.txt** : Liste des dépendances Python nécessaires.
- **run.py** : Point d'entrée pour exécuter l'application backend.

### Frontend
- **package.json** : Fichier de configuration pour le gestionnaire de paquets npm.
- **package-lock.json** : Fichier de verrouillage des dépendances npm.
- **public/** : Contient les fichiers publics accessibles directement.
    - **assets/images/** : Contient les images utilisées dans l'application.
        - **acceuil.png** : Image pour la page d'accueil.
        - **avatar1.png** à **avatar5.png** : Images d'avatars.
        - **contact.png** : Image pour la page de contact.
        - **fitness.png** : Image pour la page fitness.
        - **logo.png** : Logo de l'application.
        - **musculation.png** : Image pour la page musculation.
        - **piscine.png** : Image pour la page piscine.
    - **favicon.ico** : Icône de l'application.
    - **index.html** : Fichier HTML principal.
    - **manifest.json** : Fichier de configuration pour les Progressive Web Apps.
    - **robots.txt** : Fichier pour les moteurs de recherche.
- **src/** : Contient le code source de l'application frontend.
    - **api.js** : Fichier pour gérer les appels API.
    - **App.css** : Styles globaux pour l'application.
    - **App.js** : Composant principal de l'application React.
    - **index.css** : Fichier CSS pour les styles globaux.
    - **index.js** : Point d'entrée pour l'application React.
    - **logo.svg** : Logo au format SVG.
    - **pages/** : Contient les pages de l'application.
        - **AdminFitnessPage.jsx** : Page d'administration pour le fitness.
        - **AdminMusculationPage.jsx** : Page d'administration pour la musculation.
        - **AdminPage.jsx** : Page d'administration générale.
        - **AdminPiscinePage.jsx** : Page d'administration pour la piscine.
        - **AdminStatisticPage.jsx** : Page pour les statistiques administratives.
        - **ContactPage.jsx** : Page de contact.
        - **DeleteUserPage.jsx** : Page pour supprimer un utilisateur.
        - **FitnessPage.jsx** : Page dédiée au fitness.
        - **InscriptionCoursPage.jsx** : Page pour l'inscription aux cours.
        - **LoginPage.jsx** : Page de connexion.
        - **MonProfilPage.jsx** : Page pour afficher le profil de l'utilisateur.
        - **MusculationPage.jsx** : Page dédiée à la musculation.
        - **PiscinePage.jsx** : Page dédiée à la piscine.
        - **RegisterPage.jsx** : Page d'inscription.
        - **style.css** : Fichier CSS pour les styles des pages.
        - **SubscribePage.jsx** : Page pour gérer les abonnements.
    - **reportWebVitals.js** : Fichier pour mesurer les performances de l'application.
    - **setupTests.js** : Fichier de configuration pour les tests.

### Racine du projet
- **LICENSE** : Fichier de licence du projet.
- **README.md** : Documentation principale du projet.
- **structure.md** : Fichier décrivant la structure du projet.
- **TODO** : Liste des tâches à accomplir.
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── __init__.py
│   │   ├── models/
│   │   │   ├── Abonnement.py
│   │   │   ├── Contact.py
│   │   │   ├── __init__.py
│   │   │   ├── PageFitness.py
│   │   │   ├── PageMusculation.py
│   │   │   ├── PagePiscine.py
│   │   │   ├── Subscriptions.py
│   │   │   └── user.py
│   │   ├── routes/
│   │   │   ├── admin.py
│   │   │   ├── auth.py
│   │   │   ├── contact.py
│   │   │   ├── pageFitness.py
│   │   │   ├── pageMusculation.py
│   │   │   ├── pagePiscine.py
│   │   │   └── subscribe.py
│   │   └── utils/
│   │       └── plot_utils.py
│   ├── database/
│   │   ├── database.db
│   │   ├── init_db.py
│   │   └── schema.sql
│   ├── requirements.txt
│   └── run.py
├── frontend/
│   ├── package.json
│   ├── package-lock.json
│   ├── public/
│   │   ├── assets/
│   │   │   └── images/
│   │   │       ├── acceuil.png
│   │   │       ├── avatar1.png
│   │   │       ├── avatar2.png
│   │   │       ├── avatar3.png
│   │   │       ├── avatar4.png
│   │   │       ├── avatar5.png
│   │   │       ├── contact.png
│   │   │       ├── fitness.png
│   │   │       ├── logo.png
│   │   │       ├── musculation.png
│   │   │       └── piscine.png
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── manifest.json
│   │   └── robots.txt
│   ├── README.md
│   └── src/
│       ├── api.js
│       ├── App.css
│       ├── App.js
│       ├── index.css
│       ├── index.js
│       ├── logo.svg
│       ├── pages/
│       │   ├── AdminFitnessPage.jsx
│       │   ├── AdminMusculationPage.jsx
│       │   ├── AdminPage.jsx
│       │   ├── AdminPiscinePage.jsx
│       │   ├── AdminStatisticPage.jsx
│       │   ├── ContactPage.jsx
│       │   ├── DeleteUserPage.jsx
│       │   ├── FitnessPage.jsx
│       │   ├── InscriptionCoursPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── MonProfilPage.jsx
│       │   ├── MusculationPage.jsx
│       │   ├── PiscinePage.jsx
│       │   ├── RegisterPage.jsx
│       │   ├── style.css
│       │   └── SubscribePage.jsx
│       ├── reportWebVitals.js
│       └── setupTests.js
├── LICENSE
├── README.md
├── structure.md
└── TODO
