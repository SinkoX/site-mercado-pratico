import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import CardProduto from "../components/CardProduto";
import Footer from "../components/Footer";
import PlaceHolder from "../assets/images/categorias/placeholder.png";
import "./Carrinho.css";
import {
  FaStore,
  FaArrowLeft,
  FaShoppingCart,
  FaTrashAlt,
  FaMapMarkerAlt,
  FaCreditCard,
} from "react-icons/fa";

interface ItemCarrinhoDTO {
  idItemCarrinho: number;
  idProduto: number;
  nomeProduto: string;
  quantidade: number;
  subTotal: number;
  imgUrl?: string;
  img_url?: string;
  imagemProdutoBase64?: string;
}

interface CarrinhoDTO {
  idCarrinho: number;
  nomeUsuario: string;
  valorTotal: number;
  quantidadeTotal: number;
  itens: ItemCarrinhoDTO[];
}

interface EnderecoDTO {
  idEndereco: number;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento?: string;
}

interface FormDataEnderecoUsuario {
  cep: string;
  numero: string;
  rua: string;
  bairro: string;
  cidade: string;
}

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
  quantidade: number;
  dataValidade: string;
  categoria?: Categoria;
  subCategoria: Subcategoria;
  imgUrl?: string;
}

interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
}

interface Subcategoria {
  idSubcategoria: number;
  nomeSubcategoria: string;
}

