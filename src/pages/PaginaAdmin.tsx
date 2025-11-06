import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { User, Package, Boxes, ClipboardList, Truck } from "lucide-react";
import "./PaginaAdmin.css";

export default function PaginaAdmin() {
  const navigate = useNavigate();

  return (
    <div className="admin-container">
      <Header />

      <main className="admin-main">
        <div className="admin-cards">
          {/* Card 1 - Cadastro Produto */}
          <div className="admin-card">
            <div className="admin-icon">
              <Package size={32} />
            </div>
            <h2>Cadastro Produto</h2>
            <p>Adicione novos produtos ao catálogo do mercado</p>
            <button onClick={() => navigate("/cadastro/produto")}>
              Acessar
            </button>
          </div>

          {/* Card 2 - Cadastro Usuário */}
          <div className="admin-card">
            <div className="admin-icon">
              <User size={32} />
            </div>
            <h2>Cadastro Usuário</h2>
            <p>Gerencie usuários e permissões do sistema</p>
            <button onClick={() => navigate("/gerenciar/cadastro-usuario-adm")}>
              Acessar
            </button>
          </div>

          {/* Card 3 - Cadastro Fornecedor */}
          <div className="admin-card">
            <div className="admin-icon">
              <Truck size={32} />
            </div>
            <h2>Cadastro Fornecedor</h2>
            <p>Cadastre novos fornecedores do mercado</p>
            <button onClick={() => navigate("/cadastro/fornecedor")}>
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
              <button onClick={() => navigate("/gerenciar/categorias")}>Acessar</button>
                </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
