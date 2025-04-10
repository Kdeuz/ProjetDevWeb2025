import React, { useState } from "react";
import './style.css';  // Assurez-vous d'importer les styles CSS ici

// Fonction pour appeler l'API Flask et générer un code
async function generateCode() {
  try {
    const res = await fetch("http://localhost:5000/admin/generate_code", {
      method: "POST",
      credentials: "include", // Inclure les cookies pour l'authentification
    });

    // Vérifiez si la réponse est correcte
    if (!res.ok) {
      const errorText = await res.text(); // Lire la réponse brute
      console.error("Réponse brute :", errorText); // Afficher la réponse brute pour déboguer
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json(); // Convertir la réponse en JSON
    console.log("Réponse de l'API :", data); // Afficher la réponse brute pour déboguer
    return data; // Retourner les données JSON
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
    return { error: error.message || "Impossible de générer le code. Veuillez réessayer." };
  }
}

// Fonction pour appeler l'API Flask et ajouter un cours
async function addCourse(courseData) {
  try {
    const res = await fetch("http://localhost:5000/admin/add_course", {
      method: "POST",
      credentials: "include", // Inclure les cookies pour l'authentification
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(courseData),
    });

    // Vérifiez si la réponse est correcte
    if (!res.ok) {
      const errorText = await res.text(); // Lire la réponse brute
      console.error("Réponse brute :", errorText); // Afficher la réponse brute pour déboguer
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const data = await res.json(); // Convertir la réponse en JSON
    console.log("Réponse de l'API :", data); // Afficher la réponse brute pour déboguer
    return data; // Retourner les données JSON
  } catch (error) {
    console.error("Erreur lors de l'appel à l'API :", error);
    return { error: error.message || "Impossible d'ajouter le cours. Veuillez réessayer." };
  }
}

export default function AdminPage() {
  const [courseData, setCourseData] = useState({
    Nom: "",
    Date: "",
    Heure_debut: "",
    Heure_fin: "",
    Description: "",
    Capacite_max: "",
  });
  const [code, setCode] = useState(null);
  const [message, setMessage] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCourseData({ ...courseData, [name]: value });
  };

  // Fonction qui sera appelée lorsque l'on clique sur le bouton pour générer le code
  const handleGenerateCode = async () => {
    setMessage("Génération en cours...");
    const result = await generateCode(); // Appeler la fonction pour générer le code
    console.log("Résultat de l'API :", result); // Afficher le résultat pour déboguer

    if (result.code) {
      setMessage("✅ Code généré avec succès !");
      setCode(result.code);
    } else {
      setMessage(`❌ Erreur : ${result.error || "Une erreur est survenue."}`);
    }
  };

  // Fonction qui sera appelée lorsque l'on clique sur le bouton pour ajouter un cours
  const handleAddCourse = async () => {
    setMessage("Ajout du cours en cours...");
    const result = await addCourse(courseData); // Appeler la fonction pour ajouter un cours
    console.log("Résultat de l'API :", result); // Afficher le résultat pour déboguer

    if (result.cours) {
      setMessage("✅ Cours ajouté avec succès !");
    } else {
      setMessage(`❌ Erreur : ${result.error || "Une erreur est survenue."}`);
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

      <header className="profile-header">
        <h2>Page Admin - Ajouter un Cours</h2>
      </header>

      <section className="admin-section">
        <form>
          <input
            type="text"
            name="Nom"
            placeholder="Nom du cours"
            value={courseData.Nom}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="Date"
            placeholder="Date"
            value={courseData.Date}
            onChange={handleInputChange}
          />
          <input
            type="time"
            name="Heure_debut"
            placeholder="Heure de début"
            value={courseData.Heure_debut}
            onChange={handleInputChange}
          />
          <input
            type="time"
            name="Heure_fin"
            placeholder="Heure de fin"
            value={courseData.Heure_fin}
            onChange={handleInputChange}
          />
          <textarea
            name="Description"
            placeholder="Description"
            value={courseData.Description}
            onChange={handleInputChange}
          />
          <input
            type="number"
            name="Capacite_max"
            placeholder="Capacité max"
            value={courseData.Capacite_max}
            onChange={handleInputChange}
          />
        </form>
        <button onClick={handleAddCourse} className="btn-add-course">
          Ajouter un Cours
        </button>
        {message && <p className={`message ${message.startsWith('✅') ? 'success' : 'error'}`}>{message}</p>}
      </section>
    </div>
  );
}
