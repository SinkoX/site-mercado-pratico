import { useState, useEffect } from "react";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";

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
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        // Endpoint correto para buscar todos os produtos
        const response = await api.get("/produtos");
        // Garante que é um array
        setProdutos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao carregar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, []);

  return (
    <div className="home-page">
      <Header />
      <MenuCategoria />

      <main>
        <section id="section-main-img">
          <MainImage />
        </section>

        <div>
          <h1>Bem-vindo ao Mercado Prático 🛒</h1>
          {user && <p>Olá, {user.nomeUsuario}! Confira suas ofertas personalizadas abaixo.</p>}
          <p>Aqui você encontra ofertas imperdíveis, produtos fresquinhos e toda a praticidade para suas compras online.</p>
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

          {loading ? (
            <p>Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            <div className="produtos">
              {produtos.slice(0, 16).map((produto) => (
                <CardProduto
                  key={produto.idProduto}
                  produto={{
                    ...produto,
                    imgUrl:
                      produto.imgUrl && produto.imgUrl.trim() !== ""
                        ? produto.imgUrl
                        : produto.imagemProdutoBase64
                        ? `data:image/png;base64,${produto.imagemProdutoBase64}`
                        : "/placeholder.png",
                  }}
                />
              ))}
            </div>
          )}

          <Image src={bannerSecundario1} alt="banner" />
        </section>

        <section id="section-banner-propaganda">
          <Image src={bannerSecundario2} alt="banner" />
        </section>
      </main>

      <Footer />
    </div>
  );
}

export default Home;
