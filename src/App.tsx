import { useState } from "react";
import Header from "./components/Header";
import Image from "./components/Image";
import MenuCategoria from "./components/MenuCategoria";
import ProdutosLista from "./pages/ProdutoLista";
import CategoriasHome from "./components/CategoriasHome";
import CardSuperOferta from "./components/CardSuperOferta";
import './App.css';

function App() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    string | undefined
  >();
  const [buscaProduto, setBuscaProduto] = useState<string | undefined>();

  // Quando usuário usa a barra de busca
  const handleBusca = (termo: string) => {
    setCategoriaSelecionada(undefined); // limpa categoria se estiver buscando por nome
    setBuscaProduto(termo);
  };

  // Quando usuário seleciona uma categoria
  const handleSelecionarCategoria = (categoria: string) => {
    setBuscaProduto(undefined); // limpa busca se estiver clicando em categoria
    setCategoriaSelecionada(categoria);
  };

  return (
    <div className="App">
      <Header onBuscarProduto={handleBusca} />
      <MenuCategoria onSelecionarCategoria={handleSelecionarCategoria} />
      <section id="section-main-img">
        <Image />
      </section>

      {/* Tela inicial - sem categoria nem busca */}
      {!categoriaSelecionada && !buscaProduto ? (
        <div style={{ padding: "30px" }}>
          <h1>Bem-vindo ao Mercado Prático 🛒</h1>
          <p>
            Aqui você encontra ofertas imperdíveis, produtos fresquinhos e toda
            a praticidade para suas compras online.
          </p>
          <p>
            Selecione uma categoria no menu acima ou pesquise um produto para
            começar!
          </p>
        </div>
      ) : (
        // Exibe lista de produtos com base em categoria ou busca
        <ProdutosLista
          categoria={categoriaSelecionada}
          nomeBusca={buscaProduto}
        />
      )}

      <section id="section-categorias-home">
        <CategoriasHome />
      </section>

      <section id="section-super-ofertas">
        <CardSuperOferta src="" alt="" />
        <CardSuperOferta src="" alt="" />
        <CardSuperOferta src="" alt="" />
      </section>
    </div>
  );
}

export default App;
