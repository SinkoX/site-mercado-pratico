import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import "./PaginaLogin.css"; 
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";

const RedefinirSenha: React.FC = () => {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<"solicitar" | "redefinir">("solicitar");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [novaSenha, setNovaSenha] = useState("");
  const [showSenha, setShowSenha] = useState(false);

  // Solicitar reset
  const handleSolicitar = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/redef/solicitar-reset", { email });
      setSuccess("Código enviado para seu email!");
      setEtapa("redefinir");
    } catch (err: any) {
      console.error(err);
      setError("Erro ao solicitar redefinição. Verifique o email.");
    } finally {
      setLoading(false);
    }
  };

  // Redefinir senha
  const handleRedefinir = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      await api.post("/redef/redefinir-senha", { codigo, novaSenha });
      setSuccess("Senha redefinida com sucesso!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      console.error(err);
      setError("Código inválido ou erro ao redefinir senha.");
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
        <p className="market-slogan">Redefinição de senha</p>
      </div>

      {etapa === "solicitar" && (
        <form className="login-form" onSubmit={handleSolicitar}>
          <h2>Solicitar redefinição</h2>
          <div className="input-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu email"
              required
            />
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Enviando..." : "Enviar código"}
          </button>
        </form>
      )}

      {etapa === "redefinir" && (
        <form className="login-form" onSubmit={handleRedefinir}>
          <h2>Redefinir senha</h2>

          <div className="input-group">
            <label>Código</label>
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              placeholder="Digite o código recebido"
              required
            />
          </div>

          <div className="input-group">
            <label>Nova senha</label>
            <div className="senha-wrapper">
              <input
                type={showSenha ? "text" : "password"}
                value={novaSenha}
                onChange={(e) => setNovaSenha(e.target.value)}
                placeholder="Digite sua nova senha"
                required
              />
              <span className="icon-btn" onClick={() => setShowSenha(prev => !prev)}>
  {showSenha ? <FaEye /> : <FaEyeSlash />}
</span>
            </div>
          </div>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Redefinindo..." : "Redefinir senha"}
          </button>
        </form>
      )}
    </div>
  );
};

export default RedefinirSenha;
