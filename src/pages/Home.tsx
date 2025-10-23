import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import Header from "../components/Header";
import MainImage from "../components/MainImage";
import MenuCategoria from "../components/MenuCategoria";
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
  const [produtos, setProdutos] = useState<any[]>([]);
  const navigate = useNavigate();

  // Função de busca: redireciona para /busca/:termo
  const handleBusca = (termo: string) => {
    if (!termo.trim()) return;
    navigate(`/busca/${termo}`);
  };

  useEffect(() => {
    // Carrega todos os produtos para exibição na Home
    api.get("/produtos")
      .then((res) => setProdutos(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="home-page">
      <Header onBuscarProduto={handleBusca} />
      <MenuCategoria />

      <main>
        <section id="section-main-img">
          <MainImage />
        </section>

        {/* Tela inicial */}
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
