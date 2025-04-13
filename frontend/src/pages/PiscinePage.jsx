import React, { useEffect, useState } from 'react';
import { getPiscineData } from '../api';
import './style.css';
import { useNavigate } from 'react-router-dom';
import { Link } from "react-router-dom";



export default function PiscinePage() {
  const [loading, setLoading] = useState(true);
  const [piscineData, setPiscineData] = useState(null);
  const [error, setError] = useState(null);

  const fetchData = () => {
    getPiscineData()
      .then(data => {
        setPiscineData(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Erreur lors du chargement :", err);
        setError("Erreur lors du chargement des données.");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  const navigate = useNavigate();
      
  const handleSubscribe = (courseId, courseType) => {
              // Store course info in localStorage or navigate with state
      localStorage.setItem("selectedCourse", JSON.stringify({ id: courseId, type: courseType }));
      navigate("/subscribe");  // if using react-router
  };

  if (loading) return <p>Chargement des données piscine...</p>;
  if (error) return <p>{error}</p>;
  if (!piscineData) return <p>Aucune donnée disponible</p>;

  // Helper function to format pool status
  const formatPoolStatus = (status) => {
    return status === 0 ? "Fermé" : `${status} personnes`;
  };
  

  

  return (
    <div className="page piscine-page">
      <header className="header">
        <h1>Piscine de l'Espace Fitness</h1>
        <p>Plongez dans un environnement aquatique sain et relaxant. Profitez de nos bassins et cours variés pour une expérience complète.</p>
      </header>

      <section className="about">
        <h2>Nos Bassins</h2>
        <p>Nous proposons {piscineData.nombreBassins} bassins adaptés à tous les niveaux.</p>
        <table className="basins-table">
          <thead>
            <tr>
              <th>Nom du Bassin</th>
              <th>Description</th>
              <th>Longueur (m)</th>
              <th>Profondeur (m)</th>
            </tr>
          </thead>
          <tbody>
            {piscineData.bassins && piscineData.bassins.map(bassin => (
              <tr key={bassin.id}>
                <td><strong>{bassin.nom}</strong></td>
                <td>{bassin.description}</td>
                <td>{bassin.longueur}</td>
                <td>{bassin.profondeur}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className="pool-feature">Eau propre et claire grâce à notre filtration moderne.</p>
      </section>

      <section className="classes">
        <h2>Cours Disponibles ({piscineData.totalCours})</h2>
        <p>Rejoignez nos cours aquatiques variés :</p>
        <div className="class-list">
          {piscineData.cours.map((cours) => (
            <div className="class-card" key={cours.id || cours.nom}>
              <h3>{cours.nom}</h3>
              <p>{cours.description}</p>
              <p><strong>Jour :</strong> {cours.jour || "Non spécifié"}</p>
              <p><strong>Heure :</strong> {cours.heure || "Non spécifié"}</p>
              <p><strong>ID :</strong> {cours.id || "Non spécifié"}</p>
              <button
                                className="subscribe-button"
                                onClick={() => handleSubscribe(cours.id, 'piscine')}
                            >
                                S'inscrire
                            </button>
            </div>
          ))}
        </div>
      </section>

      <section className="real-time">
        <h2>Statut des Bassins</h2>
        <div className="pool-status">
          {piscineData.nombreParBassin && Object.entries(piscineData.nombreParBassin).map(([bassinName, status]) => (
            <div key={bassinName} className="status-item">
              <span className="pool-name">{bassinName}:</span>
              <span className={`status ${status === 0 ? 'closed' : 'open'}`}>
                {formatPoolStatus(status)}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="benefits">
        <h2>Les Bienfaits de la Natation</h2>
        <ul>
          <li><strong>Cardio :</strong> Endurance & circulation améliorée.</li>
          <li><strong>Muscles :</strong> Travail complet du corps.</li>
          <li><strong>Relaxation :</strong> Diminution du stress.</li>
          <li><strong>Accessibilité :</strong> Pour tous les âges.</li>
        </ul>
      </section>

      <section className="testimonials">
        <h2>Témoignages</h2>
        <div className="testimonial">
          <p>"Aquagym super efficace ! Cours accessibles à tous." - <strong>Julie M.</strong></p>
        </div>
        <div className="testimonial">
          <p>"Piscine propre et moderne. Idéal pour mes entraînements." - <strong>Lucas B.</strong></p>
        </div>
      </section>

      <section className="contact">
        <h2>Contactez-Nous</h2>
        <p>Des questions ? Contactez notre équipe !</p>
        <Link to="/contact" className="join-button">Nous contacter</Link>
      </section>
    </div>
  );
}