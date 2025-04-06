import React, { useState } from "react";
import { loginUser } from "../api";
import { Link } from "react-router-dom";
import './style.css';  // Ensure to import the CSS styles here

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await loginUser(form);
    if (res.message) {
      setUserData(res.user);
      setError("");
    } else {
      setError(res.error);
    }
  };

  return (
    <div className="login-page">
      <header className="profile-header">
        <p>Accédez à votre espace fitness et commencez votre entraînement.</p>
      </header>

      <section className="form-section">
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

          <button type="submit" className="submit-btn">Se connecter</button>
        </form>

        {error && <p className="message error">{error}</p>}
        {userData && (
          <div>
            <h4>Bienvenue {userData.prenom} 👋</h4>
            <p>Vous êtes maintenant connecté à votre espace personnel.</p>
          </div>
        )}
      </section>

      <section className="login-links">
        <div>
          <Link to="/register" className="login-link">Pas de compte? Inscrivez-vous</Link>
        </div>
        <div>
          <Link to="/admin" className="login-link">Connexion en tant qu'admin</Link>
        </div>
      </section>
    </div>
  );
}
