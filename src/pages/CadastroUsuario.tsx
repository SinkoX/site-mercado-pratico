import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FaEye, FaEyeSlash } from "react-icons/fa"; 
import "./CadastroUsuario.css";

interface FormData {
  nomeUsuario: string;
  emailUsuario: string;
  senhaUsuario: string;
  telefoneUsuario: string;
  cpfUsuario: string;
}

const CadastroUsuario: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    nomeUsuario: "",
    emailUsuario: "",
    senhaUsuario: "",
    telefoneUsuario: "",
    cpfUsuario: "",
  });

  const [showSenha, setShowSenha] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
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
      telefoneUsuario: limparTelefone(formData.telefoneUsuario),
      cpfUsuario: limparCpf(formData.cpfUsuario),
    };

    try {
      const response = await api.post("/usuario/cadastro", usuarioLimpo);

      const novoUsuario = response.data;
      localStorage.setItem("usuarioId", novoUsuario.idUsuario);
      alert("Usuário cadastrado com sucesso!");
      navigate("/cadastro/endereco");
    } catch (error) {
      console.error("Erro ao cadastrar:", error);
      alert("Erro ao cadastrar usuário.");
    }
  };

  return (
    <div className="cadastro-usuario-page">
      <form className="form" onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Seja Bem-Vindo!</h1>
          <div className="subtitulo">
            <h5>Cadastre-se e aproveite as oportunidades imperdíveis</h5>
          </div>
        </div>

        <div className="campos">
          <div className="campo">
            <label htmlFor="idNomeUsuario">
              <h2>Nome Completo</h2>
            </label>
            <input
              type="text"
              id="idNomeUsuario"
              name="nomeUsuario"
              value={formData.nomeUsuario}
              onChange={handleChange}
              required
              placeholder="Digite seu nome completo"
            />
          </div>

          <div className="campo">
            <label htmlFor="idEmailUsuario">
              <h2>Email</h2>
            </label>
            <input
              type="email"
              id="idEmailUsuario"
              name="emailUsuario"
              value={formData.emailUsuario}
              onChange={handleChange}
              required
              placeholder="email@gmail.com"
            />
          </div>

          <div className="campo senha-campo">
            <label htmlFor="idSenhaUsuario">
              <h2>Senha</h2>
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

          <div className="campo">
            <label htmlFor="idTelefoneUsuario">
              <h2>Telefone</h2>
            </label>
            <input
              type="tel"
              id="idTelefoneUsuario"
              name="telefoneUsuario"
              value={formData.telefoneUsuario}
              onChange={handleTelChange}
              maxLength={15}
              required
              placeholder="(00) 00000-0000"
            />
          </div>

          <div className="campo">
            <label htmlFor="idCpfUsuario">
              <h2>CPF</h2>
            </label>
            <input
              type="text"
              id="idCpfUsuario"
              name="cpfUsuario"
              value={formData.cpfUsuario}
              onChange={handleCpfChange}
              maxLength={14}
              required
              placeholder="000.000.000-00"
            />
          </div>
        </div>

        <button className="button" type="submit">
          <h1>Cadastrar</h1>
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
};

export default CadastroUsuario;
