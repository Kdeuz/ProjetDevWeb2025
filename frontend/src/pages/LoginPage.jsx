import React, { useState } from "react";
import { loginUser } from "../api";
import { Link } from "react-router-dom";
import './style.css';

export default function LoginPage({ userData, setUserData }) { // Recevoir userData et setUserData comme props
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation des champs côté client
      if (!form.email.includes("@")) {
        setError("Veuillez entrer une adresse email valide.");
        return;
      }
      if (form.password.length < 6) {
        setError("Le mot de passe doit contenir au moins 6 caractères.");
        return;
      }

      setError(""); // Réinitialiser les erreurs
      setIsLoading(true); // Activer l'état de chargement

      // Appel à l'API pour la connexion
      const res = await loginUser(form);
      setIsLoading(false); // Désactiver l'état de chargement

      if (res.message) {
        setUserData(res.user); // Mettre à jour l'état global dans App.js
        localStorage.setItem("userData", JSON.stringify(res.user)); // Stocker les données utilisateur dans le localStorage
      } else {
        setError(res.error || "Une erreur est survenue. Veuillez réessayer."); // Gérer les erreurs de l'API
      }
    } catch (err) {
      setIsLoading(false); // Désactiver l'état de chargement en cas d'erreur
      setError("Une erreur serveur est survenue. Veuillez réessayer plus tard."); // Message d'erreur générique
    }
  };

  return (
    <div className="login-page">
      <header className="profile-header">
        <p>Accédez à votre espace fitness et commencez votre entraînement.</p>
      </header>

      <section className="form-section">
        {!userData ? ( // Utiliser l'état global userData pour afficher ou cacher le formulaire
          <form onSubmit={handleSubmit} className="registration-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="Entrez votre email"
                className="input-field"
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Mot de passe</label>
              <input
                id="password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="Entrez votre mot de passe"
                className="input-field"
              />
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Connexion..." : "Se connecter"} {/* Affiche "Connexion..." pendant le chargement */}
            </button>
          </form>
        ) : (
          <div aria-live="polite">
            <h4>Bienvenue {userData.prenom} 👋</h4>
            <p>Vous êtes maintenant connecté à votre espace personnel.</p>
          </div>
        )}
      </section>

        
      {/* Section des liens conditionnels */}
      {!userData && ( // Afficher les liens uniquement si l'utilisateur n'est pas connecté
        <section className="login-links">
          <div>
            <Link to="/register" className="login-link">Pas de compte? Inscrivez-vous</Link>
          </div>
          <div>
            <Link to="/admin" className="login-link">Connexion en tant qu'admin</Link>
          </div>
        </section>
      )}
    </div>
  );
}
