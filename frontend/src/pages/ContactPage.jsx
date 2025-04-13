import React, { useState } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [feedback, setFeedback] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("Envoi en cours...");

    const res = await fetch("http://localhost:5000/api/contact", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (data.success) {
      setFeedback("✅ Message envoyé !");
      setForm({ name: '', email: '', message: '' });
    } else {
      setFeedback(`❌ Erreur : ${data.error}`);
    }
  };

  return (
    <div className="page contact-page">
      <h2>📬 Contactez-nous</h2>
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label htmlFor="name">👤 Nom :</label>
          <input
            id="name"
            name="name"
            className="form-control"
            placeholder="Entrez votre nom"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">📧 Email :</label>
          <input
            id="email"
            name="email"
            type="email"
            className="form-control"
            placeholder="Entrez votre email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">💬 Message :</label>
          <textarea
            id="message"
            name="message"
            className="form-control"
            placeholder="Écrivez votre message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">
          🚀 Envoyer
        </button>
      </form>
      {feedback && (
        <p className={`feedback ${feedback.startsWith('✅') ? 'success' : 'error'}`}>
          {feedback}
        </p>
      )}
    </div>
  );
};

export default ContactPage;
