import React, { useState } from "react";
import "./CadastroEndereco.css";

interface FormData {
  cep: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
}

function CadastroEndereco() {
  const [formData, setFormData] = useState<FormData>({
    cep: "",
    numero: "",
    rua: "",
    bairro: "",
    cidade: "",
  });

  // Atualiza os campos normais
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // CEP com máscara e busca automática
  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); // só números

    // limita a 8 dígitos
    if (value.length > 8) value = value.slice(0, 8);

    // aplica a máscara 00000-000
    const maskedCep = value.replace(/^(\d{5})(\d)/, "$1-$2");

    setFormData((prev) => ({ ...prev, cep: maskedCep }));

    // quando o CEP estiver completo (8 dígitos), busca o endereço
    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Endereço cadastrado:", formData);
    alert("Endereço cadastrado com sucesso!");
  };

  return (
    <div className="cadastro-endereco-page">
      <form className="form" onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Cadastro de Endereço</h1>
          <div className="subtitulo">
            <h5>Digite seu CEP para preencher automaticamente</h5>
          </div>
        </div>

        <div className="campos">
          <div className="campo">
            <label htmlFor="cep">
              <h2>CEP</h2>
            </label>
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

          <div className="campo">
            <label htmlFor="rua">
              <h2>Rua</h2>
            </label>
            <input
              type="text"
              id="rua"
              name="rua"
              value={formData.rua}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="bairro">
              <h2>Bairro</h2>
            </label>
            <input
              type="text"
              id="bairro"
              name="bairro"
              value={formData.bairro}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="cidade">
              <h2>Cidade</h2>
            </label>
            <input
              type="text"
              id="cidade"
              name="cidade"
              value={formData.cidade}
              onChange={handleChange}
              required
            />
          </div>

          <div className="campo">
            <label htmlFor="numero">
              <h2>Número</h2>
            </label>
            <input
              type="text"
              id="numero"
              name="numero"
              value={formData.numero}
              onChange={handleChange}
              required
              placeholder="Digite o número da casa"
            />
          </div>
        </div>

        <button className="button" type="submit">
          <h1>Cadastrar</h1>
        </button>
      </form>
    </div>
  );
}

export default CadastroEndereco;
