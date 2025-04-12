const API_URL = "http://localhost:5000"; 

export async function registerUser(userData) {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", 
    body: JSON.stringify(userData),
  });
  return res.json();
}

export async function loginUser(credentials) {
  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    credentials: "include", // ✅ add this!
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
  return res.json();
}


export async function getUserData() {
  const res = await fetch(`${API_URL}/me`, {
    method: "GET",
    credentials: "include", // to include authentication cookies
  });

  if (!res.ok) {
    throw new Error('Failed to fetch user data');
  }

  return res.json();
}

// api.js
export const getPiscineData = async () => {
  const response = await fetch('/api/piscine'); // adapte l'URL à ton backend
  if (!response.ok) {
    throw new Error('Erreur de récupération des données piscine');
  }
  return await response.json(); // doit contenir { nombreBassins, cours: [], nombreParBassin }
};

export const getProgrammes = async () => {
  const res = await fetch("http://localhost:5000/api/programmes");
  return res.json();
};

export const getEquipements = async () => {
  const res = await fetch("http://localhost:5000/api/equipements");
  return res.json();
};

export const getTemoignages = async () => {
  const res = await fetch("http://localhost:5000/api/temoignages");
  return res.json();
};

export const getFitnessData = async () => {
  const response = await fetch('/api/fitness'); // 
  if (!response.ok) {
    throw new Error('Erreur de récupération des données fitness');
  }
  return await response.json(); // doit contenir { mockCoachs, mockCours, interval }
};