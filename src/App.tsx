import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import CadastroUsuario from "./pages/CadastroUsuario";
import CadastroEndereco from "./pages/CadastroEndereco";
import CadastroProduto from "./pages/CadastroProdutos";
import "./App.css";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/cadastro/usuario" element={<CadastroUsuario />}/>
      <Route path="/cadastro/endereco" element={<CadastroEndereco />}/>
      <Route path="/cadastro/produto" element={<CadastroProduto />}/>
    </Routes>
  );
}

export default App;
