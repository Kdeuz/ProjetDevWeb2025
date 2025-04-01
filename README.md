
                ## Instructions pour exécuter le projet localement

                ### Étapes en français :
                1. **Cloner le dépôt**  
                    Clonez ce dépôt sur votre machine locale :  
                    ```bash
                    git clone <URL_DU_DEPOT>
                    cd ProjetDevWeb
                    ```

                2. **Configurer l'environnement backend (Flask)**  
                    - Accédez au dossier backend :  
                      ```bash
                      cd backend
                      ```
                    - Créez un environnement virtuel Python :  
                      ```bash
                      python3 -m venv venv
                      source venv/bin/activate  # Sur Windows : venv\Scripts\activate
                      ```
                    - Installez les dépendances :  
                      ```bash
                      pip install -r requirements.txt
                      ```
                    - Revenez au dossier racine :  
                      ```bash
                      cd ..
                      ```

                3. **Configurer le frontend (React)**  
                    - Créez une nouvelle application React dans un dossier nommé `frontend` :  
                      ```bash
                      npx create-react-app frontend
                      ```
                    - Accédez au dossier du frontend :  
                      ```bash
                      cd frontend
                      ```

                4. **Lancer le projet**  
                    - Démarrez le backend Flask :  
                      ```bash
                      cd ../backend
                      flask run
                      ```
                    - Démarrez le frontend React :  
                      ```bash
                      cd ../frontend
                      npm start
                      ```

                5. **Accéder à l'application**  
                    Ouvrez votre navigateur et accédez à `http://localhost:3000`.

                ---

                ### Steps in English:
                1. **Clone the repository**  
                    Clone this repository to your local machine:  
                    ```bash
                    git clone <REPOSITORY_URL>
                    cd ProjetDevWeb
                    ```

                2. **Set up the backend environment (Flask)**  
                    - Navigate to the backend folder:  
                      ```bash
                      cd backend
                      ```
                    - Create a Python virtual environment:  
                      ```bash
                      python3 -m venv venv
                      source venv/bin/activate  # On Windows: venv\Scripts\activate
                      ```
                    - Install the dependencies:  
                      ```bash
                      pip install -r requirements.txt
                      ```
                    - Return to the root folder:  
                      ```bash
                      cd ..
                      ```

                3. **Set up the frontend (React)**  
                    - Create a new React application in a folder named `frontend`:  
                      ```bash
                      npx create-react-app frontend
                      ```
                    - Navigate to the frontend folder:  
                      ```bash
                      cd frontend
                      ```

                4. **Run the project**  
                    - Start the Flask backend:  
                      ```bash
                      cd ../backend
                      flask run
                      ```
                    - Start the React frontend:  
                      ```bash
                      cd ../frontend
                      npm start
                      ```

                5. **Access the application**  
                    Open your browser and go to `http://localhost:3000`.