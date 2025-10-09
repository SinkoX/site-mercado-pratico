import { useState } from "react";
import "./CategoriasHome.css";

const CategoriasHome = () => {
  const categorias = [
    { id: 1, nome: "Hortifruti", imagem: "" },
    { id: 2, nome: "Bebidas", imagem: "" },
    { id: 3, nome: "Mercearia", imagem: "" },
    { id: 4, nome: "Limpeza", imagem: "" },
    { id: 5, nome: "Açougue", imagem: "" },
    { id: 6, nome: "Higiene", imagem: "" },
    { id: 7, nome: "Padaria", imagem: "" },
    { id: 8, nome: "Pet Shop", imagem: "" },
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
        <button className="seta" onClick={anterior}>
          &#8249;
        </button>

        <div className="categorias-container">
          {categoriasVisiveis.map((categoria) => (
            <div key={categoria.id} className="categoria-card">
              <div className="img-card">IMAGEM</div>
              <h3>{categoria.nome}</h3>
            </div>
          ))}
        </div>

        <button className="seta" onClick={proximo}>
          &#8250;
        </button>
      </div>
    </div>
  );
};

export default CategoriasHome;
