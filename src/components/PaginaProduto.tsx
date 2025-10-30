import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import MenuCategoria from "../components/MenuCategoria";
import Footer from "../components/Footer";
import "../pages/PaginaProduto.css";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  descricao?: string;
  imgUrl?: string;
  imagemProdutoBase64?: string;
}

const PaginaProduto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false); // Estado para controlar o popup

  useEffect(() => {
    if (!id) return;

    setLoading(true);
    api
      .get(`/produto/${id}`)
      .then((res) => {
        const data = res.data;
        setProduto({ ...data, precoProduto: Number(data.precoProduto) });
      })
      .catch((err) => console.error("Erro ao buscar produto:", err))
      .finally(() => setLoading(false));
  }, [id]);

  const aumentar = () => setQuantidade((q) => q + 1);
  const diminuir = () => setQuantidade((q) => (q > 1 ? q - 1 : 1));

  const adicionarAoCarrinho = async () => {
    if (!user) {
      setShowLoginPopup(true); // Exibe o popup se o usuário não estiver logado
      return;
    }
    if (!produto) return;

    try {
      await api.post(
        `/carrinho/${user.idUsuario}/adicionar/${produto.idProduto}`,
        null,
        { params: { quantidade } }
      );

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000); // Desaparece depois de 3s
    } catch (err) {
      console.error("Erro ao adicionar produto ao carrinho:", err);
      alert("Erro ao adicionar produto ao carrinho.");
    }
  };

  const fecharPopup = () => {
    setShowLoginPopup(false); // Fecha o popup
  };

  if (loading) return <p className="loading">Carregando produto...</p>;
  if (!produto) return <p className="loading">Produto não encontrado.</p>;

  const imagemFinal =
    produto.imgUrl && produto.imgUrl.trim() !== ""
      ? produto.imgUrl
      : produto.imagemProdutoBase64
      ? `data:image/png;base64,${produto.imagemProdutoBase64}`
      : "/placeholder.png";

  return (
    <div>
      <Header />
      <MenuCategoria />

      <div className="produto-container">
        <div className="produto-card">
          <div className="imagem-container">
            <img
              src={imagemFinal}
              alt={produto.nomeProduto}
              className="product-image"
            />
          </div>

          <div className="detalhes-produto">
            <h1 className="nome-produto">{produto.nomeProduto}</h1>
            {produto.descricaoProduto && (
              <p className="descricao-junta">{produto.descricaoProduto}</p>
            )}

            <p className="preco">
              R$ {(produto.precoProduto * quantidade).toFixed(2)}
            </p>

            <div className="quantidade">
              <button onClick={diminuir}>−</button>
              <span>{quantidade}</span>
              <button onClick={aumentar}>+</button>
            </div>

            <button className="button-add" onClick={adicionarAoCarrinho}>
              Adicionar ao Carrinho
            </button>
          </div>
        </div>
      </div>

      {/* Toast animado */}
      {showToast && (
        <div className="toast-carrinho">
          🛒 Item adicionado ao carrinho!
        </div>
      )}

      {/* Popup de Login */}
      {showLoginPopup && (
        <div className="login-popup-overlay">
          <div className="login-popup">
            <span className="close-popup" onClick={fecharPopup}>
              ✖
            </span>
            <h2>Você precisa estar logado para adicionar o produto ao carrinho.</h2>
            <p>
              <button className="button-popup" onClick={() => alert("Ir para Login")}>
                Fazer Login
              </button>
            </p>
            <p>
              <button className="button-popup" onClick={() => alert("Ir para Cadastro")}>
                Cadastrar-se
              </button>
            </p>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PaginaProduto;
