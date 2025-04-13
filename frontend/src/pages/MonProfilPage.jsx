import React, { useState, useEffect } from 'react';
import { getUserData, unsubscribeFromCourse, updateUserAvatar, updateUserRecords, updateUserProfile} from '../api';
import './style.css';


// Avatar image paths
const Avatar1 = '/assets/images/avatar1.png';
const Avatar2 = '/assets/images/avatar2.png';
const Avatar3 = '/assets/images/avatar3.png';
const Avatar4 = '/assets/images/avatar4.png';
const Avatar5 = '/assets/images/avatar5.png';

const avatarOptions = [
  { id: 1, src: Avatar1, alt: "Fitness Male" },
  { id: 2, src: Avatar2, alt: "Fitness Female" },
  { id: 3, src: Avatar3, alt: "Bodybuilder" },
  { id: 4, src: Avatar4, alt: "Yoga Practitioner" },
  { id: 5, src: Avatar5, alt: "Swimmer" },
];
const MonProfilPage = () => {
  const [userData, setUserData] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null); // Track the alert type (success or error)
  const [error, setError] = useState(null);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [newRecord, setNewRecord] = useState('');
  const [showRecordForm, setShowRecordForm] = useState(false);


  const fetchUserData = async () => {
    try {
      setLoading(true);
      const data = await getUserData();
      setUserData(data);
      setFormData({
        email: data.email || '',
        username: data.username || '',
        nom: data.nom || '',
        prenom: data.prenom || '',
        age: data.age || '',
        telephone: data.telephone || '',
        password: ''
      });
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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // Prepare data to send - exclude password if empty
    const dataToSend = { ...formData };
    if (!dataToSend.password) {
      delete dataToSend.password;
    } else {
      // Only validate password if it's not empty
      if (dataToSend.password.length < 6) {
        setAlertMessage("Le mot de passe doit contenir au moins 6 caractères.");
        setAlertType("error");
        return; // Stop the form submission
      }
    }
  
    try {
      const res = await updateUserProfile(dataToSend);
      if (res.success) {
        setAlertMessage("Profil mis à jour avec succès !");
        setAlertType("success");
        await fetchUserData();
      } else {
        setAlertMessage(res.error || 'Échec de la mise à jour du profil');
        setAlertType("error");
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour du profil:', err);
      setAlertMessage('Erreur lors de la mise à jour du profil');
      setAlertType("error");
    }
  };
  

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

  const handleUpdateRecords = async () => {
    try {
      // Optimistic UI update - update the frontend immediately
      setUserData(prev => ({
        ...prev,
        records: newRecord
      }));
      
      // Then make the API call
      const response = await updateUserRecords(newRecord);
      
      // If API fails, revert the change
      if (!response.success) {
        setUserData(prev => ({
          ...prev,
          records: prev.records // Revert to previous value
        }));
        setError('Failed to update records');
      } else {
        // On success, optionally refresh data from server
        await fetchUserData();
      }
    } catch (err) {
      console.error('Error updating records:', err);
      setError('Failed to update records');
      // Revert the optimistic update
      setUserData(prev => ({
        ...prev,
        records: prev.records
      }));
    } finally {
      setNewRecord('');
      setShowRecordForm(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="error-message">{error}</div>;

  const { 
    abonnement = 'Non spécifié', 
    mes_records = null, 
    courses = [], 
    avatar_id = '',
  } = userData || {};
  
  const selectedAvatar = avatarOptions.find(avatar => avatar.id === avatar_id) || avatarOptions[0];
  

  return (
    <div className="page monprofil-page">
  <header className="profile-header">
    <p>Bienvenue sur votre page personnelle !</p>
  </header>

  <section className="profile-info">
    <h3>Mes Informations</h3>
    {alertMessage && (
      <div className="alert error-alert">
        {alertMessage}
      </div>
    )}
    <form onSubmit={handleFormSubmit} className="profile-form">
      <div className="avatar-section">
        <img 
          src={selectedAvatar.src} 
          alt={selectedAvatar.alt} 
          className="profile-avatar"
          onClick={() => setShowAvatarModal(true)}
        />
        <button 
          className="change-avatar-btn"
          type="button"
          onClick={() => setShowAvatarModal(true)}
        >
          Changer d'avatar
        </button>
      </div>
      <label>Email:</label>
      <input type="email" name="email" value={formData.email} onChange={handleFormChange} />

      <label>Nom:</label>
      <input type="text" name="nom" value={formData.nom} onChange={handleFormChange} />

      <label>Prénom:</label>
      <input type="text" name="prenom" value={formData.prenom} onChange={handleFormChange} />

      <label>Username:</label>
      <input type="text" name="username" value={formData.username} onChange={handleFormChange} />

      <label>Âge:</label>
      <input type="number" name="age" value={formData.age} onChange={handleFormChange} />

      <label>Téléphone:</label>
      <input type="text" name="telephone" value={formData.telephone} onChange={handleFormChange} />

      <label>Mot de passe (laisser vide si inchangé):</label>
      <input type="password" name="password" value={formData.password} onChange={handleFormChange} />

      <button type="submit">Mettre à jour</button>
    </form>
  </section>

  <section className="mon-abonnement">
    <h3>Mon Abonnement</h3>
    <p><strong>Type d'abonnement:</strong> {abonnement}</p>
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

      <section className="records">
        <h3>Mes Records</h3>
        {mes_records ? (
          <div className="records-display">
            <p><strong>Vos records actuels:</strong> {mes_records}</p>
          </div>
        ) : (
          <p>Aucun record enregistré.</p>
        )}
        
        {showRecordForm ? (
          <div className="record-form">
            <textarea
              value={newRecord}
              onChange={(e) => setNewRecord(e.target.value)}
              placeholder="Entrez vos nouveaux records..."
            />
            <div className="record-form-buttons">
              <button onClick={handleUpdateRecords} className="save-record-btn">
                Enregistrer
              </button>
              <button 
                onClick={() => setShowRecordForm(false)} 
                className="cancel-record-btn"
              >
                Annuler
              </button>
            </div>
          </div>
        ) : (
          <button 
            className="update-record-btn"
            onClick={() => setShowRecordForm(true)}
          >
            {mes_records ? 'Modifier mes records' : 'Ajouter des records'}
          </button>
        )}
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