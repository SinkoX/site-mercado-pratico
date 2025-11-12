import React, { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CheckoutCard from "../components/CheckoutCard";
import "./Checkout.css";

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

interface FormDataEnderecoUsuario {
  cep: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
  complemento: string;
  idUsuario?: number;
}

function Checkout() {
  const [formData, setFormData] = useState<FormDataEnderecoUsuario>({
    cep: "",
    numero: "",
    rua: "",
    bairro: "",
    cidade: "",
    complemento: "",
  });
  const { user, setUser } = useAuth();
  const [pedido, setPedido] = useState<PedidoDTO | null>(null);
  const [enderecos, setEnderecos] = useState<EnderecoDTO[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] =
    useState<EnderecoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPopup, setShowLoginPopup] = useState(false);

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
        const valorFinalCalculado =
          (dadosCarrinho.valorTotal || 0) + valorFrete;

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
          console.log(
            "✅ Endereço selecionado padrão:",
            enderecosFormatados[0]
          );
        }
      } catch (err) {
        console.error("❌ Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDados();
  }, [user]);

  const fecharPopup = () => setShowLoginPopup(false);

  const handleSelecionarEndereco = (idEndereco: number) => {
    const endereco = enderecos.find((e) => e.idEndereco === idEndereco) || null;
    console.log("📦 Endereço selecionado:", endereco);
    setEnderecoSelecionado(endereco);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");

    if (value.length > 8) value = value.slice(0, 8);
    const maskedCep = value.replace(/^(\d{5})(\d)/, "$1-$2");
    setFormData((prev) => ({ ...prev, cep: maskedCep }));

    if (value.length === 8) {
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${value}/json/`,
          { method: "GET", headers: { "Content-Type": "application/json" } }
        );
        const data = await response.json();

        if (data.erro) {
          alert("CEP não encontrado!");
          return;
        }

        setFormData((prev) => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
        }));
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar o CEP. Tente novamente.");
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const idUsuario = localStorage.getItem("usuarioId");
      if (!idUsuario) {
        alert("Usuário não identificado! Faça login novamente.");
        return;
      }

      const response = await api.post(
        `/enderecos/usuario/${idUsuario}`,
        formData
      );
      console.log("Endereço cadastrado:", response.data);
      alert("Endereço cadastrado com sucesso!");

      // 🔄 Atualiza o usuário no contexto e no localStorage
      const resUser = await api.get(`/usuario/${idUsuario}`);
      setUser(resUser.data);
      localStorage.setItem("user", JSON.stringify(resUser.data));
    } catch (error) {
      console.error("Erro ao cadastrar endereço:", error);
      alert("Erro ao cadastrar o endereço. Tente novamente.");
    }
  };

  const refreshPage = () => {
    location.reload();
  };

  const handleFinalizarCompra = async () => {
    if (!pedido || !enderecoSelecionado) {
      setShowLoginPopup(true);
      return;
    }

    try {
      console.log("💳 Enviando dados para pagamento...");
      const pagamentoDTO = {
        idEnderecoEntrega: enderecoSelecionado.idEndereco,
        frete: pedido.frete,
        desconto: pedido.desconto,
        itens: pedido.itens.map((item) => ({
          idProduto: item.idProduto,
          nomeProduto: item.nomeProduto,
          quantidade: item.quantidade,
          subTotal: item.subTotal,
        })),
      };
      console.log("🧾 PagamentoDTO:", pagamentoDTO);

      const res = await api.post(
        `/pagamentos/finalizar/${user?.idUsuario}`,
        pagamentoDTO
      );
      console.log("✅ Resposta do backend:", res.data);

      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      console.error("❌ Erro ao finalizar compra:", err);
      alert("Erro ao finalizar compra. Tente novamente.");
    }
  };

  if (!user) return <p>Você precisa estar logado para acessar o checkout.</p>;
  if (loading) return <p>Carregando pedido...</p>;
  if (!pedido || pedido.itens.length === 0)
    return <p>Seu carrinho está vazio.</p>;

  return (
    <div className="checkout-page">
      <Header />
      <h1 className="titulo-checkout">Resumo do Pedido</h1>

      <div className="checkout-container">
        <div className="checkout-itens">
          {pedido.itens.map((item) => (
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
              {enderecos.map((end) => (
                <option key={end.idEndereco} value={end.idEndereco}>
                  {end.rua}, {end.numero} - {end.bairro}, {end.cidade} -{" "}
                  {end.cep}
                </option>
              ))}
            </select>
          )}

          <div className="resumo-financeiro">
            <p>Valor: R$ {(pedido.valorTotal || 0).toFixed(2)}</p>
            <p>Frete: R$ {(pedido.frete || 0).toFixed(2)}</p>
            <h3>Valor Final: R$ {(pedido.valorFinal || 0).toFixed(2)}</h3>
          </div>

          {showLoginPopup && (
            <div className="login-popup-overlay">
              <div className="login-popup">
                <span className="close-popup" onClick={fecharPopup}>
                  ✖
                </span>
                <div className="popup-content">
                  <h2>Insira seu CEP</h2>
                  <p>Insira seu CEP para receber os produtos.</p>
                  <form className="popup-buttons" onSubmit={handleSubmit}>
                    <div className="campos-principal">
                      <div className="campo-principal campo">
                        <label htmlFor="cep">CEP:</label>
                        <input
                          type="text"
                          id="cep"
                          name="cep"
                          value={formData.cep}
                          onChange={handleCepChange}
                          required
                          placeholder="00000-000"
                          maxLength={9}
                        />
                      </div>

                      <div className="campo-principal campo">
                        <label htmlFor="numero">Numero:</label>
                        <input
                          type="number"
                          id="numero"
                          name="numero"
                          value={formData.numero}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="campo">
                      <label htmlFor="complemento">Complemento</label>
                      <input
                        type="text"
                        id="complemento"
                        name="complemento"
                        value={formData.complemento}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <button
                      className="button-popup"
                      type="submit"
                      onClick={refreshPage}
                    >
                      Enviar
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          <button
            className="btn-finalizar-checkout"
            onClick={handleFinalizarCompra}
          >
            Finalizar Compra
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default Checkout;
