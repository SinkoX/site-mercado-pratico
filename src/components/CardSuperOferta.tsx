// src/components/ImageCard.tsx
import React from "react";
import "./CardSuperOferta.css";

interface CardSuperOfertaProps {
  src: string;
  alt?: string;
}

const CardSuperOferta: React.FC<CardSuperOfertaProps> = ({ src, alt }) => {
  return (
    <div className="card-superoferta">
      <img
        src={src}
        alt={alt || "Imagem do card"}
        className="img-superoferta"
      />
    </div>
  );
};

export default CardSuperOferta;
