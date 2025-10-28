import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./CardProduto.css";
import PlaceHolder from "../assets/images/categorias/placeholder.png";

interface CardProdutoProps {
  produto: {
    idProduto: number;
    nomeProduto: string;
    precoProduto: number;
    descricaoProduto?: string;
    imgUrl?: string;
    img_url?: string;
    imagemProdutoBase64?: string;
  };
}

const CardProduto: React.FC<CardProdutoProps> = ({ produto }) => {
  const navigate = useNavigate();

  // Escolhe a imagem correta
  const imagemFinal =
    produto.imgUrl && produto.imgUrl.trim() !== ""
      ? produto.imgUrl
      : produto.img_url && produto.img_url.trim() !== ""
      ? produto.img_url
      : produto.imagemProdutoBase64
      ? `data:image/png;base64,${produto.imagemProdutoBase64}`
      : PlaceHolder;

  return (
    <Link to={`/produto/${produto.idProduto}`}>
      <div className="card-produto">
        <img src={imagemFinal} alt={produto.nomeProduto} className="produto" />
        <div className="card-produto-text">
          <h3>{produto.nomeProduto}</h3>
          {produto.descricaoProduto && <p>{produto.descricaoProduto}</p>}
          <p>R${Number(produto.precoProduto).toFixed(2)}</p>
        </div>
        <button>Visualizar</button>
      </div>
    </Link>
  );
};

export default CardProduto;
