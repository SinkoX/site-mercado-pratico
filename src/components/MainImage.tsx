import "./MainImage.css";
import logoCarrinho from "../assets/images/icones/logo.png";

export default function MainImage() {
  return (
    <header className="main-image">
      {/* blobs (de fundo) */}
      <div className="blob verde" aria-hidden="true" />
      <div className="blob verde-claro" aria-hidden="true" />
      <div className="blob laranja" aria-hidden="true" />

      {/* círculo branco com logo */}
      <div className="bola">
        <img src={logoCarrinho} alt="Logo Mercado Prático" />
      </div>

      {/* texto à esquerda */}
      <div className="texto">
        <h1>
          <span className="verde-texto">Mercado</span><br />
          <span className="laranja-texto">Prático</span>
        </h1>
        <p className="tagline">Tudo o que você precisa, se encontra aqui</p>
      </div>

      {/* faixa laranja inferior + pill verde e rodapé (ícone + url) */}
      <div className="bottom-bar">
        <div className="pill" />
        <div className="footer-left">
          <span className="globe" aria-hidden="true"></span>
          <span className="site">www.mercadoPratico.com</span>
        </div>
      </div>
    </header>
  );
}
