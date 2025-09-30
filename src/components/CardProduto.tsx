// src/components/ImageCard.tsx
import React from "react";
import "./CardProduto.css";

interface CardSuperOfertaProps {
  src: string;
  alt?: string;
}

const CardSuperOferta: React.FC<CardSuperOfertaProps> = ({ src, alt }) => {
  return (
    <div className="card-produto">
      <div className="produto">
        <img
          src={src}
          alt={alt || "Imagem do produto"}
          className="img-produto"
        />
      </div>
      <button>Adicionar</button>
    </div>
  );
};

export default CardSuperOferta;
