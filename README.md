# ProjetDevWeb / WebDevProject

## Description / Description

C'est un projet de développement web qui utilise **React** pour le frontend et **Flask** pour le backend. L'objectif de ce projet est de construire une application web full-stack, où le frontend communique avec une API backend pour gérer et afficher des données depuis une base de données.

This is a web development project that uses **React** for the frontend and **Flask** for the backend. The goal of this project is to build a full-stack web application, where the frontend communicates with a backend API to manage and display data from a database.

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
    python3 run.py
    ```
    Oubrez un nouveau terminal et Démarrez le frontend React :  
    ```bash
    cd ../frontend
    ```
    Installer les librairies 
    ```bash
    npm install @mui/material @emotion/react @emotion/styled @mui/icons-material
    ```

    Lancer le serveur
    ```bash
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

## Utilisateurs de test / Test Users

Voici trois utilisateurs de test pour l'application :

1. **Administrateur**  
    - **Email**: `admin@exemple.com`  
    - **Mot de passe / Password**: `adminpassword`  

2. **Utilisateur VIP**  
    - **Email**: `user@exemple.com`  
    - **Mot de passe / Password**: `userpassword`  

3. **Utilisateur normal**  
    - **Email**: `user2@exemple.com`  
    - **Mot de passe / Password**: `user2password`  


## License / Licence

This project is licensed under the MIT License. See the LICENSE file for more details.  
Ce projet est sous licence MIT. Voir le fichier LICENSE pour plus de détails.
