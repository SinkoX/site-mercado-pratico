import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { User } from "../hooks/useAuth";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import "./PaginaLogin.css";

interface LoginProps {
  loginFn: (user: User) => void; // salva usuário no contexto global
}

const PaginaLogin: React.FC<LoginProps> = ({ loginFn }) => {
  const navigate = useNavigate();
  const [showSenha, setShowSenha] = useState(false);

  const [formData, setFormData] = useState({
    emailUsuario: "",
    senhaUsuario: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  
  const toggleSenha = () => setShowSenha((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/usuario/login", formData);
      const user: User = res.data;

      if (!user) {
        alert("Email ou senha inválidos!");
        return;
      }

      loginFn(user);
      localStorage.setItem("usuarioLogado", JSON.stringify(user));
      navigate("/perfil");
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      alert("Email ou senha incorretos.");
    }
  };

  return (
    <div className="login-page">
      <div className="home-icon" onClick={() => navigate("/")}>
      <FaHome />
    </div>
      <div className="top-part-login">
        <h1 className="nome-mercado">Mercado Prático</h1>
        <p className="mensagem">Seu mercado de confiança desde 1975</p>
      </div>

      <form className="form" onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Bem-vindo de Volta!</h1>
          <div className="subtitulo">
            <h5>Entre em sua conta para continuar comprando</h5>
          </div>
        </div>

        <div className="campos">
          <div className="campo">
            <label htmlFor="emailUsuario">Email</label>
            <input
              type="email"
              id="idEmailUsuario"
              name="emailUsuario"
              value={formData.emailUsuario}
              onChange={handleChange}
              required
              placeholder="Digite seu email"
            />
          </div>


          <div className="campo senha-campo">
            <label htmlFor="senhaUsuario">
              Senha
            </label>
            <div className="senha-wrapper">
              <input
                type={showSenha ? "text" : "password"}
                id="idSenhaUsuario"
                name="senhaUsuario"
                value={formData.senhaUsuario}
                onChange={handleChange}
                required
                placeholder="Digite sua senha"
              />
              <span
                className="icon-btn"
                onClick={toggleSenha}
                tabIndex={-1} // pra não atrapalhar a navegação
              >
                {showSenha ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>
        </div>

        <button className="button" type="submit">
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
