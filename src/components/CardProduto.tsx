import React from "react";
import { Link } from "react-router-dom";
import "./CardProduto.css";
import PlaceHolder from "../assets/images/categorias/placeholder.png";
import { FaShoppingCart } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";

interface CardProdutoProps {
  produto: {
    idProduto: number;
    nomeProduto: string;
    precoProduto: number;
    imgUrl?: string;
    img_url?: string;
    imagemProduto?: string;
  };
}

const CardProduto: React.FC<CardProdutoProps> = ({ produto }) => {
  const imagemFinal =
    produto.imgUrl && produto.imgUrl.trim() !== ""
      ? produto.imgUrl
      : produto.img_url && produto.img_url.trim() !== ""
      ? produto.img_url
      : produto.imagemProduto
      ? `data:image/png;base64,${produto.imagemProduto}`
      : PlaceHolder;

  return (
    <Link to={`/produto/${produto.idProduto}`}>
      <div className="card-produto">
        <img src={imagemFinal} alt={produto.nomeProduto} className="produto" />
        <div className="card-produto-text">
          <h3>{produto.nomeProduto}</h3>
          <p>R${Number(produto.precoProduto).toFixed(2)}</p>
        </div>
        <button>
          <FaShoppingCart />
          <FaPlus />
        </button>
      </div>
    </Link>
  );
};

export default CardProduto;
