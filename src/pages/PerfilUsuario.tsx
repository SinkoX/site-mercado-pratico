import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import "./PerfilUsuario.css";

function PerfilUsuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) {
    return <p>Carregando perfil...</p>;
  }

  return (
    <div className="perfil-page">
      <div className="profile-header">
        <div className="avatar">
          <img
            src="C:\\Users\\DEV-2D\\Pictures\\Screenshots\\Captura de tela 2025-09-30 132559.png"
            alt="Avatar"
          />
        </div>
      </div>

      <div className="form">
        <div className="info-item">
          <label className="info-label">Nome</label>
          <span className="info-box">{user.nomeUsuario}</span>
        </div>
        <div className="info-item">
          <label className="info-label">Email</label>
          <span className="info-box">{user.emailUsuario}</span>
        </div>
        <div className="info-item">
          <label className="info-label">Telefone</label>
          <span className="info-box">{user.telefoneUsuario}</span>
        </div>
        <div className="info-item">
          <label className="info-label">CPF</label>
          <span className="info-box">{user.cpfUsuario}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default PerfilUsuario;
