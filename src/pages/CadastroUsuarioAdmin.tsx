import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FaEye, FaEyeSlash, FaHome } from "react-icons/fa";
import "./CadastroUsuarioAdmin.css"; // CSS atualizado

interface TipoUsuario {
  idTipoUsuario: number;
  nomeTipoUsuario: string;
}

interface FormDataUsuario {
  nomeUsuario: string;
  emailUsuario: string;
  senhaUsuario: string;
  telefoneUsuario: string;
  cpfUsuario: string;
  tipoUsuarioId?: number;
}

export default function CadastroUsuarioAdmPage() {
  const [formData, setFormData] = useState<FormDataUsuario>({
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
  

  const toggleSenha = () => setShowSenha(prev => !prev);


  function limparCpf(cpf: string) {
    return cpf.replace(/\D/g, "");
  }

  function limparTelefone(telefone: string) {
    return telefone.replace(/\D/g, "");
  }

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
      tipoUsuario: { idTipoUsuario: formData.tipoUsuarioId }
    };

    try {
      const response = await api.post("/usuario/cadastro", usuarioLimpo);
      const novoUsuario = response.data;

      localStorage.setItem("usuarioId", novoUsuario.idUsuario.toString());
      alert("Usuário cadastrado com sucesso!");
      navigate("/cadastro/endereco");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="cadastro-usuario-adm-page">
      <div className="home-icon" onClick={() => navigate("/")}>
        <FaHome />
      </div>

      <form className="formulario-pag-cadastro-usuario-adm" onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Cadastro de Usuário</h1>
          <div className="subtitulo">
            <h5>Preencha os dados do novo usuário</h5>
          </div>
        </div>

        <div className="campos-pag-cadastro-usuario-adm">
          <div className="campo-pag-cadastro-usuario-adm">
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

          <div className="campo-pag-cadastro-usuario-adm">
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

          <div className="campo-pag-cadastro-usuario-adm senha-campo">
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

          <div className="campo-pag-cadastro-usuario-adm">
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

          <div className="campo-pag-cadastro-usuario-adm">
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

          <div className="campo-pag-cadastro-usuario-adm">
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

        <button type="submit" className="btn-cadastro-usuario-adm">Cadastrar</button>
      </form>
    </div>
  );
}
