import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaTimesCircle } from "react-icons/fa";
import "./CanceladoPedido.css";

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

export default function CanceladoPedido() {
  const [searchParams] = useSearchParams();
  const pedidoId = searchParams.get("pedido");
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function buscar() {
      try {
        const r = await axios.get(
          `http://localhost:8080/pedidos-usuarios/${pedidoId}`
        );
        setPedido(r.data);
      } catch {
        setErro("Erro ao carregar pedido.");
      }
    }
    buscar();
  }, [pedidoId]);

  if (erro) return <p className="error">{erro}</p>;
  if (!pedido) return <p className="loading">Carregando...</p>;

  return (
    <div className="cancelado-container">
      <FaTimesCircle className="cancelado-icone" />

      <h1>Pagamento Cancelado</h1>

      <div className="pedido-info">
        <div>ID: #{pedido.idPedidoUsuario}</div>
        <div>Nome: {pedido.nomeUsuario}</div>
        <div>Data: {pedido.dataPedido}</div>
        <div>Status: <span className="status-badge cancelado">CANCELADO</span></div>
      </div>

      <h2>Itens do Pedido</h2>
      <div className="itens-pedido">
        {pedido.itens.map((item, i) => (
          <div key={i} className="item-card">
            {item.nomeProduto} — Qtd: {item.quantidade}
          </div>
        ))}
      </div>

      <button className="btn-home" onClick={() => navigate("/")}>
        Voltar à Home
      </button>
    </div>
  );
}
