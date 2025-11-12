// MenuCategoria.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./MenuCategoria.css";

const MenuCategoria: React.FC = () => {
  const [categoriaAtiva, setCategoriaAtiva] = useState("Super Ofertas");
  const navigate = useNavigate();

  const categorias = ["Super Ofertas", "Hortifruti", "Mercearia", "Limpeza"];

  const handleClick = (categoria: string) => {
    setCategoriaAtiva(categoria);

    navigate(`/categoria/${encodeURIComponent(categoria)}`);
  };

  return (
    <div className="categoria-menu">
      {categorias.map((categoria) => (
        <button
          key={categoria}
          className={`categoria-btn ${
            categoriaAtiva === categoria ? "ativo" : ""
          }`}
          onClick={() => handleClick(categoria)}
        >
          {categoria}
        </button>
      ))}
    </div>
  );
};

export default MenuCategoria;
