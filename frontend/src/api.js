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
  const response = await fetch('http://localhost:5000/api/fitness-data');
  
  if (!response.ok) {
    throw new Error('Erreur de récupération des données fitness');
  }
  
  const data = await response.json(); // Parses the response JSON
  
  // Destructuring the relevant data from the response
  const { coachs, cours, stats, metadata } = data;

  return {
    mockCoachs: coachs,
    mockCours: cours,
    interval: stats.personnes,
    metadata: metadata // Contains last_updated and version
  };
};

export const getPiscineData = async () => {
  const response = await fetch('http://localhost:5000/api/piscine-data');
  
  if (!response.ok) {
    throw new Error('Erreur de récupération des données piscine');
  }

  const data = await response.json();
  
  if (!data.success) {
    throw new Error(data.error || 'Erreur inconnue');
  }

  return {
    cours: data.data.cours,
    bassins: data.data.bassins,  // Added bassins data
    nombreBassins: data.data.nombreBassins,
    nombreParBassin: data.data.nombreParBassin,
    totalCours: data.data.stats.total_cours
  };
};


