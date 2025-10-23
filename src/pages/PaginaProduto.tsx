import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Header from "../components/Header";
import MenuCategoria from "../components/MenuCategoria";
import Footer from "../components/Footer";
import "./PaginaProduto.css";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  descricao?: string;
  imgUrl?: string;
  imagemProdutoBase64?: string;
}

const PaginaProduto = () => {
  const { id } = useParams<{ id: string }>();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [quantidade, setQuantidade] = useState(1);

  useEffect(() => {
    if (!id) return;

    axios
      .get(`http://localhost:8080/produtos/${id}`)
      .then((res) => setProduto(res.data))
      .catch((err) => console.error("Erro ao buscar produto:", err));
  }, [id]);

  const aumentar = () => setQuantidade((q) => q + 1);
  const diminuir = () => setQuantidade((q) => (q > 1 ? q - 1 : 1));

  if (!produto) return <p style={{ textAlign: "center", marginTop: "50px" }}>Carregando produto...</p>;

  // Calcula preço total com base na quantidade
  const precoTotal = produto.precoProduto * quantidade;

  // Escolhe a imagem disponível
  const imagemFinal =
    produto.imgUrl && produto.imgUrl.trim() !== ""
      ? produto.imgUrl
      : produto.imagemProdutoBase64
      ? `data:image/png;base64,${produto.imagemProdutoBase64}`
      : "/placeholder.png";

  return (
    <div>
      <Header onBuscarProduto={() => {}} />
      <MenuCategoria />

      <div className="pagina-produto">
        <div className="imagem-container">
          <img src={imagemFinal} alt={produto.nomeProduto} className="product-image" />
        </div>

        <div className="detalhes-produto">
          <h2>{produto.nomeProduto}</h2>
          <p className="preco">R$ {precoTotal.toFixed(2)}</p>

          <div className="quantidade">
            <button onClick={diminuir}>-</button>
            <span>{quantidade}</span>
            <button onClick={aumentar}>+</button>
          </div>

          <button className="button-add">Adicionar</button>

          {produto.descricao && <p className="descricao">{produto.descricao}</p>}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaginaProduto;
