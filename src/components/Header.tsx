import React, { useState, useEffect } from "react";
import "./Header.css";
import iconPerfil from "../assets/images/icones/iconPerfil.png";
import iconPesquisa from "../assets/images/icones/iconPesquisa.png";
import { FaShoppingCart, FaBars } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import Sidebar from "./Sidebar";

interface ItemCarrinhoDTO {
  idItemCarrinho: number;
  nomeProduto: string;
  quantidade: number;
  subTotal: number;
}

interface CarrinhoDTO {
  idCarrinho: number;
  quantidadeTotal: number;
  valorTotal: number;
  itens: ItemCarrinhoDTO[];
}

const categoriasDisponiveis = [
  "hortifruti",
  "bebidas",
  "mercearia",
  "limpeza",
  "açougue",
  "higiene",
  "padaria",
  "petshop",
];

function Header() {
  const [busca, setBusca] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState<CarrinhoDTO | null>(null);
  const [mostrarDropdownCarrinho, setMostrarDropdownCarrinho] = useState(false);
  const [mostrarDropdownPerfil, setMostrarDropdownPerfil] = useState(false);
  const [sidebarAberta, setSidebarAberta] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const buscaTratada = busca.toLowerCase().replace(/\s+/g, "");
    if (!buscaTratada) {
      alert("Digite algo para buscar!");
      return;
    }

    if (categoriasDisponiveis.includes(buscaTratada)) {
      navigate(`/categoria/${buscaTratada}`);
      setBusca("");
      return;
    }

    try {
      const response = await api.get(`/produto/busca?nome=${buscaTratada}`);
      if (response.data && response.data.length > 0) {
        navigate(`/busca/${buscaTratada}`);
      } else {
        alert("Nenhum produto encontrado para essa busca.");
      }
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
      alert("Ocorreu um erro ao realizar a busca. Tente novamente mais tarde.");
    }

    setBusca("");
  };

  useEffect(() => {
    if (!user?.idUsuario) return;
    api
      .get(`/carrinho/${user.idUsuario}`)
      .then((res) => setCarrinho(res.data))
      .catch((err) => console.error(err));
  }, [user]);

  const irParaCarrinho = () => {
    navigate("/carrinho");
  };

  const toggleDropdownPerfil = () => {
    setMostrarDropdownPerfil((prev) => !prev);
  };

  const toggleSidebar = () => {
    setSidebarAberta(prev => !prev);
  };

  useEffect(() => {
    const handleClickFora = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".user")) {
        setMostrarDropdownPerfil(false);
      }
    };
    document.addEventListener("click", handleClickFora);
    return () => document.removeEventListener("click", handleClickFora);
  }, []);

  return (
    <>
      <header className="header">
        <button className="menu-hamburger" onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>

        <Link to={"/"}>
          <div className="logo">
            <img src="/logo.png" className="logo" alt="logo" />
          </div>
        </Link>

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

      <div className="user-icons">
        {user && (
          <div
            className="carrinho-icon"
            onMouseEnter={() => setMostrarDropdownCarrinho(true)}
            onMouseLeave={() => setMostrarDropdownCarrinho(false)}
            onClick={irParaCarrinho}
          >
            <FaShoppingCart size={34} />
            {carrinho && carrinho.quantidadeTotal > 0 && (
              <span className="contador">{carrinho.quantidadeTotal}</span>
            )}
            {mostrarDropdownCarrinho && carrinho && carrinho.itens.length > 0 && (
              <div className="dropdown-carrinho">
                {carrinho.itens.map(item => (
                  <div key={item.idItemCarrinho} className="item-dropdown">
                    <span>{item.nomeProduto}</span>
                    <span>Qtd: {item.quantidade}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PERFIL COM DROPDOWN POR CLIQUE */}
        {user ? (
          <div className="user" onClick={toggleDropdownPerfil}>
            <img src={iconPerfil} alt="icon perfil" id="icon-perfil" />
            {mostrarDropdownPerfil && (
              <div className="dropdown-carrinho">
                <div className="item-dropdown">
                  <Link to="/perfil">Perfil</Link>
                </div>
                {user?.tipoUsuario?.idTipoUsuario === 2 && (
  <div className="item-dropdown">
    <Link to="/paginaAdmin">Gerenciar</Link>
  </div>
)}
              </div>
            )}
          </div>
        ) : (
          <Link to="/login">
            <div className="user">
              <img src={iconPerfil} alt="icon perfil" id="icon-perfil" />
            </div>
          </Link>
        )}
      </div>
    </header>
  );
}

export default Header;