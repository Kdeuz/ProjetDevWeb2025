import React, { useState, useEffect } from 'react';
import { getUserData, unsubscribeFromCourse, updateUserAvatar } from '../api';
import './style.css';

// Avatar image paths
const Avatar1 = '/assets/images/avatar1.png';
const Avatar2 = '/assets/images/avatar2.png';
const Avatar3 = '/assets/images/avatar3.png';
const Avatar4 = '/assets/images/avatar4.png';
const Avatar5 = '/assets/images/avatar5.png';

const MonProfilPage = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  const avatarOptions = [
    { id: 1, src: Avatar1, alt: "Fitness Male" },
    { id: 2, src: Avatar2, alt: "Fitness Female" },
    { id: 3, src: Avatar3, alt: "Bodybuilder" },
    { id: 4, src: Avatar4, alt: "Yoga Practitioner" },
    { id: 5, src: Avatar5, alt: "Swimmer" },
  ];

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await getUserData();
      setUserData(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError('Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleUnsubscribe = async (courseId, courseType) => {
    try {
      await unsubscribeFromCourse(courseId, courseType);
      await fetchUserData();
    } catch (err) {
      console.error('Error unsubscribing:', err);
      setError('Failed to unsubscribe from course');
    }
  };

  const handleAvatarSelect = async (avatarId) => {
    try {
      // Optimistic update - update UI immediately
      setUserData(prev => ({
        ...prev,
        avatar_id: avatarId,
        avatar_url: `/assets/images/avatar${avatarId}.png`
      }));
      
      // Then make the API call
      const response = await updateUserAvatar(avatarId);
      
      // If API fails, revert the change
      if (!response.success) {
        setUserData(prev => ({
          ...prev,
          avatar_id: prev.avatar_id, // Revert to previous value
          avatar_url: prev.avatar_url
        }));
        setError('Failed to update avatar');
      }
    } catch (err) {
      console.error('Error updating avatar:', err);
      setError('Failed to update avatar');
      // Revert the optimistic update
      setUserData(prev => ({
        ...prev,
        avatar_id: prev.avatar_id,
        avatar_url: prev.avatar_url
      }));
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const { 
    nom = 'Nom utilisateur', 
    prenom = 'Email non renseigné', 
    subscription = 'Non spécifié', 
    performance = null, 
    courses = [], 
    avatar_id = '',  // Use avatar_id instead of avatarId
  } = userData || {};
  
  const selectedAvatar = avatarOptions.find(avatar => avatar.id === avatar_id) || avatarOptions[0];
  

  return (
    <div className="page monprofil-page">
      <header className="profile-header">
        <p>Bienvenue sur votre page personnelle !</p>
      </header>

      <section className="profile-info">
        <h3>Mes Informations</h3>
        <div className="profile-details">
          <div className="avatar-section">
            <img 
              src={selectedAvatar.src} 
              alt={selectedAvatar.alt} 
              className="profile-avatar"
              onClick={() => setShowAvatarModal(true)}
            />
            <button 
              className="change-avatar-btn"
              onClick={() => setShowAvatarModal(true)}
            >
              Changer d'avatar
            </button>
          </div>
          <p><strong>Nom:</strong> {nom}</p>
          <p><strong>Email:</strong> {prenom}</p>
          <p><strong>Abonnement:</strong> {subscription}</p>
        </div>
      </section>

      {/* Avatar Selection Modal */}
      {showAvatarModal && (
        <div className="avatar-modal">
          <div className="modal-content">
            <h3>Choisissez votre avatar</h3>
            <div className="avatar-grid">
              {avatarOptions.map(avatar => (
                <div 
                  key={avatar.id}
                  className={`avatar-option ${avatar.id === avatar_id ? 'selected' : ''}`}
                  onClick={() => handleAvatarSelect(avatar.id)}
                >
                  <img src={avatar.src} alt={avatar.alt} />
                </div>
              ))}
            </div>
            <button 
              className="close-modal-btn"
              onClick={() => setShowAvatarModal(false)}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      <section className="performances">
        <h3>Mes Performances</h3>
        {performance ? (
          <p>Dernière performance: {performance}</p>
        ) : (
          <p>Aucune performance enregistrée.</p>
        )}
        <button className="update-performance-btn">Mettre à jour les performances</button>
      </section>

      <section className="calendar">
        <h3>Mes Cours Inscrits</h3>
        <p>Voici la liste des cours auxquels vous êtes inscrit :</p>
        <table className="schedule">
          <thead>
            <tr>
              <th>Type</th>
              <th>Jour</th>
              <th>Heure</th>
              <th>Activité / Description</th>
              <th>ID Cours</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course, index) => {
                const {
                  type = 'inconnu',
                  details = {},
                  id = 'N/A',
                  course_id = id || 'N/A'
                } = course;

                const displayedId = course_id || id || 'N/A';

                let description = '-';
                if (type === 'fitness') {
                  description = details.activite || '-';
                } else if (type === 'piscine') {
                  description = `${details.nom || ''} ${details.description || ''}`.trim() || '-';
                } else if (type === 'muscu') {
                  description = `${details.titre || ''} ${details.description || ''}`.trim() || '-';
                }

                return (
                  <tr key={`${type}-${displayedId}-${index}`}>
                    <td>{type.charAt(0).toUpperCase() + type.slice(1)}</td>
                    <td>{details.jour || '-'}</td>
                    <td>{details.heure || '-'}</td>
                    <td>{description}</td>
                    <td>{displayedId}</td>
                    <td>
                      <button 
                        onClick={() => handleUnsubscribe(displayedId, type)}
                        className="unsubscribe-btn"
                      >
                        Se désinscrire
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">Aucun cours inscrit.</td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default MonProfilPage;
