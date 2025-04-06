import React, { useState } from 'react';
import './style.css';

const MonProfilPage = () => {
  const [profileImage, setProfileImage] = useState(null);
  const [courses, setCourses] = useState([
    { name: 'Natation Avancée', completed: false },
    { name: 'Aquagym', completed: true },
    { name: 'Plongée Sous-Marine', completed: false },
  ]);
  const [performance, setPerformance] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  return (
    <div className="page monprofil-page">
      <header className="profile-header">
        <p>Bienvenue sur votre page personnelle ! Mettez à jour vos informations et suivez vos progrès.</p>
      </header>

      <section className="profile-info">
        <h3>Mes Informations</h3>
        <div className="profile-details">
          <p><strong>Nom:</strong> John Doe</p>
          <p><strong>Email:</strong> john@example.com</p>
          <p><strong>Abonnement:</strong> 6 mois</p>
          <p><strong>QR Code pour entrée:</strong></p>
          <img src="/path-to-qrcode.png" alt="QR Code" />
        </div>

        <div className="profile-photo">
          <h4>Photo de Profil</h4>
          {profileImage ? (
            <img src={profileImage} alt="Profile" className="profile-img" />
          ) : (
            <p>Pas de photo de profil sélectionnée.</p>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="upload-btn"
          />
        </div>
      </section>

      <section className="performances">
        <h3>Mes Performances</h3>
        {performance ? (
          <p>Dernière performance: {performance}</p>
        ) : (
          <p>Aucune performance enregistrée.</p>
        )}
        <button className="update-performance-btn">Mettre à jour les performances</button>
      </section>

      <section className="courses">
        <h3>Mes Cours</h3>
        {courses.length > 0 ? (
          <ul className="course-list">
            {courses.map((course, index) => (
              <li key={index} className={course.completed ? 'completed' : 'in-progress'}>
                {course.name} - {course.completed ? 'Terminé' : 'En cours'}
              </li>
            ))}
          </ul>
        ) : (
          <p>Aucun cours suivi pour le moment.</p>
        )}
        <button className="add-course-btn">Ajouter un Cours</button>
      </section>

      <section className="cool-options">
        <h3>Options Cool</h3>
        <p>Faites partie d'une communauté active et bénéficiez de fonctionnalités personnalisées pour suivre vos progrès.</p>
        <button className="option-btn">Rejoindre la communauté</button>
        <button className="option-btn">Consulter l'historique</button>
      </section>
    </div>
  );
};

export default MonProfilPage;
