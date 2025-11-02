import React from "react";
import PlaceHolder from "../assets/images/categorias/placeholder.png";

interface CheckoutCardProps {
  item: {
    idItemCarrinho: number;
    nomeProduto: string;
    quantidade: number;
    subTotal: number;
    imgUrl?: string;
    img_url?: string;
    imagemProdutoBase64?: string;
  };
}

const CheckoutCard: React.FC<CheckoutCardProps> = ({ item }) => {
  const imagemFinal =
    item.imgUrl && item.imgUrl.trim() !== ""
      ? item.imgUrl
      : item.img_url && item.img_url.trim() !== ""
      ? item.img_url
      : item.imagemProdutoBase64
      ? `data:image/png;base64,${item.imagemProdutoBase64}`
      : PlaceHolder;

  return (
    <div className="checkout-card">
      <img src={imagemFinal} alt={item.nomeProduto} className="checkout-img" />
      <div className="checkout-info">
        <h3>{item.nomeProduto}</h3>
        <p>Quantidade: {item.quantidade}</p>
        <p>Subtotal: R$ {item.subTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default CheckoutCard;
