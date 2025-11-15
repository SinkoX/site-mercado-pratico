import { useEffect, useState } from "react";
import { ShoppingCart, Clock, Truck, CheckCircle, XCircle, Package } from "lucide-react";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";
import "./MeusPedidos.css";

interface ItemPedido {
  idItem?: number;
  nome: string;
  quantidade: number;
  precoUnitario: number;
  imagem?: string;
}

interface Pedido {
  idPedido: number;
  dataPedido: string;
  statusPedido: string;
  valorTotal: number;
  enderecoEntrega: string;
  itens: ItemPedido[];
}

const statusConfig = {
  todos: { label: "Todos", classe: "cinza", icon: ShoppingCart },
  pendente: { label: "Pendente", classe: "amarelo", icon: Clock },
  enviado: { label: "Enviado", classe: "azul", icon: Truck },
  entregue: { label: "Entregue", classe: "verde", icon: CheckCircle },
  cancelado: { label: "Cancelado", classe: "vermelho", icon: XCircle },
};

export default function MeusPedidos() {
  const { user } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroStatus, setFiltroStatus] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user?.idUsuario) return;

    const carregarPedidos = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await api.get(`/pedidos/usuario/${user.idUsuario}`);
        setPedidos(res.data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar seus pedidos.");
      } finally {
        setLoading(false);
      }
    };

    carregarPedidos();
  }, [user]);

  const pedidosFiltrados =
    filtroStatus === "todos"
      ? pedidos
      : pedidos.filter((p) => p.statusPedido.toLowerCase() === filtroStatus);

  const StatusBadge = ({ status }: { status: string }) => {
    const key = status.toLowerCase() as keyof typeof statusConfig;
    const cfg = statusConfig[key] || statusConfig.pendente;
    const Icon = cfg.icon;

    return (
      <div className={`status-badge ${cfg.classe}`}>
        <Icon size={18} />
        {cfg.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="tela-carregando">
        <div className="conteudo-carregando">
          <div className="spinner"></div>
          <p>Carregando pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-pedidos">
      <div className="container-pedidos">

        <div className="cabecalho">
          <h1>Meus Pedidos</h1>
          <p>Acompanhe suas compras</p>
        </div>

        {/* Filtros */}
        <div className="filtros">
          {Object.entries(statusConfig).map(([key, cfg]) => (
            <button
              key={key}
              className={`botao-filtro ${filtroStatus === key ? "ativo" : ""}`}
              onClick={() => setFiltroStatus(key)}
            >
              {cfg.label}
            </button>
          ))}
        </div>

        {error && <p className="mensagem-erro">{error}</p>}

        <div className="lista-pedidos">
          {pedidosFiltrados.length === 0 ? (
            <div className="sem-pedidos">
              <ShoppingCart size={48} />
              <p>Nenhum pedido encontrado.</p>
            </div>
          ) : (
            pedidosFiltrados.map((pedido) => (
              <div key={pedido.idPedido} className="pedido-card">
                <div className="pedido-header">
                  <div>
                    <h3>Pedido #{pedido.idPedido}</h3>
                    <p>
                      Data:{" "}
                      {new Date(pedido.dataPedido).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                  <StatusBadge status={pedido.statusPedido} />
                </div>

                {/* Itens */}
                <div className="pedido-itens">
                  {pedido.itens.map((item, i) => (
                    <div key={i} className="item-linha">
                      <div className="item-imagem">
                        {item.imagem ? (
                          <img src={item.imagem} alt={item.nome} />
                        ) : (
                          <Package size={32} />
                        )}
                      </div>
                      <div className="item-info">
                        <h4>{item.nome}</h4>
                        <p>Quantidade: {item.quantidade}</p>
                      </div>
                      <div className="item-preco">
                        <strong>
                          R${(item.precoUnitario * item.quantidade).toFixed(2)}
                        </strong>
                        <p>R${item.precoUnitario.toFixed(2)} cada</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pedido-total">
                  <span>Total: </span>
                  <strong>R$ {pedido.valorTotal.toFixed(2)}</strong>
                </div>

                <div className="pedido-endereco">
                  <h5>Endereço de Entrega</h5>
                  <p>{pedido.enderecoEntrega}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
