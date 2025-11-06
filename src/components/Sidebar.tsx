import React from "react";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

const categorias = [
  "Super Ofertas",
  "Hortifruti",
  "Bebidas",
  "Mercearia",
  "Limpeza",    
  "Açougue",
  "Higiene",
  "Padaria",
  "PetShop",
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

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
              <li key={c} className="sidebar_item">
                <button
                  className="sidebar_link"
                  onClick={() => handleCategoriaClick(c)}
                >
                  {c}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </nav>
      <div 
        className={`sidebar_backdrop ${isOpen ? "sidebar_backdrop--visible" : ""}`} 
        onClick={onClose}
      />
    </>
  );
};

export default Sidebar;