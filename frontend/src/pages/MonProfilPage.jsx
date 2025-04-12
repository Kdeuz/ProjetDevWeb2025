import React, { useState, useEffect } from 'react';
import { getUserData } from '../api'; // import the function to fetch user data
import './style.css';

const MonProfilPage = () => {
  const [userData, setUserData] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [courses, setCourses] = useState([]);
  const [performance, setPerformance] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const data = await getUserData();
        setUserData(data);
        setProfileImage(data?.profileImage || null);
        setCourses(data?.courses || []);
        setPerformance(data?.performance || null);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  if (!userData) {
    return <div>Loading...</div>; // Show loading message while data is being fetched
  }

  return (
    <div className="page monprofil-page">
      <header className="profile-header">
        <p>Bienvenue sur votre page personnelle ! </p>
      </header>

      <section className="profile-info">
        <h3>Mes Informations</h3>
        <div className="profile-details">
          <p><strong>Nom:</strong> {userData?.nom || 'Nom utilisateur'}</p>
          <p><strong>Email:</strong> {userData?.prenom || 'Email non renseigné'}</p>
          <p><strong>Abonnement:</strong> {userData?.subscription || 'Non spécifié'}</p>
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
    </div>
  );
};

export default MonProfilPage;
