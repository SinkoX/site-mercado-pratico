import React, { useState } from "react";
import "./PerfilUsuario.css";

function PerfilUsuario() {
  const [userData] = useState({
    nome: "Nome completo",
    email: "email@email.com",
    telefone: "(11)99999-9999",
    cpf: "000.000.000-00",
    cep: "00000-000"
  });

  const handleLogout = () => {
    console.log("Logout realizado");
    alert("Logout realizado com sucesso!");
  };

  return (
    <div className="profile-container">
      <div className="profile-header">  
        <div className="avatar">
            <img src="C:\Users\DEV-2D\Pictures\Screenshots\Captura de tela 2025-09-30 132559.png" alt="" />
        </div>
      </div>
      <div className="form">
        <div className="info-item">
          <label className="info-label">Name</label>
          <span className="info-box">{userData.nome}</span>
        </div>
        <div className="info-item">
          <label className="info-label">Email</label>
          <span className="info-box">{userData.email}</span>
        </div>
        <div className="info-item">
          <label className="info-label">Telefone</label>
          <span className="info-box">{userData.telefone}</span>
        </div>
        <div className="info-item">
          <label className="info-label">CPF</label>
          <span className="info-box">{userData.cpf}</span>
        </div>
        <div className="info-item">
          <label className="info-label">CEP</label>
          <span className="info-box">{userData.cep}</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default PerfilUsuario;
