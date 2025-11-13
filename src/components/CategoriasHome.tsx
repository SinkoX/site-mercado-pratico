import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriasHome.css";
import { api } from "../api";

interface Categoria {
  id: number;
  nomeCategoria: string;
  imgUrl: string;
}

const CategoriasHome = () => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const navigate = useNavigate();

  const [indice, setIndice] = useState(0);
  const itensPorPagina = 6;
  const [animacao, setAnimacao] = useState("");

  useEffect(() => {
    api
      .get("/categorias")
      .then((res) => {
        setCategorias(Array.isArray(res.data) ? res.data : []);
      })
      .catch((err) => console.error("Erro ao buscar categorias:", err));
  }, []);

  const proximo = () => {
    setAnimacao("animar-proximo");
    setTimeout(() => {
      setIndice((prev) => (prev === categorias.length - 1 ? 0 : prev + 1));
      setAnimacao("");
    }, 400);
  };

  const anterior = () => {
    setAnimacao("animar-anterior");
    setTimeout(() => {
      setIndice((prev) => (prev === 0 ? categorias.length - 1 : prev - 1));
      setAnimacao("");
    }, 400);
  };
  const categoriasVisiveis = [
    ...categorias.slice(indice, indice + itensPorPagina),
    ...categorias.slice(
      0,
      Math.max(0, indice + itensPorPagina - categorias.length)
    ),
  ];

  return (
    <div className="categorias-home">
      <h2>Categorias em Destaque</h2>

      <div className="carrossel-wrapper">
        <div className="container-seta">
          <button className="seta" onClick={anterior}>
            &#8249;
          </button>
        </div>

        <div className={`categorias-container ${animacao}`}>
          {categoriasVisiveis.map((categoria) => (
            <div
              key={categoria.id}
              className="categoria-card"
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/categoria/${categoria.nomeCategoria}`)}
            >
              <div className="img-card">
                <img src={categoria.imgUrl} alt={categoria.nomeCategoria} />
              </div>
              <h3>{categoria.nomeCategoria}</h3>
            </div>
          ))}
        </div>

        <div className="container-seta">
          <button className="seta" onClick={proximo}>
            &#8250;
          </button>
        </div>
      </div>
    </div>
  );
};

export default CategoriasHome;
