# ProjetDevWeb / WebDevProject

## Description / Description

C'est un projet de développement web qui utilise **React** pour le frontend et **Flask** pour le backend. L'objectif de ce projet est de construire une application web full-stack, où le frontend communique avec une API backend pour gérer et afficher des données depuis une base de données.

This is a web development project that uses **React** for the frontend and **Flask** for the backend. The goal of this project is to build a full-stack web application, where the frontend communicates with a backend API to manage and display data from a database.

---

Admin : test@mail.com  ----- 123456


## Structure du projet / Project Structure

```
ProjetDevWeb/
├── backend/                # Fichiers backend Flask (API, gestion de base de données, etc.)
│   ├── app.py              # Fichier principal Flask (application backend)
│   ├── routes/             # Routes de l'API Flask
│   ├── models/             # Modèles de base de données (SQLAlchemy ou autre ORM)
│   ├── database/           # Gestion des connexions à la base de données
│   ├── config.py           # Fichier de configuration pour le backend (clé API, config DB)
│   └── requirements.txt    # Dépendances Python pour le backend
│
├── frontend/               # Fichiers frontend React
│   ├── src/                # Code source du frontend (React)
│   │   ├── components/     # Composants React
│   │   ├── pages/          # Pages React (Accueil, Dashboard, etc.)
│   │   └── App.js          # Point d’entrée React
│   ├── public/             # Fichiers publics (index.html, etc.)
│   ├── package.json        # Dépendances frontend (React, etc.)
│   ├── package-lock.json   # Assure une installation cohérente des dépendances
│   ├── styles/             # Fichiers CSS personnalisés
│   └── node_modules/       # Modules Node.js (générés automatiquement, à ignorer dans Git)
│
├── database/               # Fichiers de gestion de base de données (SQL, migrations, etc.)
│   ├── schema.sql          # Schéma de la base de données (tables, relations, etc.)
│   ├── migrations/         # Dossier pour les migrations de base de données
│   └── init_db.py          # Script d'initialisation de la base de données
│
├── virtualenv/             # Environnement virtuel Python
├── README.md               # Documentation du projet
├── .gitignore              # Fichier .gitignore (à ignorer node_modules, fichiers secrets, etc.)
├── LICENSE                 # Licence du projet (par exemple, MIT)
└── config.py               # Configuration globale du projet (API keys, paths, etc.)
```

---

## Instructions pour exécuter le projet localement / Instructions to run the project locally

### Étapes en français :

1. **Cloner le dépôt**  
    Clonez ce dépôt sur votre machine locale :  
    ```bash
    git clone <URL_DU_DEPOT>
    cd ProjetDevWeb
    ```
    Créez un environnement virtuel Python :  
    ```bash
    python3 -m venv virtualenv
    source venv/bin/activate # Sur Windows : venv\Scripts\activate
    ```

2. **Configurer l'environnement backend (Flask)**  
    Accédez au dossier backend :  
    ```bash
    cd backend
    ```
    Installez les dépendances :  
    ```bash
    pip install -r requirements.txt
    ```

    Revenez au dossier racine :  
    ```bash
    cd ..
    ```

3. **Configurer le frontend (React)**  
    Accédez au dossier frontend :  
    ```bash
    cd frontend
    ```

    Installez les dépendances Node.js en exécutan :  
    ```bash
    npm install
    ```

4. **Lancer le projet**  
    Démarrez le backend Flask :  
    ```bash
    cd ../backend
    flask run
    ```

    Démarrez le frontend React :  
    ```bash
    cd ../frontend
    npm start
    ```

5. **Accéder à l'application**  
    Ouvrez votre navigateur et accédez à [http://localhost:3000](http://localhost:3000).

---


### Steps in English:

1. **Clone the repository**  
    Clone this repository to your local machine:  
    ```bash
    git clone <REPOSITORY_URL>
    cd ProjetDevWeb
    ```
    Create a Python virtual environment:  
    ```bash
    python3 -m venv virtualenv
    source venv/bin/activate # On Windows: venv\Scripts\activate
    ```

2. **Set up the backend environment (Flask)**  
    Navigate to the backend folder:  
    ```bash
    cd backend
    ```
    Install the dependencies:  
    ```bash
    pip install -r requirements.txt
    ```

    Return to the root folder:  
    ```bash
    cd ..
    ```

3. **Set up the frontend (React)**  
    Navigate to the frontend folder:  
    ```bash
    cd frontend
    ```

    Install the Node.js dependencies by running:  
    ```bash
    npm install
    ```

4. **Run the project**  
    Start the Flask backend:  
    ```bash
    cd ../backend
    flask run
    ```

    Start the React frontend:  
    ```bash
    cd ../frontend
    npm start
    ```

5. **Access the application**  
    Open your browser and go to [http://localhost:3000](http://localhost:3000).

---

## License / Licence

This project is licensed under the MIT License. See the LICENSE file for more details.  
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
