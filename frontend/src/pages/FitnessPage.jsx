import React, { useState, useEffect } from 'react';
import './style.css';
import { Link } from "react-router-dom";
import { getFitnessData } from '../api';

const FitnessPage = () => {
    const [peopleCount, setPeopleCount] = useState(0);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [coachs, setCoachs] = useState([]);
    const [cours, setCours] = useState([]);
    const [loading, setLoading] = useState(true); // Loading state to manage data fetching state
    const [error, setError] = useState(null); // Error state to handle errors during data fetch

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getFitnessData();
                console.log('Fetched data:', data);  // Log fetched data for debugging

                // Ensure proper structure of data before setting state
                setCoachs(data.mockCoachs || []);
                setCours(data.mockCours || []);
                setPeopleCount(data.interval || 0);  // Corrected to match the correct data key
                setLoading(false);  // Data is loaded, stop the loading state
            } catch (error) {
                console.error("Erreur de chargement des données fitness :", error);
                setError("Erreur de chargement des données.");  // Set error message
                setLoading(false);  // Stop loading even on error
            }
        };

        fetchData();  // Initial fetch

        const interval = setInterval(fetchData, 3000); // Fetch data every 3 seconds to keep it updated in real time

        // Clean up the interval when component unmounts
        return () => clearInterval(interval);
    }, []); // Empty dependency array ensures this effect runs once when the component mounts

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail) {
            setIsSubscribed(true);
        }
    };

    return (
        <div className="page fitness-page">
            <header className="header">
                <h1>Bienvenue à l'Espace Fitness</h1>
                <p>Votre santé, notre priorité. Rejoignez-nous pour un voyage vers un mode de vie plus sain et plus heureux.</p>
            </header>

            <section className="about">
                <h2>À Propos de Nous</h2>
                <p>
                    L'Espace Fitness est bien plus qu'une simple salle de sport. C'est un lieu où la communauté, la motivation et l'excellence se rencontrent. 
                    Avec des équipements de pointe, des coachs certifiés et une variété de cours adaptés à tous les niveaux, nous nous engageons à vous aider à atteindre vos objectifs.
                </p>
                <p>
                    Que vous soyez débutant ou athlète confirmé, notre mission est de vous offrir un environnement accueillant et stimulant pour vous dépasser.
                </p>
            </section>

            <section className="coachs">
                <h2>Nos Coachs</h2>
                <p>Rencontrez notre équipe de coachs passionnés et expérimentés, prêts à vous guider à chaque étape de votre parcours.</p>
                <div className="coach-list">
                    {loading ? (
                        <p>Chargement des coachs...</p>
                    ) : error ? (
                        <p>{error}</p>
                    ) : (
                        coachs.map((coach) => (
                            <div className="coach" key={coach.id}>
                                <span className="coach-icon">👤</span>
                                <h3>{coach.nom} {coach.prenom}</h3>
                                <p>{coach.description}</p>
                            </div>
                        ))
                    )}
                </div>
            </section>

            <section className="calendar">
                <h2>Planning des Cours</h2>
                <p>Découvrez notre planning hebdomadaire et trouvez les cours qui vous conviennent le mieux.</p>
                <table className="schedule">
                    <thead>
                        <tr>
                            <th>Jour</th>
                            <th>Heure</th>
                            <th>Activité</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan="3">Chargement des cours...</td></tr>
                        ) : error ? (
                            <tr><td colSpan="3">{error}</td></tr>
                        ) : (
                            cours.map((coursItem) => (
                                <tr key={coursItem.id}>
                                    <td>{coursItem.jour}</td>
                                    <td>{coursItem.heure}</td>
                                    <td>{coursItem.activite}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </section>

            <section className="real-time">
                <h2>Personnes dans l'espace Fitness</h2>
                <p>Actuellement : <span className="people-count">{peopleCount}</span> personnes. Rejoignez-nous pour une séance dynamique et motivante !</p>
            </section>

            <section className="testimonials">
                <h2>Témoignages</h2>
                <p>Découvrez ce que nos membres disent de nous :</p>
                <div className="testimonial">
                    <p>"Un endroit incroyable pour rester en forme ! Les coachs sont très professionnels et toujours à l'écoute."</p>
                    <h4>- Alice</h4>
                </div>
                <div className="testimonial">
                    <p>"J'adore les cours de yoga ici. Une ambiance parfaite pour se détendre et se recentrer."</p>
                    <h4>- Marc</h4>
                </div>
                <div className="testimonial">
                    <p>"Les équipements sont modernes et bien entretenus. Je recommande vivement à tous mes amis !"</p>
                    <h4>- Sophie</h4>
                </div>
                <div className="testimonial">
                    <p>"Le planning des cours est varié et les coachs sont toujours motivants. Une expérience 5 étoiles !"</p>
                    <h4>- Julien</h4>
                </div>
            </section>

            <section className="membership">
                <h2>Devenez Membre</h2>
                <p>Rejoignez notre communauté et profitez d'un accès illimité à nos installations, cours et événements exclusifs.</p>
                <ul>
                    <li>Accès illimité à toutes les installations</li>
                    <li>Réductions sur les événements spéciaux</li>
                    <li>Coaching personnalisé disponible</li>
                </ul>
                <Link to="/register" className="join-button">Inscrivez-vous !</Link>
            </section>

            <section className="newsletter">
                <h2>Inscrivez-vous à notre Newsletter</h2>
                <p>Recevez des conseils de fitness, des offres exclusives et les dernières nouvelles directement dans votre boîte mail.</p>
                {isSubscribed ? (
                    <p>Merci de vous être inscrit à notre newsletter !</p>
                ) : (
                    <form onSubmit={handleNewsletterSubmit}>
                        <input
                            type="email"
                            placeholder="Votre adresse email"
                            value={newsletterEmail}
                            onChange={(e) => setNewsletterEmail(e.target.value)}
                        />
                        <button type="submit">S'inscrire</button>
                    </form>
                )}
            </section>
        </div>
    );
};

export default FitnessPage;
