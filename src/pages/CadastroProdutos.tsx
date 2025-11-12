import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { api } from "../api";
import "./CadastroProduto.css";

interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
  subcategoria: Subcategoria;
}

interface Subcategoria {
  idSubcategoria: number;
  nomeSubcategoria: string;
}

function CadastroProduto() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    nomeProduto: "",
    quantidadeProduto: "",
    categoriaProduto: "",
    subCategoriaProduto: "",
    precoProduto: "",
    dataValidade: "",
    descricao: "",
    imagemProduto: "",
    imgUrl: "",
  });

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subcategoria, setSubCategoria] = useState<Subcategoria[]>([]);

  useEffect(() => {
    api
      .get("/categorias")
      .then((res) => setCategorias(res.data))
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    if (!formData.categoriaProduto) return; // só busca se houver categoria selecionada
    if (formData.categoriaProduto == "-1") return setSubCategoria([]);

    api
      .get(`/categorias/id/${encodeURIComponent(formData.categoriaProduto)}`)
      .then((res) => {
        console.log("Subcategorias carregadas:", res.data);
        setSubCategoria(res.data); // ✅ aqui sim
      })
      .catch((err) => console.error("Erro ao buscar subcategorias:", err));
  }, [formData.categoriaProduto]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (name === "precoProduto") {
      if (!isNaN(Number(value)) && value.trim() !== "") {
        setFormData((prev) => ({
          ...prev,
          [name]: parseFloat(value).toFixed(2),
        }));
      } else {
        setFormData((prev) => ({ ...prev, [name]: "" }));
      }
    } else if (e.target.type === "file" && files) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          imagemProduto: reader.result as string,
        }));
      };
      reader.readAsDataURL(files[0]);
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nomeProduto.trim())
      return alert("Informe o nome do produto.");
    if (!formData.quantidadeProduto || Number(formData.quantidadeProduto) <= 0)
      return alert("Informe uma quantidade válida.");
    if (!formData.precoProduto || Number(formData.precoProduto) <= 0)
      return alert("Informe um preço válido.");
    if (!formData.categoriaProduto) return alert("Selecione uma categoria.");
    if (!formData.subCategoriaProduto) return alert("Selecione uma categoria.");
    if (!formData.descricao.trim()) return alert("Informe a descrição.");

    const produto = {
      nomeProduto: formData.nomeProduto.trim(),
      quantidade: Number(formData.quantidadeProduto),
      precoProduto: Number(formData.precoProduto),
      dataValidade: formData.dataValidade || null,
      categoria: { idCategoria: parseInt(formData.categoriaProduto) },
      subCategoria: { idSubcategoria: parseInt(formData.subCategoriaProduto) },
      descricaoProduto: formData.descricao.trim(),
      imagemProdutoBase64: formData.imagemProduto || null,
      imgUrl: formData.imgUrl?.trim() || null,
    };

    try {
      await api.post("/produto/cadastro", produto);
      alert("Produto cadastrado com sucesso!");
      setFormData({
        nomeProduto: "",
        quantidadeProduto: "",
        categoriaProduto: "",
        subCategoriaProduto: "",
        precoProduto: "",
        dataValidade: "",
        descricao: "",
        imagemProduto: "",
        imgUrl: "",
      });
    } catch (err) {
      console.error(err);
      alert("Erro ao cadastrar produto. Verifique os dados.");
    }

    console.log("Produto enviado:", formData);
  };

  return (
    <div className="cadastro-produto-page">
      {/* Ícone de voltar */}
      <div className="home-icon" onClick={() => navigate("/")}>
        <FaHome />
      </div>

      <form className="formulario-pag-cadastro-produto" onSubmit={handleSubmit}>
        <div className="titulo">
          <h1>Cadastro de Produto</h1>
          <div className="subtitulo">
            <h5>Preencha os dados do novo produto</h5>
          </div>
        </div>

        <div className="campos-pag-cadastro-produto">
          <div className="campo-pag-cadastro-produto">
            <label>Nome do Produto</label>
            <input
              type="text"
              name="nomeProduto"
              value={formData.nomeProduto}
              onChange={handleChange}
              placeholder="Nome do produto"
              required
            />
          </div>

          <div className="campo-pag-cadastro-produto">
            <label>Quantidade</label>
            <input
              type="number"
              name="quantidadeProduto"
              value={formData.quantidadeProduto}
              onChange={handleChange}
              placeholder="Quantidade disponível"
              required
            />
          </div>

          <div className="campo-pag-cadastro-produto">
            <label>Categoria</label>
            <select
              name="categoriaProduto"
              value={formData.categoriaProduto}
              onChange={handleChange}
              required
            >
              <option value="-1">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.idCategoria} value={cat.idCategoria}>
                  {cat.nomeCategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-pag-cadastro-produto">
            <label>Subcategoria</label>
            <select
              name="subCategoriaProduto"
              value={formData.subCategoriaProduto}
              onChange={handleChange}
              required
            >
              <option value="">Selecione uma subcategoria</option>
              {subcategoria.map((sub) => (
                <option key={sub.idSubcategoria} value={sub.idSubcategoria}>
                  {sub.nomeSubcategoria}
                </option>
              ))}
            </select>
          </div>

          <div className="campo-pag-cadastro-produto">
            <label>Preço</label>
            <input
              type="number"
              step="0.01"
              name="precoProduto"
              value={formData.precoProduto}
              onChange={handleChange}
              placeholder="Ex: 12.50"
              required
            />
          </div>

          <div className="campo-pag-cadastro-produto">
            <label>Data de Validade</label>
            <input
              type="date"
              name="dataValidade"
              value={formData.dataValidade}
              onChange={handleChange}
            />
          </div>

          <div className="campo-pag-cadastro-produto">
            <label>Descrição</label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleChange}
              placeholder="Descrição detalhada do produto"
              required
            />
          </div>

          <div className="campo-pag-cadastro-produto">
            <label>URL da Imagem (opcional)</label>
            <input
              type="text"
              name="imgUrl"
              value={formData.imgUrl}
              onChange={handleChange}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="campo-pag-cadastro-produto">
            <label>Imagem do Produto</label>
            <input type="file" name="imagemProduto" onChange={handleChange} />
          </div>
        </div>

        <button type="submit" className="btn-cadastro-produto">
          Cadastrar Produto
        </button>
      </form>
    </div>
  );
}

export default CadastroProduto;
