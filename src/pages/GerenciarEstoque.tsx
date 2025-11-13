import React, { useEffect, useState } from "react";
import { api } from "../api";
import Modal from "../components/EstoqueModal";
import "./GerenciarEstoque.css";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";

interface EstoqueDTO {
  idEstoque: number;
  idProduto: number;
  nomeProduto: string;
  quantidade: number;
  quantidadeMinima: number;
  estoqueAbaixoDoMinimo: boolean;
}

interface MovimentacaoEstoqueDTO {
  idMovimentacao: number;
  idProduto: number;
  nomeProduto: string;
  tipoMovimentacao: "ENTRADA" | "SAIDA";
  quantidade: number;
  dataMovimentacao: string;
  observacao?: string;
}

interface AlertaMov {
  tipo: "ENTRADA" | "SAIDA";
  mensagem: string;
}

export default function GerenciarEstoque() {
  // ==== Estados Estoque e Movimentação ====
  const [estoques, setEstoques] = useState<EstoqueDTO[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoEstoqueDTO[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  // ==== Modal de movimentação ====
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduto, setSelectedProduto] = useState<EstoqueDTO | null>(
    null
  );
  const [tipoMovimentacao, setTipoMovimentacao] = useState<"ENTRADA" | "SAIDA">(
    "ENTRADA"
  );
  const [quantidade, setQuantidade] = useState<number>(0);
  const [observacao, setObservacao] = useState("");
  const [buscandoProduto, setBuscandoProduto] = useState(false);

  // ==== Modal de novo estoque ====
  const [isModalNovoEstoqueOpen, setIsModalNovoEstoqueOpen] = useState(false);
  const [novoProdutoId, setNovoProdutoId] = useState("");
  const [novoProdutoNome, setNovoProdutoNome] = useState("");
  const [novoProdutoQtd, setNovoProdutoQtd] = useState<number>(0);
  const [novoProdutoMin, setNovoProdutoMin] = useState<number>(0);
  // ==== Filtros ====
  const [filtroEstoque, setFiltroEstoque] = useState(
    localStorage.getItem("filtroEstoque") || ""
  );
  const [filtroStatus, setFiltroStatus] = useState(
    localStorage.getItem("filtroStatus") || "TODOS"
  );
  const [filtroMov, setFiltroMov] = useState(
    localStorage.getItem("filtroMov") || ""
  );
  const [tipoFiltroMov, setTipoFiltroMov] = useState(
    localStorage.getItem("tipoFiltroMov") || "TODOS"
  );
  const [filtroData, setFiltroData] = useState(
    localStorage.getItem("filtroData") || ""
  );

  // ==== Paginação ====
  const [paginaEstoque, setPaginaEstoque] = useState(
    Number(localStorage.getItem("paginaEstoque")) || 1
  );
  const [paginaMov, setPaginaMov] = useState(
    Number(localStorage.getItem("paginaMov")) || 1
  );
  const [itensPorPaginaEstoque, setItensPorPaginaEstoque] = useState(
    Number(localStorage.getItem("itensPorPaginaEstoque")) || 10
  );
  const [itensPorPaginaMov, setItensPorPaginaMov] = useState(
    Number(localStorage.getItem("itensPorPaginaMov")) || 10
  );

  // ==== Alerta ====
  const [alertaMov, setAlertaMov] = useState<AlertaMov | null>(null);
  const [alertaAnimacao, setAlertaAnimacao] = useState(false);

  const navigate = useNavigate();

  // ==== Fetch Estoques e Movimentações ====
  const fetchEstoque = async () => {
    try {
      const res = await api.get(`/estoques`);
      setEstoques(res.data);
    } catch (err) {
      console.error("Erro buscar estoques:", err);
    }
  };

  const fetchMovimentacoes = async () => {
    try {
      const res = await api.get(`/movimentacoes`);
      setMovimentacoes(res.data);
    } catch (err) {
      console.error("Erro buscar movimentações:", err);
    }
  };

  useEffect(() => {
    const load = async () => {
      await Promise.all([fetchEstoque(), fetchMovimentacoes()]);
      setLoading(false);
    };
    load();
  }, []);

  // ==== Persistir filtros e paginação ====
  useEffect(() => {
    localStorage.setItem("filtroEstoque", filtroEstoque);
    localStorage.setItem("filtroStatus", filtroStatus);
    localStorage.setItem("filtroMov", filtroMov);
    localStorage.setItem("tipoFiltroMov", tipoFiltroMov);
    localStorage.setItem("filtroData", filtroData);
    localStorage.setItem("paginaEstoque", String(paginaEstoque));
    localStorage.setItem("paginaMov", String(paginaMov));
    localStorage.setItem(
      "itensPorPaginaEstoque",
      String(itensPorPaginaEstoque)
    );
    localStorage.setItem("itensPorPaginaMov", String(itensPorPaginaMov));
  }, [
    filtroEstoque,
    filtroStatus,
    filtroMov,
    tipoFiltroMov,
    filtroData,
    paginaEstoque,
    paginaMov,
    itensPorPaginaEstoque,
    itensPorPaginaMov,
  ]);

  // ==== Modal Movimentação ====
  const abrirModal = (produto: EstoqueDTO, tipo: "ENTRADA" | "SAIDA") => {
    setSelectedProduto(produto);
    setTipoMovimentacao(tipo);
    setQuantidade(0);
    setObservacao("");
    setIsModalOpen(true);
  };

  const registrarMovimentacao = async () => {
    if (!selectedProduto || quantidade <= 0) {
      alert("Informe uma quantidade válida.");
      return;
    }

    // Validação de saída: não pode retirar mais do que tem em estoque
    if (
      tipoMovimentacao === "SAIDA" &&
      quantidade > selectedProduto.quantidade
    ) {
      alert(
        `❌ Quantidade insuficiente em estoque!\n\n` +
          `Produto: ${selectedProduto.nomeProduto}\n` +
          `Quantidade disponível: ${selectedProduto.quantidade}\n` +
          `Quantidade solicitada: ${quantidade}\n\n` +
          `Por favor, insira uma quantidade menor ou igual a ${selectedProduto.quantidade}.`
      );
      return;
    }

    const payload = {
      idProduto: selectedProduto.idProduto,
      quantidade,
      tipoMovimentacao,
      observacao,
    };

    try {
      await api.post(`/movimentacoes/manual`, payload, {
        headers: { "Content-Type": "application/json" },
      });
      setIsModalOpen(false);
      await Promise.all([fetchEstoque(), fetchMovimentacoes()]);
      mostrarAlerta(
        tipoMovimentacao,
        `${tipoMovimentacao} registrada com sucesso!`
      );
    } catch (err) {
      console.error("Erro ao registrar movimentação:", err);
      alert("Erro ao registrar movimentação. Verifique o console.");
    }
  };

  // ==== Modal Novo Estoque ====
  const buscarProdutoPorId = async (idProduto: string) => {
    if (!idProduto.trim()) {
      setNovoProdutoNome("");
      return;
    }

    setBuscandoProduto(true);
    try {
      const res = await api.get(`/produto/${idProduto}`);
      if (res.data && res.data.nomeProduto) {
        setNovoProdutoNome(res.data.nomeProduto);
      }
    } catch (err) {
      console.error("Erro ao buscar produto:", err);
      setNovoProdutoNome("");
      alert("Produto não encontrado com esse ID.");
    } finally {
      setBuscandoProduto(false);
    }
  };

  const cadastrarNovoEstoque = async () => {
    if (
      !novoProdutoId.trim() ||
      !novoProdutoNome ||
      novoProdutoQtd < 0 ||
      novoProdutoMin < 0
    ) {
      alert("Preencha os dados corretamente.");
      return;
    }

    const payload = {
      idProduto: Number(novoProdutoId),
      nomeProduto: novoProdutoNome,
      quantidade: novoProdutoQtd,
      quantidadeMinima: novoProdutoMin,
    };

    try {
      await api.post(`/estoques`, payload);
      setIsModalNovoEstoqueOpen(false);
      setNovoProdutoId("");
      setNovoProdutoNome("");
      setNovoProdutoQtd(0);
      setNovoProdutoMin(0);
      await fetchEstoque();
      mostrarAlerta("ENTRADA", "Estoque cadastrado com sucesso!");
    } catch (err) {
      console.error("Erro ao cadastrar estoque:", err);
      alert(
        "Erro ao cadastrar estoque. Verifique se o produto já não possui estoque cadastrado."
      );
    }
  };

  // ==== Alerta ====
  const mostrarAlerta = (tipo: "ENTRADA" | "SAIDA", mensagem: string) => {
    setAlertaMov({ tipo, mensagem });
    setAlertaAnimacao(false);

    setTimeout(() => setAlertaAnimacao(true), 50);
    setTimeout(() => {
      setAlertaAnimacao(false);
      setTimeout(() => setAlertaMov(null), 300);
    }, 3000);
  };

  const normalizar = (texto: string) =>
    texto
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  // ==== Filtragem Estoques ====
  const estoquesFiltrados = estoques.filter((e) => {
    const nomeMatch = normalizar(e.nomeProduto).includes(
      normalizar(filtroEstoque)
    );
    const idMatch = e.idProduto.toString().includes(filtroEstoque.trim());
    const statusMatch =
      filtroStatus === "TODOS" ||
      (filtroStatus === "ABAIXO" && e.estoqueAbaixoDoMinimo) ||
      (filtroStatus === "ZERADO" && e.quantidade === 0) ||
      (filtroStatus === "NORMAL" &&
        !e.estoqueAbaixoDoMinimo &&
        e.quantidade > 0);
    return (nomeMatch || idMatch) && statusMatch;
  });

  // ==== Filtragem Movimentações ====
  const movimentacoesFiltradas = movimentacoes.filter((m) => {
    const nomeMatch = normalizar(m.nomeProduto).includes(normalizar(filtroMov));
    const idMatch =
      filtroMov.trim() === ""
        ? false
        : m.idMovimentacao.toString().includes(filtroMov.trim()) ||
          m.idProduto.toString().includes(filtroMov.trim());
    const tipoMatch =
      tipoFiltroMov === "TODOS" ? true : m.tipoMovimentacao === tipoFiltroMov;
    const dataMatch =
      !filtroData ||
      new Date(m.dataMovimentacao).toLocaleDateString("sv-SE") === filtroData;
    const nomeOuIdMatch = filtroMov.trim() ? nomeMatch || idMatch : nomeMatch;
    return nomeOuIdMatch && tipoMatch && dataMatch;
  });

  // ==== Paginação ====
  const totalPaginasEstoque = Math.max(
    1,
    Math.ceil(estoquesFiltrados.length / itensPorPaginaEstoque)
  );
  const totalPaginasMov = Math.max(
    1,
    Math.ceil(movimentacoesFiltradas.length / itensPorPaginaMov)
  );

  const estoquesPaginados = estoquesFiltrados.slice(
    (paginaEstoque - 1) * itensPorPaginaEstoque,
    paginaEstoque * itensPorPaginaEstoque
  );

  const movimentacoesPaginadas = movimentacoesFiltradas.slice(
    (paginaMov - 1) * itensPorPaginaMov,
    paginaMov * itensPorPaginaMov
  );

  // ==== Navegação Paginação ====
  const prevEstoque = () => setPaginaEstoque((p) => Math.max(1, p - 1));
  const nextEstoque = () =>
    setPaginaEstoque((p) => Math.min(totalPaginasEstoque, p + 1));
  const prevMov = () => setPaginaMov((p) => Math.max(1, p - 1));
  const nextMov = () => setPaginaMov((p) => Math.min(totalPaginasMov, p + 1));

  const limparFiltrosEstoque = async () => {
    setFiltroEstoque("");
    setFiltroStatus("TODOS");
    setItensPorPaginaEstoque(10);
    setPaginaEstoque(1);
    localStorage.removeItem("filtroEstoque");
    localStorage.removeItem("filtroStatus");
    await fetchEstoque();
  };

  const limparFiltrosMov = async () => {
    setFiltroMov("");
    setTipoFiltroMov("TODOS");
    setFiltroData("");
    setItensPorPaginaMov(10);
    setPaginaMov(1);
    localStorage.removeItem("filtroMov");
    localStorage.removeItem("tipoFiltroMov");
    localStorage.removeItem("filtroData");
    await fetchMovimentacoes();
  };

  const handleChangeItensPorPaginaEstoque = (n: number) => {
    setItensPorPaginaEstoque(n);
    setPaginaEstoque(1);
  };

  const handleChangeItensPorPaginaMov = (n: number) => {
    setItensPorPaginaMov(n);
    setPaginaMov(1);
  };

  if (loading) return <p>Carregando dados...</p>;

  return (
    <div className="estoque-container">
      <div className="back-icon" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </div>
      <h1>Gerenciamento de Estoque</h1>

      {/* ALERTA */}
      {alertaMov && (
        <div
          className={`alerta-mov ${alertaMov.tipo.toLowerCase()} ${
            alertaAnimacao ? "entra" : "sai"
          }`}
        >
          {alertaMov.mensagem}
        </div>
      )}

      {/* BOTÃO NOVO ESTOQUE */}
      <div style={{ textAlign: "right", marginBottom: "10px" }}>
        <button
          className="btn entrada"
          onClick={() => setIsModalNovoEstoqueOpen(true)}
        >
          ➕ Novo Estoque
        </button>
      </div>

      {/* ESTOQUES */}
      <section className="bloco-estoque">
        <h2>📦 Estoques</h2>
        <div className="filtros">
          <input
            type="text"
            placeholder="Buscar por nome ou ID..."
            value={filtroEstoque}
            onChange={(e) => setFiltroEstoque(e.target.value)}
          />
          <select
            value={filtroStatus}
            onChange={(e) => setFiltroStatus(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ABAIXO">Abaixo do mínimo</option>
            <option value="ZERADO">Zerados</option>
            <option value="NORMAL">Normal</option>
          </select>
          <button className="btn limpar" onClick={limparFiltrosEstoque}>
            Limpar filtros
          </button>
        </div>

        <div className="tabela-container">
          <table className="estoque-tabela">
            <thead>
              <tr>
                <th>ID</th>
                <th>Produto</th>
                <th>Qtd</th>
                <th>Mínimo</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {estoquesPaginados.map((item) => (
                <tr key={item.idEstoque}>
                  <td>{item.idProduto}</td>
                  <td>{item.nomeProduto}</td>
                  <td>{item.quantidade}</td>
                  <td>{item.quantidadeMinima}</td>
                  <td>
                    {item.estoqueAbaixoDoMinimo ? (
                      <span className="status alerta">Abaixo</span>
                    ) : item.quantidade === 0 ? (
                      <span className="status zerado">Zerado</span>
                    ) : (
                      <span className="status ok">OK</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn entrada"
                      onClick={() => abrirModal(item, "ENTRADA")}
                    >
                      ➕
                    </button>
                    <button
                      className="btn saida"
                      onClick={() => abrirModal(item, "SAIDA")}
                    >
                      ➖
                    </button>
                  </td>
                </tr>
              ))}
              {estoquesPaginados.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Nenhum estoque encontrado.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação Estoques */}
        <div className="paginacao">
          <div className="paginacao-controls">
            <button onClick={prevEstoque} disabled={paginaEstoque <= 1}>
              ◀
            </button>
            {Array.from({ length: totalPaginasEstoque }).map((_, i) => (
              <button
                key={i}
                className={paginaEstoque === i + 1 ? "ativa" : ""}
                onClick={() => setPaginaEstoque(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={nextEstoque}
              disabled={paginaEstoque >= totalPaginasEstoque}
            >
              ▶
            </button>
          </div>
          <div>
            <label>Itens por página</label>
            <select
              value={itensPorPaginaEstoque}
              onChange={(e) =>
                handleChangeItensPorPaginaEstoque(Number(e.target.value))
              }
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </section>

      {/* MOVIMENTAÇÕES */}
      <section className="bloco-movimentacoes">
        <h2>📊 Movimentações</h2>
        <div className="filtros">
          <input
            type="text"
            placeholder="Buscar por nome, ID produto ou ID mov..."
            value={filtroMov}
            onChange={(e) => setFiltroMov(e.target.value)}
          />
          <select
            value={tipoFiltroMov}
            onChange={(e) => setTipoFiltroMov(e.target.value)}
          >
            <option value="TODOS">Todos</option>
            <option value="ENTRADA">Entrada</option>
            <option value="SAIDA">Saída</option>
          </select>
          <input
            type="date"
            value={filtroData}
            onChange={(e) => setFiltroData(e.target.value)}
          />
          <button className="btn limpar" onClick={limparFiltrosMov}>
            Limpar filtros
          </button>
        </div>

        <div className="tabela-container">
          <table className="estoque-tabela">
            <thead>
              <tr>
                <th>ID Mov.</th>
                <th>Produto</th>
                <th>Tipo</th>
                <th>Qtd</th>
                <th>Data</th>
                <th>Observação</th>
              </tr>
            </thead>
            <tbody>
              {movimentacoesPaginadas.length > 0 ? (
                movimentacoesPaginadas.map((m) => (
                  <tr key={m.idMovimentacao}>
                    <td>{m.idMovimentacao}</td>
                    <td>{m.nomeProduto}</td>
                    <td
                      className={
                        m.tipoMovimentacao === "ENTRADA" ? "entrada" : "saida"
                      }
                    >
                      {m.tipoMovimentacao}
                    </td>
                    <td>{m.quantidade}</td>
                    <td>
                      {new Date(m.dataMovimentacao).toLocaleString("pt-BR")}
                    </td>
                    <td>{m.observacao || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: "center" }}>
                    Nenhuma movimentação encontrada.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação Movimentações */}
        <div className="paginacao">
          <div className="paginacao-controls">
            <button onClick={prevMov} disabled={paginaMov <= 1}>
              ◀
            </button>
            {Array.from({ length: totalPaginasMov }).map((_, i) => (
              <button
                key={i}
                className={paginaMov === i + 1 ? "ativa" : ""}
                onClick={() => setPaginaMov(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button onClick={nextMov} disabled={paginaMov >= totalPaginasMov}>
              ▶
            </button>
          </div>
          <div>
            <label>Itens por página</label>
            <select
              value={itensPorPaginaMov}
              onChange={(e) =>
                handleChangeItensPorPaginaMov(Number(e.target.value))
              }
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>
        </div>
      </section>

      {/* MODAL MOVIMENTAÇÃO */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={registrarMovimentacao}
        title={
          tipoMovimentacao === "ENTRADA"
            ? "Registrar Entrada"
            : "Registrar Saída"
        }
      >
        {selectedProduto && (
          <div className="modal-form">
            <p>
              <strong>Produto:</strong> {selectedProduto.nomeProduto}
            </p>
            <label>
              Quantidade:
              <input
                type="number"
                min={1}
                value={quantidade}
                onChange={(e) => setQuantidade(Number(e.target.value))}
              />
            </label>
            <label>
              Observação:
              <textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
              />
            </label>
          </div>
        )}
      </Modal>

      {/* MODAL NOVO ESTOQUE */}
      <Modal
        isOpen={isModalNovoEstoqueOpen}
        onClose={() => {
          setIsModalNovoEstoqueOpen(false);
          setNovoProdutoId("");
          setNovoProdutoNome("");
          setNovoProdutoQtd(0);
          setNovoProdutoMin(0);
        }}
        onConfirm={cadastrarNovoEstoque}
        title="Cadastrar Novo Estoque"
      >
        <div className="modal-form">
          <label>
            ID do Produto: *
            <input
              type="number"
              placeholder="Digite o ID do produto"
              value={novoProdutoId}
              onChange={(e) => {
                setNovoProdutoId(e.target.value);
                buscarProdutoPorId(e.target.value);
              }}
              min={1}
            />
          </label>

          <label>
            Nome do Produto:
            <input
              type="text"
              value={buscandoProduto ? "Buscando..." : novoProdutoNome}
              disabled
              placeholder="O nome será preenchido automaticamente"
              style={{
                background: "#f3f4f6",
                cursor: "not-allowed",
                color: buscandoProduto ? "#9ca3af" : "#374151",
              }}
            />
          </label>

          <label>
            Quantidade Inicial: *
            <input
              type="number"
              min={0}
              value={novoProdutoQtd}
              onChange={(e) => setNovoProdutoQtd(Number(e.target.value))}
              placeholder="Ex: 100"
            />
          </label>

          <label>
            Quantidade Mínima: *
            <input
              type="number"
              min={0}
              value={novoProdutoMin}
              onChange={(e) => setNovoProdutoMin(Number(e.target.value))}
              placeholder="Ex: 10"
            />
          </label>
        </div>
      </Modal>
    </div>
  );
}
