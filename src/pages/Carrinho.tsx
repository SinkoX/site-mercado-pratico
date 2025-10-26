import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Carrinho.css";

// Tipos do DTO do backend
interface ItemCarrinhoDTO {
  idItemCarrinho: number;
  nomeProduto: string;
  quantidade: number;
  subTotal: number;
}

interface CarrinhoDTO {
  idCarrinho: number;
  nomeUsuario: string;
  valorTotal: number;
  quantidadeTotal: number;
  itens: ItemCarrinhoDTO[];
}

function Carrinho() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState<CarrinhoDTO | null>(null);
  const [loading, setLoading] = useState(true);

  // Busca o carrinho ao carregar a página
  const fetchCarrinho = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/carrinho/${user.idUsuario}`);
      setCarrinho(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCarrinho();
  }, [user]);

  // Atualiza quantidade do item
  const handleAtualizarQuantidade = async (idItem: number, quantidade: number) => {
    if (!user || quantidade < 1) return;
    try {
      await api.put(
        `/itens-carrinho/${user.idUsuario}/atualizar/${idItem}?quantidade=${quantidade}`
      );
      fetchCarrinho();
    } catch (err) {
      console.error(err);
    }
  };

  // Remove item do carrinho
  const handleRemoverItem = async (idProduto: number) => {
    if (!user) return;
    try {
      await api.delete(`/carrinho/${user.idUsuario}/remover/${idProduto}`);
      fetchCarrinho();
    } catch (err) {
      console.error(err);
    }
  };

  // Limpa todo o carrinho
  const handleLimparCarrinho = async () => {
    if (!user) return;
    try {
      await api.delete(`/carrinho/${user.idUsuario}/limpar`);
      fetchCarrinho();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return <p>Você precisa estar logado para acessar o carrinho.</p>;
  }

  if (loading) {
    return <p>Carregando carrinho...</p>;
  }

  if (!carrinho || carrinho.itens.length === 0) {
    return (
      <div className="carrinho-page">
        <Header />
        <div className="carrinho-vazio">
          <h2>🛒 Seu carrinho está vazio!</h2>
          <p>Adicione produtos e eles aparecerão aqui. 😄</p>
          <button onClick={() => navigate("/")}>Voltar para a Home</button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="carrinho-page">
      <Header />
      <h1>Carrinho de {carrinho.nomeUsuario}</h1>

      <table className="carrinho-table">
        <thead>
          <tr>
            <th>Produto</th>
            <th>Quantidade</th>
            <th>Subtotal</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {carrinho.itens.map((item) => (
            <tr key={item.idItemCarrinho}>
              <td>{item.nomeProduto}</td>
              <td>
                <input
                  type="number"
                  value={item.quantidade}
                  min={1}
                  onChange={(e) =>
                    handleAtualizarQuantidade(item.idItemCarrinho, Number(e.target.value))
                  }
                />
              </td>
              <td>R$ {item.subTotal.toFixed(2)}</td>
              <td>
                <button onClick={() => handleRemoverItem(item.idItemCarrinho)}>Remover</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="carrinho-total">
        <p>Total de itens: {carrinho.quantidadeTotal}</p>
        <p>Valor total: R$ {carrinho.valorTotal.toFixed(2)}</p>
      </div>

      <div className="carrinho-acoes">
        <button onClick={handleLimparCarrinho}>Limpar Carrinho</button>
      </div>

      <Footer />
    </div>
  );
}

export default Carrinho;
