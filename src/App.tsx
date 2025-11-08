import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CadastroUsuario from "./pages/CadastroUsuario";
import CadastroEndereco from "./pages/CadastroEndereco";
import CadastroProduto from "./pages/CadastroProdutos";
import PaginaLogin from "./pages/PaginaLogin";
import Produto from "./pages/PaginaProduto";
import Perfil from "./pages/PerfilUsuario";
import PaginaCategoria from "./pages/PaginaCategoria";
import { useAuth } from "./hooks/useAuth";
import Carrinho from "./pages/Carrinho";
import Produtos from "./pages/Produtos"; 
import Checkout from "./pages/Checkout";
import PaginaAdmin from "./pages/PaginaAdmin";
import GerenciarPedidos from "./pages/GerenciarPedidos";
import GerenciarFornecedores from "./pages/GerenciarFornecedores";
import CadastroUsuarioAdm from "./pages/CadastroUsuarioAdmin";
import GerenciarCategorias from "./pages/GerenciarCategorias"; 
import SucessoPedido from "./pages/SucessoPedido";

import "./App.css";

function App() {
  const { login } = useAuth();

  return (
    <Routes>
      {/* 🏠 Páginas principais */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<PaginaLogin loginFn={login} />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/produto/:id" element={<Produto />} />
      <Route path="/produtos" element={<Produtos />} />
      <Route path="/carrinho" element={<Carrinho />} />
      <Route path="/checkout" element={<Checkout />} />

      {/* 🔍 Categorias e busca */}
      <Route path="/categoria/:nomeCategoria" element={<PaginaCategoria />} />
      <Route path="/busca/:termo" element={<PaginaCategoria />} />

      {/* ⚙️ Administração */}
      <Route path="/paginaAdmin" element={<PaginaAdmin />} />
      <Route path="/gerenciar/pedidos" element={<GerenciarPedidos />} />
      <Route path="/gerenciar/fornecedores" element={<GerenciarFornecedores />} />
      <Route path="/gerenciar/categorias" element={<GerenciarCategorias />} /> {/* 👈 nova rota */}

      {/* 📝 Cadastros */}
      <Route path="/cadastro/usuario" element={<CadastroUsuario />} />
      <Route path="/cadastro/endereco" element={<CadastroEndereco />} />
      <Route path="/cadastro/produto" element={<CadastroProduto />} />
      <Route path="/gerenciar/cadastro-usuario" element={<CadastroUsuarioAdm />} />

      <Route path="/sucesso" element={<SucessoPedido />} />

    </Routes>
  );
}

export default App;
