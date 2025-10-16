import React from "react";
import "./CardProduto.css";
import PlaceHolder from "../assets/images/categorias/placeholder.png";

interface CardProdutoProps {
  produto: {
    idProduto: number;
    nomeProduto: string;
    precoProduto: number;
    descricaoProduto?: string;
    imgUrl?: string;
    imagemProdutoBase64?: string;
  };
}

const CardProduto: React.FC<CardProdutoProps> = ({ produto }) => {
  const imagemFinal =
    produto.imgUrl && produto.imgUrl.trim() !== ""
      ? produto.imgUrl
      : produto.imagemProdutoBase64
      ? `data:image/png;base64,${produto.imagemProdutoBase64}`
      : PlaceHolder; // imagem padrão

  return (
    <div className="card-produto">
      <img src={imagemFinal} alt={produto.nomeProduto} className="produto" />
      <div className="card-produto-text">
        <h3>{produto.nomeProduto}</h3>
        {produto.descricaoProduto && <p>{produto.descricaoProduto}</p>}
        <p>Preço: R$ {Number(produto.precoProduto).toFixed(2)}</p>
      </div>
      <button>Adicionar</button>
    </div>
  );
};

export default CardProduto;
