import React, { useState } from "react";
import './Header.css';
import iconPerfil from "../assets/images/iconPerfil.png";

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
        <input
          type="text"
          placeholder="Buscar Produtos..."
          className="procura-input"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
        <button type="submit" className="botao-procura"></button>
      </form>

      <div className="user">
        <img src={iconPerfil} alt="" className="icon-perfil"/>
      </div>
    </header>
  );
}

export default Header;
