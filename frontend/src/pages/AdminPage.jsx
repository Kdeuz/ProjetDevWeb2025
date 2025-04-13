import React, { useState } from "react";
import './style.css';
import RegisterPage from "./RegisterPage";
import AdminFitnessPage from "./AdminFitnessPage";
import AdminMusculationPage from "./AdminMusculationPage";
import AdminPiscinePage from "./AdminPiscinePage";
import AdminStatisticPage from "./AdminStatisticPage";
import DeleteUserPage from "./DeleteUserPage"; // Import the DeleteUserPage

export default function AdminPage() {
  const [afficherSalles, setAfficherSalles] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [showFitnessManagement, setShowFitnessManagement] = useState(false);
  const [showMusculationManagement, setShowMusculationManagement] = useState(false);
  const [showPiscineManagement, setShowPiscineManagement] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);

  const handleFitnessClick = () => {
    setShowFitnessManagement(true);
    setAfficherSalles(false);
  };

  const handleMusculationClick = () => {
    setShowMusculationManagement(true);
    setAfficherSalles(false);
  };

  const handlePiscineClick = () => {
    setShowPiscineManagement(true);
    setAfficherSalles(false);
  };

  const handleStatisticsClick = () => {
    setShowStatistics(true);
  };

  const handleDeleteUserClick = () => {
    setShowDeleteUser(true);
  };

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Panneau d'Administration</h1>
      </header>

      <div className="admin-content">
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
        ) : showStatistics ? (
          <div className="statistics-container">
            <button 
              onClick={() => setShowStatistics(false)}
              className="btn-back"
            >
              ← Retour au panneau d'administration
            </button>
            <AdminStatisticPage />
          </div>
        ) : showDeleteUser ? (
          <div className="delete-user-container">
            <button 
              onClick={() => setShowDeleteUser(false)}
              className="btn-back"
            >
              ← Retour au panneau d'administration
            </button>
            <DeleteUserPage />
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

            {/* Section Statistiques */}
            <section className="admin-section">
              <h2>Statistiques</h2>
              <button 
                onClick={handleStatisticsClick} 
                className="btn-toggle"
              >
                <span className="icon">📊</span> Afficher les statistiques
              </button>
            </section>

            {/* Section Supprimer un Utilisateur */}
            <section className="admin-section">
              <h2>Supprimer un Adhérent</h2>
              <button 
                onClick={handleDeleteUserClick} 
                className="btn-toggle"
              >
                <span className="icon">❌</span> Supprimer un utilisateur
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
