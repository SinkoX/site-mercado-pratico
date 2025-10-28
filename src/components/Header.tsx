import React, { useState, useEffect } from "react";
import "./Header.css";
import iconPerfil from "../assets/images/icones/iconPerfil.png";
import iconPesquisa from "../assets/images/icones/iconPesquisa.png";
import { FaShoppingCart } from "react-icons/fa"; 
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";

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
  "hortifruti", "bebidas", "mercearia", "limpeza",
  "açougue", "higiene", "padaria", "petshop"
];

function Header() {
  const [busca, setBusca] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState<CarrinhoDTO | null>(null);
  const [mostrarDropdown, setMostrarDropdown] = useState(false);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const buscaTratada = busca.toLowerCase().replace(/\s+/g, "");
  if (!buscaTratada) {
    alert("Digite algo para buscar!");
    return;
  }

  // Se for categoria existente
  if (categoriasDisponiveis.includes(buscaTratada)) {
    navigate(`/categoria/${buscaTratada}`);
    setBusca("");
    return;
  }

  try {
    // Verifica se há produtos correspondentes antes de navegar
    const response = await api.get(`/produto/buscar?termo=${buscaTratada}`);

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
