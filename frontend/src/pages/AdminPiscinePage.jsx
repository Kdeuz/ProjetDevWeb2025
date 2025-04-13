import React, { useEffect, useState } from "react";
import { getPiscineData } from '../api';
import './style.css';

export default function AdminPiscinePage() {
  const [loading, setLoading] = useState(true);
  const [piscineData, setPiscineData] = useState(null);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    bassins: [],
    cours: [],
    nombreParBassin: {}
  });

  // Fetch piscine data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    getPiscineData()
      .then(data => {
        setPiscineData(data);
        setEditData({
          bassins: [...data.bassins],
          cours: [...data.cours].map(c => ({
            ...c,
            // Ensure heure is in HH:MM format
            heure: c.heure ? c.heure.slice(0, 5) : '00:00'
          })),
          nombreParBassin: {...data.nombreParBassin}
        });
        setLoading(false);
        console.log(data.cours);
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
      bassins: [...piscineData.bassins],
      cours: [...piscineData.cours].map(c => ({
        ...c,
        heure: c.heure ? c.heure.slice(0, 5) : '00:00'
      })),
      nombreParBassin: {...piscineData.nombreParBassin}
    });
  };

  const handleSaveClick = async () => {
    try {
      setIsEditing(false);
      await updateBassins();
      await updateCours();
      await updatePoolStatus();
      fetchData(); // Refresh data after successful update
    } catch (err) {
      setError(err.message);
      setIsEditing(true); // Stay in edit mode if error occurs
    }
  };

  const updateBassins = async () => {
    const response = await fetch('http://localhost:5000/api/admin/update-bassins', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        bassins: editData.bassins.map(bassin => ({
          id: bassin.id,
          nom: bassin.nom,
          description: bassin.description,
          longueur: bassin.longueur,
          profondeur: bassin.profondeur,
        })),
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update bassins');
    }
  };

  const updateCours = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/update-cours-piscine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cours: editData.cours.map(c => ({
            id: c.id,
            nom: c.nom,
            description: c.description,
            jour: c.jour,
            heure: typeof c.heure === 'string' ? c.heure : 
                  c.heure ? formatTime(c.heure) : '00:00'
          }))
        }),
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update courses');
      }
      return await response.json();
    } catch (err) {
      setError(err.message);
      throw err;
    }
  };

  // Helper function to format time
