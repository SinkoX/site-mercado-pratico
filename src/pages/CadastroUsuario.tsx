import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import "./CadastroUsuario.css"; // CSS atualizado

interface FormDataUsuario {
  nomeUsuario: string;
  emailUsuario: string;
  senhaUsuario: string;
  telefoneUsuario: string;
  cpfUsuario: string;
}

export default function CadastroUsuarioAdmPage() {
  const [formData, setFormData] = useState<FormDataUsuario>({
    nomeUsuario: "",
    emailUsuario: "",
    senhaUsuario: "",
    telefoneUsuario: "",
    cpfUsuario: "",
  });
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "tipoUsuarioId" ? Number(value) : value,
    }));
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setFormData({ ...formData, cpfUsuario: value });
  };

  const handleTelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
    setFormData({ ...formData, telefoneUsuario: value });
  };

  const toggleSenha = () => setShowSenha((prev) => !prev);

  function limparCpf(cpf: string) {
    return cpf.replace(/\D/g, ""); // remove tudo que não for número
  }

  function limparTelefone(telefone: string) {
    return telefone.replace(/\D/g, "");
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const usuarioLimpo = {
      ...formData,
      cpfUsuario: limparCpf(formData.cpfUsuario),
      telefoneUsuario: limparTelefone(formData.telefoneUsuario),
    };

    try {
      const response = await api.post("/usuario/cadastro", usuarioLimpo);
      const novoUsuario = response.data;

      localStorage.setItem("usuarioId", novoUsuario.idUsuario.toString());
      alert("Usuário cadastrado com sucesso!");
      navigate("/");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="cadastro-usuario-page">
      <div className="home-icon" onClick={() => navigate("/")}>
        <FaHome />
      </div>

      <form className="formulario-pag-cadastro-usuario" onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Seja Bem-Vindo</h1>
          <div className="subtitulo">
            <h5>Cadastre-se e aproveite as oportunidades imperdíveis</h5>
          </div>
        </div>

        <div className="campos-pag-cadastro-usuario">
          <div className="campo-pag-cadastro-usuario">
            <label>Nome Completo</label>
            <input
              type="text"
              name="nomeUsuario"
              value={formData.nomeUsuario}
              onChange={handleChange}
              required
              placeholder="Nome completo"
            />
          </div>

          <div className="campo-pag-cadastro-usuario">
            <label>Email</label>
            <input
              type="email"
              name="emailUsuario"
              value={formData.emailUsuario}
              onChange={handleChange}
              required
              placeholder="email@gmail.com"
            />
          </div>

          <div className="campo-pag-cadastro-usuario senha-campo">
            <label>Senha</label>
            <div className="senha-wrapper">
              <input
                type={showSenha ? "text" : "password"}
                name="senhaUsuario"
                value={formData.senhaUsuario}
                onChange={handleChange}
                required
                placeholder="Senha"
              />
              <span className="icon-btn" onClick={toggleSenha}>
                {showSenha ? <FaEye /> : <FaEyeSlash />}
              </span>
            </div>
          </div>

          <div className="campo-pag-cadastro-usuario">
            <label>Telefone</label>
            <input
              type="tel"
              name="telefoneUsuario"
              value={formData.telefoneUsuario}
              onChange={handleTelChange}
              required
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="campo-pag-cadastro-usuario">
            <label>CPF</label>
            <input
              type="text"
              name="cpfUsuario"
              value={formData.cpfUsuario}
              onChange={handleCpfChange}
              required
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        <button type="submit" className="btn-cadastro-usuario">
          Cadastrar
        </button>

        <div className="conta">
          <p className="login-link">
            Possui uma conta?{" "}
            <span onClick={() => navigate("/login")} className="logar">
              Login
            </span>
          </p>
        </div>
      </form>
    </div>
  );
}
