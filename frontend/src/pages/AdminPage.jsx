import React, { useState } from "react";

// Fonction pour appeler l'API Flask et générer un code
async function generateCode() {
  const res = await fetch("http://localhost:5000/admin/generate_code", {
    method: "POST",
  });
  return res.json();
}

export default function AdminPage() {
  const [code, setCode] = useState(null);
  const [message, setMessage] = useState("");

  const handleGenerateCode = async () => {
    setMessage("Génération en cours...");
    const result = await generateCode();
    if (result.message) {
      setMessage(`Code généré avec succès : ${result.code}`);
      setCode(result.code);
    } else {
      setMessage(`Erreur : ${result.error}`);
    }
  };

  return (
    <div>
      <h2>Page Admin - Générer un Code</h2>
      <button onClick={handleGenerateCode}>Générer un Code</button>
      {message && <p>{message}</p>}
      {code && (
        <div>
          <h3>Code généré :</h3>
          <p>{code}</p>
        </div>
      )}
    </div>
  );
}