const formatTime = (timeObj) => {
  if (!timeObj) return '00:00';
  const hours = String(timeObj.hours || 0).padStart(2, '0');
  const minutes = String(timeObj.minutes || 0).padStart(2, '0');
  return `${hours}:${minutes}`;
};


  const updatePoolStatus = async () => {
    const response = await fetch('http://localhost:5000/api/admin/update-pool-status', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombreParBassin: editData.nombreParBassin,
      }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update pool status');
    }
  };

  const handleInputChange = (section, index, field, value) => {
    const updatedData = { ...editData };
    
    if (section === 'nombreParBassin') {
      updatedData[section][field] = parseInt(value) || 0;
    } else {
      updatedData[section][index][field] = value;
    }
    
    setEditData(updatedData);
  };

  const addNewBassin = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/add-bassin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nom: 'Nouveau Bassin',
          description: '',
          longueur: 0,
          profondeur: 0
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add bassin');
      }

      fetchData(); // Refresh data
    } catch (err) {
      setError(err.message);
    }
  };

  const addNewCours = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/admin/add-cours-piscine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          nom: 'Nouveau Cours',
          description: '',
          jour: 'Lundi', // Default day (required field)
          heure: '12:00' // Default time
        })
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add course');
      }
  
      const newCourse = await response.json();
      // Update local state with the new course
      setEditData(prev => ({
        ...prev,
        cours: [...prev.cours, {
          id: newCourse.id,
          nom: newCourse.nom,
          description: newCourse.description,
          jour: newCourse.jour,
          heure: newCourse.heure
        }]
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const removeBassin = async (index) => {
    const bassinToDelete = editData.bassins[index];
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-bassin/${bassinToDelete.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete bassin');
      }
  
      // Update local state immediately
      setEditData(prev => ({
        ...prev,
        bassins: prev.bassins.filter(b => b.id !== bassinToDelete.id),
        // Also remove any status reference for this bassin
        nombreParBassin: Object.fromEntries(
          Object.entries(prev.nombreParBassin).filter(([name]) => name !== bassinToDelete.nom)
        )
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  const removeCours = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/delete-cours-piscine/${id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to delete course');
      }
  
      // Update local state by filtering out the deleted course
      setEditData(prev => ({
        ...prev,
        cours: prev.cours.filter(c => c.id !== id)
      }));
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <p>Chargement...</p>;
  if (error) return <p>Erreur: {error}</p>;
  if (!piscineData || !editData) return <p>Aucune donnée disponible</p>;

  return (
    <div className="admin-piscine-page">
      <h2 className="title">Données Piscine</h2>

      {!isEditing ? (
        <button onClick={handleEditClick} className="btn-edit">
          Modifier
        </button>
      ) : (
        <div className="edit-controls">
          <button onClick={handleSaveClick} className="btn-save">
            Enregistrer
          </button>
          <button onClick={handleCancelClick} className="btn-cancel">
            Annuler
          </button>
        </div>
      )}

      <h3 className="section-title">Bassins</h3>
      <table className="basins-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Longueur (m)</th>
            <th>Profondeur (m)</th>
            {isEditing && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {editData.bassins.map((bassin, index) => (
            <tr key={bassin.id}>
              {isEditing ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={bassin.nom}
                      onChange={(e) => handleInputChange('bassins', index, 'nom', e.target.value)}
                      placeholder="Nom du bassin"
                      className="input-field"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={bassin.description}
                      onChange={(e) => handleInputChange('bassins', index, 'description', e.target.value)}
                      placeholder="Description"
                      className="input-field"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={bassin.longueur}
                      onChange={(e) => handleInputChange('bassins', index, 'longueur', e.target.value)}
                      placeholder="Longueur"
                      className="input-field"
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={bassin.profondeur}
                      onChange={(e) => handleInputChange('bassins', index, 'profondeur', e.target.value)}
                      placeholder="Profondeur"
                      className="input-field"
                    />
                  </td>
                  <td>
                    <button onClick={() => removeBassin(index)} className="btn-delete">
                      Supprimer
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{bassin.nom}</td>
                  <td>{bassin.description}</td>
                  <td>{bassin.longueur}</td>
                  <td>{bassin.profondeur}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing && (
        <button onClick={addNewBassin} className="btn-add">
          Ajouter un bassin
        </button>
      )}

      <h3 className="section-title">Cours</h3>
      <table className="basins-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Description</th>
            <th>Jour</th>
            <th>Heure</th>
            {isEditing && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {editData.cours.map((cours, index) => (
            <tr key={cours.id}>
              {isEditing ? (
                <>
                  <td>
                    <input
                      type="text"
                      value={cours.nom}
                      onChange={(e) => handleInputChange('cours', index, 'nom', e.target.value)}
                      placeholder="Nom du cours"
                      className="input-field"
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={cours.description}
                      onChange={(e) => handleInputChange('cours', index, 'description', e.target.value)}
                      placeholder="Description"
                      className="input-field"
                    />
                  </td>
                  <td>
                    <select
                      value={cours.jour}
                      onChange={(e) => handleInputChange('cours', index, 'jour', e.target.value)}
                      className="input-field"
                    >
                      {['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'].map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input
                      type="time"
                      value={cours.heure || (editData.cours[1]?.heure || '00:00')}
                      onChange={(e) => handleInputChange('cours', index, 'heure', e.target.value)}
                      className="input-field"
                    />
                  </td>
                  <td>
                    <button onClick={() => removeCours(cours.id)} className="btn-delete">
                      Supprimer
                    </button>
                  </td>
                </>
              ) : (
                <>
                  <td>{cours.nom}</td>
                  <td>{cours.description}</td>
                  <td>{cours.jour}</td>
                  <td>{cours.heure || (editData.cours[1]?.heure || '00:00')}</td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      {isEditing && (
        <button onClick={addNewCours} className="btn-add">
          Ajouter un cours
        </button>
        
      )}
      <h3 className="section-title">Statut du Bassin</h3>
      {Object.entries(editData.nombreParBassin).map(([bassin, count]) => (
        <div key={bassin} className="status-item">
          {isEditing ? (
            <>
              <label>{bassin}:</label>
              <input
                type="number"
                value={count}
                onChange={(e) => handleInputChange('nombreParBassin', null, bassin, e.target.value)}
                className="input-field"
              />
            </>
          ) : (
            <p>{bassin}: {count} personnes</p>
          )}
        </div>
      ))}
    </div>
  );
}
  



