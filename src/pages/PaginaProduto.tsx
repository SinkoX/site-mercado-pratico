import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom"; //importa o hook aqui
import "./PaginaProduto.css";
import Header from "../components/Header";
import MenuCategoria from "../components/MenuCategoria";
import CardProduto from "../components/CardProduto";
import Footer from "../components/Footer";
import axios from "axios";

const PaginaProduto = () => {
  const { idProduto } = useParams(); //pega o ID da URL

  const [produto, setProduto] = useState(null);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
   axios.get('http://localhost:8080/produtos')
      .then((res) => setProduto(res.data))
      .catch((err) => console.error("Erro ao buscar produto:", err));
  },[idProduto]);

  const aumentar = () => setQuantidade((q) => q + 1);
  const diminuir = () => setQuantidade((q) => (q > 1 ? q - 1 : 1));

  if (!produto) return <p>Carregando produto...</p>;

  return (
    <div>
      <Header />
      <MenuCategoria />

      <div className="pagina-produto">
        <div className="imagem-container">
          <img
            src={`data:imagem/png;base64,${produto.imagemProdutoBase64}`}
            alt="Produto"
            style={styles.imagemProdutoBase64}
          />
        </div>

        <div className="detalhes-produto">
          <h2>{produto.nomeProduto}</h2>
          <p className="preco">R$ {produto.precoProduto}</p>

          <div className="quantidade">
            <button onClick={diminuir}>-</button>
            <span>{quantidade}</span>
            <button onClick={aumentar}>+</button>
          </div>
          <button className="button-add">Adicionar</button>

          <p className="descricao">{produto.descricao}</p>
          <hr />
        </div>
      </div>

      <CardProduto />
      <Footer />
    </div>
  );
};

export default PaginaProduto;
