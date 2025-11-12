import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowLeft } from "react-icons/fa";
import "./GerenciarPedidos.css";

interface PedidoUsuario {
  idPedidoUsuario: number;
  nomeUsuario: string;
  valorTotal: number;
  frete?: number;
  desconto?: number;
  valorFinal?: number;
  statusPedido: string;
  dataPedido: string;
}

export default function GerenciarPedidos() {
  const [pedidos, setPedidos] = useState<PedidoUsuario[]>([]);
  const [pedidosFiltrados, setPedidosFiltrados] = useState<PedidoUsuario[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [pedidoSelecionado, setPedidoSelecionado] = useState<number | null>(
    null
  );
  const [mostrarModal, setMostrarModal] = useState(false);

  // FILTROS
  const [filtroId, setFiltroId] = useState("");
  const [filtroNome, setFiltroNome] = useState("");
  const [filtroData, setFiltroData] = useState("");
  const [filtroStatus, setFiltroStatus] = useState("");

  const API_URL = "http://localhost:8080/pedidos-usuarios";
  const navigate = useNavigate();

  useEffect(() => {
    buscarPedidos();
  }, []);

  useEffect(() => {
    filtrarPedidos();
  }, [filtroId, filtroNome, filtroData, filtroStatus, pedidos]);

  async function buscarPedidos() {
    try {
      console.log("🔄 Buscando pedidos do backend...");
      const resposta = await axios.get(API_URL);
      console.log("✅ Pedidos recebidos do backend:", resposta.data);

      const pedidosTratados = resposta.data.map((pedido: any) => ({
        idPedidoUsuario: pedido.idPedidoUsuario,
        nomeUsuario: pedido.nomeUsuario ?? "Usuário não identificado",
        valorTotal: Number(pedido.valorTotal ?? 0),
        frete: Number(pedido.frete ?? 0),
        desconto: Number(pedido.desconto ?? 0),
        valorFinal: Number(
          pedido.valorFinal ?? (pedido.valorTotal ?? 0) + (pedido.frete ?? 0)
        ),
        statusPedido: pedido.statusPedido ?? "Indefinido",
        dataPedido: pedido.dataPedido ?? "Data não informada",
      }));

      setPedidos(pedidosTratados);
      setPedidosFiltrados(pedidosTratados);
    } catch (erro) {
      console.error("❌ Erro ao buscar pedidos:", erro);
    } finally {
      setCarregando(false);
    }
  }

  function filtrarPedidos() {
    const normalizar = (texto: string) =>
      texto
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();

    let filtrados = pedidos;

    if (filtroId) {
      filtrados = filtrados.filter((p) =>
        p.idPedidoUsuario.toString().includes(filtroId)
      );
    }

    if (filtroNome) {
      const nomeFiltroNormalizado = normalizar(filtroNome);
      filtrados = filtrados.filter((p) =>
        normalizar(p.nomeUsuario).includes(nomeFiltroNormalizado)
      );
    }

    if (filtroData) {
      filtrados = filtrados.filter((p) => p.dataPedido === filtroData);
    }

    if (filtroStatus) {
      const statusFiltroNormalizado = normalizar(filtroStatus);
      filtrados = filtrados.filter((p) =>
        normalizar(p.statusPedido).includes(statusFiltroNormalizado)
      );
    }

    setPedidosFiltrados(filtrados);
  }

  function abrirModal(id: number) {
    setPedidoSelecionado(id);
    setMostrarModal(true);
  }

  function fecharModal() {
    setPedidoSelecionado(null);
    setMostrarModal(false);
  }

  async function confirmarExclusao() {
    if (!pedidoSelecionado) return;
    try {
      await axios.delete(`${API_URL}/${pedidoSelecionado}`);
      setPedidos((antigos) =>
        antigos.filter((p) => p.idPedidoUsuario !== pedidoSelecionado)
      );
      fecharModal();
    } catch (erro) {
      console.error("❌ Erro ao deletar pedido:", erro);
    }
  }

  if (carregando) {
    return (
      <div className="loading">
        <p>Carregando pedidos...</p>
      </div>
    );
  }

  return (
    <div className="gerenciar-pedidos-container">
      <main className="gerenciar-pedidos-main">
        <div className="home-icon" onClick={() => navigate(-1)}>
          <FaArrowLeft />
        </div>

        <h1>Gerenciar Pedidos</h1>

        {/* 🔍 FILTROS */}
        <div className="filtros-container">
          <input
            type="text"
            placeholder="Filtrar por ID"
            value={filtroId}
            onChange={(e) => setFiltroId(e.target.value)}
          />
          <input
            type="text"
            placeholder="Filtrar por Nome"
            value={filtroNome}
            onChange={(e) => setFiltroNome(e.target.value)}
          />
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="">Todos os Status</option>
            <option value="PENDENTE">Pendente</option>
            <option value="PAGO">Pago</option>
            <option value="CANCELADO">Cancelado</option>
          </select>
        </div>

        {pedidosFiltrados.length === 0 ? (
          <p>Nenhum pedido encontrado.</p>
        ) : (
          <table className="pedidos-tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuário</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Frete</th>
                <th>Valor Final</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pedidosFiltrados.map((pedido) => (
                <tr key={pedido.idPedidoUsuario}>
                  <td>{pedido.idPedidoUsuario}</td>
                  <td>{pedido.nomeUsuario}</td>
                  <td>{pedido.dataPedido}</td>
                  <td>R$ {pedido.valorTotal.toFixed(2)}</td>
                  <td>R$ {(pedido.frete ?? 0).toFixed(2)}</td>
                  <td>R$ {(pedido.valorFinal ?? 0).toFixed(2)}</td>
                  <td>{pedido.statusPedido}</td>
                  <td className="acoes-coluna">
                    <button
                      className="btn-excluir"
                      onClick={() => abrirModal(pedido.idPedidoUsuario)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 🗑️ MODAL */}
        {mostrarModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Confirmar Exclusão</h2>
              <p>Tem certeza que deseja excluir este pedido?</p>
              <div className="modal-buttons">
                <button onClick={confirmarExclusao} className="btn-confirmar">
                  Sim, Excluir
                </button>
                <button onClick={fecharModal} className="btn-cancelar">
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
