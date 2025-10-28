import "./MainImage.css";
import logoCarrinho from "../assets/images/icones/logo.png";

export default function MainImage() {
  return (
    <div className="main-image">
      {/* Formas orgânicas coloridas (morphing fluido) */}
      <div className="forma verde"></div>
      <div className="forma verde-claro"></div>
      <div className="forma laranja"></div>

      {/* Bola branca com logo */}
      <div className="bola">
        <img src={logoCarrinho} alt="Logo Mercado Prático" />
      </div>

      {/* Texto principal */}
      <div className="texto">
        <h1>
          <span className="verde-texto">Mercado</span>{" "}
          <span className="laranja-texto">Prático</span>
        </h1>
        <p>Tudo o que você precisa, se encontra aqui</p>
      </div>
    </div>
  );
}
