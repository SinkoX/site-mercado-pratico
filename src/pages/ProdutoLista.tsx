import React, { useEffect, useState } from "react";
import axios from "axios";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  quantidade: number;
  dataValidade: string;
  categoria?: string;
}

interface ProdutosListaProps {
  categoria?: string;
  nomeBusca?: string;
}

const ProdutosLista: React.FC<ProdutosListaProps> = ({ categoria, nomeBusca }) => {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [erro, setErro] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    setLoading(true);
    setErro(null);

    let endpoint = '/api/produtos';

    if (nomeBusca) {
      endpoint = `/api/produtos/nome?value=${encodeURIComponent(nomeBusca)}`;
    } else if (categoria) {
      endpoint = `/api/produtos/categoria?value=${encodeURIComponent(categoria)}`;
    }

    axios.get<Produto[]>(endpoint)
      .then(response => {
        setProdutos(response.data);
      })
      .catch(error => {
        console.error('Erro ao buscar produtos:', error);
        setErro("Erro ao carregar produtos.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [categoria, nomeBusca]);

  if (loading) return <p>Carregando...</p>;
  if (erro) return <p>{erro}</p>;

  if (!Array.isArray(produtos)) {
    return <p>Erro: dados inválidos.</p>;
  }

  return (
    <div style={{ 
      display: 'flex',
      flexWrap: 'wrap',
      gap: '1rem',
      justifyContent: 'flex-start',
      paddingLeft: '30px'
    }}>
      {produtos.map(produto => (
        <div key={produto.idProduto} style={{
          border: '1px solid #ccc',
          borderRadius: '8px',
          padding: '1rem',
          width: '220px',
          boxShadow: '2px 2px 8px rgba(0,0,0,0.1)',
          backgroundColor: 'white',
        }}>
          <div style={{
            width: '100%',
            height: '150px',
            backgroundColor: '#eee',
            borderRadius: '4px',
            marginBottom: '1rem',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            color: '#999',
            fontStyle: 'italic',
            fontSize: '0.9rem'
          }}>
            Sem imagem
          </div>

          <h3 style={{ margin: '0 0 0.5rem 0' }}>{produto.nomeProduto}</h3>
          <p style={{ margin: '0.25rem 0' }}><strong>Preço:</strong> R$ {produto.precoProduto.toFixed(2)}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Quantidade:</strong> {produto.quantidade}</p>
          <p style={{ margin: '0.25rem 0' }}><strong>Categoria:</strong> {produto.categoria}</p>
          <p style={{ margin: '0.25rem 0' }}>
            <strong>Validade:</strong> {new Date(produto.dataValidade).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default ProdutosLista;
