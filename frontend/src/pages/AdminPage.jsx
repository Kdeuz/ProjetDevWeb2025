import React, { useState } from "react";
import './style.css';
import RegisterPage from "./RegisterPage";
import AdminFitnessPage from "./AdminFitnessPage"; // Import the fitness management component
import AdminMusculationPage from "./AdminMusculationPage"; // Import the musculation management component
import AdminPiscinePage from "./AdminPiscinePage"; // Import the piscine management component

export default function AdminPage() {
  const [afficherSalles, setAfficherSalles] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showFitnessManagement, setShowFitnessManagement] = useState(false);
  const [showMusculationManagement, setShowMusculationManagement] = useState(false); // State for musculation management
  const [showPiscineManagement, setShowPiscineManagement] = useState(false); // State for piscine management

  const handleFitnessClick = () => {
    setShowFitnessManagement(true);
    setAfficherSalles(false); // Hide the facilities grid
  };

  const handleMusculationClick = () => {
    setShowMusculationManagement(true);
    setAfficherSalles(false); // Hide the facilities grid
  };

  const handlePiscineClick = () => {
    setShowPiscineManagement(true);
    setAfficherSalles(false); // Hide the facilities grid
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Panneau d'Administration</h1>
      </header>

      <div className="admin-content">
        {/* Show either the fitness management, musculation management, or piscine management */}
        {showFitnessManagement ? (
          <div className="fitness-management-container">
            <button 
              onClick={() => setShowFitnessManagement(false)}
              className="btn-back"
            >
              ← Retour au panneau d'administration
            </button>
            <AdminFitnessPage />
          </div>
        ) : showMusculationManagement ? (
          <div className="musculation-management-container">
            <button 
              onClick={() => setShowMusculationManagement(false)}
              className="btn-back"
            >
              ← Retour au panneau d'administration
            </button>
            <AdminMusculationPage />
          </div>
        ) : showPiscineManagement ? (
          <div className="piscine-management-container">
            <button 
              onClick={() => setShowPiscineManagement(false)}
              className="btn-back"
            >
              ← Retour au panneau d'administration
            </button>
            <AdminPiscinePage />
          </div>
        ) : (
          <>
            {/* Section Inscription */}
            <section className="admin-section">
              <h2>Ajouter un Nouvel Utilisateur</h2>
              <button 
                onClick={() => setShowRegisterForm(!showRegisterForm)} 
                className="btn-toggle"
              >
                {showRegisterForm ? "▼ Masquer le formulaire" : "▶ Ajouter un utilisateur"}
              </button>
              {showRegisterForm && (
                <div className="register-form-wrapper">
                  <RegisterPage />
                </div>
              )}
            </section>

            {/* Section Gestion des Installations */}
            <section className="admin-section">
              <h2>Gestion des Salles</h2>
              <button 
                onClick={() => setAfficherSalles(!afficherSalles)} 
                className={`btn-toggle ${afficherSalles ? 'active' : ''}`}
              >
                {afficherSalles ? "▼ Masquer les salles" : "▶ Afficher les salles"}
              </button>

              {afficherSalles && (
                <div className="facilities-grid">
                  <button className="facility-btn" onClick={handleFitnessClick}>
                    <span className="icon">🏋️</span> Gérer Fitness
                  </button>
                  <button className="facility-btn" onClick={handleMusculationClick}>
                    <span className="icon">💪</span> Gérer Musculation
                  </button>
                  <button className="facility-btn" onClick={handlePiscineClick}>
                    <span className="icon">🏊</span> Gérer Piscine
                  </button>
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}
