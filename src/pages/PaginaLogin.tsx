import React, { useState } from "react";
import "./PaginaLogin.css";

function PaginaLogin() {
  const [formData, setFormData] = useState({
    email_Usuario: "",
    senha_Usuario: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Dados de login:", formData);
  };

  return (
    <div className="container">
      <div className="header">
        <div className="logo-section">
          <h1 className="nome_">Mercado Prático</h1>
          <p className="mensagem">Seu mercado de confiança desde ...</p>
        </div>
      </div>

      {/* Formulário */}
      <form className="form" onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Bem-vindo de Volta!</h1>
          <div className="subtitulo">
            <h5>Entre em sua conta para continuar comprando</h5>
          </div>
        </div>

        <div className="campo">
          <label htmlFor="email_Usuario">Email</label>
          <input
            type="email"
            id="idEmailUsuario"
            name="email_Usuario"
            value={formData.email_Usuario}
            onChange={handleChange}
            required
            placeholder="Digite seu email"
          />
        </div>

        <div className="campo">
          <label htmlFor="senha">Senha</label>
          <input
            type="password"
            id="idSenhausuario"
            name="senha_Usuario"
            value={formData.senha_Usuario}
            onChange={handleChange}
            required
            placeholder="Digite sua senha!"
          />
        </div>

        <div className="conta">
          Não possui uma conta? <span className="cadastrar-se">Cadastrar-se</span>
        </div>
        
        <button className="button" type="submit">
          Entrar
        </button>
      </form>
    </div>
  );
}

export default PaginaLogin;