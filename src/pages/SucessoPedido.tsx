import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaCheckCircle } from "react-icons/fa";
import "./SucessoPedido.css";

interface Item {
  nomeProduto: string;
  quantidade: number;
  subTotal: number;
}

interface Pedido {
  idPedidoUsuario: number;
  nomeUsuario: string;
  valorTotal: number;
  frete?: number;
  desconto?: number;
  valorFinal?: number;
  statusPedido: string;
  dataPedido: string;
  itens: Item[];
}

export default function SucessoPedido() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get("pedido");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!pedidoId) {
      setErro("Pedido inválido.");
      setCarregando(false);
      return;
    }

    async function buscarPedido() {
      try {
        const resposta = await axios.get(
          `http://localhost:8080/pedidos-usuarios/${pedidoId}`
        );
        setPedido(resposta.data);
      } catch {
        setErro("Erro ao carregar pedido.");
      } finally {
        setCarregando(false);
      }
    }

    buscarPedido();
  }, [pedidoId]);

  if (carregando) return <p className="loading">Carregando pedido...</p>;
  if (erro) return <p className="error">{erro}</p>;
  if (!pedido) return <p className="error">Pedido não encontrado.</p>;

  return (
    <div className="sucesso-container">
      {/* Confirmação animada */}
      <div className="icone-container">
        <FaCheckCircle className="sucesso-icone" />
      </div>

      <h1>Pedido Confirmado!</h1>

      {/* Informações do pedido */}
      <div className="pedido-info">
        <div className="info-item">
          <span>ID:</span> #{pedido.idPedidoUsuario}
        </div>
        <div className="info-item">
          <span>Nome:</span> {pedido.nomeUsuario}
        </div>
        <div className="info-item">
          <span>Data:</span> {pedido.dataPedido}
        </div>
        <div className="info-item">
          <span>Status:</span>
          <span className={`status-badge ${pedido.statusPedido.toLowerCase()}`}>
            {pedido.statusPedido}
          </span>
        </div>
      </div>

      {/* Itens do pedido */}
      <h2>Itens do Pedido</h2>
      <div className="itens-pedido">
        {pedido.itens.map((item, i) => (
          <div key={i} className="item-card">
            <div className="item-nome">{item.nomeProduto}</div>
            <div className="item-qtd">Qtd: {item.quantidade}</div>
            <div className="item-preco">R$ {item.subTotal.toFixed(2)}</div>
          </div>
        ))}
      </div>

      {/* Valores do pedido */}
      <div className="valores-pedido">
        <div>
          <span>Total:</span> R$ {pedido.valorTotal.toFixed(2)}
        </div>
        <div>
          <span>Frete:</span> R$ {(pedido.frete ?? 0).toFixed(2)}
        </div>
        <div>
          <span>Desconto:</span> R$ {(pedido.desconto ?? 0).toFixed(2)}
        </div>
        <div className="valor-final">
          <span>Valor Final:</span> R${" "}
          {(pedido.valorFinal ?? pedido.valorTotal).toFixed(2)}
        </div>
      </div>

      <button className="btn-home" onClick={() => navigate("/")}>
        Voltar à Home
      </button>
    </div>
  );
}
