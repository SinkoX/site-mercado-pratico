import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CadastroProduto.css";
import { api } from "../api";

interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
}

function CadastroProduto() {
  const [formData, setFormData] = useState({
    nomeProduto: "",
    quantidadeProduto: "",
    categoriaProduto: "",
    precoProduto: "",
    dataValidade: "",
    descricao: "",
    imagemProduto: "",
    imgUrl: "",
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/categorias")
      .then((response) => setCategorias(response.data))
      .catch((error) => console.error("Erro ao buscar categorias:", error));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "precoProduto") {
      // Formata o valor para duas casas decimais se for número válido
      if (!isNaN(Number(value)) && value.trim() !== "") {
        setFormData((prev) => ({
          ...prev,
          [name]: parseFloat(value).toFixed(2),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (e.target.type === "file" && files) {
      const file = files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagemProduto: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validações básicas
    if (!formData.nomeProduto.trim()) {
      alert("Por favor, insira o nome do produto.");
      return;
    }

    const quantidadeNum = Number(formData.quantidadeProduto);
    if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
      alert("Por favor, insira uma quantidade válida.");
      return;
    }

    const precoNum = parseFloat(formData.precoProduto);
    if (isNaN(precoNum) || precoNum <= 0) {
      alert("Por favor, insira um preço válido.");
      return;
    }

    if (!formData.categoriaProduto) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    if (!formData.descricao.trim()) {
      alert("Por favor, insira uma descrição do produto.");
      return;
    }

    // Preparar objeto conforme ProdutoDTO
    const produto = {
      nomeProduto: formData.nomeProduto.trim(),
      quantidade: quantidadeNum,
      precoProduto: precoNum,
      dataValidade: formData.dataValidade || null,
      idSubcategoria: Number(formData.categoriaProduto),
      descricaoProduto: formData.descricao.trim(),
      imagemProdutoBase64: formData.imagemProduto || null,
      imgUrl: formData.imgUrl?.trim() || null,
    };

    console.log("JSON enviado para backend:", JSON.stringify(produto, null, 2));

    try {
      console.log("📦 Dados enviados:", formData);

      const response = await api.post("/produto/cadastro");
      

      console.log("✅ Produto cadastrado com sucesso:", response.data);
      alert("Produto cadastrado com sucesso!");

      // Resetar formulário
      setFormData({
        nomeProduto: "",
        quantidadeProduto: "",
        categoriaProduto: "",
        precoProduto: "",
        dataValidade: "",
        descricao: "",
        imagemProduto: "",
        imgUrl: "",
      });
    } catch (error) {
      console.error("❌ Erro ao cadastrar produto:", error);
      alert("Erro ao cadastrar produto. Verifique os dados e tente novamente.");
    }
  };

  return (
    <div className="cadastro-produto-page">
      <form className="form" onSubmit={handleSubmit}>
        <h1>Cadastro Produto</h1>

        <div className="campo">
          <label htmlFor="nomeProduto">Nome do Produto</label>
          <input
            type="text"
            id="nomeProduto"
            name="nomeProduto"
            value={formData.nomeProduto}
            onChange={handleChange}
            placeholder="Digite o nome do produto"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="quantidadeProduto">Quantidade</label>
          <input
            type="number"
            id="quantidadeProduto"
            name="quantidadeProduto"
            value={formData.quantidadeProduto}
            onChange={handleChange}
            placeholder="Digite a quantidade"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="categoriaproduto">Categoria</label>
          <select
            id="categoriaProduto"
            name="categoriaProduto"
            value={formData.categoriaProduto}
            onChange={handleChange}
            required
          >
            <option value="">Selecione uma categoria</option>
            {categorias.map((cat) => (
              <option key={cat.idCategoria} value={cat.idCategoria}>
                {cat.nomeCategoria}
              </option>
            ))}
          </select>
        </div>

        <div className="campo">
          <label htmlFor="precoProduto">Preço</label>
          <input
            type="number"
            step="0.01"
            id="precoProduto"
            name="precoProduto"
            value={formData.precoProduto}
            onChange={handleChange}
            placeholder="Digite o preço (ex: 12.50)"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="dataValidade">Data de Validade</label>
          <input
            type="date"
            id="dataValidade"
            name="dataValidade"
            value={formData.dataValidade}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="descricao">Descrição</label>
          <textarea
            id="descricao"
            name="descricao"
            value={formData.descricao}
            onChange={handleChange}
            placeholder="Digite a descrição do produto"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="imgUrl">URL da Imagem (opcional)</label>
          <input
            type="text"
            id="imgUrl"
            name="imgUrl"
            value={formData.imgUrl}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className="campo">
          <label htmlFor="imagemProduto">Imagem do Produto</label>
          <input type="file" id="imagemProduto" name="imagemProduto" onChange={handleChange} />
        </div>

        <button type="submit" className="button">
          Registrar Produto
        </button>
      </form>
    </div>
  );
}

export default CadastroProduto;
