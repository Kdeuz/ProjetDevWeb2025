import React, { useState } from 'react';

//menu déroulant affichant la liste de tous les cours disponibles 








// Fonction pour appeler l'API et envoyer les données du formulaire de contact
async function sendContactForm(data) {
  // Envoie les données du formulaire à l'API backend
  const res = await fetch('http://localhost:5000/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data), // Convertir les données du formulaire en JSON
  });
  return res.json(); // Retourne la réponse de l'API
}

const InscriptionCoursPage = () => {
  // Utilisation de useState pour gérer les données du formulaire
  const [form, setForm] = useState({
    cours:"", // Le cours sélectionné
    name: '',
    email: '',
    message: '',
  });

  const [feedbackMessage, setFeedbackMessage] = useState('');

  // Fonction pour mettre à jour l'état du formulaire lorsqu'une valeur change
  const handleChange = (e) => {
    setForm({
      ...form, // Conserve les autres champs du formulaire
      [e.target.name]: e.target.value, // Met à jour la valeur du champ modifié
    });
  };

  // Fonction pour gérer la soumission du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page lors de la soumission

    // Affiche un message de "chargement" pendant l'envoi
    setFeedbackMessage('Envoi en cours...');

    // Envoie les données du formulaire au backend
    const result = await sendContactForm(form);

    // Vérifie si l'envoi a réussi et met à jour le message en conséquence
    if (result.success) {
      setFeedbackMessage('✅ Message envoyé avec succès !');
    } else {
      setFeedbackMessage(`❌ Erreur : ${result.error}`);
    }

    // Réinitialise les champs du formulaire après l'envoi
    setForm({
        cours: "", // Réinitialise le cours sélectionné
        name: '',
        email: '',
        message: '',
    });
  };

    // Liste des cours disponibles
  const coursDisponibles = [
    'Musculation',
    'Natation',
    'Fitness',
  ];
  
  return (
        <div className="page contact-page">
          <h2>Contact</h2>
          <form onSubmit={handleSubmit}>
          <div className="form-group">
          <label htmlFor="cours">Cours: </label>
          <select
            id="cours"
            name="cours"
            value={form.cours}
            onChange={handleChange}
            required
          >
            <option value="" disabled>Sélectionnez un cours</option>
            {coursDisponibles.map((cours, index) => (
              <option key={index} value={cours}>{cours}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="name">Nom: </label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange} // Gère le changement des champs
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email: </label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor= "message">Message: </label>
          <textarea
            id="message"
            name="message"
            value={form.message}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Envoyer</button>
      </form>
      {feedbackMessage && <p className="feedback-message">{feedbackMessage}</p>}
    </div>
  );
};

export default InscriptionCoursPage;
