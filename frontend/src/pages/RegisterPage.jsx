import React, { useState } from "react";
import { registerUser } from "../api";
import './style.css';  // Ensure to import the CSS styles here

export default function RegisterPage() {
  const [form, setForm] = useState({
    email: "",
    username: "",
    password: "",
    prenom: "",
    nom: "",
    age: "",
    telephone: "",
    code: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUser(form);
    if (res.message) {
      setMessage("✅ Inscription réussie !");
    } else {
      setMessage(`❌ Erreur : ${res.error}`);
    }
  };

  return (
    <div className="register-page">
      <header className="profile-header">
        <h2>Inscription</h2>
        <p>Rejoignez notre espace fitness et commencez votre parcours dès aujourd'hui.</p>
      </header>

      <section className="form-section">
        <form onSubmit={handleSubmit} className="registration-form">
          {Object.keys(form).map((key) => (
            <div key={key} className="form-group">
              <label htmlFor={key}>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
              <input
                id={key}
                name={key}
                value={form[key]}
                onChange={handleChange}
                required
                placeholder={`Entrez votre ${key}`}
                className="input-field"
              />
            </div>
          ))}
          <button type="submit" className="submit-btn">S'inscrire</button>
        </form>

        {message && <p className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
      </section>
    </div>
  );
}
