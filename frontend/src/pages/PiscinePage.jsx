import React, { useState, useEffect } from 'react';
import './style.css';
import { Link } from "react-router-dom";
import { getPiscineData } from '../api';

const PiscinePage = () => {
  const [piscineData, setPiscineData] = useState({
    nombreBassins: 3,
    cours: [],
    nombreParBassin: 0,
    stats: { total_cours: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPiscineData();
        setPiscineData(data.data || {
          nombreBassins: 3,
          cours: [],
          nombreParBassin: 0,
          stats: { total_cours: 0 }
        });
        setLoading(false);
      } catch (err) {
        console.error("Erreur de chargement des données:", err);
        setError("Erreur de chargement des données");
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Actualisation toutes les 3 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="page piscine-page">
      <header className="header">
        <h1>Piscine de l'Espace Fitness</h1>
        <p>Plongez dans un environnement aquatique sain et relaxant. Profitez de nos bassins et cours variés pour une expérience complète.</p>
      </header>

      <section className="about">
        <h2>Nos Bassins</h2>
        <div className="basins">
          <p>Nous proposons {piscineData.nombreBassins} bassins adaptés à tous les niveaux, pour nager, se détendre ou participer à des activités aquatiques.</p>
          <p>Nombre de bassins: <strong>{piscineData.nombreBassins}</strong></p>
          <p>Consignes de sécurité et détails des bassins :</p>
          <ul>
            <li><strong>Bassin de natation :</strong> Idéal pour les longueurs et les entraînements intenses.</li>
            <li><strong>Bassin ludique :</strong> Pour les enfants et la détente, avec des jeux aquatiques et des zones de relaxation.</li>
            <li><strong>Bassin de plongée :</strong> Profitez de la profondeur et de la tranquillité pour pratiquer la plongée sous-marine ou les activités aquatiques avancées.</li>
          </ul>
          <p className="pool-feature">Chaque bassin est équipé de systèmes de filtration modernes pour garantir une eau propre et claire en tout temps.</p>
        </div>
      </section>

      <section className="classes">
        <h2>Cours Disponibles</h2>
        <p>Rejoignez nos cours aquatiques variés pour un entraînement complet et amusant :</p>
        {loading ? (
          <p>Chargement des cours...</p>
        ) : error ? (
          <p>{error}</p>
        ) : (
          <div className="class-list">
            {piscineData.cours.map((cours) => (
              <div className="class-card" key={cours.nom}>
                <h3>{cours.nom}</h3>
                <p>{cours.description}</p>
                <p>Bassin: {cours.bassin}</p>
                <button className="class-btn">Voir les horaires</button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="real-time">
        <h2>Personnes par Bassin</h2>
        <p>Actuellement : <span className="people-count">{piscineData.nombreParBassin}</span> personnes par bassin. Venez profiter de nos bassins spacieux !</p>
      </section>

      <section className="benefits">
        <h2>Les Bienfaits de la Natation</h2>
        <p>La natation est un excellent exercice pour le corps et l'esprit. Voici quelques-uns des nombreux avantages :</p>
        <ul>
          <li><strong>Améliore la santé cardiovasculaire :</strong> La natation augmente l'endurance et améliore la circulation sanguine.</li>
          <li><strong>Renforce la musculature :</strong> Tous les groupes musculaires sont sollicités pendant la natation, ce qui renforce le corps.</li>
          <li><strong>Réduit le stress :</strong> L'eau a un effet relaxant et permet de diminuer l'anxiété et la tension.</li>
          <li><strong>Accessibilité :</strong> La natation est accessible à tous, quel que soit l'âge ou le niveau de forme physique.</li>
        </ul>
      </section>

      <section className="testimonials">
        <h2>Témoignages</h2>
        <div className="testimonial">
          <p>"J'ai amélioré ma forme physique en un temps record grâce à l'aquagym ! Les cours sont adaptés à tous les niveaux." - <strong>Julie M.</strong></p>
        </div>
        <div className="testimonial">
          <p>"La piscine est super propre et les installations sont modernes. J'adore venir ici pour mes entraînements quotidiens." - <strong>Lucas B.</strong></p>
        </div>
      </section>

      <section className="contact">
        <h2>Contactez-Nous</h2>
        <p>Vous avez des questions sur nos services aquatiques ? Contactez notre équipe pour plus d'informations !</p>
        <Link to="/contact" className="join-button">Nous contacter</Link>
      </section>
    </div>
  );
};

export default PiscinePage;