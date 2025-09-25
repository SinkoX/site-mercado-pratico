import React, { useState } from "react";
import "./CadastroUsuario.css"

function CadastroProduto() {
  const [formData, setFormData] = useState({
    nome_Usuario: "",
    email_Usuario: "",
    telefone_Usuario: "",
    cpf_Usuario: "",
    senha_Usuario: "",
    data_Nascimento_Usuario: "",
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
        <label htmlFor="nome_usuario">
          <h2>Nome Completo</h2>{" "}
        </label>
        <input
          type="text"
          id="idNomeUsuario"
          name="nome_Usuario"
          value={formData.nome_Usuario}
          onChange={handleChange}
          required
          placeholder="Digite seu Nome Completo"
        />
      </div>

      <div className="campo">
        <label htmlFor="email_Usuario">
          <h2>Email</h2>{" "}
        </label>
        <input
          type="text"
          id="idEmailUsuario"
          name="emailUsuario"
          value={formData.email_Usuario}
          onChange={handleChange}
          required
          placeholder="Digite seu email"
        />
      </div>

     <div className="campo">
        <label htmlFor="telefone_Usuario">
          <h2>Telefone</h2>{" "}
        </label>
        <input
          type="number"
          id="idTelefoneUsuario"
          name="telefoneUsuario"
          value={formData.email_Usuario}
          onChange={handleChange}
          required
          placeholder="(11)9999-9999"
        />
      </div>

      <div className="campo">
        <label htmlFor="cpf_Usuario">
          <h2>Cpf</h2>{" "}
        </label>
        <input
          type="number"
          id="idCpfUsuario"
          name="cpfUsuario"
          value={formData.cpf_Usuario}
          onChange={handleChange}
          required
          placeholder="Digite seu cpf"
        />
      </div>

      <div className="campo">
        <label htmlFor="senha">
          <h2>Senha</h2>{" "}
        </label>
        <input
          type="text"
          id="idSenhausuario"
          name="senha_Usuario"
          value={formData.senha_Usuario}
          onChange={handleChange}
          required
          placeholder="digite sua senha!"
        />
      </div>

      <div>
        <label htmlFor="data_de_nascimento">
          <h2>Data de nascimento</h2>{" "}
        </label>
        <input
          type="date"
          id="idData_de_Nascimento"
          name="Data_de_Nascimento"
          value={formData.data_Nascimento_Usuario}
          onChange={handleChange}
          required
        />
      </div>

      <button className="button" type="submit">
        <h1>Criar Conta</h1>
      </button>
    </form>
  );
}

export default CadastroProduto;
