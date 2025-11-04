// src/pages/CadastroUsuarioAdmin.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";

import Footer from "../components/Footer";
import "./CadastroUsuarioAdmin.css";

interface TipoUsuario {
  idTipoUsuario: number;
  nomeTipoUsuario: string;
}

interface FormData {
  nomeUsuario: string;
  emailUsuario: string;
  senhaUsuario: string;
  telefoneUsuario: string;
  cpfUsuario: string;
  tipoUsuarioId?: number; // id do tipo selecionado
}

export default function CadastroUsuarioAdmin() {
  const [formData, setFormData] = useState<FormData>({
    nomeUsuario: "",
    emailUsuario: "",
    senhaUsuario: "",
    telefoneUsuario: "",
    cpfUsuario: "",
    tipoUsuarioId: undefined,
  });

  const [tipos, setTipos] = useState<TipoUsuario[]>([]);
  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();

  // Busca tipos de usuário
  useEffect(() => {
    api.get("/tipos-usuario")
      .then(res => setTipos(res.data))
      .catch(err => console.error(err));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "tipoUsuarioId" ? Number(value) : value
    }));
  };

  const toggleSenha = () => setShowSenha(prev => !prev);

  const limparCpf = (cpf: string) => cpf.replace(/\D/g, "");
  const limparTelefone = (tel: string) => tel.replace(/\D/g, "");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.tipoUsuarioId) {
      alert("Selecione um tipo de usuário!");
      return;
    }

    const usuarioLimpo = {
      ...formData,
      cpfUsuario: limparCpf(formData.cpfUsuario),
      telefoneUsuario: limparTelefone(formData.telefoneUsuario),
      tipoUsuario: { idTipoUsuario: formData.tipoUsuarioId } // envia objeto com idTipoUsuario
    };

    try {
      const response = await api.post("/usuario/cadastro", usuarioLimpo);
      const novoUsuario = response.data;

      localStorage.setItem("usuarioId", novoUsuario.idUsuario.toString());
      alert("Usuário cadastrado com sucesso!");
      navigate("/cadastro/endereco"); // redireciona para endereço
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="cadastro-usuario-admin-page">
     
      <div className="home-icon" onClick={() => navigate("/")}>
        <FaHome />
      </div>
      <form className="form" onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Cadastro de Usuário</h1>
          <div className="subtitulo">
            <h5>Preencha os dados do novo usuário</h5>
          </div>
        </div>

        <div className="campos">
          <div className="campo">
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

          <div className="campo">
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

          <div className="campo senha-campo">
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

          <div className="campo">
            <label>Telefone</label>
            <input
              type="tel"
              name="telefoneUsuario"
              value={formData.telefoneUsuario}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, telefoneUsuario: limparTelefone(e.target.value) }))
              }
              required
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="campo">
            <label>CPF</label>
            <input
              type="text"
              name="cpfUsuario"
              value={formData.cpfUsuario}
              onChange={(e) =>
                setFormData(prev => ({ ...prev, cpfUsuario: limparCpf(e.target.value) }))
              }
              required
              placeholder="000.000.000-00"
            />
          </div>

          <div className="campo">
            <label>Tipo de Usuário</label>
            <select
              name="tipoUsuarioId"
              value={formData.tipoUsuarioId || ""}
              onChange={handleChange}
              required
            >
              <option value="" disabled>Selecione</option>
              {tipos.map(tipo => (
                <option key={tipo.idTipoUsuario} value={tipo.idTipoUsuario}>
                  {tipo.nomeTipoUsuario}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button type="submit" className="button">
          Cadastrar
        </button>
      </form>
      <Footer />
    </div>
  );
}
