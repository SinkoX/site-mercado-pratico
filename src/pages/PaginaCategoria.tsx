import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import CardProduto from "../components/CardProduto";
import "./PaginaCategoria.css";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  quantidade: number;
  dataValidade: string;
  idSubcategoria?: number;
  imgUrl?: string;
}

interface Subcategoria {
  idSubcategoria: number;
  nomeSubcategoria: string;
}

export default function PaginaCategoria() {
  const { nomeCategoria, termo } = useParams<{ nomeCategoria?: string; termo?: string }>();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroSubcategoria, setFiltroSubcategoria] = useState<number | null>(null);
  const [filtroDisponibilidade, setFiltroDisponibilidade] = useState<boolean | null>(null);
  const [filtroPreco, setFiltroPreco] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });

  useEffect(() => {
    const parametro = termo || nomeCategoria;
    if (!parametro) return;

    setLoading(true);

    // URL para buscar produtos
    const url = termo
      ? `http://localhost:8080/produto/busca?nome=${encodeURIComponent(parametro)}`
      : `http://localhost:8080/categorias/${encodeURIComponent(parametro)}/produtos`;

    axios.get(url)
      .then(res => setProdutos(Array.isArray(res.data) ? res.data : []))
      .catch(err => console.error("Erro ao buscar produtos:", err))
      .finally(() => setLoading(false));

    // Se for categoria, tenta carregar subcategorias
    if (nomeCategoria) {
      axios.get(`http://localhost:8080/categorias/${encodeURIComponent(nomeCategoria)}`)
        .then(res => setSubcategorias(Array.isArray(res.data) ? res.data : []))
        .catch(err => console.warn("Sem subcategorias para esta categoria:", err));
    }
  }, [nomeCategoria, termo]);

  // Filtra produtos conforme filtros
  const produtosFiltrados = produtos.filter(prod => {
    const atendeSub = filtroSubcategoria ? prod.idSubcategoria === filtroSubcategoria : true;
    const atendeDisp =
      filtroDisponibilidade !== null
        ? filtroDisponibilidade
          ? prod.quantidade > 0
          : prod.quantidade === 0
        : true;
    const atendePreco = prod.precoProduto >= filtroPreco.min && prod.precoProduto <= filtroPreco.max;
    return atendeSub && atendeDisp && atendePreco;
  });

  return (
    <div>
      <Header />

      <div className="container">
        <h2>{nomeCategoria || termo}</h2>

        {loading ? (
          <p>Carregando produtos...</p>
        ) : produtosFiltrados.length === 0 ? (
          <p>Nenhum produto encontrado.</p>
        ) : (
          <div className="pagina-com-filtros">
            <aside className="filtros">
              {subcategorias.length > 0 && (
                <div className="filtro">
                  <strong>Subcategorias</strong>
                  {subcategorias.map(sub => (
                    <label key={sub.idSubcategoria}>
                      <input
                        type="radio"
                        name="subcategoria"
                        checked={filtroSubcategoria === sub.idSubcategoria}
                        onChange={() => setFiltroSubcategoria(sub.idSubcategoria)}
                      />
                      {sub.nomeSubcategoria}
                    </label>
                  ))}
                  <button onClick={() => setFiltroSubcategoria(null)}>Limpar</button>
                </div>
              )}

              <div className="filtro">
                <strong>Disponibilidade</strong>
                <label>
                  <input
                    type="radio"
                    checked={filtroDisponibilidade === true}
                    onChange={() => setFiltroDisponibilidade(true)}
                  /> Em estoque
                </label>
                <label>
                  <input
                    type="radio"
                    checked={filtroDisponibilidade === false}
                    onChange={() => setFiltroDisponibilidade(false)}
                  /> Esgotado
                </label>
                <button onClick={() => setFiltroDisponibilidade(null)}>Limpar</button>
              </div>

              <div className="filtro">
                <strong>Faixa de preço</strong>
                <input
                  type="number"
                  placeholder="Min"
                  value={filtroPreco.min}
                  onChange={e => setFiltroPreco({ ...filtroPreco, min: Number(e.target.value) })}
                />
                <input
                  type="number"
                  placeholder="Max"
                  value={filtroPreco.max}
                  onChange={e => setFiltroPreco({ ...filtroPreco, max: Number(e.target.value) })}
                />
              </div>
            </aside>

            <section className="produtos-lista">
              {produtosFiltrados.map(prod => (
                <CardProduto
                  key={prod.idProduto}
                  produto={{
                    ...prod,
                    imgUrl: prod.imgUrl && prod.imgUrl.trim() !== "" ? prod.imgUrl : "/placeholder.png"
                  }}
                />
              ))}
            </section>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
