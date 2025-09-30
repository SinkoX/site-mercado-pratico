import { useState } from "react";
import Header from "./components/Header";
import MainImage from "./components/MainImage";
import MenuCategoria from "./components/MenuCategoria";
import ProdutosLista from "./pages/ProdutoLista";
import CategoriasHome from "./components/CategoriasHome";
import CardSuperOferta from "./components/CardSuperOferta";
import CardProduto from "./components/CardProduto";
import Image from "./components/Image";
import Footer from "./components/Footer";
import "./App.css";

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
      <main>
        <section id="section-main-img">
          <MainImage />
        </section>

        {/* Tela inicial - sem categoria nem busca */}
        {!categoriaSelecionada && !buscaProduto ? (
          <div>
            <h1>Bem-vindo ao Mercado Prático 🛒</h1>
            <p>
              Aqui você encontra ofertas imperdíveis, produtos fresquinhos e
              toda a praticidade para suas compras online.
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

        <section id="section-produtos-destaque">
          <div className="titulo-destaque">
            <h1>Produtos em Destaque</h1>
            <hr />
          </div>
          <div className="produtos">
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
          </div>
          <Image />
          <div className="produtos">
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
            <CardProduto src="" alt="" />
          </div>
        </section>

        <section id="section-banner-propaganda">
          <Image />
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default App;
