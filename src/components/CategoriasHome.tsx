import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./CategoriasHome.css";
import categoriaHortiFruti from "../assets/images/categorias/categoriaHortiFruti.png";
import categoriaBebidas from "../assets/images/categorias/categoriaBebidas.png";
import categoriaMercearia from "../assets/images/categorias/categoriaMercearia.png";
import categoriaLimpeza from "../assets/images/categorias/categoriaLimpeza.png";
import categoriaAcougue from "../assets/images/categorias/categoriaAcougue.png";
import categoriaHigiene from "../assets/images/categorias/categoriaHigiene.png";
import categoriaPadaria from "../assets/images/categorias/categoriaPadaria.png";
import categoriaPetShop from "../assets/images/categorias/categoriaPetShop.png";

const CategoriasHome = () => {
  const navigate = useNavigate();

  const categorias = [
    { id: 1, nome: "Hortifruti", imagem: categoriaHortiFruti },
    { id: 2, nome: "Bebidas", imagem: categoriaBebidas },
    { id: 3, nome: "Mercearia", imagem: categoriaMercearia },
    { id: 4, nome: "Limpeza", imagem: categoriaLimpeza },
    { id: 5, nome: "Açougue", imagem: categoriaAcougue },
    { id: 6, nome: "Higiene", imagem: categoriaHigiene },
    { id: 7, nome: "Padaria", imagem: categoriaPadaria },
    { id: 8, nome: "Pet Shop", imagem: categoriaPetShop },
  ];

  const [indice, setIndice] = useState(0);
  const itensPorPagina = 6;

  const anterior = () => {
    setIndice((prev) => (prev === 0 ? categorias.length - 1 : prev - 1));
  };

  const proximo = () => {
    setIndice((prev) => (prev === categorias.length - 1 ? 0 : prev + 1));
  };

  const categoriasVisiveis = [];
  for (let i = 0; i < itensPorPagina; i++) {
    const index = (indice + i) % categorias.length;
    categoriasVisiveis.push(categorias[index]);
  }

  return (
    <div className="categorias-home">
      <h2>Categorias em Destaque</h2>

      <div className="carrossel-wrapper">
        <div className="container-seta">
          <button className="seta" onClick={anterior}>
            &#8249;
          </button>
        </div>

        <div className="categorias-container">
          {categoriasVisiveis.map((categoria) => (
            <div
              key={categoria.id}
              className="categoria-card"
              onClick={() => navigate(`/categoria/${categoria.nome}`)} // 🔹 aqui usamos o nome
              style={{ cursor: "pointer" }}
            >
              <div className="img-card">
                <img src={categoria.imagem} alt={categoria.nome} />
              </div>
              <h3>{categoria.nome}</h3>
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
