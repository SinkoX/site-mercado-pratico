import { useState, useEffect } from "react";
import { api } from "../api";
import Header from "../components/Header";
import MainImage from "../components/MainImage";
import MenuCategoria from "../components/MenuCategoria";
import ProdutosLista from "../pages/ProdutoLista";
import CategoriasHome from "../components/CategoriasHome";
import CardSuperOferta from "../components/CardSuperOferta";
import CardProduto from "../components/CardProduto";
import Image from "../components/Image";
import Footer from "../components/Footer";
import superOferta1 from "../assets/images/superOfertas/superOferta1.png";
import superOferta2 from "../assets/images/superOfertas/superOferta2.png";
import superOferta3 from "../assets/images/superOfertas/superOferta3.png";
import bannerSecundario1 from "../assets/images/banner/bannerSecundario1.png";
import bannerSecundario2 from "../assets/images/banner/bannerSecundario2.png";
import "./Home.css";

function Home() {
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<
    string | undefined
  >();
  const [buscaProduto, setBuscaProduto] = useState<string | undefined>();
  const [produtos, setProdutos] = useState<any[]>([]);

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

  useEffect(() => {
    api.get("/produtos").then((res) => setProdutos(res.data));
  }, []);

  return (
    <div className="home-page">
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
          <CardSuperOferta src={superOferta1} alt="imagem super oferta 1" />
          <CardSuperOferta src={superOferta2} alt="imagem super oferta 2" />
          <CardSuperOferta src={superOferta3} alt="imagem super oferta 3" />
        </section>

        <section id="section-produtos-destaque">
          <div className="titulo-destaque">
            <h1>Produtos em Destaque</h1>
            <hr />
          </div>
          <div className="produtos">
            {produtos.slice(0, 8).map((produto) => (
              <CardProduto key={produto.idProduto} produto={produto} />
            ))}
          </div>
          <Image src={bannerSecundario1} alt="banner" />
          <div className="produtos">
            {produtos.slice(8, 16).map((produto) => (
              <CardProduto key={produto.idProduto} produto={produto} />
            ))}
          </div>
        </section>

        <section id="section-banner-propaganda">
          <Image src={bannerSecundario2} alt="banner" />
        </section>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Home;
