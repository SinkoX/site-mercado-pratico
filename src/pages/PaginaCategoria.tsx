// Categoria.tsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import CardProduto from "../components/CardProduto";
import "./PaginaCategoria.css"; // CSS normal

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  quantidade: number;
  dataValidade: string;
  idSubcategoria: number;
  imagemProdutoBase64?: string;
  imgUrl?: string;
}

interface Subcategoria {
  idSubcategoria: number;
  nomeSubcategoria: string;
}

export default function Categoria() {
  const { nomeCategoria, termo } = useParams<{ nomeCategoria?: string; termo?: string }>();
  const navigate = useNavigate();

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroSubcategoria, setFiltroSubcategoria] = useState<number | null>(null);
  const [filtroDisponibilidade, setFiltroDisponibilidade] = useState<boolean | null>(null);
  const [filtroPreco, setFiltroPreco] = useState<{ min: number; max: number }>({ min: 0, max: 10000 });

  const handleBuscarProduto = (busca: string) => {
    if (busca.trim() === "") return;
    navigate(`/busca/${busca}`);
  };

  useEffect(() => {
    setLoading(true);

    if (nomeCategoria) {
      // 🔹 Busca produtos por categoria
      axios.get(`http://localhost:8080/categorias/${encodeURIComponent(nomeCategoria)}/produtos`)
        .then(res => setProdutos(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));

      // 🔹 Busca subcategorias da categoria
      axios.get(`http://localhost:8080/categorias/${encodeURIComponent(nomeCategoria)}/subcategorias`)
        .then(res => setSubcategorias(res.data))
        .catch(err => console.error(err));
    } else if (termo) {
      // 🔹 Busca produtos por termo
      axios.get(`http://localhost:8080/produtos?busca=${encodeURIComponent(termo)}`)
        .then(res => setProdutos(res.data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [nomeCategoria, termo]);

  // Aplica os filtros
  const produtosFiltrados = produtos.filter(prod => {
    const atendeSub = filtroSubcategoria ? prod.idSubcategoria === filtroSubcategoria : true;
    const atendeDisp = filtroDisponibilidade !== null
      ? (filtroDisponibilidade ? prod.quantidade > 0 : prod.quantidade === 0)
      : true;
    const atendePreco = prod.precoProduto >= filtroPreco.min && prod.precoProduto <= filtroPreco.max;
    const atendeBusca = termo ? prod.nomeProduto.toLowerCase().includes(termo.toLowerCase()) : true;
    return atendeSub && atendeDisp && atendePreco && atendeBusca;
  });

  if (loading) return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando produtos...</p>;

  return (
    <div>
      <Header onBuscarProduto={handleBuscarProduto} />

      <div className="container">
        <aside className="filtros">
          <h3>Filtrar Produtos</h3>

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
            <strong>Faixa de Preço</strong>
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
          {produtosFiltrados.length > 0 ? (
            produtosFiltrados.map(prod => <CardProduto key={prod.idProduto} produto={prod} />)
          ) : (
            <p>Nenhum produto encontrado.</p>
          )}
        </section>
      </div>

      <Footer />
    </div>
  );
}
