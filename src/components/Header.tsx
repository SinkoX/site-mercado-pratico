import React, { useState, useEffect } from "react";
import "./Header.css";
import iconPerfil from "../assets/images/icones/iconPerfil.png";
import iconPesquisa from "../assets/images/icones/iconPesquisa.png";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import Sidebar from "./Sidebar";
import { useCarrinho } from "./CarrinhoContext";

const categoriasDisponiveis = [
  "hortifruti", "bebidas", "mercearia", "limpeza", "açougue",
  "higiene", "padaria", "petshop",
];

function Header() {
  const [busca, setBusca] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const { carrinho } = useCarrinho();
  const [mostrarDropdownCarrinho, setMostrarDropdownCarrinho] = useState(false);
  const [mostrarDropdownPerfil, setMostrarDropdownPerfil] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const buscaTratada = busca.toLowerCase().replace(/\s+/g, "");
    if (!buscaTratada) { alert("Digite algo para buscar!"); return; }
    if (categoriasDisponiveis.includes(buscaTratada)) navigate(`/categoria/${buscaTratada}`);
    else navigate(`/busca/${buscaTratada}`);
    setBusca("");
  };

  const irParaCarrinho = () => navigate("/carrinho");
  const toggleDropdownPerfil = () => setMostrarDropdownPerfil(prev => !prev);
  const toggleSidebar = () => setSidebarAberta(prev => !prev);

  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user")) setMostrarDropdownPerfil(false);
    };
    document.addEventListener("click", handleClickFora);
    return () => document.removeEventListener("click", handleClickFora);
  }, []);

  return (
    <>
      <header className="header">
        {isMobile && <button className="menu-hamburger" onClick={toggleSidebar}><FaBars size={24} /></button>}
        <Link to="/"><div className="logo"><img src="/logo.png" className="logo" alt="logo" /></div></Link>

        <form className="procura" onSubmit={handleSubmit}>
          <img src={iconPesquisa} alt="icon pesquisa" id="icon-pesquisa" />
          <input
            type="text"
            placeholder="Buscar Produtos..."
            className="procura-input"
            value={busca}
            onChange={e => setBusca(e.target.value)}
          />
        </form>

        <div className="user-icons">
          {user && (
            <div
              className="carrinho-icon"
              onMouseEnter={() => setMostrarDropdownCarrinho(true)}
              onMouseLeave={() => setMostrarDropdownCarrinho(false)}
              onClick={irParaCarrinho}
            >
              <FaShoppingCart size={34} />
              {carrinho?.quantidadeTotal ? <span className="contador">{carrinho.quantidadeTotal}</span> : null}

              {mostrarDropdownCarrinho && carrinho?.itens?.length ? (
                <div className="dropdown-carrinho">
                  {carrinho.itens.map(item => (
                    <div key={item.idItemCarrinho} className="item-dropdown">
                      <span>{item.nomeProduto}</span>
                      <span>Qtd: {item.quantidade}</span>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {user ? (
            <div className="user" onClick={toggleDropdownPerfil}>
              <img src={iconPerfil} alt="icon perfil" id="icon-perfil" />
              {mostrarDropdownPerfil && (
                <div className="dropdown-carrinho">
                  <div className="item-dropdown"><Link to="/perfil">Perfil</Link></div>
                  {user.tipoUsuario?.idTipoUsuario === 2 && (
                    <div className="item-dropdown"><Link to="/paginaAdmin">Gerenciar</Link></div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Link to="/login"><div className="user"><img src={iconPerfil} alt="icon perfil" id="icon-perfil" /></div></Link>
          )}
        </div>
      </header>

      {isMobile && <Sidebar isOpen={sidebarAberta} onClose={() => setSidebarAberta(false)} />}
    </>
  );
}

export default Header;
