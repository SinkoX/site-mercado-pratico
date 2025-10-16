import React, { useState } from "react";
import './Header.css';
import iconPerfil from "../assets/images/icones/iconPerfil.png";
import iconPesquisa from "../assets/images/icones/iconPesquisa.png";
import { Link } from "react-router-dom";

interface HeaderProps {
  onBuscarProduto: (busca: string) => void;
}

function Header({ onBuscarProduto }: HeaderProps) {
  const [busca, setBusca] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBuscarProduto(busca);
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" className="logo" alt="logo" />
      </div>

      <form className="procura" onSubmit={handleSubmit}>
        <img src={iconPesquisa} alt="icon perfil" id="icon-pesquisa"/>
        <input
          type="text"
          placeholder="Buscar Produtos..."
          className="procura-input"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </form>

      <div className="user">
        <Link to="/perfil">
          <img src={iconPerfil} alt="icon perfil" id="icon-perfil"/>
        </Link>
      </div>
    </header>
  );
}

export default Header;
