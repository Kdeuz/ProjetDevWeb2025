import React, { useState } from "react";
import './style.css';
import RegisterPage from "./RegisterPage"; // 👉 make sure the path is correct

export default function AdminPage() {
  const [afficherSalles, setAfficherSalles] = useState(false);
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  return (
    <div className="admin-page">
      <header className="admin-header">
        <h1>Panneau d'Administration</h1>
      </header>

      <div className="admin-content">
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
              <button className="facility-btn">
                <span className="icon">🏋️</span> Gérer Fitness
              </button>
              <button className="facility-btn">
                <span className="icon">💪</span> Gérer Musculation
              </button>
              <button className="facility-btn">
                <span className="icon">🏊</span> Gérer Piscine
              </button>
              <button className="facility-btn">
                <span className="icon">🚴</span> Gérer Cardio
              </button>
              <button className="facility-btn">
                <span className="icon">🧘</span> Gérer Yoga
              </button>
              <button className="facility-btn">
                <span className="icon">🚿</span> Gérer Vestiaires
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
