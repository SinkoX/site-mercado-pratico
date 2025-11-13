import { useNavigate } from "react-router-dom";
import { User, Package, Boxes, ClipboardList, Truck } from "lucide-react";
import { FaHome } from "react-icons/fa";
import "./PaginaAdmin.css";

export default function PaginaAdmin() {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <div className="home-icon" onClick={() => navigate("/")}>
        <FaHome />
      </div>

      <main className="admin-main">
        <div className="admin-cards">
          {/* Card 1 - Gerenciar Produto */}
          <div className="admin-card">
            <div className="admin-icon">
              <Package size={32} />
            </div>
            <h2>Gerenciar Produtos</h2>
            <p>Gerencie produtos e adicione novos ao catálogo do mercado</p>
            <button onClick={() => navigate("/gerenciar/produtos")}>
              Acessar
            </button>
          </div>

          {/* Card 2 - Gerenciar Usuário */}
          <div className="admin-card">
            <div className="admin-icon">
              <User size={32} />
            </div>
            <h2>Gerenciar Usuários</h2>
            <p>Gerencie usuários e permissões do sistema</p>
            <button onClick={() => navigate("/gerenciar/usuarios")}>
              Acessar
            </button>
          </div>

          

          {/* Card 4 - Gerenciar Estoque */}
          <div className="admin-card">
            <div className="admin-icon">
              <Boxes size={32} />
            </div>
            <h2>Gerenciar Estoque</h2>
            <p>Controle quantidades e movimentações de produtos</p>
            <button onClick={() => navigate("/gerenciar/estoque")}>
              Acessar
            </button>
          </div>

          {/* Card 5 - Gerenciar Pedidos */}
          <div className="admin-card">
            <div className="admin-icon">
              <ClipboardList size={32} />
            </div>
            <h2>Gerenciar Pedidos</h2>
            <p>Acompanhe e atualize o status dos pedidos realizados</p>
            <button onClick={() => navigate("/gerenciar/pedidos")}>
              Acessar
            </button>
          </div>

          {/* Card 6 - Gerenciar Fornecedores */}
          <div className="admin-card">
            <div className="admin-icon">
              <Truck size={32} />
            </div>
            <h2>Gerenciar Fornecedores</h2>
            <p>Visualize e mantenha os dados dos fornecedores</p>
            <button onClick={() => navigate("/gerenciar/fornecedores")}>
              Acessar
            </button>
          </div>

          {/* Card 7 - Gerenciar Categorias */}
          <div className="admin-card">
            <div className="admin-icon">
              <Boxes size={32} />
            </div>
            <h2>Gerenciar Categorias</h2>
            <p>Crie, edite e remova categorias e subcategorias</p>
            <button onClick={() => navigate("/gerenciar/categorias")}>
              Acessar
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