function Carrinho() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [carrinho, setCarrinho] = useState<CarrinhoDTO | null>(null);
  const [enderecos, setEnderecos] = useState<EnderecoDTO[]>([]);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<EnderecoDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEnderecoPopup, setShowEnderecoPopup] = useState(false);
  const [produtosRelacionados, setProdutosRelacionados] = useState<Produto[]>([]);
  const [paginaRelacionados, setPaginaRelacionados] = useState(0);
  const [finalizandoCompra, setFinalizandoCompra] = useState(false); // NOVO ESTADO
  const [formData, setFormData] = useState<FormDataEnderecoUsuario>({
    cep: "",
    numero: "",
    rua: "",
    bairro: "",
    cidade: "",
  });

  const VALOR_FRETE = 15;
  const PRODUTOS_POR_PAGINA = 4;

  // ------------------ BUSCAR CARRINHO ------------------
  const fetchCarrinho = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const res = await api.get(`/carrinho/${user.idUsuario}`);
      setCarrinho(res.data);

      // Buscar endereços
      const resEnderecos = await api.get(`/enderecos/${user.idUsuario}`);
      let enderecosArray: any[] = [];
      if (Array.isArray(resEnderecos.data)) {
        enderecosArray = resEnderecos.data;
      } else if (resEnderecos.data && typeof resEnderecos.data === "object") {
        enderecosArray = [resEnderecos.data];
      }

      const enderecosFormatados = enderecosArray.map((end: any) => ({
        idEndereco: end.id_endereco,
        cep: end.cep,
        rua: end.rua,
        numero: end.numero,
        bairro: end.bairro,
        cidade: end.cidade,
        complemento: end.complemento,
      }));

      setEnderecos(enderecosFormatados);
      if (enderecosFormatados.length > 0) {
        setEnderecoSelecionado(enderecosFormatados[0]);
      }

      // Buscar produtos relacionados
      if (res.data.itens && res.data.itens.length > 0) {
        await fetchProdutosRelacionados(res.data.itens);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ------------------ PRODUTOS RELACIONADOS ------------------
  const fetchProdutosRelacionados = async (itensCarrinho: ItemCarrinhoDTO[]) => {
    try {
      if (itensCarrinho.length === 0) return;

      const primeiroProdutoId = itensCarrinho[0].idProduto;
      const resProduto = await api.get(`/produto/${primeiroProdutoId}`);
      const produto = resProduto.data;

      const resTodosProdutos = await api.get(`/produto`);
      const todosProdutos: Produto[] = Array.isArray(resTodosProdutos.data)
        ? resTodosProdutos.data
        : [];

      const idsNoCarrinho = itensCarrinho.map((item) => item.idProduto);

      // Produtos da mesma subcategoria
      const relacionadosSubcategoria = todosProdutos
        .filter(
          (p) =>
            p.subCategoria?.idSubcategoria === produto.subCategoria?.idSubcategoria &&
            !idsNoCarrinho.includes(p.idProduto)
        )
        .slice(0, 4);

      // Produtos da mesma categoria (mas não da mesma subcategoria)
      const relacionadosCategoria = todosProdutos
        .filter(
          (p) =>
            p.categoria?.idCategoria === produto.categoria?.idCategoria &&
            p.subCategoria?.idSubcategoria !== produto.subCategoria?.idSubcategoria &&
            !idsNoCarrinho.includes(p.idProduto)
        )
        .slice(0, 4);

      setProdutosRelacionados([...relacionadosSubcategoria, ...relacionadosCategoria]);
      setPaginaRelacionados(0);
    } catch (error) {
      console.error("Erro ao buscar produtos relacionados:", error);
    }
  };

  useEffect(() => {
    fetchCarrinho();
  }, [user]);

  // ------------------ ATUALIZAR QUANTIDADE ------------------
  const atualizarEstadoItem = (idItem: number, novaQuantidade: number) => {
    if (!carrinho) return;

    const itensAtualizados = carrinho.itens.map((item) =>
      item.idItemCarrinho === idItem
        ? {
            ...item,
            subTotal: (item.subTotal / item.quantidade) * novaQuantidade,
            quantidade: novaQuantidade,
          }
        : item
    );

    const valorTotalAtualizado = itensAtualizados.reduce((sum, item) => sum + item.subTotal, 0);
    const quantidadeTotalAtualizada = itensAtualizados.reduce((sum, item) => sum + item.quantidade, 0);

    setCarrinho({
      ...carrinho,
      itens: itensAtualizados,
      valorTotal: valorTotalAtualizado,
      quantidadeTotal: quantidadeTotalAtualizada,
    });
  };

  const handleAtualizarQuantidade = async (idItem: number, quantidade: number) => {
    if (!user || quantidade < 1) return;

    try {
      await api.put(`/itens-carrinho/${user.idUsuario}/atualizar/${idItem}?quantidade=${quantidade}`);
      atualizarEstadoItem(idItem, quantidade);
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------ REMOVER ITEM ------------------
  const handleRemoverItem = async (idProduto: number, idItemCarrinho: number) => {
    if (!user) return;
    try {
      await api.delete(`/carrinho/${user.idUsuario}/remover/${idProduto}`);
      if (carrinho) {
        const itensRestantes = carrinho.itens.filter((item) => item.idItemCarrinho !== idItemCarrinho);
        const valorTotalAtualizado = itensRestantes.reduce((sum, item) => sum + item.subTotal, 0);
        const quantidadeTotalAtualizada = itensRestantes.reduce((sum, item) => sum + item.quantidade, 0);

        setCarrinho({
          ...carrinho,
          itens: itensRestantes,
          valorTotal: valorTotalAtualizado,
          quantidadeTotal: quantidadeTotalAtualizada,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLimparCarrinho = async () => {
    if (!user) return;
    try {
      await api.delete(`/carrinho/${user.idUsuario}/limpar`);
      setCarrinho({
        ...carrinho!,
        itens: [],
        valorTotal: 0,
        quantidadeTotal: 0,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // ------------------ ENDEREÇO ------------------
  const handleSelecionarEndereco = (idEndereco: number) => {
    const endereco = enderecos.find((e) => e.idEndereco === idEndereco) || null;
    setEnderecoSelecionado(endereco);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCepChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    const maskedCep = value.replace(/^(\d{5})(\d)/, "$1-$2");
    setFormData((prev) => ({ ...prev, cep: maskedCep }));

    if (value.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${value}/json/`);
        const data = await response.json();
        if (data.erro) {
          alert("CEP não encontrado!");
          return;
        }
        setFormData((prev) => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
        }));
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
        alert("Erro ao buscar o CEP. Tente novamente.");
      }
    }
  };

  const handleSubmitEndereco = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const idUsuario = localStorage.getItem("usuarioId");
      if (!idUsuario) {
        alert("Usuário não identificado! Faça login novamente.");
        return;
      }
      await api.post(`/enderecos/usuario/${idUsuario}`, formData);
      alert("Endereço cadastrado com sucesso!");
      setFormData({ cep: "", numero: "", rua: "", bairro: "", cidade: "" });
      const resUser = await api.get(`/usuario/${idUsuario}`);
      setUser(resUser.data);
      localStorage.setItem("user", JSON.stringify(resUser.data));
      setShowEnderecoPopup(false);
      await fetchCarrinho();
    } catch (error) {
      console.error("Erro ao cadastrar endereço:", error);
      alert("Erro ao cadastrar o endereço. Tente novamente.");
    }
  };

  // ------------------ FINALIZAR COMPRA (ATUALIZADO) ------------------
  const handleFinalizarCompra = async () => {
    if (!carrinho || carrinho.itens.length === 0) {
      alert("Seu carrinho está vazio!");
      return;
    }
    if (!enderecoSelecionado) {
      setShowEnderecoPopup(true);
      return;
    }

    setFinalizandoCompra(true); // Inicia o carregamento
    try {
      const pagamentoDTO = {
        idEnderecoEntrega: enderecoSelecionado.idEndereco,
        frete: VALOR_FRETE,
        desconto: 0,
        itens: carrinho.itens.map((item) => ({
          idProduto: item.idProduto,
          nomeProduto: item.nomeProduto,
          quantidade: item.quantidade,
          subTotal: item.subTotal,
        })),
      };
      const res = await api.post(`/pagamentos/finalizar/${user?.idUsuario}`, pagamentoDTO);
      window.location.href = res.data.checkoutUrl;
    } catch (err) {
      console.error("Erro ao finalizar compra:", err);
      alert("Erro ao finalizar compra. Tente novamente.");
      setFinalizandoCompra(false); // Para o spinner em caso de erro
    }
  };

  // ------------------ PAGINAÇÃO RELACIONADOS ------------------
  const paginaAtualProdutos = produtosRelacionados.slice(
    paginaRelacionados * PRODUTOS_POR_PAGINA,
    (paginaRelacionados + 1) * PRODUTOS_POR_PAGINA
  );

  const totalPaginas = Math.ceil(produtosRelacionados.length / PRODUTOS_POR_PAGINA);

  // ------------------ RENDER ------------------
  if (!user) return <p>Você precisa estar logado para acessar o carrinho.</p>;
  if (loading) return <p>Carregando carrinho...</p>;

  if (!carrinho || carrinho.itens.length === 0) {
    return (
      <div className="carrinho-page">
        <Header />
        <div className="carrinho-vazio">
          <div className="icone-vazio-container">
            <img
              src="https://cdn-icons-png.flaticon.com/512/891/891462.png"
              alt="Carrinho vazio"
              className="icone-vazio"
            />
          </div>
          <h2>Seu carrinho está vazio</h2>
          <p>Adicione produtos e volte aqui para finalizar sua compra.</p>
          <button onClick={() => navigate("/")}>
            <FaStore style={{ marginRight: "8px" }} /> Ver produtos
          </button>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="carrinho-page">
      <Header />

      <div className="container-principal">
        <div className="secao-esquerda">
          <div className="header-carrinho">
            <button className="btn-voltar" onClick={() => navigate("/")}>
              <FaArrowLeft style={{ marginRight: "8px" }} /> Continuar comprando
            </button>
            <h1 className="titulo-carrinho">
              <FaShoppingCart style={{ marginRight: "12px" }} /> Meu Carrinho
            </h1>
          </div>

          <div className="tabela-container">
            <table className="tabela-produtos">
              <thead>
                <tr>
                  <th>Produto</th>
                  <th>Preço Unitário</th>
                  <th>Quantidade</th>
                  <th>Total</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {carrinho.itens.map((item) => {
                  const imagemFinal =
                    (item.imgUrl && item.imgUrl.trim() !== "" && item.imgUrl) ||
                    (item.img_url && item.img_url.trim() !== "" && item.img_url) ||
                    (item.imagemProdutoBase64
                      ? `data:image/png;base64,${item.imagemProdutoBase64}`
                      : PlaceHolder);

                  return (
                    <tr key={item.idItemCarrinho}>
                      <td className="produto-info">
                        <img src={imagemFinal} alt={item.nomeProduto} className="produto-img" />
                        <span>{item.nomeProduto}</span>
                      </td>
                      <td>R$ {(item.subTotal / item.quantidade).toFixed(2)} / un</td>
                      <td>
                        <div className="controles-quantidade">
                          <button
                            className="btn-qtd"
                            onClick={() =>
                              handleAtualizarQuantidade(item.idItemCarrinho, item.quantidade - 1)
                            }
                          >
                            –
                          </button>
                          <span className="quantidade-valor">{item.quantidade} un</span>
                          <button
                            className="btn-qtd"
                            onClick={() =>
                              handleAtualizarQuantidade(item.idItemCarrinho, item.quantidade + 1)
                            }
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="preco-total">R$ {item.subTotal.toFixed(2)}</td>
                      <td>
                        <button
                          className="btn-remover-icon"
                          onClick={() => handleRemoverItem(item.idProduto, item.idItemCarrinho)}
                        >
                          <FaTrashAlt style={{ marginRight: "6px" }} /> Remover
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <button className="btn-esvaziar" onClick={handleLimparCarrinho}>
            <FaTrashAlt style={{ marginRight: "8px" }} /> Esvaziar Carrinho
          </button>
        </div>

        <div className="secao-direita">
          <div className="resumo-pedido">
            <h2>Resumo do Pedido</h2>

            <div className="resumo-valores">
              <div className="linha-valor">
                <span>Subtotal</span>
                <span>R$ {carrinho.valorTotal.toFixed(2)}</span>
              </div>
              <div className="linha-valor">
                <span>Entrega</span>
                <span>R$ {VALOR_FRETE.toFixed(2)}</span>
              </div>
            </div>

            {enderecos.length > 0 ? (
              <div className="secao-endereco">
                <h3>Endereço de Entrega</h3>
                <select
                  className="select-endereco"
                  value={enderecoSelecionado?.idEndereco || ""}
                  onChange={(e) => handleSelecionarEndereco(Number(e.target.value))}
                >
                  {enderecos.map((end) => (
                    <option key={end.idEndereco} value={end.idEndereco}>
                      {end.rua}, {end.numero} - {end.bairro}, {end.cidade} - {end.cep}
                    </option>
                  ))}
                </select>
              </div>
            ) : (
              <div className="sem-endereco">
                <p>Você ainda não tem um endereço cadastrado.</p>
                <button className="btn-adicionar-endereco" onClick={() => setShowEnderecoPopup(true)}>
                  <FaMapMarkerAlt style={{ marginRight: "8px" }} /> Adicionar Endereço
                </button>
              </div>
            )}

            {/* BOTÃO ATUALIZADO COM SPINNER */}
            <button
              className={`btn-finalizar-compra ${finalizandoCompra ? 'processando' : ''}`}
              onClick={handleFinalizarCompra}
              disabled={finalizandoCompra}
            >
              {!finalizandoCompra && <FaCreditCard style={{ marginRight: "8px" }} />}
              <span>{finalizandoCompra ? "Processando pagamento..." : "Finalizar Compra"}</span>
              {finalizandoCompra && <div className="spinner-checkout"></div>}
            </button>
          </div>
        </div>
      </div>

      {produtosRelacionados.length > 0 && (
        <div className="produtos-relacionados">
          <h2>Compre também</h2>
          <div className="cards-relacionados">
            {paginaAtualProdutos.map((produto) => (
              <CardProduto key={produto.idProduto} produto={produto} />
            ))}
          </div>

          {totalPaginas > 1 && (
            <div className="paginacao">
              {Array.from({ length: totalPaginas }, (_, i) => (
                <button
                  key={i}
                  className={i === paginaRelacionados ? "ativo" : ""}
                  onClick={() => setPaginaRelacionados(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {showEnderecoPopup && (
        <div className="popup-endereco">
          <div className="popup-conteudo">
            <h2>Adicionar Endereço</h2>
            <form onSubmit={handleSubmitEndereco}>
              <input
                type="text"
                name="cep"
                value={formData.cep}
                onChange={handleCepChange}
                placeholder="CEP"
                required
              />
              <input
                type="text"
                name="rua"
                value={formData.rua}
                onChange={handleChange}
                placeholder="Rua"
                required
              />
              <input
                type="text"
                name="numero"
                value={formData.numero}
                onChange={handleChange}
                placeholder="Número"
                required
              />
              <input
                type="text"
                name="bairro"
                value={formData.bairro}
                onChange={handleChange}
                placeholder="Bairro"
                required
              />
              <input
                type="text"
                name="cidade"
                value={formData.cidade}
                onChange={handleChange}
                placeholder="Cidade"
                required
              />
              <div className="botoes-popup">
                <button type="submit">Salvar</button>
                <button type="button" onClick={() => setShowEnderecoPopup(false)}>
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default Carrinho;