import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import Header from "../components/Header";
import Footer from "../components/Footer";
import CardProduto from "../components/CardProduto";
import "./PaginaCategoria.css";
import { api } from "../api";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  quantidade: number;
  dataValidade: string;
  categoria?: Categoria;
  subCategoria: Subcategoria;
  imgUrl?: string;
}

interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
  subCategoria: Subcategoria;
}

interface Subcategoria {
  idSubcategoria: number;
  nomeSubcategoria: string;
}

export default function PaginaCategoria() {
  const { nomeCategoria, termo } = useParams<{
    nomeCategoria?: string;
    termo?: string;
  }>();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [subcategorias, setSubcategorias] = useState<Subcategoria[]>([]);
  const [loading, setLoading] = useState(true);

  const [filtroSubcategoria, setFiltroSubcategoria] = useState<number | null>(
    null
  );
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(1000);

  const STEP = 1;

  // Busca produtos e subcategorias
  useEffect(() => {
    const parametro = termo || nomeCategoria;
    if (!parametro) return;

    setLoading(true);

    const url = termo
      ? `http://localhost:8080/produto/busca?nome=${encodeURIComponent(
          parametro
        )}`
      : `http://localhost:8080/categorias/nome/${encodeURIComponent(
          parametro
        )}/produtos`;

    axios
      .get(url)
      .then((res) => {
        console.log("Produtos recebidos:", res.data); // <-- coloca aqui
        setProdutos(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Erro ao buscar produtos:", err))
      .finally(() => setLoading(false));

    if (nomeCategoria) {
      api
        .get(`/categorias/nome/${encodeURIComponent(nomeCategoria)}`)
        .then((res) => {
          const data = res.data;
          const subcats = Array.isArray(data)
            ? data
            : Array.isArray(data.subcategorias)
            ? data.subcategorias
            : [];
          console.log("Subcategorias carregadas:", subcats);
          setSubcategorias(subcats);
        })
        .catch((err) =>
          console.warn("Sem subcategorias para esta categoria:", err)
        );
    }
  }, [nomeCategoria, termo]);

  // Filtra produtos automaticamente com base em subcategoria e faixa de preço
  const produtosFiltrados = produtos.filter((prod) => {
    const atendeSub = filtroSubcategoria
      ? prod.subCategoria?.idSubcategoria === filtroSubcategoria
      : true;

    const atendePreco =
      prod.precoProduto >= precoMin && prod.precoProduto <= precoMax;
    return atendeSub && atendePreco;
  });

  // Sliders
  const handleSliderMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = Number(e.target.value);
    setPrecoMin(Math.min(valor, precoMax - STEP));
  };

  const handleSliderMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valor = Number(e.target.value);
    setPrecoMax(Math.max(valor, precoMin + STEP));
  };

  // Inputs numéricos
  const handleInputMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorNumerico = Number(e.target.value.replace(/\D/g, ""));
    setPrecoMin(Math.min(valorNumerico, precoMax - STEP));
  };

  const handleInputMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const valorNumerico = Number(e.target.value.replace(/\D/g, ""));
    setPrecoMax(Math.max(valorNumerico, precoMin + STEP));
  };

  return (
    <div className="page-categoria">
      <Header />

      <div className="container">
        {loading ? (
          <p>Carregando produtos...</p>
        ) : (
          <div className="pagina-com-filtros">
            <aside className="filtros">
              <div className="container-titulo">
                <h2 className="titulo-categoria">
                  {nomeCategoria || termo || "Produtos"}
                </h2>
              </div>

              {subcategorias.length > 0 && (
                <div className="filtro">
                  <strong>Subcategorias</strong>
                  {subcategorias.map((sub) => (
                    <label key={sub.idSubcategoria}>
                      <input
                        type="radio"
                        name="subcategoria"
                        checked={filtroSubcategoria === sub.idSubcategoria}
                        onChange={() =>
                          setFiltroSubcategoria(sub.idSubcategoria)
                        }
                      />
                      {sub.nomeSubcategoria}
                    </label>
                  ))}
                  <button onClick={() => setFiltroSubcategoria(null)}>
                    Limpar
                  </button>
                </div>
              )}

              <div className="filtro filtro-preco">
                <strong>Faixa de preço</strong>
                <div className="slider-container">
                  {/* Sliders */}
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={STEP}
                    value={precoMin}
                    onChange={handleSliderMinChange}
                    className="slider slider-min"
                  />
                  <input
                    type="range"
                    min={0}
                    max={1000}
                    step={STEP}
                    value={precoMax}
                    onChange={handleSliderMaxChange}
                    className="slider slider-max"
                  />

                  {/* Track ativo */}
                  <div
                    className="slider-track-active"
                    style={{
                      left: `${(precoMin / 1000) * 100}%`,
                      width: `${((precoMax - precoMin) / 1000) * 100}%`,
                    }}
                  />

                  {/* Inputs numéricos formatados */}
                  <div className="valores-preco">
                    <input
                      type="text"
                      value={precoMin.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                      onChange={handleInputMinChange}
                      onBlur={(e) => {
                        if (!e.target.value) setPrecoMin(0);
                      }}
                    />
                    <span>—</span>
                    <input
                      type="text"
                      value={precoMax.toLocaleString("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      })}
                      onChange={handleInputMaxChange}
                      onBlur={(e) => {
                        if (!e.target.value) setPrecoMax(1000);
                      }}
                    />
                  </div>
                </div>
              </div>
            </aside>

            <section className="produtos-lista">
              {produtosFiltrados.length === 0 ? (
                <p>Nenhum produto encontrado.</p>
              ) : (
                produtosFiltrados.map((prod) => (
                  <CardProduto key={prod.idProduto} produto={prod} />
                ))
              )}
            </section>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
