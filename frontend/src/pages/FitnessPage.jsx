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

/*   useEffect(() => {

// Simule des données de coachs (à remplacer par appel backend)
        const mockCoachs = [
            {
                id: 1,
                nom: "Silvester Stallone",
                description: "Expert en musculation et nutrition. Jean vous aidera à construire votre force et à optimiser votre alimentation."
            },
            {
                id: 2,
                nom: "Marie Curie",
                description: "Spécialiste en yoga et bien-être. Marie vous guidera vers un équilibre parfait entre corps et esprit."
            },
            {
                id: 3,
                nom: "Paul Martin",
                description: "Coach cardio et endurance. Avec Paul, améliorez votre condition physique et repoussez vos limites."
            },
            {
                id: 4,
                nom: "Emma Bernard",
                description: "Instructrice de Pilates et stretching. Emma vous aidera à renforcer votre corps tout en améliorant votre souplesse."
            }
        ];
        setCoachs(mockCoachs);
    }, []);

    // Simule des données de planning de cours
    useEffect(() => {
        const mockCours = [
            { id: 1, jour: "Lundi", heure: "18:00", activite: "Yoga" },
            { id: 2, jour: "Mardi", heure: "19:00", activite: "Cardio" },
            { id: 3, jour: "Mercredi", heure: "20:00", activite: "Musculation" },
            { id: 4, jour: "Jeudi", heure: "18:30", activite: "HIIT" },
            { id: 5, jour: "Vendredi", heure: "19:00", activite: "Pilates" },
            { id: 6, jour: "Samedi", heure: "10:00", activite: "Bootcamp" },
            { id: 7, jour: "Dimanche", heure: "11:00", activite: "Méditation" }
        ];
        setCours(mockCours);
    }, []);
    // Simule une fluctuation du nombre de personnes en salle
    useEffect(() => {
        const interval = setInterval(() => {
            setPeopleCount((prevCount) => Math.max(10, prevCount + Math.floor(Math.random() * 5 - 2)));
        }, 3000);

        // TODO: Remplacer ce comportement par une valeur récupérée via une API réelle si besoin
        return () => clearInterval(interval);
    }, []);
*/

//On commence par récupérer les données de l'API
// On utilise useEffect pour charger les données au démarrage du composant

useEffect(() => {
    const fetchData = async () => {
        try {
            const data = await getFitnessData();
            setCoachs(data.coachs || []);
            setCours(data.cours || []);
            setPeopleCount(data.stats?.total_participants || 0);
        } catch (error) {
            console.error("Erreur de chargement des données fitness :", error);
        }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000); // Mise à jour toutes les 3s

    return () => clearInterval(interval);
}, []);

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
                    {coachs.map((coach) => (
                        <div className="coach" key={coach.id}>
                            <span className="coach-icon">👤</span>
                            <h3>{coach.nom_complet}</h3>
                            <p>{coach.description}</p>
                        </div>
                    ))}
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
                        {cours.map((cours) => (
                            <tr key={cours.id}>
                                <td>{cours.jour}</td>
                                <td>{cours.heure}</td>
                                <td>{cours.activite}</td>
                            </tr>
                        ))}
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