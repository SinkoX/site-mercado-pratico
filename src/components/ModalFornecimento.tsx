import { useState, useEffect } from "react";
import { api } from "../api";
import "./ModalFornecimento.css";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
}

interface Fornecedor {
  idFornecedor: number;
  nomeFornecedor: string;
  produtos: Produto[];
}

interface ItemFornecimento {
  produto: Produto;
  quantidade: number;
}

interface ModalFornecimentoProps {
  fornecimentoEdit?: any; // para edição futura
  fechar: () => void;
  atualizar: () => void;
}

export default function ModalFornecimento({
  fornecimentoEdit,
  fechar,
  atualizar,
}: ModalFornecimentoProps) {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [fornecedorSelecionado, setFornecedorSelecionado] =
    useState<Fornecedor | null>(null);
  const [itens, setItens] = useState<ItemFornecimento[]>([]);
  const [dataFornecimento, setDataFornecimento] = useState("");
  const [valorFornecimento, setValorFornecimento] = useState("");

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    const res = await api.get("/fornecedores"); // endpoint que retorna fornecedores com produtos
    setFornecedores(res.data);
  };

  const handleQuantidadeChange = (index: number, value: number) => {
    const newItens = [...itens];
    newItens[index].quantidade = value;
    setItens(newItens);
  };

  const handleSalvar = async () => {
    if (!fornecedorSelecionado) {
      alert("Selecione um fornecedor!");
      return;
    }

    if (!dataFornecimento) {
      alert("Escolha a data do fornecimento!");
      return;
    }

    try {
      const fornecimento = {
        fornecedor: { idFornecedor: fornecedorSelecionado.idFornecedor },
        dataFornecimento: dataFornecimento + "T00:00:00", // formato LocalDateTime
        valorFornecimento: Number(valorFornecimento),
        itens: itens
          .filter((i) => i.quantidade > 0)
          .map((i) => ({
            produto: { idProduto: i.produto.idProduto },
            quantidade: i.quantidade,
          })),
      };

      if (fornecimentoEdit) {
        await api.put(
          `/fornecimentos/${fornecimentoEdit.idFornecimento}`,
          fornecimento
        );
        alert("Fornecimento atualizado com sucesso!");
      } else {
        await api.post("/fornecimentos", fornecimento);
        alert("Fornecimento cadastrado com sucesso!");
      }

      atualizar();
      fechar();
    } catch (err) {
      console.error("Erro ao salvar fornecimento:", err);
      alert("Erro ao salvar fornecimento");
    }
  };

  return (
    <div className="modal-overlay" onClick={fechar}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>
          {fornecimentoEdit ? "Editar Fornecimento" : "Cadastrar Fornecimento"}
        </h2>

        <div className="form-group">
          <label>Fornecedor</label>
          <select
            value={fornecedorSelecionado?.idFornecedor || ""}
            onChange={(e) =>
              setFornecedorSelecionado(
                fornecedores.find(
                  (f) => f.idFornecedor === Number(e.target.value)
                ) || null
              )
            }
          >
            <option value="">Selecione um fornecedor</option>
            {fornecedores.map((f) => (
              <option key={f.idFornecedor} value={f.idFornecedor}>
                {f.nomeFornecedor}
              </option>
            ))}
          </select>
        </div>

        {fornecedorSelecionado && (
          <div className="produtos-container">
            <h3>Produtos</h3>
            <button
              type="button"
              onClick={() => {
                if (fornecedorSelecionado.produtos.length > 0) {
                  setItens([
                    ...itens,
                    {
                      produto: fornecedorSelecionado.produtos[0], // produto inicial do select
                      quantidade: 0,
                    },
                  ]);
                }
              }}
            >
              Adicionar Produto
            </button>

            {itens.map((item, index) => (
              <div key={index} className="produto-item">
                <select
                  value={item.produto.idProduto}
                  onChange={(e) => {
                    const produtoSelecionado =
                      fornecedorSelecionado.produtos.find(
                        (p) => p.idProduto === Number(e.target.value)
                      );
                    if (produtoSelecionado) {
                      const newItens = [...itens];
                      newItens[index].produto = produtoSelecionado;
                      setItens(newItens);
                    }
                  }}
                >
                  {fornecedorSelecionado.produtos.map((p) => (
                    <option key={p.idProduto} value={p.idProduto}>
                      {p.nomeProduto} (R$ {p.precoProduto.toFixed(2)})
                    </option>
                  ))}
                </select>

                <input
                  type="number"
                  min={0}
                  value={item.quantidade}
                  onChange={(e) =>
                    handleQuantidadeChange(index, Number(e.target.value))
                  }
                />
              </div>
            ))}
          </div>
        )}

        <div className="form-group">
          <label>Data Prevista de Entrega</label>
          <input
            type="date"
            value={dataFornecimento}
            onChange={(e) => setDataFornecimento(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Valor</label>
          <input
            type="number"
            value={valorFornecimento}
            onChange={(e) => setValorFornecimento(e.target.value)}
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancelar" onClick={fechar}>
            Cancelar
          </button>
          <button className="btn-salvar" onClick={handleSalvar}>
            {fornecimentoEdit ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}
