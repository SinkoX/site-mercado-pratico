import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckoutCard from "../components/CheckoutCard";
import "../components/Checkout.css";

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

interface EnderecoDTO {
  idEndereco: number;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento?: string;
}

interface PedidoDTO {
  idPedidoUsuario: number;
  itens: ItemCarrinhoDTO[];
  frete: number;
  desconto: number;
  valorTotal: number;
  valorFinal: number;
  enderecoEntrega?: EnderecoDTO;
}

function Checkout() {
  const { user } = useAuth();
  const [pedido, setPedido] = useState<PedidoDTO | null>(null);
  const [enderecos, setEnderecos] = useState<EnderecoDTO[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<EnderecoDTO | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDados = async () => {
      try {
        const resCarrinho = await api.get(`/carrinho/${user.idUsuario}`);
        const dadosCarrinho = resCarrinho.data;
        console.log("Dados do carrinho:", dadosCarrinho);

        setPedido({
          idPedidoUsuario: dadosCarrinho.idCarrinho,
          itens: dadosCarrinho.itens,
          frete: 15,
          desconto: 0,
          valorTotal: dadosCarrinho.valorTotal,
          valorFinal: dadosCarrinho.valorTotal + 15,
          enderecoEntrega: dadosCarrinho.enderecoEntrega || null,
        });

        const resEnderecos = await api.get(`/enderecos/${user.idUsuario}`);
        console.log("Endereços retornados do backend:", resEnderecos.data);

        // Se for objeto único, converte para array
        let enderecosArray: any[] = [];
        if (Array.isArray(resEnderecos.data)) {
          enderecosArray = resEnderecos.data;
        } else if (resEnderecos.data && typeof resEnderecos.data === "object") {
          enderecosArray = [resEnderecos.data];
        }

        const enderecosFormatados = enderecosArray.map((end: any) => ({
          idEndereco: end.id_endereco,
          cep: end.cep,
          rua: end.rua,
          numero: end.numero,
          bairro: end.bairro,
          cidade: end.cidade,
          complemento: end.complemento,
        }));

        setEnderecos(enderecosFormatados);

        if (enderecosFormatados.length > 0) {
          setEnderecoSelecionado(enderecosFormatados[0]);
          console.log("Endereço selecionado padrão:", enderecosFormatados[0]);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [user]);

  const handleSelecionarEndereco = (idEndereco: number) => {
    const endereco = enderecos.find(e => e.idEndereco === idEndereco) || null;
    setEnderecoSelecionado(endereco);
  };

  const handleFinalizarCompra = async () => {
    if (!pedido || !enderecoSelecionado) return;

    try {
      const pagamentoDTO = {
        idEnderecoEntrega: enderecoSelecionado.idEndereco,
        frete: pedido.frete,
        desconto: pedido.desconto,
        itens: pedido.itens.map(item => ({
          idProduto: item.idProduto,
          nomeProduto: item.nomeProduto,
          quantidade: item.quantidade,
          subTotal: item.subTotal,
        })),
      };

      const res = await api.post(`/pagamentos/finalizar/${user.idUsuario}`, pagamentoDTO);
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      console.error(err);
      alert("Erro ao finalizar compra. Tente novamente.");
    }
  };

  if (!user) return <p>Você precisa estar logado para acessar o checkout.</p>;
  if (loading) return <p>Carregando pedido...</p>;
  if (!pedido || pedido.itens.length === 0) return <p>Seu carrinho está vazio.</p>;

  return (
    <div className="checkout-page">
      <Header />
      <h1 className="titulo-checkout">Resumo do Pedido</h1>

      <div className="checkout-container">
        <div className="checkout-itens">
          {pedido.itens.map(item => (
            <CheckoutCard key={item.idItemCarrinho} item={item} />
          ))}
        </div>

        <div className="checkout-resumo">
          <h2>Endereço de Entrega</h2>

          {enderecoSelecionado && (
            <select
              value={enderecoSelecionado.idEndereco}
              onChange={(e) => handleSelecionarEndereco(Number(e.target.value))}
            >
              {enderecos.map(end => (
                <option key={end.idEndereco} value={end.idEndereco}>
                  {end.rua}, {end.numero} - {end.bairro}, {end.cidade} - {end.cep}
                </option>
              ))}
            </select>
          )}

          <div className="resumo-financeiro">
            <p>Subtotal: R$ {pedido.valorTotal.toFixed(2)}</p>
            <p>Frete: R$ {pedido.frete.toFixed(2)}</p>
            <p>Desconto: R$ {pedido.desconto.toFixed(2)}</p>
            <h3>Total: R$ {pedido.valorFinal.toFixed(2)}</h3>
          </div>

          <button className="btn-finalizar-checkout" onClick={handleFinalizarCompra}>
            Finalizar Compra
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;
