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
  try {
    // Utilisez l'URL absolue avec le port 5000
    const response = await fetch('http://localhost:5000/api/piscine-data', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    // Debug crucial
    console.log('Status:', response.status);
    const text = await response.text();
    console.log('Response text:', text.substring(0, 100));
    
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return JSON.parse(text);
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
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

