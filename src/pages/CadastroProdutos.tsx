import React, { useState, useEffect } from "react";
import axios from "axios";
import "./CadastroProduto.css";

interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
}

function CadastroProduto() {
  const [formData, setFormData] = useState({
    nome_produto: "",
    quantidade_produto: "",
    categoria_produto: "",
    preco_produto: "",
    data_validade_produto: "",
    descricao_produto: "",
    imagem_produto: "",
    img_url: "",
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

    if (name === "preco_produto") {
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
          imagem_produto: reader.result as string,
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
    if (!formData.nome_produto.trim()) {
      alert("Por favor, insira o nome do produto.");
      return;
    }

    const quantidadeNum = Number(formData.quantidade_produto);
    if (isNaN(quantidadeNum) || quantidadeNum <= 0) {
      alert("Por favor, insira uma quantidade válida.");
      return;
    }

    const precoNum = parseFloat(formData.preco_produto);
    if (isNaN(precoNum) || precoNum <= 0) {
      alert("Por favor, insira um preço válido.");
      return;
    }

    if (!formData.categoria_produto) {
      alert("Por favor, selecione uma categoria.");
      return;
    }

    if (!formData.descricao_produto.trim()) {
      alert("Por favor, insira uma descrição do produto.");
      return;
    }

    // Preparar objeto conforme ProdutoDTO
    const produto = {
      nomeProduto: formData.nome_produto.trim(),
      quantidade: quantidadeNum,
      precoProduto: precoNum,
      dataValidade: formData.data_validade_produto || null,
      idSubcategoria: Number(formData.categoria_produto),
      descricaoProduto: formData.descricao_produto.trim(),
      imagemProdutoBase64: formData.imagem_produto || null,
      imgUrl: formData.img_url?.trim() || null,
    };

    console.log("JSON enviado para backend:", JSON.stringify(produto, null, 2));

    try {
      const response = await axios.post("http://localhost:8080/produtos", produto, {
        headers: { "Content-Type": "application/json" },
      });

      console.log("✅ Produto cadastrado com sucesso:", response.data);
      alert("Produto cadastrado com sucesso!");

      // Resetar formulário
      setFormData({
        nome_produto: "",
        quantidade_produto: "",
        categoria_produto: "",
        preco_produto: "",
        data_validade_produto: "",
        descricao_produto: "",
        imagem_produto: "",
        img_url: "",
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
          <label htmlFor="nome_produto">Nome do Produto</label>
          <input
            type="text"
            id="nome_produto"
            name="nome_produto"
            value={formData.nome_produto}
            onChange={handleChange}
            placeholder="Digite o nome do produto"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="quantidade_produto">Quantidade</label>
          <input
            type="number"
            id="quantidade_produto"
            name="quantidade_produto"
            value={formData.quantidade_produto}
            onChange={handleChange}
            placeholder="Digite a quantidade"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="categoria_produto">Categoria</label>
          <select
            id="categoria_produto"
            name="categoria_produto"
            value={formData.categoria_produto}
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
          <label htmlFor="preco_produto">Preço</label>
          <input
            type="number"
            step="0.01"
            id="preco_produto"
            name="preco_produto"
            value={formData.preco_produto}
            onChange={handleChange}
            placeholder="Digite o preço (ex: 12.50)"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="data_validade_produto">Data de Validade</label>
          <input
            type="date"
            id="data_validade_produto"
            name="data_validade_produto"
            value={formData.data_validade_produto}
            onChange={handleChange}
          />
        </div>

        <div className="campo">
          <label htmlFor="descricao_produto">Descrição</label>
          <textarea
            id="descricao_produto"
            name="descricao_produto"
            value={formData.descricao_produto}
            onChange={handleChange}
            placeholder="Digite a descrição do produto"
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="img_url">URL da Imagem (opcional)</label>
          <input
            type="text"
            id="img_url"
            name="img_url"
            value={formData.img_url}
            onChange={handleChange}
            placeholder="https://exemplo.com/imagem.jpg"
          />
        </div>

        <div className="campo">
          <label htmlFor="imagem_produto">Imagem do Produto</label>
          <input type="file" id="imagem_produto" name="imagem_produto" onChange={handleChange} />
        </div>

        <button type="submit" className="button">
          Registrar Produto
        </button>
      </form>
    </div>
  );
}

export default CadastroProduto;
