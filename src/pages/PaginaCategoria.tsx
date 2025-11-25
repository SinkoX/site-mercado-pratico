import { useEffect, useState, useRef } from "react";
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

  const STEP = 1;
  const MAX_PRECO = 1000;

  // valores reais
  const [precoMin, setPrecoMin] = useState(0);
  const [precoMax, setPrecoMax] = useState(MAX_PRECO);

  // strings exibidas
  const [precoMinStr, setPrecoMinStr] = useState("R$ 0,00");
  const [precoMaxStr, setPrecoMaxStr] = useState("R$ 1.000,00");

  const inputMinRef = useRef<HTMLInputElement | null>(null);
  const inputMaxRef = useRef<HTMLInputElement | null>(null);

  // formatador de moeda
  function formatMoney(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2,
    });
  }

  // máscara enquanto digita (centavos)
  function maskCurrency(value: string, maxDigits: number) {
    let v = value.replace(/\D/g, "");

    if (v.length > maxDigits) v = v.slice(0, maxDigits);

    if (v.length === 0) return "R$ 0,00";

    const num = Number(v) / 100;
    return formatMoney(num);
  }

  // carregar produtos
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
      .then((res) => setProdutos(Array.isArray(res.data) ? res.data : []))
      .catch(() => {})
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
          setSubcategorias(subcats);
        })
        .catch(() => {});
    }
  }, [nomeCategoria, termo]);

  // filtragem
  const produtosFiltrados = produtos.filter((prod) => {
    const atendeSub = filtroSubcategoria
      ? prod.subCategoria?.idSubcategoria === filtroSubcategoria
      : true;

    const atendePreco =
      prod.precoProduto >= precoMin && prod.precoProduto <= precoMax;

    return atendeSub && atendePreco;
  });

  // sliders
  const handleSliderMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoMin = Math.min(Number(e.target.value), precoMax - STEP);
    setPrecoMin(novoMin);
    setPrecoMinStr(formatMoney(novoMin));
  };

  const handleSliderMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const novoMax = Math.max(Number(e.target.value), precoMin + STEP);
    setPrecoMax(novoMax);
    setPrecoMaxStr(formatMoney(novoMax));
  };

  // inputs digitando
  const handleInputMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrecoMinStr(maskCurrency(e.target.value, 5)); // max 999,99
  };

  const handleInputMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPrecoMaxStr(maskCurrency(e.target.value, 6)); // max 1.000,00
  };

  // aplicar valores
  const handleInputMinBlur = () => {
    const num =
      parseFloat(precoMinStr.replace(/[^\d,]/g, "").replace(",", ".")) || 0;

    let valor = Math.min(num, precoMax - STEP);
    if (valor < 0) valor = 0;

    setPrecoMin(valor);
    setPrecoMinStr(formatMoney(valor));
  };

  const handleInputMaxBlur = () => {
    const num =
      parseFloat(precoMaxStr.replace(/[^\d,]/g, "").replace(",", ".")) ||
      MAX_PRECO;

    let valor = Math.max(num, precoMin + STEP);
    if (valor > MAX_PRECO) valor = MAX_PRECO;

    setPrecoMax(valor);
    setPrecoMaxStr(formatMoney(valor));
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
              <h2 className="titulo-categoria">
                {nomeCategoria || termo || "Produtos"}
              </h2>

              {/* Subcategorias */}
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

                 <button
  onClick={() => {
    setFiltroSubcategoria(null);

    // reset preço
    setPrecoMin(0);
    setPrecoMax(MAX_PRECO);
    setPrecoMinStr("R$ 0,00");
    setPrecoMaxStr("R$ 1.000,00");
  }}
>
  Limpar
</button>
                </div>
              )}

              {/* Preço */}
              <div className="filtro filtro-preco">
                <strong>Faixa de preço</strong>

                <div className="slider-container">
                  <input
                    type="range"
                    min={0}
                    max={MAX_PRECO}
                    step={STEP}
                    value={precoMin}
                    onChange={handleSliderMinChange}
                    className="slider slider-min"
                  />

                  <input
                    type="range"
                    min={0}
                    max={MAX_PRECO}
                    step={STEP}
                    value={precoMax}
                    onChange={handleSliderMaxChange}
                    className="slider slider-max"
                  />

                  <div
                    className="slider-track-active"
                    style={{
                      left: `${(precoMin / MAX_PRECO) * 100}%`,
                      width: `${((precoMax - precoMin) / MAX_PRECO) * 100}%`,
                    }}
                  />

                  <div className="valores-preco">
                    <input
                      ref={inputMinRef}
                      type="text"
                      value={precoMinStr}
                      onChange={handleInputMinChange}
                      onBlur={handleInputMinBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleInputMinBlur();
                          inputMaxRef.current?.focus();
                        }
                      }}
                    />

                    <span>—</span>

                    <input
                      ref={inputMaxRef}
                      type="text"
                      value={precoMaxStr}
                      onChange={handleInputMaxChange}
                      onBlur={handleInputMaxBlur}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleInputMaxBlur();
                        }
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
