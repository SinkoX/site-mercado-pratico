import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CadastroUsuario from "./pages/CadastroUsuario";
import CadastroEndereco from "./pages/CadastroEndereco";
import CadastroProduto from "./pages/CadastroProdutos";
import Login from "./pages/PaginaLogin";
import Produto from "./pages/PaginaProduto";
import Perfil from "./pages/PerfilUsuario";
import Categoria from "./pages/PaginaCategoria"; 
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cadastro/usuario" element={<CadastroUsuario />} />
      <Route path="/cadastro/endereco" element={<CadastroEndereco />} />
      <Route path="/cadastro/produto" element={<CadastroProduto />} />
      <Route path="/login" element={<Login />} />
      <Route path="/perfil" element={<Perfil />} />
      <Route path="/produto/:id" element={<Produto />} />
      <Route path="/categoria/:id" element={<Categoria />} />
      <Route path="/busca/:termo" element={<Categoria />} /> {/* nova rota de busca */}
    </Routes>
  );
}

export default App;
