import React, { useState, useEffect } from 'react';
import './style.css';
import { Link } from "react-router-dom";

const MusculationPage = () => {
    const [programs, setPrograms] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5000/api/programmes')
            .then(res => res.json())
            .then(data => setPrograms(data))
            .catch(err => console.error(err));

        fetch('http://localhost:5000/api/equipements')
            .then(res => res.json())
            .then(data => setEquipmentList(data))
            .catch(err => console.error(err));
    }, []);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail) setIsSubscribed(true);
    };

    const toggleEquipment = (id) => {
        setEquipmentList(prev =>
            prev.map(eq =>
                eq.id === id ? { ...eq, disponible: !eq.disponible } : eq
            )
        );
        // Optionnel : envoyer le changement au backend ici
    };

    return (
        <div className="page musculation-page">
            {/* Header Section */}
            <header className="header">
                <h1>Musculation - Devenez Plus Fort</h1>
                <p>Transformez votre corps avec des séances intensives et un suivi personnalisé.</p>
            </header>

            {/* Program Section */}
            <section className="about">
                <h2>Nos Programmes de Musculation</h2>
                <p>
                    Que vous soyez un débutant ou un expert, nos programmes de musculation sont adaptés à tous les niveaux. Nos coachs
                    vous guideront tout au long de votre parcours pour que vous atteigniez vos objectifs.
                </p>

                <div className="program-cards">
                    {programs.map(program => (
                        <div key={program.id} className="program-card">
                            <h3>{program.titre}</h3>
                            <p>{program.description}</p>
                            <button className="program-btn">En savoir plus</button>
                        </div>
                    ))}
                </div>
            </section>

            {/* Coaching Section */}
            <section className="coaching">
                <h2>Coaching Personnalisé</h2>
                <p>
                    Nos coachs spécialisés sont là pour vous fournir un programme adapté à vos besoins. En fonction de vos objectifs
                    (force, volume, endurance), nous concevons des séances sur mesure.
                </p>
                <button className="coaching-btn">Réservez votre session</button>
            </section>

            {/* Equipment Section */}
            <section className="equipment">
                <h2>Nos Équipements</h2>
                <table className="equipment-table">
                    <thead>
                        <tr>
                            <th>Équipement</th>
                            <th>Description</th>
                            <th>Disponibilité</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equipmentList.map(equipment => (
                            <tr key={equipment.id}>
                                <td>{equipment.label}</td>
                                <td>{equipment.description}</td>
                                <td>{equipment.disponible ? 'Disponible' : 'Indisponible'}</td>
                                <td>
                                    <button onClick={() => toggleEquipment(equipment.id)}>
                                        {equipment.disponible ? 'Rendre Indisponible' : 'Rendre Disponible'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* Testimonials Section (statique) */}
            <section className="feedback">
                <h2>Ce Que Disent Nos Membres</h2>
                <div className="testimonial">
                    <p>"J'ai vu des résultats incroyables en seulement quelques semaines. Les coachs sont formidables!"</p>
                    <h4>- Hugo</h4>
                </div>
                <div className="testimonial">
                    <p>"Un endroit motivant avec de super équipements et une ambiance géniale. Je recommande vivement!"</p>
                    <h4>- Olivia</h4>
                </div>
            </section>

            {/* Membership Section */}
            <section className="membership">
                <h2>Devenez Membre</h2>
                <p>
                    Rejoignez-nous et bénéficiez d'un accès illimité à nos installations modernes, avec des coachs expérimentés pour vous
                    guider à chaque étape.
                </p>
                <Link to="/register" className="join-button">Inscription</Link>
            </section>

            {/* Newsletter Section */}
            <section className="newsletter">
                <h2>Inscrivez-vous à notre Newsletter</h2>
                <p>Restez à jour avec les dernières tendances en musculation, des astuces et des offres exclusives.</p>
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

export default MusculationPage;