import { useEffect, useState } from "react";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import CardProduto from "../components/CardProduto";
import "./Produtos.css";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  quantidade: number;
  imgUrl?: string;
  idSubcategoria?: number;
  nomeCategoria?: string;
}

interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
}

export default function PaginaProdutos() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaFiltrada, setCategoriaFiltrada] = useState<number | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  // Buscar produtos e categorias ao carregar
  useEffect(() => {
    setLoading(true);

    axios
      .get("http://localhost:8080/produto")
      .then((res) => setProdutos(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erro ao buscar produtos:", err));

    axios
      .get("http://localhost:8080/categorias")
      .then((res) => setCategorias(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Erro ao buscar categorias:", err))
      .finally(() => setLoading(false));
  }, []);

  // Produtos filtrados pela categoria selecionada
  const produtosFiltrados = categoriaFiltrada
    ? produtos.filter(
        (p) =>
          p.nomeCategoria &&
          categorias.find((c) => c.idCategoria === categoriaFiltrada)
            ?.nomeCategoria === p.nomeCategoria
      )
    : produtos;

  return (
    <div>
      <Header />

      <div className="pagina-produtos-container">
        <h1>Todos os Produtos</h1>

        {/* Filtro de categorias */}
        <div className="filtro-categorias">
          <button
            className={categoriaFiltrada === null ? "ativo" : ""}
            onClick={() => setCategoriaFiltrada(null)}
          >
            Todas
          </button>
          {categorias.map((cat) => (
            <button
              key={cat.idCategoria}
              className={categoriaFiltrada === cat.idCategoria ? "ativo" : ""}
              onClick={() => setCategoriaFiltrada(cat.idCategoria)}
            >
              {cat.nomeCategoria}
            </button>
          ))}
        </div>

        {loading ? (
          <p>Carregando produtos...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <div className="produtos-lista">
            {produtosFiltrados.map((prod) => (
              <CardProduto
                key={prod.idProduto}
                produto={{
                  ...prod,
                  imgUrl:
                    prod.imgUrl && prod.imgUrl.trim() !== ""
                      ? prod.imgUrl
                      : "/placeholder.png",
                }}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
