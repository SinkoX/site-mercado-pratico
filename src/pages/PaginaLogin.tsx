import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import type { User } from "../hooks/useAuth";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import "./PaginaLogin.css";

interface LoginProps {
  loginFn: (user: User) => void;
}

const PaginaLogin: React.FC<LoginProps> = ({ loginFn }) => {
  const navigate = useNavigate();
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    emailUsuario: "",
    senhaUsuario: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const toggleSenha = () => setShowSenha((prev) => !prev);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Enviar payload que o backend espera: { email, senha }
      const payload = {
        email: formData.emailUsuario,
        senha: formData.senhaUsuario,
      };

      const res = await api.post("/auth/login", payload, {
        withCredentials: true, 
      });

      if (!res.data || !res.data.idUsuario) {
        setError("Email ou senha inválidos!");
        setLoading(false);
        return;
      }

      // Monta o objeto User para o contexto
      const user: User = {
        ...res.data,
        enderecoUsuario: res.data.endereco || [],
      };

      loginFn(user);
      navigate("/");
    } catch (err: any) {
      console.error(err);

      if (err.response && err.response.status === 401) {
        setError("Email ou senha incorretos.");
      } else {
        setError("Erro ao conectar com o servidor. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pagina-login-container">
      <div className="home-icon" onClick={() => navigate("/")}>
        <FaHome />
      </div>

      <div className="login-top">
        <h1 className="market-name">Mercado Prático</h1>
        <p className="market-slogan">Seu mercado de confiança desde 1975</p>
      </div>

      <form
        className={`login-form ${error ? "shake" : ""}`}
        onSubmit={handleSubmit}
      >
        <h2 className="login-title">Bem-vindo de volta!</h2>
        <p className="login-subtitle">
          Entre em sua conta para continuar comprando
        </p>

        <div className="input-group">
          <label htmlFor="emailUsuario">Email</label>
          <input
            type="email"
            id="emailUsuario"
            name="emailUsuario"
            value={formData.emailUsuario}
            onChange={handleChange}
            placeholder="Digite seu email"
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="senhaUsuario">Senha</label>
          <div className="senha-wrapper">
            <input
              type={showSenha ? "text" : "password"}
              id="senhaUsuario"
              name="senhaUsuario"
              value={formData.senhaUsuario}
              onChange={handleChange}
              placeholder="Digite sua senha"
              required
            />
            <span className="icon-btn" onClick={toggleSenha}>
              {showSenha ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>
        </div>

        <p className="forgot-password" onClick={() => navigate("/redefinir-senha")}>
    Esqueci minha senha
  </p>


        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button" disabled={loading}>
          {loading ? <span className="loader"></span> : "Entrar"}
        </button>

        <p className="cadastro-text">
          Não tem uma conta?{" "}
          <span
            className="link-cadastro"
            onClick={() => navigate("/cadastro/usuario")}
          >
            Cadastre-se
          </span>
        </p>
      </form>
    </div>
  );
};

export default PaginaLogin;
