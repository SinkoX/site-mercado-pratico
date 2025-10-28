import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CardProduto from "../components/CardProduto";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  descricaoProduto?: string;
  imgUrl?: string;
}

function Busca() {
  const { termo } = useParams<{ termo?: string }>(); // Ex: "Arroz"
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!termo) return;

    const fetchProdutos = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/produto/busca?nome=${encodeURIComponent(termo)}`
        );
        setProdutos(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutos();
  }, [termo]);

  return (
    <>
      <Header />
      <div className="container-produtos">
        <h2>{termo}</h2>

        {loading ? (
          <p>Carregando produtos...</p>
        ) : produtos.length === 0 ? (
          <p>Nenhum produto encontrado para este termo.</p>
        ) : (
          <div className="grid-produtos">
            {produtos.map((produto) => (
              <CardProduto key={produto.idProduto} produto={produto} />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}

export default Busca;
