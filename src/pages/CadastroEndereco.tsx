import React, { useState } from "react";
import "./CadastroEndereco.css"

function CadastroEndereco() {
  const [formData, setFormData] = useState({
    cep_Endereco: "",
    numero_casa_Endereco: "",
    rua_Endereco: "",
    bairro_Endereco: "",
    cidade_Endereco: "",
  });

  const handleChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  return (
    <form className="form">
      <div className="titulo">
        <h1>Seja Bem-Vindo!</h1>
        <div className="subtitulo">
            <h5>Cadastre-se e aproveite as oportunidades imperdíveis</h5>
        </div>
      </div>
      <div className="campo">
        <label htmlFor="cep_Endereco">
          <h2>CEP</h2>{" "}
        </label>
        <input
          type="number"
          id="idCepEndereco"
          name="cep_Endereco"
          value={formData.cep_Endereco}
          onChange={handleChange}
          required
          placeholder="Digite seu Cep"
        />
      </div>

      <div className="campo">
        <label htmlFor="numeroCasa">
          <h2>Numero da Casa</h2>{" "}
        </label>
        <input
          type="text"
          id="idNumeroCasa"
          name="numeroCasa"
          value={formData.numero_casa_Endereco}
          onChange={handleChange}
          required
          placeholder="Digite o numero de sua casa"
        />
      </div>

          <div className="campo">
        <label htmlFor="ruaEndereco">
          <h2>Rua</h2>{" "}
        </label>
        <input
          type="text"
          id="idRuaEndereco"
          name="ruaEndereco"
          value={formData.rua_Endereco}
          onChange={handleChange}
          required
          placeholder="Digite sua Rua"
        />
      </div>

     <div className="campo">
        <label htmlFor="bairroEndereco">
          <h2>Bairro</h2>{" "}
        </label>
        <input
          type="text"
          id="idBairroEndereco"
          name="bairroEndereco"
          value={formData.bairro_Endereco}
          onChange={handleChange}
          required
          placeholder="Digite seu Endereco"
        />
      </div>

      <div className="campo">
        <label htmlFor="cidadeEndereco">
          <h2>Cidade</h2>{" "}
        </label>
        <input
          type="text"
          id="idCidadeEndereco"
          name="cidadeEndereco"
          value={formData.cidade_Endereco}
          onChange={handleChange}
          required
          placeholder="Digite sua Cidade"
        />
      </div>

      <button className="button" type="submit">
        <h1>Cadastrar</h1>
      </button>
    </form>
  );
}

export default CadastroEndereco;
