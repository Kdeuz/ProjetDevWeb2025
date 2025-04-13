import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css"; 

const Subscribe = () => {
  const [course, setCourse] = useState(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkLoginStatus = async () => {
      try {
        const response = await fetch("http://localhost:5000/check-auth", {
          credentials: 'include',
        });
        setUserLoggedIn(response.ok);
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setLoading(false);
      }
    };

    checkLoginStatus();

    // Fetch course data
    const stored = JSON.parse(localStorage.getItem("selectedCourse"));
    if (stored) {
      fetch(`http://localhost:5000/api/courses/${stored.type}/${stored.id}`)
        .then((res) => {
          if (!res.ok) throw new Error("Failed to fetch course");
          return res.json();
        })
        .then((data) => setCourse(data))
        .catch((err) => {
          console.error("Erreur :", err);
          showAlert("Failed to load course details", "error");
        });
    }
  }, []);

  const showAlert = (message, type = "success") => {
    const alertElement = document.createElement("div");
    alertElement.className = `alert alert-${type}`;
    alertElement.textContent = message;
    
    document.body.appendChild(alertElement);
    
    setTimeout(() => {
      alertElement.classList.add("fade-out");
      setTimeout(() => alertElement.remove(), 500);
    }, 3000);
  };

  const subscribeToCourse = async (id, type) => {
    try {
      const response = await fetch("http://localhost:5000/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ course_id: id, course_type: type }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error("Erreur lors de l'inscription");

      const result = await response.json();
      showAlert(result.message || "Inscription réussie !");
    } catch (err) {
      console.error("Erreur :", err);
      showAlert("Échec de l'inscription", "error");
    }
  };
  

  if (loading) return <p className="loading">Chargement...</p>;
  if (!course) return <p className="error">Cours non trouvé</p>;

  return (
    <div className="subscribe-container">
      <h2>Détails du Cours ({course.type})</h2>
      
      <table className="course-details">
        <tbody>
          {Object.entries(course.details).map(([key, value]) => (
            <tr key={key}>
              <td className="detail-label">{key}:</td>
              <td className="detail-value">{value?.toString() || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {userLoggedIn ? (
        <button 
          className="subscribe-btn"
          onClick={() => subscribeToCourse(course.id, course.type)}
        >
          Confirmer l'inscription
        </button>
      ) : (
        <div className="login-required">
          <p>Vous devez être membre pour vous inscrire à ce cours</p>
          <button 
            className="login-btn"
            onClick={() => navigate("/login")}
          >
            Se connecter
          </button>
        </div>
      )}
    </div>
  );
};

export default Subscribe;
