import React, { useState, useEffect } from "react";
import "./Header.css";
import iconPerfil from "../assets/images/icones/iconPerfil.png";
import iconPesquisa from "../assets/images/icones/iconPesquisa.png";
import { FaShoppingCart } from "react-icons/fa"; 
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";

interface HeaderProps {}

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
  "Hortifruti", "Bebidas", "Mercearia", "Limpeza",
  "Açougue", "Higiene", "Padaria", "Pet Shop"
];

function Header({}: HeaderProps) {
  const [busca, setBusca] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState<CarrinhoDTO | null>(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!busca.trim()) return;

    // Se for categoria, navega para categoria
    if (categoriasDisponiveis.includes(busca)) {
      navigate(`/categoria/${busca}`);
    } else {
      // Para outros termos, vai para página de busca
      navigate(`/busca/${busca}`);
    }

    setBusca(""); // limpa input
  };

  useEffect(() => {
    if (!user?.idUsuario) return;
    api.get(`/carrinho/${user.idUsuario}`)
      .then(res => setCarrinho(res.data))
      .catch(err => console.error(err));
  }, [user]);

  const irParaCarrinho = () => {
    navigate("/carrinho");
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

      <div className="user-icons">
        {user && (
          <div
            className="carrinho-icon"
            onMouseEnter={() => setMostrarDropdown(true)}
            onMouseLeave={() => setMostrarDropdown(false)}
            onClick={irParaCarrinho}
          >
            <FaShoppingCart size={34} />
            {carrinho && carrinho.quantidadeTotal > 0 && (
              <span className="contador">{carrinho.quantidadeTotal}</span>
            )}
            {mostrarDropdown && carrinho && carrinho.itens.length > 0 && (
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
        <Link to={user ? "/perfil" : "/login"}>
          <div className="user">
            <img src={iconPerfil} alt="icon perfil" id="icon-perfil" />
          </div>
        </Link>
      </div>
    </header>
  );
}

export default Header;
