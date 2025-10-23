import React from "react";
import "./Sidebar.css";

interface SidebarProps {
  isOpen?: boolean; // used for mobile overlay state
  onClose?: () => void;
  onSelecionarCategoria?: (categoria: string) => void;
}

const categorias = [
  "Super Ofertas",
  "Hortifruti",
  "Mercearia",
  "Limpeza",
  "Bebidas",
  "Padaria",
  "Açougue",
  "Pet Shop",
];

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onSelecionarCategoria }) => {
  return (
    <nav className={`sidebar ${isOpen ? "sidebar--open" : ""}`} aria-label="Menu lateral">
      <div className="sidebar__inner">
        <div className="sidebar__header">
          <span className="sidebar__title">Categorias</span>
          <button className="sidebar__close" onClick={onClose} aria-label="Fechar menu">×</button>
        </div>
        <ul className="sidebar__list">
          {categorias.map((c) => (
            <li key={c} className="sidebar__item">
              <button
                className="sidebar__link"
                onClick={() => {
                  onSelecionarCategoria?.(c);
                  onClose?.();
                }}
              >
                {c}
              </button>
            </li>
          ))}
        </ul>
      </div>
      {/* Backdrop for mobile overlay */}
      <div className={`sidebar__backdrop ${isOpen ? "sidebar__backdrop--visible" : ""}`} onClick={onClose} />
    </nav>
  );
};

export default Sidebar;
