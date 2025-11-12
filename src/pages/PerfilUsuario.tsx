import React from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import "./PerfilUsuario.css";

function PerfilUsuario() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Funções de formatação
  const formatTelefone = (telefone: string) => {
    if (!telefone) return "";
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1)$2-$3");
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return "";
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  const formatCEP = (cep: string) => {
    if (!cep) return "";
    return cep.replace(/^(\d{5})(\d{3})$/, "$1-$2");
  };

  if (!user) return <p>Carregando perfil...</p>;

  console.log(user);

  return (
    <div className="perfil-page">
      <div className="home-icon" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </div>

      <div className="profile-header">
        <div className="avatar">
          <img src="../src/assets/images/icones/iconeAvatar.jpg" alt="Avatar" />
        </div>
        <h2>{user.nomeUsuario}</h2>
      </div>

      <div className="form">
        <div className="info-item">
          <label className="info-label">Email</label>
          <span className="info-box">{user.emailUsuario}</span>
        </div>

        <div className="info-item">
          <label className="info-label">Telefone</label>
          <span className="info-box">
            {formatTelefone(user.telefoneUsuario)}
          </span>
        </div>

        <div className="info-item">
          <label className="info-label">CPF</label>
          <span className="info-box">{formatCPF(user.cpfUsuario)}</span>
        </div>

        <div className="info-item">
          <label className="info-label">CEP</label>
          <span className="info-box">
            {formatCEP(user.enderecoUsuario?.[0]?.cep)}
          </span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default PerfilUsuario;
