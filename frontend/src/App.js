import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import './App.css';

// Import des pages
import FitnessPage from './pages/FitnessPage';
import MusculationPage from './pages/MusculationPage';
import PiscinePage from './pages/PiscinePage';
import ContactPage from './pages/ContactPage';
import MonProfilPage from './pages/MonProfilPage';
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage";
import SubscribePage from "./pages/SubscribePage";

;

function App() {
  const [userData, setUserData] = useState(null);

  // Charger les données utilisateur depuis le localStorage au démarrage
  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
  }, []);

  const handleLogout = () => {
    setUserData(null);
    localStorage.removeItem("userData");
    
    // Add this to clear the server-side session
    fetch('http://localhost:5000/logout', {
      method: 'POST',
      credentials: 'include'  // Important for cookies/session
    }).then(() => {
      window.location.reload();  // Optional: refresh the page
    });
  };

  return (
    <Router>
      <div className="App">
        {/* En-tête */}
        <header className="header">
          <div className="logo">
            <img src="/assets/images/logo.png" alt="Logo SmartGym" />
            <h1>SmartGym</h1>
          </div>
        </header>

        {/* Barre de navigation */}
        <nav className="navbar">
          <ul>
            <li><Link to="/">Accueil</Link></li>
            {!userData ? (
              // Afficher "Connexion" si l'utilisateur n'est pas connecté
              <li><Link to="/login">Connexion</Link></li>
            ) : (
              // Afficher "Mon Profil" et "Déconnexion" si l'utilisateur est connecté
              <>
                <li><Link to="/monprofil">Mon Profil</Link></li>
                <li>
                  <Link to="/" onClick={handleLogout} className="logout-btn">
                    Déconnexion
                  </Link>
                </li>
              </>
            )}

            {/* Afficher le lien Admin si l'utilisateur est un administrateur */}
            {userData && userData.is_admin == 1 && (
              <li><Link to="/admin">Admin</Link></li>
            )}
          </ul>
        </nav>

        {/* Contenu principal */}
        <main>
          <Routes>
            {/* Page d'accueil */}
            <Route path="/" element={(
              <div className="accueil">
                {/* Section 1 : Bienvenue */}
                <section className="accueil-section" id="welcome">
                  <div className="section-content">
                    <h2>Bienvenue sur SmartGym</h2>
                    <p>Votre compagnon de fitness personnel !</p>
                    <button><Link to="/fitness">Commencez votre aventure fitness</Link></button>
                  </div>
                  <div className="section-image">
                    <img src="/assets/images/fitness.png" alt="Fitness" />
                  </div>
                </section>

                {/* Section 2 : Musculation */}
                <section className="accueil-section" id="musculation">
                  <div className="section-content">
                    <h2>Musculation</h2>
                    <p>Renforcez votre musculature avec nos programmes d'entraînement.</p>
                    <button><Link to="/musculation">Explorer la Musculation</Link></button>
                  </div>
                  <div className="section-image">
                    <img src="/assets/images/musculation.png" alt="Musculation" />
                  </div>
                </section>

                {/* Section 3 : Piscine */}
                <section className="accueil-section" id="piscine">
                  <div className="section-content">
                    <h2>Piscine</h2>
                    <p>Nagez vers la forme avec nos programmes aquatiques.</p>
                    <button><Link to="/piscine">Explorer Piscine</Link></button>
                  </div>
                  <div className="section-image">
                    <img src="/assets/images/piscine.png" alt="Piscine" />
                  </div>
                </section>

                {/* Section 4 : Contact */}
                <section className="accueil-section" id="contact">
                  <div className="section-content">
                    <h2>Contact</h2>
                    <p>Contactez-nous pour plus d'informations ou des demandes.</p>
                    <button><Link to="/contact">Contactez-nous</Link></button>
                  </div>
                  <div className="section-image">
                    <img src="/assets/images/contact.png" alt="Contact" />
                  </div>
                </section>
              </div>
            )} />

            {/* Autres Pages */}
            <Route path="/fitness" element={<FitnessPage />} />
            <Route path="/musculation" element={<MusculationPage />} />
            <Route path="/piscine" element={<PiscinePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/monprofil" element={<MonProfilPage />} />
            <Route path="/Subscribe" element={<SubscribePage />} />

            {/* Pages Authentification */}
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/login" element={<LoginPage userData={userData} setUserData={setUserData} />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="footer">
          <p>&copy; 2025 SmartGym. Tous droits réservés.</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
