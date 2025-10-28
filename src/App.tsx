import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CadastroUsuario from "./pages/CadastroUsuario";
import CadastroEndereco from "./pages/CadastroEndereco";
import CadastroProduto from "./pages/CadastroProdutos";
import PaginaLogin from "./pages/PaginaLogin";
import Produto from "./components/PaginaProduto";
import Perfil from "./pages/PerfilUsuario";
import PaginaCategoria from "./pages/PaginaCategoria";
import { useAuth } from "./hooks/useAuth";
import Carrinho from "./pages/Carrinho";
import Produtos from "./pages/Produtos"; 
import "./App.css";

function App() {
  const { login } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro/usuario" element={<CadastroUsuario />} />
      <Route path="/cadastro/endereco" element={<CadastroEndereco />} />
      <Route path="/cadastro/produto" element={<CadastroProduto />} />
      <Route path="/login" element={<PaginaLogin loginFn={login}/>} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/produto/:id" element={<Produto />} />
       <Route path="/carrinho" element={<Carrinho />} />

      {/* ✅ Rota única e correta para categorias */}
      <Route path="/categoria/:nomeCategoria" element={<PaginaCategoria />} />

      {/* ✅ Rota de busca usando o mesmo componente */}
      <Route path="/busca/:termo" element={<PaginaCategoria />} />
      <Route path="/produtos" element={<Produtos />} />
    </Routes>
  );
}

export default App;
