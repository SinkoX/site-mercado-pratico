import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import "./Sidebar.css";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

interface Categoria {
  id: number;
  nomeCategoria: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
      api
        .get("/categorias")
        .then((res) => {
          setCategorias(Array.isArray(res.data) ? res.data : []);
        })
        .catch((err) => console.error("Erro ao buscar categorias:", err));
    }, []);

  const handleCategoriaClick = (categoria: string) => {
    navigate(`/categoria/${categoria}`);
    onClose?.();
  };

  return (
    <>
      <nav
        className={`sidebar ${isOpen ? "sidebar--open" : ""}`}
        aria-label="Menu lateral"
      >
        <div className="sidebar_inner">
          <div className="sidebar_header">
            <span className="sidebar_title">Categorias</span>
            <button
              className="sidebar_close"
              onClick={onClose}
              aria-label="Fechar menu"
            >
              ✕
            </button>
          </div>
          <ul className="sidebar_list">
            {categorias.map((c) => (
              <li key={c.id} className="sidebar_item">
                <button
                  className="sidebar_link"
                  onClick={() => handleCategoriaClick(c.nomeCategoria)}
                >
                  {c.nomeCategoria}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div
        className={`sidebar_backdrop ${
          isOpen ? "sidebar_backdrop--visible" : ""
        }`}
        onClick={onClose}
      />
    </>
  );
};

export default Sidebar;
