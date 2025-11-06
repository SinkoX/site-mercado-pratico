import { useState, useEffect } from "react";
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
  const [loading, setLoading] = useState(true);
  const [indiceOferta, setIndiceOferta] = useState(0);

  const superOfertas = [
    { id: 1, src: superOferta1, alt: "Super Oferta 1" },
    { id: 2, src: superOferta2, alt: "Super Oferta 2" },
    { id: 3, src: superOferta3, alt: "Super Oferta 3" },
  ];

  const proximaOferta = () => {
    setIndiceOferta((prev) =>
      prev === superOfertas.length - 1 ? 0 : prev + 1
    );
  };

  const anteriorOferta = () => {
    setIndiceOferta((prev) =>
      prev === 0 ? superOfertas.length - 1 : prev - 1
    );
  };

  const limparProduto = (produto: any) => {
    const copia = { ...produto };
    delete copia.itensCarrinho;
    delete copia.itensPedido;
    return copia;
  };

  useEffect(() => {
    const fetchProdutos = async () => {
      setLoading(true);
      try {
        const response = await api.get("/produto");
        const data = response.data;
        let listaProdutos: any[] = [];

        if (Array.isArray(data)) listaProdutos = data;
        else if (Array.isArray(data.produtos)) listaProdutos = data.produtos;
        else if (Array.isArray(data.data)) listaProdutos = data.data;
        else listaProdutos = [];

        const produtosFormatados = listaProdutos.map((p: any) => ({
          ...limparProduto(p),
          imgUrl: p.imgUrl || p.img_url || "/placeholder.png",
        }));

        setProdutos(produtosFormatados);
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

        <section id="section-categorias-home">
          <CategoriasHome />
        </section>

        {/* ===== SUPER OFERTAS ===== */}
        <section id="section-super-ofertas">
          {/* Mobile carrossel */}
          <div className="super-ofertas-carrossel">
            <button
              className="seta-oferta"
              onClick={anteriorOferta}
              aria-label="Oferta anterior"
            >
              &#8249;
            </button>

            <div className="ofertas-container">
              {superOfertas.map((oferta, index) => (
                <div
                  key={oferta.id}
                  className={`oferta-item ${
                    index === indiceOferta ? "active" : ""
                  }`}
                >
                  <CardSuperOferta src={oferta.src} alt={oferta.alt} />
                </div>
              ))}
            </div>

            <button
              className="seta-oferta"
              onClick={proximaOferta}
              aria-label="Próxima oferta"
            >
              &#8250;
            </button>
          </div>

          {/* Desktop layout */}
          <div className="ofertas-container desktop-ofertas">
            {superOfertas.map((oferta) => (
              <div key={`desktop-${oferta.id}`} className="oferta-item">
                <CardSuperOferta src={oferta.src} alt={oferta.alt} />
              </div>
            ))}
          </div>
        </section>

        {/* ===== PRODUTOS DESTAQUE ===== */}
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
              {produtos.slice(0, 10).map((produto) => (
                <CardProduto key={produto.idProduto} produto={produto} />
              ))}
            </div>
          )}

          <Image src={bannerSecundario1} alt="banner" />

          {loading ? (
            <p>Carregando produtos...</p>
          ) : produtos.length === 0 ? (
            <p>Nenhum produto encontrado.</p>
          ) : (
            <div className="produtos">
              {produtos.slice(10, 20).map((produto) => (
                <CardProduto key={produto.idProduto} produto={produto} />
              ))}
            </div>
          )}
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
