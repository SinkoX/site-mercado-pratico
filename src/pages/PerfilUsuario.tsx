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

  // Caso não haja usuário logado
  if (!user) {
    return <p>Carregando perfil...</p>;
  }

  return (
    <div className="perfil-page">
      <div className="profile-header">
        <div className="avatar">
          {/* Troque pelo caminho de uma imagem válida ou URL */}
          <img
            src="/avatar-placeholder.png"
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
