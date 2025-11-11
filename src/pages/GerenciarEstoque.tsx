import React, { useEffect, useState } from "react";
import "./GerenciarEstoque.css";
import EstoqueModal from "../components/EstoqueModal"; // <-- novo modal bonito

interface EstoqueDTO {
  idEstoque: number;
  nomeProduto: string;
  quantidade: number;
  quantidadeMinima: number;
  estoqueAbaixoDoMinimo: boolean;
}

interface MovimentacaoDTO {
  idMovimentacao: number;
  nomeProduto: string;
  quantidade: number;
  tipoMovimentacao: "ENTRADA" | "SAIDA";
  dataMovimentacao: string;
}

// Tipos de sort separados
type SortKeyEstoque = keyof EstoqueDTO;
type SortKeyMov = keyof MovimentacaoDTO;

export const GerenciarEstoque: React.FC = () => {
  const [estoques, setEstoques] = useState<EstoqueDTO[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filtroProdutoEstoque, setFiltroProdutoEstoque] = useState("");
  const [filtroZerado, setFiltroZerado] = useState(false);
  const [filtroMinimo, setFiltroMinimo] = useState(false);

  const [filtroProdutoMov, setFiltroProdutoMov] = useState("");
  const [filtroTipoMov, setFiltroTipoMov] = useState<"ENTRADA" | "SAIDA" | "">("");
  const [filtroIDMov, setFiltroIDMov] = useState("");
  const [filtroDataMov, setFiltroDataMov] = useState("");

  const [sortEstoque, setSortEstoque] = useState<{ key: SortKeyEstoque; ascending: boolean }>({
    key: "idEstoque",
    ascending: true,
  });

  const [sortMov, setSortMov] = useState<{ key: SortKeyMov; ascending: boolean }>({
    key: "idMovimentacao",
    ascending: true,
  });

  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null);
  const [modalEstoque, setModalEstoque] = useState<Partial<EstoqueDTO> | null>(null);
  const [modalMovimentacao, setModalMovimentacao] = useState<Partial<MovimentacaoDTO> | null>(null);

  // ==== FETCH ALL ====
  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [estoqueRes, movRes] = await Promise.all([
        fetch("http://localhost:8080/estoque"),
        fetch("http://localhost:8080/movimentacoes/ultimas"),
      ]);

      if (!estoqueRes.ok) throw new Error(`Erro ao buscar estoques: ${estoqueRes.status}`);
      if (!movRes.ok) throw new Error(`Erro ao buscar movimentações: ${movRes.status}`);

      const estoquesData: EstoqueDTO[] = await estoqueRes.json();
      const movData: MovimentacaoDTO[] = await movRes.json();

      setEstoques(estoquesData);
      setMovimentacoes(movData);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  // ==== SORT HELPER ====
  const sortValues = (a: any, b: any) => {
    if (typeof a === "string" && typeof b === "string") return a.localeCompare(b);
    if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime();
    return a - b;
  };

  // ==== FILTROS E ORDENAÇÃO ====
  const estoquesFiltrados = estoques
    .filter((e) => e.nomeProduto.toLowerCase().includes(filtroProdutoEstoque.toLowerCase()))
    .filter((e) => !filtroZerado || e.quantidade === 0)
    .filter((e) => !filtroMinimo || e.estoqueAbaixoDoMinimo)
    .sort((a, b) =>
      sortEstoque.ascending
        ? sortValues(a[sortEstoque.key], b[sortEstoque.key])
        : -sortValues(a[sortEstoque.key], b[sortEstoque.key])
    );

  const movimentacoesFiltradas = movimentacoes
    .filter((m) => m.nomeProduto.toLowerCase().includes(filtroProdutoMov.toLowerCase()))
    .filter((m) => filtroTipoMov === "" || m.tipoMovimentacao === filtroTipoMov)
    .filter((m) => filtroIDMov === "" || m.idMovimentacao.toString().includes(filtroIDMov))
    .filter(
      (m) =>
        filtroDataMov === "" ||
        new Date(m.dataMovimentacao).toLocaleDateString().includes(filtroDataMov)
    )
    .sort((a, b) =>
      sortMov.ascending
        ? sortValues(a[sortMov.key], b[sortMov.key])
        : -sortValues(a[sortMov.key], b[sortMov.key])
    );

  // ==== BADGE ====
  const getBadge = (estoque: EstoqueDTO) => {
    if (estoque.quantidade === 0) return <span className="badge zerado">Zerado</span>;
    if (estoque.estoqueAbaixoDoMinimo)
      return <span className="badge emergencial">Emergencial</span>;
    return <span className="badge normal">Normal</span>;
  };

  // ==== TOOLTIP ====
  const showTooltip = (e: React.MouseEvent, text: string) => {
    const tooltipWidth = 200;
    const tooltipHeight = 60;
    let x = e.clientX + 10;
    let y = e.clientY + 10;
    if (x + tooltipWidth > window.innerWidth) x = e.clientX - tooltipWidth - 10;
    if (y + tooltipHeight > window.innerHeight) y = e.clientY - tooltipHeight - 10;
    setTooltip({ text, x, y });
  };
  const hideTooltip = () => setTooltip(null);

  // ==== SORT HANDLERS ====
  const handleSortEstoque = (key: SortKeyEstoque) =>
    setSortEstoque({ key, ascending: sortEstoque.key === key ? !sortEstoque.ascending : true });

  const handleSortMov = (key: SortKeyMov) =>
    setSortMov({ key, ascending: sortMov.key === key ? !sortMov.ascending : true });

  // ==== CRUD ESTOQUE ====
  const salvarEstoque = async (estoque: Partial<EstoqueDTO>) => {
    try {
      if (estoque.idEstoque) {
        const res = await fetch(`http://localhost:8080/estoque/${estoque.idEstoque}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(estoque),
        });
        if (!res.ok) throw new Error("Erro ao atualizar estoque");
      } else {
        const res = await fetch("http://localhost:8080/estoque", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(estoque),
        });
        if (!res.ok) throw new Error("Erro ao adicionar estoque");
      }
      setModalEstoque(null);
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deletarEstoque = async (id: number) => {
    if (!window.confirm("Deseja realmente deletar este estoque?")) return;
    try {
      const res = await fetch(`http://localhost:8080/estoque/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar estoque");
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // ==== CRUD MOVIMENTAÇÃO ====
  const salvarMovimentacao = async (mov: Partial<MovimentacaoDTO>) => {
    try {
      if (mov.idMovimentacao) {
        const res = await fetch(`http://localhost:8080/movimentacoes/${mov.idMovimentacao}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mov),
        });
        if (!res.ok) throw new Error("Erro ao atualizar movimentação");
      } else {
        const res = await fetch("http://localhost:8080/movimentacoes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mov),
        });
        if (!res.ok) throw new Error("Erro ao adicionar movimentação");
      }
      setModalMovimentacao(null);
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deletarMovimentacao = async (id: number) => {
    if (!window.confirm("Deseja realmente deletar esta movimentação?")) return;
    try {
      const res = await fetch(`http://localhost:8080/movimentacoes/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Erro ao deletar movimentação");
      fetchAll();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) return <div className="loading">Carregando dados do estoque...</div>;
  if (error) return <div className="error">Erro: {error}</div>;

  return (
    <div className="gerenciar-estoque-container">
      <h1>Gerenciamento de Estoque</h1>

      {/* ========== ESTOQUES ========== */}
      <section className="estoques-section">
        <h2>Estoques</h2>
        <button className="btn-add" onClick={() => setModalEstoque({})}>
          Adicionar Estoque
        </button>
        <div className="filtros">
          <input
            placeholder="Filtrar por Produto"
            value={filtroProdutoEstoque}
            onChange={(e) => setFiltroProdutoEstoque(e.target.value)}
          />
          <label>
            <input type="checkbox" checked={filtroZerado} onChange={() => setFiltroZerado(!filtroZerado)} /> Zerado
          </label>
          <label>
            <input type="checkbox" checked={filtroMinimo} onChange={() => setFiltroMinimo(!filtroMinimo)} /> Emergencial
          </label>
        </div>

        <div className="table-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th onClick={() => handleSortEstoque("idEstoque")}>ID</th>
                <th onClick={() => handleSortEstoque("nomeProduto")}>Produto</th>
                <th onClick={() => handleSortEstoque("quantidade")}>Quantidade</th>
                <th onClick={() => handleSortEstoque("quantidadeMinima")}>Qtd Mínima</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {estoquesFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    Nenhum estoque encontrado.
                  </td>
                </tr>
              ) : (
                estoquesFiltrados.map((e) => (
                  <tr key={e.idEstoque}>
                    <td>{e.idEstoque}</td>
                    <td>{e.nomeProduto}</td>
                    <td>{e.quantidade}</td>
                    <td>{e.quantidadeMinima}</td>
                    <td>{getBadge(e)}</td>
                    <td>
                      <button className="btn-edit" onClick={() => setModalEstoque(e)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => deletarEstoque(e.idEstoque)}>
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ========== MOVIMENTAÇÕES ========== */}
      <section className="movimentacoes-section">
        <h2>Últimas Movimentações</h2>
        <button className="btn-add" onClick={() => setModalMovimentacao({})}>
          Adicionar Movimentação
        </button>
        <div className="filtros">
          <input placeholder="Filtrar por Produto" value={filtroProdutoMov} onChange={(e) => setFiltroProdutoMov(e.target.value)} />
          <input placeholder="Filtrar por ID" value={filtroIDMov} onChange={(e) => setFiltroIDMov(e.target.value)} />
          <input type="date" value={filtroDataMov} onChange={(e) => setFiltroDataMov(e.target.value)} />
          <select value={filtroTipoMov} onChange={(e) => setFiltroTipoMov(e.target.value as any)}>
            <option value="">Todos os tipos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>
        </div>

        <div className="table-wrapper">
          <table className="tabela">
            <thead>
              <tr>
                <th onClick={() => handleSortMov("idMovimentacao")}>ID</th>
                <th onClick={() => handleSortMov("nomeProduto")}>Produto</th>
                <th onClick={() => handleSortMov("quantidade")}>Quantidade</th>
                <th onClick={() => handleSortMov("tipoMovimentacao")}>Tipo</th>
                <th onClick={() => handleSortMov("dataMovimentacao")}>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty">
                    Nenhuma movimentação encontrada.
                  </td>
                </tr>
              ) : (
                movimentacoesFiltradas.map((m) => (
                  <tr
                    key={m.idMovimentacao}
                    className={m.tipoMovimentacao === "ENTRADA" ? "entrada" : "saida"}
                    onMouseEnter={(e) =>
                      showTooltip(e, `Produto: ${m.nomeProduto}\nTipo: ${m.tipoMovimentacao}\nQtd: ${m.quantidade}`)
                    }
                    onMouseLeave={hideTooltip}
                  >
                    <td>{m.idMovimentacao}</td>
                    <td>{m.nomeProduto}</td>
                    <td>{m.quantidade}</td>
                    <td>{m.tipoMovimentacao}</td>
                    <td>{m.dataMovimentacao ? new Date(m.dataMovimentacao).toLocaleString() : "N/D"}</td>
                    <td>
                      <button className="btn-edit" onClick={() => setModalMovimentacao(m)}>
                        Editar
                      </button>
                      <button className="btn-delete" onClick={() => deletarMovimentacao(m.idMovimentacao)}>
                        Deletar
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* ==== TOOLTIP ==== */}
      {tooltip && (
        <div className="tooltip show" style={{ top: tooltip.y, left: tooltip.x, position: "fixed" }}>
          {tooltip.text.split("\n").map((line, idx) => (
            <div key={idx}>{line}</div>
          ))}
        </div>
      )}

      {/* ==== MODAIS ==== */}
      {modalEstoque && (
        <EstoqueModal
          title={modalEstoque.idEstoque ? "Editar Estoque" : "Adicionar Estoque"}
          onClose={() => setModalEstoque(null)}
        >
          <input
            placeholder="Nome do Produto"
            value={modalEstoque.nomeProduto || ""}
            onChange={(e) => setModalEstoque({ ...modalEstoque, nomeProduto: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={modalEstoque.quantidade ?? ""}
            onChange={(e) => setModalEstoque({ ...modalEstoque, quantidade: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Quantidade Mínima"
            value={modalEstoque.quantidadeMinima ?? ""}
            onChange={(e) => setModalEstoque({ ...modalEstoque, quantidadeMinima: Number(e.target.value) })}
          />
          <div className="estoque-modal-buttons">
            <button className="btn-save" onClick={() => salvarEstoque(modalEstoque)}>Salvar</button>
            <button className="btn-cancel" onClick={() => setModalEstoque(null)}>Cancelar</button>
          </div>
        </EstoqueModal>
      )}

      {modalMovimentacao && (
        <EstoqueModal
          title={modalMovimentacao.idMovimentacao ? "Editar Movimentação" : "Adicionar Movimentação"}
          onClose={() => setModalMovimentacao(null)}
        >
          <input
            placeholder="Nome do Produto"
            value={modalMovimentacao.nomeProduto || ""}
            onChange={(e) => setModalMovimentacao({ ...modalMovimentacao, nomeProduto: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantidade"
            value={modalMovimentacao.quantidade ?? ""}
            onChange={(e) => setModalMovimentacao({ ...modalMovimentacao, quantidade: Number(e.target.value) })}
          />
          <select
            value={modalMovimentacao.tipoMovimentacao || ""}
            onChange={(e) => setModalMovimentacao({ ...modalMovimentacao, tipoMovimentacao: e.target.value as any })}
          >
            <option value="">Selecione o tipo</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>
          <input
            type="datetime-local"
            value={modalMovimentacao.dataMovimentacao ? modalMovimentacao.dataMovimentacao.slice(0, 16) : ""}
            onChange={(e) => setModalMovimentacao({ ...modalMovimentacao, dataMovimentacao: e.target.value })}
          />
          <div className="estoque-modal-buttons">
            <button className="btn-save" onClick={() => salvarMovimentacao(modalMovimentacao)}>Salvar</button>
            <button className="btn-cancel" onClick={() => setModalMovimentacao(null)}>Cancelar</button>
          </div>
        </EstoqueModal>
      )}
    </div>
  );
};

export default GerenciarEstoque;