import React, { useState, useEffect } from 'react';
import './style.css';
import { Link } from "react-router-dom";

const MusculationPage = () => {
    const [programs, setPrograms] = useState([]);
    const [equipmentList, setEquipmentList] = useState([]);
    const [newsletterEmail, setNewsletterEmail] = useState('');
    const [isSubscribed, setIsSubscribed] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [programRes, equipmentRes] = await Promise.all([
                    fetch('http://localhost:5000/api/programmes'),
                    fetch('http://localhost:5000/api/equipements'),
                ]);

                if (!programRes.ok || !equipmentRes.ok) {
                    throw new Error('Erreur réseau');
                }

                const programsData = await programRes.json();
                const equipmentData = await equipmentRes.json();

                setPrograms(programsData || []);
                setEquipmentList(equipmentData || []);
                setLoading(false);
                setError(null); // Clear error if data loads successfully
            } catch (err) {
                console.error("Erreur lors du chargement des données :", err);
                setError("Erreur de chargement des données.");
                setLoading(false);
            }
        };

        fetchData(); // Initial fetch

        const interval = setInterval(fetchData, 3000); // Update every 3s

        return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        if (newsletterEmail) {
            setIsSubscribed(true);
        }
    };

    return (
        <div className="page musculation-page">
            <header className="header">
                <h1>Musculation - Devenez Plus Fort</h1>
                <p>Transformez votre corps avec des séances intensives et un suivi personnalisé.</p>
            </header>

            <section className="about">
                <h2>Nos Programmes de Musculation</h2>
                <p>
                    Que vous soyez un débutant ou un expert, nos programmes sont adaptés à tous les niveaux.
                </p>

                {loading ? (
                    <p>Chargement des programmes...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <div className="program-cards">
                        {programs.map(program => (
                            <div key={program.id} className="program-card">
                                <h3>{program.titre}</h3>
                                <p>{program.description}</p>
                                <button className="program-btn">En savoir plus</button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            <section className="coaching">
                <h2>Coaching Personnalisé</h2>
                <p>
                    Nos coachs conçoivent des séances sur mesure selon vos objectifs.
                </p>
                <button className="coaching-btn">Réservez votre session</button>
            </section>

            <section className="equipment">
                <h2>Nos Équipements</h2>

                {loading ? (
                    <p>Chargement des équipements...</p>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : (
                    <table className="equipment-table">
                        <thead>
                            <tr>
                                <th>Équipement</th>
                                <th>Description</th>
                                <th>Disponibilité</th>
                            </tr>
                        </thead>
                        <tbody>
                            {equipmentList.length > 0 ? (
                                equipmentList.map(equipment => (
                                    <tr key={equipment.id}>
                                        <td>{equipment.nom}</td>
                                        <td>{equipment.description || '—'}</td>
                                        <td>{equipment.disponible ? 'Disponible' : 'Indisponible'}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3">Aucun équipement à afficher</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                )}
            </section>

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

            <section className="membership">
                <h2>Devenez Membre</h2>
                <p>
                    Rejoignez-nous et bénéficiez d'un accès illimité à nos installations modernes.
                </p>
                <Link to="/register" className="join-button">Inscription</Link>
            </section>

            <section className="newsletter">
                <h2>Inscrivez-vous à notre Newsletter</h2>
                <p>Restez à jour avec les dernières tendances et offres exclusives.</p>
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
