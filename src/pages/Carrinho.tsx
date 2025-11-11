import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "./Carrinho.css";
import PlaceHolder from "../assets/images/categorias/placeholder.png";

interface ItemCarrinhoDTO {
  idItemCarrinho: number;
  idProduto: number;
  nomeProduto: string;
  quantidade: number;
  subTotal: number;
  imgUrl?: string;
  img_url?: string;
  imagemProdutoBase64?: string;
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

  const atualizarEstadoItem = (idItem: number, novaQuantidade: number) => {
    if (!carrinho) return;

    const itensAtualizados = carrinho.itens.map((item) =>
      item.idItemCarrinho === idItem
        ? {
            ...item,
            subTotal: (item.subTotal / item.quantidade) * novaQuantidade,
            quantidade: novaQuantidade,
          }
        : item
    );

    const valorTotalAtualizado = itensAtualizados.reduce(
      (sum, item) => sum + item.subTotal,
      0
    );
    const quantidadeTotalAtualizada = itensAtualizados.reduce(
      (sum, item) => sum + item.quantidade,
      0
    );

    setCarrinho({
      ...carrinho,
      itens: itensAtualizados,
      valorTotal: valorTotalAtualizado,
      quantidadeTotal: quantidadeTotalAtualizada,
    });
  };

  const handleAtualizarQuantidade = async (
    idItem: number,
    quantidade: number
  ) => {
    if (!user || quantidade < 1) return;

    try {
      await api.put(
        `/itens-carrinho/${user.idUsuario}/atualizar/${idItem}?quantidade=${quantidade}`
      );
      atualizarEstadoItem(idItem, quantidade);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRemoverItem = async (
    idProduto: number,
    idItemCarrinho: number
  ) => {
    if (!user) return;

    try {
      await api.delete(`/carrinho/${user.idUsuario}/remover/${idProduto}`);
      if (carrinho) {
        const itensRestantes = carrinho.itens.filter(
          (item) => item.idItemCarrinho !== idItemCarrinho
        );
        const valorTotalAtualizado = itensRestantes.reduce(
          (sum, item) => sum + item.subTotal,
          0
        );
        const quantidadeTotalAtualizada = itensRestantes.reduce(
          (sum, item) => sum + item.quantidade,
          0
        );

        setCarrinho({
          ...carrinho,
          itens: itensRestantes,
          valorTotal: valorTotalAtualizado,
          quantidadeTotal: quantidadeTotalAtualizada,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLimparCarrinho = async () => {
    if (!user) return;

    try {
      await api.delete(`/carrinho/${user.idUsuario}/limpar`);
      setCarrinho({
        ...carrinho!,
        itens: [],
        valorTotal: 0,
        quantidadeTotal: 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) return <p>Você precisa estar logado para acessar o carrinho.</p>;
  if (loading) return <p>Carregando carrinho...</p>;

  if (!carrinho || carrinho.itens.length === 0)
    return (
      <div className="carrinho-page">
        <Header />
        <div className="carrinho-vazio">
          <div className="icone-vazio-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
              alt="Carrinho vazio"
              className="icone-vazio"
            />
          </div>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos e volte aqui para finalizar sua compra.</p>
          <button onClick={() => navigate("/")}>Ver produtos</button>
        </div>
        <Footer />
      </div>
    );

  console.log(carrinho);

  return (
    <div className="carrinho-page">
      <Header />
      <h1 className="titulo-carrinho">Meu Carrinho</h1>
      <div className="carrinho-itens">
        {carrinho.itens.map((item) => {
          const imagemFinal =
            (item.imgUrl && item.imgUrl.trim() !== "" && item.imgUrl) ||
            (item.img_url && item.img_url.trim() !== "" && item.img_url) ||
            (item.imagemProdutoBase64
              ? `data:image/png;base64,${item.imagemProdutoBase64}`
              : PlaceHolder);
          console.log(item);
          return (
            <div className="item-card" key={item.idItemCarrinho}>
              <img
                src={imagemFinal}
                alt={item.nomeProduto}
                className="item-img"
              />
              <div className="item-info">
                <h3>{item.nomeProduto}</h3>
                <p className="item-preco">R$ {item.subTotal.toFixed(2)}</p>
                <div className="item-controles">
                  <button
                    className="btn-qtd"
                    onClick={() =>
                      handleAtualizarQuantidade(
                        item.idItemCarrinho,
                        item.quantidade - 1
                      )
                    }
                  >
                    –
                  </button>
                  <span>{item.quantidade}</span>
                  <button
                    className="btn-qtd"
                    onClick={() =>
                      handleAtualizarQuantidade(
                        item.idItemCarrinho,
                        item.quantidade + 1
                      )
                    }
                  >
                    +
                  </button>
                </div>
              </div>
              <button
                className="btn-remover"
                onClick={() =>
                  handleRemoverItem(item.idProduto, item.idItemCarrinho)
                }
              >
                Remover
              </button>
            </div>
          );
        })}
      </div>

      <div className="resumo-carrinho">
        <p>
          Total de itens: <strong>{carrinho.quantidadeTotal}</strong>
        </p>
        <h2>Total: R$ {carrinho.valorTotal.toFixed(2)}</h2>
        <div className="botoes-carrinho">
          <button className="btn-limpar" onClick={handleLimparCarrinho}>
            Limpar
          </button>
          <button
            className="btn-finalizar"
            onClick={() => navigate("/checkout", { state: { carrinho } })}
          >
            Finalizar Pedido
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Carrinho;
