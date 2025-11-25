import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FaArrowLeft } from "react-icons/fa6";
import "./GerenciarProdutos.css";
import ModalProduto from "../components/ModalProduto";
import ModalConfirmarExclusao from "../components/ModalExclusaoProduto";

interface Subcategoria {
  idSubcategoria: number;
  nomeSubcategoria: string;
}

interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
  subcategorias: Subcategoria[];
}

interface Fornecedor {
  idFornecedor: number;
  nomeFornecedor: string;
}

interface Produto {
  idProduto: number;
  nomeProduto: string;
  descricaoProduto: string;
  imgUrl: string;
  precoProduto: number;
  categoria: Categoria;
  subCategoria: Subcategoria;
  fornecedor: Fornecedor;
}

export default function GerenciarProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [produtoEdit, setProdutoEdit] = useState<Produto | null>(null);
  const [modalProduto, setModalProduto] = useState(false);

  // ➕ ESTADOS DO MODAL DE EXCLUSÃO
  const [produtoParaExcluir, setProdutoParaExcluir] = useState<Produto | null>(null);
  const [abrirModalExcluir, setAbrirModalExcluir] = useState(false);

  const [filtroProduto, setFiltroProduto] = useState(
    localStorage.getItem("filtroProduto") || ""
  );
  const [filtroCategoria, setFiltroCategoria] = useState(
    localStorage.getItem("filtroCategoria") || ""
  );
  const [filtroSubcategoria, setFiltroSubcategoria] = useState(
    localStorage.getItem("filtroSubcategoria") || ""
  );
  const [filtroFornecedor, setFiltroFornecedor] = useState(
    localStorage.getItem("filtroFornecedor") || ""
  );

  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [subCategorias, setSubCategorias] = useState<Subcategoria[]>([]);
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const navigate = useNavigate();

  const [paginaEstoque, setPaginaEstoque] = useState(
    Number(localStorage.getItem("paginaEstoque")) || 1
  );
  const [itensPorPaginaEstoque, setItensPorPaginaEstoque] = useState(
    Number(localStorage.getItem("itensPorPaginaEstoque")) || 10
  );

  useEffect(() => {
    carregarProdutos();
    carregarCategorias();
    carregarSubcategorias();
    carregarFornecedores();
  }, []);

  const carregarProdutos = async () => {
    try {
      const res = await api.get("/produto");
      setProdutos(res.data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
    }
  };

  const carregarCategorias = async () => {
    try {
      const res = await api.get("/categorias");
      setCategorias(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const carregarSubcategorias = async () => {
    const res = await api.get("/subcategorias");
    setSubCategorias(res.data);
  };

  const carregarFornecedores = async () => {
    const res = await api.get("/fornecedores");
    setFornecedores(res.data);
  };

  // 🚨 NÃO usa mais window.confirm — agora abre modal
  const solicitarExclusao = (produto: Produto) => {
    setProdutoParaExcluir(produto);
    setAbrirModalExcluir(true);
  };

  // 🔥 Executa exclusão após confirmar no modal
  const confirmarExclusao = async () => {
    if (!produtoParaExcluir) return;

    try {
      await api.delete(`/produto/${produtoParaExcluir.idProduto}`);

      setProdutos((prev) =>
        prev.filter((p) => p.idProduto !== produtoParaExcluir.idProduto)
      );

      setAbrirModalExcluir(false);
      setProdutoParaExcluir(null);
    } catch (err) {
      console.error("Erro ao excluir produto:", err);
    }
  };

  useEffect(() => {
    localStorage.setItem("filtroProduto", filtroProduto);
    localStorage.setItem("filtroCategoria", filtroCategoria);
    localStorage.setItem("filtroSubcategoria", filtroSubcategoria);
    localStorage.setItem("filtroFornecedor", filtroFornecedor);
    localStorage.setItem("paginaEstoque", String(paginaEstoque));
    localStorage.setItem("itensPorPaginaEstoque", String(itensPorPaginaEstoque));
  }, [
    filtroProduto,
    filtroCategoria,
    filtroSubcategoria,
    filtroFornecedor,
    paginaEstoque,
    itensPorPaginaEstoque,
  ]);

  const limparFiltros = () => {
    setFiltroProduto("");
    setFiltroCategoria("");
    setFiltroSubcategoria("");
    setFiltroFornecedor("");
  };

  const produtosFiltrados = produtos.filter((p) => {
    const nomeMatch = p.nomeProduto.toLowerCase().includes(filtroProduto.toLowerCase());
    const categoriaMatch = p.categoria?.nomeCategoria?.toLowerCase().includes(filtroCategoria.toLowerCase());
    const subcategoriaMatch = p.subCategoria?.nomeSubcategoria?.toLowerCase().includes(filtroSubcategoria.toLowerCase());
    const fornecedorMatch = p.fornecedor?.nomeFornecedor?.toLowerCase().includes(filtroFornecedor.toLowerCase());

    return nomeMatch && categoriaMatch && subcategoriaMatch && fornecedorMatch;
  });

  const totalPaginasEstoque = Math.ceil(produtosFiltrados.length / itensPorPaginaEstoque);
  const indexInicio = (paginaEstoque - 1) * itensPorPaginaEstoque;
  const indexFim = indexInicio + itensPorPaginaEstoque;
  const produtosPaginados = produtosFiltrados.slice(indexInicio, indexFim);

  return (
    <div className="gerenciar-produtos-page">
      <div className="back-icon" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </div>

      <h1>Gerenciamento de Produtos</h1>

      <div className="bloco">
        <button
          className="btn-adicionar"
          onClick={() => navigate("/gerenciar/cadastro/produto")}
        >
          Adicionar Produto
        </button>

        {/* filtros… */}

        <table className="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Imagem</th>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Preço</th>
              <th>Categoria</th>
              <th>Subcategoria</th>
              <th>Fornecedor</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {produtosPaginados.map((p) => (
              <tr key={p.idProduto}>
                <td>{p.idProduto}</td>
                <td>
                  {p.imgUrl ? <img src={p.imgUrl} id="imagem-produto" /> : "—"}
                </td>
                <td>{p.nomeProduto}</td>
                <td>{p.descricaoProduto}</td>
                <td>{p.precoProduto.toFixed(2).replace(".", ",")}</td>
                <td>{p.categoria?.nomeCategoria}</td>
                <td>{p.subCategoria?.nomeSubcategoria}</td>
                <td>{p.fornecedor?.nomeFornecedor}</td>

                <td>
                  <button
                    className="btn editar"
                    onClick={() => {
                      setProdutoEdit(p);
                      setModalProduto(true);
                    }}
                  >
                    Editar
                  </button>

                  <button
                    className="btn excluir"
                    onClick={() => solicitarExclusao(p)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL DE CONFIRMAÇÃO */}
      {abrirModalExcluir && produtoParaExcluir && (
  <ModalConfirmarExclusao
    nomeProduto={produtoParaExcluir.nomeProduto}
    onCancel={() => setAbrirModalExcluir(false)}
    onConfirm={confirmarExclusao}
  />
)}

      {/* modal de edição */}
      {modalProduto && (
        <ModalProduto
          produtoEdit={produtoEdit}
          categorias={categorias}
          subCategorias={subCategorias}
          fechar={() => {
            setModalProduto(false);
            setProdutoEdit(null);
          }}
          atualizar={carregarProdutos}
        />
      )}
    </div>
  );
}
