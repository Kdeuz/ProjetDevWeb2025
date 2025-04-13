import React, { useEffect, useState } from "react";
import { getFitnessData } from '../api';
import './style.css';

export default function AdminFitnessPage() {
  const [loading, setLoading] = useState(true);
  const [fitnessData, setFitnessData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch fitness data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getFitnessData()
      .then(data => {
        setFitnessData(data);
        setEditData({
          ...data,
          mockCoachs: [...data.mockCoachs],
          mockCours: [...data.mockCours.map(course => ({
            ...course,
            heure: course.heure // Ensure time is in correct format
          }))]
        });
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError(err.message);
        setLoading(false);
      });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setEditData({
      ...fitnessData,
      mockCoachs: [...fitnessData.mockCoachs],
      mockCours: [...fitnessData.mockCours]
    });
  };

  const handleSaveClick = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/update-fitness', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          coachs: editData.mockCoachs.map(coach => ({
            id: coach.id,
            nom: coach.nom,
            prenom: coach.prenom,
            description: coach.description
          })),
          cours: editData.mockCours.map(course => ({
            id: course.id,
            jour: course.jour,
            heure: course.heure,
            activite: course.activite
          })),
          interval: editData.interval
        }),
        credentials: 'include' // This is crucial for session cookies
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update data');
      }
  
      const result = await response.json();
      console.log(result.message);
      setIsEditing(false);
      fetchData();
    } catch (err) {
      console.error('Error updating data:', err);
      setError(err.message);
    }
  };

  const handleInputChange = (section, index, field, value) => {
    const updatedData = { ...editData };
    updatedData[section][index][field] = value;
    setEditData(updatedData);
  };

  const handleIntervalChange = (e) => {
    setEditData({
      ...editData,
      interval: e.target.value
    });
  };

  const addNewCoach = () => {
    const newCoach = {
      id: Date.now(), // Temporary ID, will be set properly on the backend
      nom: '',
      prenom: '',
      description: ''
    };
    setEditData({
      ...editData,
      mockCoachs: [...editData.mockCoachs, newCoach]
    });
  };

  const addNewCourse = () => {
    const newCourse = {
      id: null, // Temporary ID, will be set properly on the backend
      activite: '',
      jour: 'Lundi', // Default value
      heure: ''
    };
    setEditData({
      ...editData,
      mockCours: [...editData.mockCours, newCourse]
    });
  };

  const removeCoach = async (index) => {
    const coachToDelete = editData.mockCoachs[index];
  
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-coach/${coachToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete coach');
      }
  
      const updatedCoachs = [...editData.mockCoachs];
      updatedCoachs.splice(index, 1);
      setEditData({
        ...editData,
        mockCoachs: updatedCoachs
      });
  
      console.log('Coach deleted successfully');
    } catch (err) {
      console.error('Error deleting coach:', err);
      setError(err.message);
    }
  };

  const removeCourse = async (index) => {
    const courseToDelete = editData.mockCours[index];
  
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-course/${courseToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete course');
      }
  
      const updatedCourses = [...editData.mockCours];
      updatedCourses.splice(index, 1);
      setEditData({
        ...editData,
        mockCours: updatedCourses
      });
  
      console.log('Course deleted successfully');
    } catch (err) {
      console.error('Error deleting course:', err);
      setError(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;
  if (!fitnessData || !editData) return <p>Aucune donnée disponible</p>;

  return (
    <div className="admin-fitness-page">
      <h2>Données Fitness</h2>

      <div className="metadata">
        <div className="metadata-item">
          <strong>Version:</strong> {fitnessData.metadata.version}
        </div>
        <div className="metadata-item">
          <strong>Dernière mise à jour:</strong> {new Date(fitnessData.metadata.last_updated).toLocaleString()}
        </div>
        <div className="metadata-item">
          <strong>Intervalle de personnes:</strong>
          {isEditing ? (
            <input
              type="number"
              value={editData.interval}
              onChange={handleIntervalChange}
            />
          ) : (
            fitnessData.interval
          )}
        </div>
      </div>

      {!isEditing ? (
        <button onClick={handleEditClick} className="edit-button">
          Modifier
        </button>
      ) : (
        <div className="edit-controls">
          <button onClick={handleSaveClick} className="save-button">
            Enregistrer
          </button>
          <button onClick={handleCancelClick} className="cancel-button">
            Annuler
          </button>
        </div>
      )}

      {/* Section for Coaches */}
      <section className="coaches-section">
        <div className="section-header">
          <h3>Coachs ({editData.mockCoachs.length})</h3>
          {isEditing && (
            <button onClick={addNewCoach} className="add-button">
              Ajouter un coach
            </button>
          )}
        </div>
        <table className="schedule">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Prenom</th>
              <th>Description</th>
              <th>ID Coach</th>
              {isEditing && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {editData.mockCoachs.map((coach, index) => (
              <tr key={index}>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={coach.nom}
                      onChange={(e) => handleInputChange('mockCoachs', index, 'nom', e.target.value)}
                    />
                  ) : (
                    coach.nom
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={coach.prenom}
                      onChange={(e) => handleInputChange('mockCoachs', index, 'prenom', e.target.value)}
                    />
                  ) : (
                    coach.prenom
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <textarea
                      value={coach.description}
                      onChange={(e) => handleInputChange('mockCoachs', index, 'description', e.target.value)}
                    />
                  ) : (
                    coach.description || 'Aucune description disponible'
                  )}
                </td>
                <td>{coach.id}</td>
                {isEditing && (
                  <td>
                    <button onClick={() => removeCoach(index)} className="remove-button">
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section for Courses */}
      <section className="courses-section">
        <div className="section-header">
          <h3>Cours ({editData.mockCours.length})</h3>
          {isEditing && (
            <button onClick={addNewCourse} className="add-button">
              Ajouter un cours
            </button>
          )}
        </div>
        <table className="schedule">
          <thead>
            <tr>
              <th>Activité</th>
              <th>Jour</th>
              <th>Heure</th>
              <th>ID Cours</th>
              {isEditing && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {editData.mockCours.map((course, index) => (
              <tr key={index}>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={course.activite}
                      onChange={(e) => handleInputChange('mockCours', index, 'activite', e.target.value)}
                    />
                  ) : (
                    course.activite
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <select
                      value={course.jour}
                      onChange={(e) => handleInputChange('mockCours', index, 'jour', e.target.value)}
                    >
                      <option value="Lundi">Lundi</option>
                      <option value="Mardi">Mardi</option>
                      <option value="Mercredi">Mercredi</option>
                      <option value="Jeudi">Jeudi</option>
                      <option value="Vendredi">Vendredi</option>
                    </select>
                  ) : (
                    course.jour
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={course.heure}
                      onChange={(e) => handleInputChange('mockCours', index, 'heure', e.target.value)}
                    />
                  ) : (
                    course.heure
                  )}
                </td>
                <td>{course.id}</td>
                {isEditing && (
                  <td>
                    <button onClick={() => removeCourse(index)} className="remove-button">
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
