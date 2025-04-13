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

  const data = await res.json();

  console.log('User Courses:', data.courses);      // Log user courses
  console.log('User Avatar ID:', data.avatar_id);  // Log avatar ID
  console.log('Mes Records:', data.mes_records);   // Log mes_records (the personal notes)

  const avatarUrl = data.avatar_url;

  // Return everything including avatarUrl and mes_records
  return { ...data, avatarUrl, mes_records: data.mes_records || '' };
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

export async function unsubscribeFromCourse(courseId, courseType) {
  const res = await fetch(`${API_URL}/api/delete-subscription`, {
    method: "DELETE",
    credentials: "include",
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      course_id: courseId,
      course_type: courseType
    })
  });

  if (!res.ok) {
    throw new Error('Failed to unsubscribe from course');
  }

  return await res.json();
}

export async function updateUserAvatar(avatarId) {
  try {
    const res = await fetch(`${API_URL}/update-avatar`, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ avatar_id: avatarId })
    });

    if (!res.ok) {
      throw new Error('Failed to update avatar');
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error updating avatar:', error);
    return { success: false, error: error.message };
  }
}

export async function updateUserRecords(mesRecords) {
  try {
    const res = await fetch(`${API_URL}/update-records`, {
      method: "POST",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ mes_records: mesRecords })
    });

    if (!res.ok) {
      throw new Error('Failed to update records');
    }

    const data = await res.json();
    return { success: true, data };
  } catch (error) {
    console.error('Error updating records:', error);
    return { success: false, error: error.message };
  }
}

export async function updateUserProfile(updatedData) {
  const response = await fetch(`${API_URL}/update-profile`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include', // <- THIS is important
    body: JSON.stringify(updatedData),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to update profile');
  }

  return data;
}


