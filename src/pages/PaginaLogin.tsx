import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PaginaLogin.css";

function PaginaLogin() {
  const navigate = useNavigate();

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
    <div className="login-page">
      <div className="top-part-login">
        <h1 className="nome-mercado">Mercado Prático</h1>
        <p className="mensagem">Seu mercado de confiança desde 1975</p>
      </div>

      {/* Formulário */}
      <form className="form" onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Bem-vindo de Volta!</h1>
          <div className="subtitulo">
            <h5>Entre em sua conta para continuar comprando</h5>
          </div>
        </div>

        <div className="campos">
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
        </div>

        <button className="button" type="submit" onClick={() => navigate("/")}>
          Entrar
        </button>
        
        <div className="conta">
          <p className="cadastro-link">
            Não tem uma conta?{" "}
            <span
              onClick={() => navigate("/cadastro/usuario")}
              className="cadastrar-se"
            >
              Cadastre-se
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}

export default PaginaLogin;
