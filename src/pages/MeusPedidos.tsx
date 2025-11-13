import React, { useState, useEffect } from 'react';
import { Package, Clock, Truck, CheckCircle, XCircle, ShoppingCart } from 'lucide-react';
import './MeusPedidos.css';

const API_URL = 'http://localhost:8080/api'; // ou sua URL do backend

const MeusPedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [filtroStatus, setFiltroStatus] = useState('todos');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar pedidos do backend
  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        setLoading(true);
        const userId = localStorage.getItem('userId');
        
        const response = await fetch(`${API_URL}/pedidos/usuario/${userId}`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) {
          throw new Error('Erro ao carregar pedidos');
        }
        
        const data = await response.json();
        setPedidos(data);
        setError(null);
      } catch (err) {
        console.error('Erro:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPedidos();
  }, []);

  const statusConfig = {
    todos: { label: 'Todos', classe: 'cinza', icon: ShoppingCart },
    pendente: { label: 'Pendente', classe: 'amarelo', icon: Clock },
    enviado: { label: 'Enviado', classe: 'azul', icon: Truck },
    entregue: { label: 'Entregue', classe: 'verde', icon: CheckCircle },
    cancelado: { label: 'Cancelado', classe: 'vermelho', icon: XCircle }
  };

  const pedidosFiltrados =
    filtroStatus === 'todos'
      ? pedidos
      : pedidos.filter(p => p.statusPedido.toLowerCase() === filtroStatus);

  const StatusBadge = ({ status }) => {
    const statusKey = status.toLowerCase();
    const config = statusConfig[statusKey] || statusConfig.pendente;
    const Icon = config.icon;

    return (
      <div className={`status-badge ${config.classe}`}>
        <Icon size={18} />
        {config.label}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="tela-carregando">
        <div className="conteudo-carregando">
          <div className="spinner"></div>
          <p>Carregando seus pedidos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="pagina-pedidos">
      <div className="container-pedidos">
        {/* Cabeçalho */}
        <div className="cabecalho">
          <h1>Meus Pedidos</h1>
          <p>Acompanhe o status da sua compra</p>
        </div>

        {/* Filtros de Status */}
        <div className="filtros">
          {Object.entries(statusConfig).map(([key, config]) => (
            <button
              key={key}
              onClick={() => setFiltroStatus(key)}
              className={`botao-filtro ${filtroStatus === key ? 'ativo' : ''}`}
            >
              {config.label}
            </button>
          ))}
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mensagem-erro">
            <p>⚠️ Erro ao carregar pedidos: {error}</p>
            <p>Verifique se o backend está rodando e a URL está correta.</p>
          </div>
        )}

        {/* Lista de Pedidos */}
        <div className="lista-pedidos">
          {pedidosFiltrados.length === 0 ? (
            <div className="sem-pedidos">
              <ShoppingCart size={48} />
              <p>
                {error
                  ? 'Não foi possível carregar os pedidos'
                  : 'Nenhum pedido encontrado'}
              </p>
              {!error && (
                <p>
                  Quando você fizer uma compra, seus pedidos aparecerão aqui.
                </p>
              )}
            </div>
          ) : (
            pedidosFiltrados.map(pedido => (
              <div key={pedido.idPedidoUsuario} className="pedido-card">
                {/* Cabeçalho do Pedido */}
                <div className="pedido-header">
                  <div>
                    <h3>
                      Pedido #{pedido.idPedidoUsuario || pedido.numeroPedido}
                    </h3>
                    <p>
                      Data: {new Date(pedido.dataPedido || pedido.created_at).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <StatusBadge status={pedido.statusPedido} />
                </div>

                {/* Itens do Pedido */}
                <div className="pedido-itens">
                  {pedido.itensPedido &&
                    pedido.itensPedido.map((item, index) => (
                      <div key={item.id || index} className="item-linha">
                        <div className="item-imagem">
                          {item.imagem_url || item.imagem ? (
                            <img
                              src={item.imagem_url || item.imagem}
                              alt={item.nome_produto || item.nome}
                              onError={e => {
                                e.target.style.display = 'none';
                                e.target.parentElement.innerHTML =
                                  '<svg class="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>';
                              }}
                            />
                          ) : (
                            <Package size={32} />
                          )}
                        </div>

                        <div className="item-info">
                          <h4>{item.nome_produto || item.nome}</h4>
                          <p>Quantidade: {item.quantidade}</p>
                          {item.descricao && <p>{item.descricao}</p>}
                        </div>

                        <div className="item-preco">
                          <strong>
                            R${' '}
                            {(
                              parseFloat(item.preco_unitario || item.preco) *
                              parseInt(item.quantidade)
                            )
                              .toFixed(2)
                              .replace('.', ',')}
                          </strong>
                          <p>
                            R${' '}
                            {parseFloat(item.preco_unitario || item.preco)
                              .toFixed(2)
                              .replace('.', ',')}{' '}
                            cada
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Total */}
                <div className="pedido-total">
                  <span>Total do pedido</span>
                  <span>
                    R$ {parseFloat(pedido.valorTotal).toFixed(2).replace('.', ',')}
                  </span>
                </div>

                {/* Endereço */}
                {pedido.enderecoEntrega && (
                  <div className="pedido-endereco">
                    <h5>Endereço de Entrega</h5>
                    <p>{pedido.enderecoEntrega}</p>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MeusPedidos;
