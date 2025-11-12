import React, { useState } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import "./CadastroEndereco.css";
import { FaArrowLeft } from "react-icons/fa";

interface FormDataEnderecoUsuario {
  cep: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
  idUsuario?: number;
}

function CadastroEnderecoUsuario() {
  const [formData, setFormData] = useState<FormDataEnderecoUsuario>({
    cep: "",
    numero: "",
    rua: "",
    bairro: "",
    cidade: "",
  });

  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 8) value = value.slice(0, 8);
    const maskedCep = value.replace(/^(\d{5})(\d)/, "$1-$2");
    setFormData((prev) => ({ ...prev, cep: maskedCep }));

    if (value.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${value}/json/`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const data = await response.json();

        if (data.erro) {
          alert("CEP não encontrado!");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
        }));
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar o CEP. Tente novamente.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const idUsuario = localStorage.getItem("usuarioId");
      if (!idUsuario) {
        alert("Usuário não identificado! Faça login novamente.");
        return;
      }

      const response = await api.post(
        `/enderecos/usuario/${idUsuario}`,
        formData
      );

      console.log("Endereço cadastrado:", response.data);
      alert("Endereço cadastrado com sucesso!");

      setFormData({ cep: "", numero: "", rua: "", bairro: "", cidade: "" });
      navigate("/gerenciar/usuarios");
    } catch (error) {
      console.error("Erro ao cadastrar endereço:", error);
      alert("Erro ao cadastrar o endereço. Tente novamente.");
    }
  };

  return (
    <div className="cadastro-endereco-page">
      <div className="back-icon" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </div>

      <form
        className="formulario-pag-cadastro-endereco"
        onSubmit={handleSubmit}
      >
        <div className="titulo">
          <h1>Cadastro de Endereço</h1>
        </div>

        <div className="campos-pag-cadastro-endereco">
          <div className="campo-pag-cadastro-endereco">
            <label>CEP</label>
            <input
              type="text"
              id="cep"
              name="cep"
              value={formData.cep}
              onChange={handleCepChange}
              required
              placeholder="00000-000"
              maxLength={9}
            />
          </div>

          <div className="campo-pag-cadastro-endereco">
            <label>Rua</label>
            <input
              type="text"
              id="rua"
              name="rua"
              value={formData.rua}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo-pag-cadastro-endereco">
            <label>Bairro</label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo-pag-cadastro-endereco">
            <label>Cidade</label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo-pag-cadastro-endereco">
            <label>Número</label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <button type="submit" className="btn-cadastro-endereco">
          Cadastrar
        </button>
      </form>
    </div>
  );
}

export default CadastroEnderecoUsuario;
