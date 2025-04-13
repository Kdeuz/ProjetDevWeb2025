import React, { useEffect, useState } from 'react';

const DeleteUserPage = () => {
  const [utilisateurs, setUtilisateurs] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [message, setMessage] = useState('');

  const BASE_URL = 'http://localhost:5000';

  // Récupérer tous les utilisateurs
  const recupererUtilisateurs = async () => {
    try {
      setChargement(true);
      setMessage(''); 
      const res = await fetch(`${BASE_URL}/api/admin/get-users`);
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          errorData.error || 'Échec de la récupération des utilisateurs'
        );
      }
      
      const data = await res.json();
      
      
      const validUsers = data.filter(user => user?.id);
      setUtilisateurs(validUsers);
      
    } catch (err) {
      console.error("Fetch error:", err);
      setMessage(err.message || 'Échec du chargement des utilisateurs.');
    } finally {
      setChargement(false);
    }
  };

  // Supprimer un utilisateur par ID
  const supprimerUtilisateur = async (idUtilisateur) => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/delete-user/${idUtilisateur}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Échec de la suppression de l’utilisateur');
      
      setMessage(`Utilisateur avec l'ID ${idUtilisateur} supprimé avec succès.`);
      recupererUtilisateurs(); // recharger la liste après la suppression
    } catch (err) {
      console.error(err);
      setMessage(`Échec de la suppression de l'utilisateur avec l'ID ${idUtilisateur}.`);
    }
  };

  useEffect(() => {
    recupererUtilisateurs(); // Initial fetch when the page is loaded
  }, []);

  if (chargement) return <p>Chargement des utilisateurs...</p>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Page de suppression d'utilisateur</h1>
      {message && <p className="mb-4 text-blue-600">{message}</p>}
      <table className="schedule">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">ID</th>
            <th className="p-2 border">Nom d'utilisateur</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {utilisateurs.map(utilisateur => (
            <tr key={utilisateur.id} className="border-t">
              <td className="p-2 border">{utilisateur.id}</td>
              <td className="p-2 border">{utilisateur.username}</td>
              <td className="p-2 border">{utilisateur.email}</td>
              <td className="p-2 border">
                <button
                  onClick={() => supprimerUtilisateur(utilisateur.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                >
                  Supprimer
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DeleteUserPage;
