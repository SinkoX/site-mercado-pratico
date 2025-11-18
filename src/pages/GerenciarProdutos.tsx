import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FaArrowLeft } from "react-icons/fa6";
import "./GerenciarProdutos.css";
import ModalProduto from "../components/ModalProduto";

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
    console.log("Categorias API:", res.data); // <--- verificar
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
  }

  const deletarProduto = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
    try {
      await api.delete(`/produto/${id}`);
      setProdutos(produtos.filter((p) => p.idProduto !== id));
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
    localStorage.setItem(
      "itensPorPaginaEstoque",
      String(itensPorPaginaEstoque)
    );
  }, [
    filtroProduto,
    filtroCategoria,
    filtroSubcategoria,
    paginaEstoque,
    itensPorPaginaEstoque,
  ]);

  const limparFiltros = () => {
    setFiltroProduto("");
    setFiltroCategoria("");
    setFiltroSubcategoria("");
    setFiltroFornecedor("");
  };

  // 🔹 Filtro composto
  const produtosFiltrados = produtos.filter((p) => {
    const nomeMatch = p.nomeProduto
      .toLowerCase()
      .includes(filtroProduto.toLowerCase());
    const categoriaMatch = p.categoria?.nomeCategoria
      ?.toLowerCase()
      .includes(filtroCategoria.toLowerCase());
    const subcategoriaMatch = p.subCategoria?.nomeSubcategoria
      ?.toLowerCase()
      .includes(filtroSubcategoria.toLowerCase());
    const fornecedorMatch = p.fornecedor?.nomeFornecedor?.toLowerCase().includes(filtroFornecedor.toLowerCase());

    return nomeMatch && categoriaMatch && subcategoriaMatch && fornecedorMatch;
  });

  // 🔹 Paginação
  const totalPaginasEstoque = Math.ceil(
    produtosFiltrados.length / itensPorPaginaEstoque
  );
  const indexInicio = (paginaEstoque - 1) * itensPorPaginaEstoque;
  const indexFim = indexInicio + itensPorPaginaEstoque;
  const produtosPaginados = produtosFiltrados.slice(indexInicio, indexFim);

  const nextEstoque = () => {
    if (paginaEstoque < totalPaginasEstoque)
      setPaginaEstoque(paginaEstoque + 1);
  };

  const prevEstoque = () => {
    if (paginaEstoque > 1) setPaginaEstoque(paginaEstoque - 1);
  };

  const handleChangeItensPorPaginaEstoque = (value: number) => {
    setItensPorPaginaEstoque(value);
    setPaginaEstoque(1); // volta para página 1 ao mudar a quantidade
  };

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

        <div className="filtros">
          <input
            type="text"
            placeholder="Filtrar por nome"
            value={filtroProduto}
            onChange={(e) => {
              setFiltroProduto(e.target.value);
              setPaginaEstoque(1);
            }}
            className="input-filtro"
          />

          <select
            value={filtroCategoria}
            onChange={(e) => {
              setFiltroCategoria(e.target.value);
              setFiltroSubcategoria("");
              setPaginaEstoque(1);
            }}
            className="input-filtro"
          >
            <option value="">Todas as categorias</option>
            {categorias.map((c) => (
              <option key={c.idCategoria} value={c.nomeCategoria}>
                {c.nomeCategoria}
              </option>
            ))}
          </select>

          <select
            value={filtroSubcategoria}
            onChange={(e) => {
              setFiltroSubcategoria(e.target.value);
              setPaginaEstoque(1);
            }}
            className="input-filtro"
          >
            <option value="">Todas as subcategorias</option>
            {subCategorias
              .filter((s) =>
                filtroCategoria
                  ? categorias
                      .find((c) => c.nomeCategoria === filtroCategoria)
                      ?.subcategorias.some(
                        (sc) => sc.nomeSubcategoria === s.nomeSubcategoria
                      )
                  : true
              )
              .map((s) => (
                <option key={s.idSubcategoria} value={s.nomeSubcategoria}>
                  {s.nomeSubcategoria}
                </option>
              ))}
          </select>

          <select
            value={filtroFornecedor}
            onChange={(e) => {
              setFiltroFornecedor(e.target.value);
              setPaginaEstoque(1);  
            }} 
            className="input-filtro"
          >
            <option value="">Todos os fornecedores</option>
            {fornecedores.map((f) => (
              <option key={f.idFornecedor} value={f.nomeFornecedor}>
                {f.nomeFornecedor}
              </option>
            ))}
          </select>

          <button className="btn limpar" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>

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
            {produtosPaginados.length > 0 ? (
              produtosPaginados.map((p) => (
                <tr key={p.idProduto}>
                  <td>{p.idProduto}</td>
                  <td>
                    {p.imgUrl ? (
                      <img
                        src={p.imgUrl}
                        alt={p.nomeProduto}
                        id="imagem-produto"
                      />
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{p.nomeProduto}</td>
                  <td>{p.descricaoProduto}</td>
                  <td>{p.precoProduto.toFixed(2).replace(".", ",")}</td>
                  <td>{p.categoria?.nomeCategoria || "—"}</td>
                  <td>{p.subCategoria?.nomeSubcategoria || "—"}</td>
                  <td>{p.fornecedor?.nomeFornecedor || "—"}</td>
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
                      onClick={() => deletarProduto(p.idProduto)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="vazio">
                  Nenhum produto encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🔹 Paginação */}
      <div className="paginacao">
        <div className="paginacao-controls">
          <button onClick={prevEstoque} disabled={paginaEstoque <= 1}>
            ◀
          </button>
          {Array.from({ length: totalPaginasEstoque }).map((_, i) => (
            <button
              key={i}
              className={paginaEstoque === i + 1 ? "ativa" : ""}
              onClick={() => setPaginaEstoque(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={nextEstoque}
            disabled={paginaEstoque >= totalPaginasEstoque}
          >
            ▶
          </button>
        </div>
        <div>
          <label>Itens por página</label>
          <select
            value={itensPorPaginaEstoque}
            onChange={(e) =>
              handleChangeItensPorPaginaEstoque(Number(e.target.value))
            }
          >
            <option value={6}>6</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
      </div>

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
