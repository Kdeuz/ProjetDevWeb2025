import React, { useEffect, useState } from "react";
import { getProgrammes, getEquipements } from '../api';
import './style.css';

export default function AdminMusculationPage() {
  const [loading, setLoading] = useState(true);
  const [programmesData, setProgrammesData] = useState(null);
  const [equipementsData, setEquipementsData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    programmes: [],
    equipements: []
  });

  // Fetch programmes and equipements data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    Promise.all([getProgrammes(), getEquipements()])
      .then(([programmes, equipements]) => {
        setProgrammesData(programmes);
        setEquipementsData(equipements);
        setEditData({
          programmes: [...programmes],
          equipements: [...equipements]
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
      programmes: [...programmesData],
      equipements: [...equipementsData]
    });
  };

  const handleSaveClick = async () => {
    try {
      // Update programmes
      const programmeRes = await fetch('http://localhost:5000/api/admin/update-programme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          programmes: editData.programmes.map(programme => ({
            id: programme.id,
            titre: programme.titre,
            description: programme.description
          }))
        }),
        credentials: 'include'
      });
  
      if (!programmeRes.ok) {
        const errorData = await programmeRes.json();
        throw new Error(errorData.error || 'Failed to update programmes');
      }
  
      // Update equipements
      const equipementRes = await fetch('http://localhost:5000/api/admin/update-equipement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          equipements: editData.equipements.map(equipement => ({
            id: equipement.id,
            nom: equipement.nom,
            description: equipement.description,
            disponible: equipement.disponible
          }))
        }),
        credentials: 'include'
      });
  
      if (!equipementRes.ok) {
        const errorData = await equipementRes.json();
        throw new Error(errorData.error || 'Failed to update equipements');
      }
  
      setIsEditing(false);
      fetchData();
      console.log('Mise à jour réussie');
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

  const addNewProgramme = async () => {
    const newProgramme = {
      titre: '',
      description: ''
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/admin/add-programme', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newProgramme)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout du programme');
      }
  
      console.log('Programme ajouté avec succès');
      fetchData(); // Refresh the list after adding
    } catch (err) {
      console.error('Error adding programme:', err);
      setError(err.message);
    }
  };
  
  const addNewEquipement = async () => {
    const newEquipement = {
      nom: '',
      description: '',
      disponible: true
    };
  
    try {
      const response = await fetch('http://localhost:5000/api/admin/add-equipement', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newEquipement)
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de l\'ajout de l\'équipement');
      }
  
      console.log('Équipement ajouté avec succès');
      fetchData(); // Refresh the list after adding
    } catch (err) {
      console.error('Error adding equipement:', err);
      setError(err.message);
    }
  };
  

  const removeProgramme = async (index) => {
    const programmeToDelete = editData.programmes[index];

    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-programme/${programmeToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete programme');
      }

      const updatedProgrammes = [...editData.programmes];
      updatedProgrammes.splice(index, 1);
      setEditData({
        ...editData,
        programmes: updatedProgrammes
      });

      console.log('Programme deleted successfully');
    } catch (err) {
      console.error('Error deleting programme:', err);
      setError(err.message);
    }
  };

  const removeEquipement = async (index) => {
    const equipementToDelete = editData.equipements[index];

    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-equipement/${equipementToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete equipement');
      }

      const updatedEquipements = [...editData.equipements];
      updatedEquipements.splice(index, 1);
      setEditData({
        ...editData,
        equipements: updatedEquipements
      });

      console.log('Equipement deleted successfully');
    } catch (err) {
      console.error('Error deleting equipement:', err);
      setError(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;
  if (!programmesData || !equipementsData || !editData) return <p>Aucune donnée disponible</p>;

  return (
    <div className="admin-musculation-page">
      <h2>Données Musculation</h2>

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

      {/* Section for Programmes */}
      <section className="programmes-section">
        <div className="section-header">
          <h3>Programmes de Musculation ({editData.programmes.length})</h3>
          {isEditing && (
            <button onClick={addNewProgramme} className="add-button">
              Ajouter un programme
            </button>
          )}
        </div>
        <table className="schedule">
          <thead>
            <tr>
              <th>Titre</th>
              <th>Description</th>
              <th>ID Programme</th>
              {isEditing && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {editData.programmes.map((programme, index) => (
              <tr key={index}>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={programme.titre}
                      onChange={(e) => handleInputChange('programmes', index, 'titre', e.target.value)}
                    />
                  ) : (
                    programme.titre
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <textarea
                      value={programme.description}
                      onChange={(e) => handleInputChange('programmes', index, 'description', e.target.value)}
                    />
                  ) : (
                    programme.description || 'Aucune description disponible'
                  )}
                </td>
                <td>{programme.id}</td>
                {isEditing && (
                  <td>
                    <button onClick={() => removeProgramme(index)} className="remove-button">
                      Supprimer
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Section for Equipements */}
      <section className="equipements-section">
        <div className="section-header">
          <h3>Equipements de Musculation ({editData.equipements.length})</h3>
          {isEditing && (
            <button onClick={addNewEquipement} className="add-button">
              Ajouter un équipement
            </button>
          )}
        </div>
        <table className="schedule">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Description</th>
              <th>Disponible</th>
              <th>ID Equipement</th>
              {isEditing && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {editData.equipements.map((equipement, index) => (
              <tr key={index}>
                <td>
                  {isEditing ? (
                    <input
                      type="text"
                      value={equipement.nom}
                      onChange={(e) => handleInputChange('equipements', index, 'nom', e.target.value)}
                    />
                  ) : (
                    equipement.nom
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <textarea
                      value={equipement.description}
                      onChange={(e) => handleInputChange('equipements', index, 'description', e.target.value)}
                    />
                  ) : (
                    equipement.description || 'Aucune description disponible'
                  )}
                </td>
                <td>
                  {isEditing ? (
                    <input
                      type="checkbox"
                      checked={equipement.disponible}
                      onChange={(e) => handleInputChange('equipements', index, 'disponible', e.target.checked)}
                    />
                  ) : (
                    equipement.disponible ? 'Disponible' : 'Non disponible'
                  )}
                </td>
                <td>{equipement.id}</td>
                {isEditing && (
                  <td>
                    <button onClick={() => removeEquipement(index)} className="remove-button">
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
