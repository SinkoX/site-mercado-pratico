import React, { useState } from "react";
import "./CadastroProduto.css";

function CadastroProduto() {
  const [formData, setFormData] = useState({
    nome_produto: "",
    quantidade_produto: "",
    categoria_produto: "",
    preco_produto: "",
    data_validade_produto: "",
    imagem_produto: "",
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
        <h1>Cadastro Produto</h1>
      </div>
      <div className="campo">
        <label htmlFor="nome_produto">
          <h2>Nome do Produto</h2>{" "}
        </label>
        <input
          type="text"
          id="idProduto"
          name="nome_Produto"
          value={formData.nome_produto}
          onChange={handleChange}
          required
          placeholder="Digite o Nome do Produto"
        />
      </div>

      <div className="campo">
        <label htmlFor="quantidade_produto">
          <h2>Quantidade</h2>{" "}
        </label>
        <input
          type="number"
          id="idQuantidadeProduto"
          name="quantidade_produto"
          value={formData.quantidade_produto}
          onChange={handleChange}
          required
          placeholder="Digite a Quantidade do Produto"
        />
      </div>

      <div className="campo">
        <label htmlFor="categoria_produto">
          <h2>Categoria</h2>
        </label>
        <select
          id="idCategoria"
          name="categoria_produto"
          value={formData.categoria_produto}
          onChange={handleChange}
          required
          className="select-box"
        >
          <option value="">Categoria do Produto</option>
          <option value=""></option>
          <option value=""></option>
          <option value=""></option>
          <option value=""></option>
        </select>
      </div>

      <div className="campo">
        <label htmlFor="preco_produto">
          <h2>Preço</h2>{" "}
        </label>
        <input
          type="number"
          id="idPreco"
          name="preco_produto"
          value={formData.preco_produto}
          onChange={handleChange}
          required
          placeholder="$00,00"
        />
      </div>

      <div className="campo">
        <label htmlFor="data_Validade">
          <h2>Data de Validade</h2>{" "}
        </label>
        <input
          type="date"
          id="idDataValidade"
          name="data_validade"
          value={formData.data_validade_produto}
          onChange={handleChange}
          required
          placeholder="digite a data de validade do produto"
        />
      </div>

      <div>
        <label htmlFor="img_produto">
          <h2>Imagem do Produto</h2>{" "}
        </label>
        <input
          type="file"
          id="idImgProduto"
          name="imagem_produto"
          value={formData.imagem_produto}
          onChange={handleChange}
          required
        />
      </div>

      <button className="button" type="submit">
        <h1>Registrar Produto</h1>
      </button>
    </form>
  );
}

export default CadastroProduto;
