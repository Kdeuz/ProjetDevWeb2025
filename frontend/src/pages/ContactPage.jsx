import React, { useState, useEffect } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [feedback, setFeedback] = useState('');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:5000/me", {
          credentials: 'include'
        });
        
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
          
          // Pre-fill form with user data
          setForm({
            name: userData.username || '',
            email: userData.email || '',
            message: ''
          });
        }
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback("Envoi en cours...");

    // Determine endpoint based on user's subscription
    const endpoint = user?.abonnement === 'VIP' 
      ? '/api/contact/vip' 
      : '/api/contact';

    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          message: form.message
        }),
      });

      const data = await res.json();
      if (data.success) {
        setFeedback("✅ Message envoyé !");
        setForm(prev => ({ ...prev, message: '' })); // Clear only message
      } else {
        setFeedback(`❌ Erreur : ${data.error || 'Une erreur est survenue'}`);
      }
    } catch (error) {
      setFeedback('❌ Erreur de connexion au serveur');
      console.error('Submission error:', error);
    }
  };

  if (loading) {
    return <div className="page contact-page">Chargement...</div>;
  }

  return (
    <div className="page contact-page">
      <h2>📬 Contactez-nous</h2>
      
      {/* Display user info if authenticated */}
      {user && (
        <div className={`user-info-card ${user?.abonnement === 'VIP' ? 'vip-card' : ''}`}>
          <h3>👤 Vos informations</h3>
          {user?.abonnement === 'VIP' && (
            <div className="vip-badge">⭐ VIP</div>
          )}
          <div className="user-details">
            <p><strong>Nom d'utilisateur:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Prénom:</strong> {user.prenom || 'Non spécifié'}</p>
            <p><strong>Nom:</strong> {user.nom || 'Non spécifié'}</p>
            <p><strong>Âge:</strong> {user.age || 'Non spécifié'}</p>
            <p><strong>Téléphone:</strong> {user.telephone || 'Non spécifié'}</p>
            <p><strong>Abonnement:</strong> {user?.abonnement || 'Aucun'}</p>
          </div>
        </div>
      )}

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
            disabled={!!user}
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
            disabled={!!user}
          />
        </div>
        <div className="form-group">
          <label htmlFor="message">💬 Message :</label>
          <textarea
            id="message"
            name="message"
            className="form-control"
            placeholder={`${user?.abonnement === 'VIP' ? 'Votre message VIP sera traité en priorité' : 'Écrivez votre message'}`}
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className={`btn ${user?.abonnement === 'VIP' ? 'btn-vip' : 'btn-primary'}`}>
          {user?.abonnement === 'VIP' ? '🚀 Envoyer (VIP)' : '🚀 Envoyer'}
        </button>
      </form>
      {feedback && (
        <p className={`feedback ${feedback.startsWith('✅') ? 'success' : 'error'}`}>
          {feedback}
        </p>
      )}

      {/* VIP-specific information */}
      {user?.abonnement === 'VIP' && (
        <div className="vip-notice">
          <p>⭐ En tant que membre VIP, votre message sera traité en priorité.</p>
        </div>
      )}
    </div>
  );
};

export default ContactPage;