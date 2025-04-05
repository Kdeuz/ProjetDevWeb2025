import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AdminPage from "./pages/AdminPage"; // Import de la page admin

function App() {
  return (
    <Router>
      <nav>
        <Link to="/register">Inscription</Link> |{" "}
        <Link to="/login">Connexion</Link> |{" "}
        <Link to="/admin">Admin</Link> {/* Lien vers la page Admin */}
      </nav>
      <Routes>
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/admin" element={<AdminPage />} /> {/* Route pour la page Admin */}
      </Routes>
    </Router>
  );
}

export default App;
