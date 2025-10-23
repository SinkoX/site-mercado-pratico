import React, { useState } from "react";
import "./Header.css";
import iconPerfil from "../assets/images/icones/iconPerfil.png";
import iconPesquisa from "../assets/images/icones/iconPesquisa.png";
import { Link } from "react-router-dom";

interface HeaderProps {
  onBuscarProduto?: (busca: string) => void;
  onToggleSidebar?: () => void;
}

function Header({ onBuscarProduto, onToggleSidebar }: HeaderProps) {
  const [busca, setBusca] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onBuscarProduto) onBuscarProduto(busca);
  };

  return (
    <header className="header">
      <button
        className="header__burger"
        aria-label="Abrir menu"
        onClick={onToggleSidebar}
        type="button"
      >
        <span className="header__burger-lines" />
      </button>

      <div className="logo">
        <img src="/logo.png" className="logo" alt="logo" />
      </div>

      <form className="procura" onSubmit={handleSubmit}>
        <img src={iconPesquisa} alt="icon perfil" id="icon-pesquisa" />
        <input
          type="text"
          placeholder="Buscar Produtos..."
          className="procura-input"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </form>

      <Link to="/login" className="header__user-link">
        <div className="user">
          <img src={iconPerfil} alt="icon perfil" id="icon-perfil" />
        </div>
      </Link>
    </header>
  );
}

export default Header;
