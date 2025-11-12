import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MenuCategoria from "../components/MenuCategoria";
import "../pages/PaginaProduto.css";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  descricaoProduto?: string;
  imgUrl?: string;
  imagemProdutoBase64?: string;
}

const PaginaProduto: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState(1);
  const [loading, setLoading] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

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
      setShowLoginPopup(true);
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
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      console.error("Erro ao adicionar produto ao carrinho:", err);
      alert("Erro ao adicionar produto ao carrinho.");
    }
  };

  const fecharPopup = () => setShowLoginPopup(false);

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
        <div className="toast-carrinho">🛒 Item adicionado ao carrinho!</div>
      )}

      {/* Popup de Login */}
      {showLoginPopup && (
        <div className="login-popup-overlay">
          <div className="login-popup">
            <span className="close-popup" onClick={fecharPopup}>
              ✖
            </span>
            <div className="popup-content">
              <h2>Você precisa estar logado</h2>
              <p>
                Para adicionar produtos ao carrinho, faça login ou cadastre-se.
              </p>
              <div className="popup-buttons">
                <button
                  className="button-popup"
                  onClick={() => navigate("/login")}
                >
                  Fazer Login
                </button>
                <button
                  className="button-popup secondary"
                  onClick={() => navigate("/cadastro")}
                >
                  Cadastrar-se
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default PaginaProduto;
