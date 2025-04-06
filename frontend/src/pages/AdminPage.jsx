import React, { useState } from "react";
import './style.css';  // Assurez-vous d'importer les styles CSS ici

// Fonction pour appeler l'API Flask et générer un code
async function generateCode() {
  // Envoie une requête POST à l'API pour générer un code
  const res = await fetch("http://localhost:5000/admin/generate_code", {
    method: "POST",
  });
  return res.json(); // Retourne la réponse sous forme JSON
}

export default function AdminPage() {
  // Utilisation de useState pour gérer l'état du code généré et du message de feedback
  const [code, setCode] = useState(null);
  const [message, setMessage] = useState("");

  // Fonction qui sera appelée lorsque l'on clique sur le bouton pour générer le code
  const handleGenerateCode = async () => {
    setMessage("Génération en cours...");  // Affiche un message de génération en cours
    const result = await generateCode(); // Attendre la réponse de l'API
    if (result.message) {
      setMessage(`Code généré avec succès`); // Si la génération réussit, afficher un message de succès
      setCode(result.code);  // Sauvegarder le code généré dans l'état
    } else {
      setMessage(`Erreur : ${result.error}`); // Si erreur, afficher un message d'erreur
    }
  };

  return (
    <div className="admin-page">
      <header className="profile-header">
        <h2>Page Admin - Générer un Code</h2>
        <p>Générez un code d'authentification pour accéder à certaines fonctionnalités administratives.</p>
      </header>

      <section className="admin-section">
        <button onClick={handleGenerateCode} className="btn-generate-code">
          Générer un Code
        </button>
        {message && <p className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
        {code && (
          <div className="code-display">
            <p>{code}</p>
          </div>
        )}
      </section>
    </div>
  );
}
