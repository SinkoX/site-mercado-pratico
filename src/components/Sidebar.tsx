import React from "react";
import "./Sidebar.css";

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
  onSelecionarCategoria?: (categoria: string) => void;
}

const categoria = [
  "Super Ofertas",
  "Hortifruti",
  "Mercearia",
  "Limpeza",    
  "Bebidas",
  "Padaria",
  "Açougue",
  "Pet Shop",
];

const Sidebar: React.FC<SidebarProps> = ({isOpen, onClose, onSelecionarCategoria}) => {
    return(
        <nav className={`sidebar ${isOpen ? "sidebar--open" : ""}`} aria-label="Menu lateral">
            <div className="sidebar_inner"> 
                <div className="sidebar_header">
                    <span className="sidebar_title">Categorias</span>
                    <button className="sidebar_close" OnClik={onClose} aria-label="Fechar menu">x</button>
                </div>
                <ul className="sidebar_list">
          {categorias.map((c) => (
            <li key={c} className="sidebar_item">
              <button
                className="sidebar_link"
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
      <div className={`sidebar_backdrop ${isOpen? "sidebar_backdrop--visible" : ""}`} onClick={onClose}></div>
        </nav>
    );
};

export default Sidebar;
