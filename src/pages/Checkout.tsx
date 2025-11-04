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
        console.log("🔄 Buscando dados do carrinho...");

        const resCarrinho = await api.get(`/carrinho/${user.idUsuario}`);
        const dadosCarrinho = resCarrinho.data;
        console.log("🛒 Dados do carrinho recebidos:", dadosCarrinho);

        if (!dadosCarrinho || !dadosCarrinho.itens) {
          console.warn("⚠️ Nenhum item encontrado no carrinho!");
          setLoading(false);
          return;
        }

        const valorFrete = 15;
        const valorDesconto = 0;
        const valorFinalCalculado = (dadosCarrinho.valorTotal || 0) + valorFrete;

        setPedido({
          idPedidoUsuario: dadosCarrinho.idCarrinho,
          itens: dadosCarrinho.itens,
          frete: valorFrete,
          desconto: valorDesconto,
          valorTotal: dadosCarrinho.valorTotal || 0,
          valorFinal: valorFinalCalculado,
          enderecoEntrega: dadosCarrinho.enderecoEntrega || null,
        });

        const resEnderecos = await api.get(`/enderecos/${user.idUsuario}`);
        console.log("🏠 Endereços retornados do backend:", resEnderecos.data);

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
          console.log("✅ Endereço selecionado padrão:", enderecosFormatados[0]);
        }
      } catch (err) {
        console.error("❌ Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [user]);

  const handleSelecionarEndereco = (idEndereco: number) => {
    const endereco = enderecos.find(e => e.idEndereco === idEndereco) || null;
    console.log("📦 Endereço selecionado:", endereco);
    setEnderecoSelecionado(endereco);
  };

  const handleFinalizarCompra = async () => {
    if (!pedido || !enderecoSelecionado) {
      alert("Selecione um endereço antes de finalizar a compra.");
      return;
    }

    try {
      console.log("💳 Enviando dados para pagamento...");
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
      console.log("🧾 PagamentoDTO:", pagamentoDTO);

      const res = await api.post(`/pagamentos/finalizar/${user.idUsuario}`, pagamentoDTO);
      console.log("✅ Resposta do backend:", res.data);

      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      console.error("❌ Erro ao finalizar compra:", err);
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
            <p>Valor: R$ {(pedido.valorTotal || 0).toFixed(2)}</p>
            <p>Frete: R$ {(pedido.frete || 0).toFixed(2)}</p>
            <h3>Valor Final: R$ {(pedido.valorFinal || 0).toFixed(2)}</h3>
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
