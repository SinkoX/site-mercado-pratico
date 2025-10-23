import React, { useState } from "react";
import "./Header.css";
import iconPerfil from "../assets/images/icones/iconPerfil.png";
import iconPesquisa from "../assets/images/icones/iconPesquisa.png";
import { Link, useNavigate } from "react-router-dom";

interface HeaderProps {
  onBuscarProduto?: (busca: string) => void; // agora opcional
}

function Header({ onBuscarProduto }: HeaderProps) {
  const [busca, setBusca] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onBuscarProduto) {
      onBuscarProduto(busca); // usa a função passada
    } else {
      navigate(`/busca/${busca}`); // navegação padrão
    }
  };

  return (
    <header className="header">
      <div className="logo">
        <img src="/logo.png" className="logo" alt="logo" />
      </div>

      <form className="procura" onSubmit={handleSubmit}>
        <img src={iconPesquisa} alt="icon pesquisa" id="icon-pesquisa" />
        <input
          type="text"
          placeholder="Buscar Produtos..."
          className="procura-input"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </form>

      <Link to="/login">
        <div className="user">
          <img src={iconPerfil} alt="icon perfil" id="icon-perfil" />
        </div>
      </Link>
    </header>
  );
}

export default Header;
