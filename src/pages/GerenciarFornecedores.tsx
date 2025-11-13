import { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./GerenciarFornecedores.css";

interface Fornecedor {
  idFornecedor: number;
  nomeFornecedor: string;
  emailFornecedor: string;
  cpfFornecedor: string;
  cnpj: string;
  telefoneFornecedor: string;
}

function GerenciarFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState<Partial<Fornecedor>>({});
  const [editando, setEditando] = useState(false);
  const navigate = useNavigate();

  // Buscar todos os fornecedores
  const fetchFornecedores = async () => {
    try {
      const res = await api.get("/fornecedores");
      setFornecedores(res.data);
    } catch {
      toast.error("❌ Erro ao carregar fornecedores");
    }
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  // Filtro automático em múltiplos campos
  useEffect(() => {
    const delay = setTimeout(async () => {
      try {
        const res = await api.get("/fornecedores");
        const todos = res.data;
        const filtrados = todos.filter((f: Fornecedor) =>
          Object.values(f)
            .join(" ")
            .toLowerCase()
            .includes(busca.toLowerCase())
        );
        setFornecedores(filtrados);
      } catch {
        toast.error("⚠️ Erro ao filtrar fornecedores");
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [busca]);

  const abrirModal = (fornecedor?: Fornecedor) => {
    setForm(fornecedor || {});
    setEditando(!!fornecedor);
    setModalAberto(true);
  };

  const fecharModal = () => {
    setModalAberto(false);
    setForm({});
    setEditando(false);
  };

  const handleChange = (campo: keyof Fornecedor, valor: string) => {
    setForm({ ...form, [campo]: valor });
  };

  const handleSalvar = async () => {
    try {
      if (editando && form.idFornecedor) {
        await api.put(`/fornecedores/${form.idFornecedor}`, form);
        toast.success("✅ Fornecedor atualizado com sucesso!");
      } else {
        await api.post("/fornecedores", form);
        toast.success("🎉 Fornecedor cadastrado com sucesso!");
      }
      fecharModal();
      fetchFornecedores();
    } catch {
      toast.error("❌ Erro ao salvar fornecedor");
    }
  };

  const handleDeletar = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este fornecedor?")) return;
    try {
      await api.delete(`/fornecedores/${id}`);
      toast.info("🗑️ Fornecedor excluído com sucesso");
      fetchFornecedores();
    } catch {
      toast.error("❌ Erro ao deletar fornecedor");
    }
  };

  return (
    <div className="fornecedor-page">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="fornecedor-container">
        <div className="fornecedor-header">
          <h1>📦 Gerenciamento de Fornecedores</h1>
          <div className="fornecedor-actions">
            <input
              type="text"
              placeholder="🔍 Pesquisar por nome, e-mail, CPF, CNPJ ou telefone..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
            <button className="btn-novo" onClick={() => abrirModal()}>
              + Novo Fornecedor
            </button>
          </div>
        </div>

        <div className="fornecedor-lista">
          {fornecedores.length === 0 ? (
            <p className="sem-fornecedores">Nenhum fornecedor encontrado.</p>
          ) : (
            fornecedores.map((f) => (
              <div key={f.idFornecedor} className="fornecedor-card">
                <div className="fornecedor-info">
                  <h3>{f.nomeFornecedor}</h3>
                  <p><strong>Email:</strong> {f.emailFornecedor}</p>
                  <p><strong>CPF:</strong> {f.cpfFornecedor}</p>
                  <p><strong>CNPJ:</strong> {f.cnpj}</p>
                  <p><strong>Telefone:</strong> {f.telefoneFornecedor}</p>
                </div>
                <div className="fornecedor-acoes">
                  <button onClick={() => abrirModal(f)} className="btn-editar">✏️ Editar</button>
                  <button onClick={() => handleDeletar(f.idFornecedor)} className="btn-excluir">🗑️ Excluir</button>
                </div>
              </div>
            ))
          )}
        </div>

        <button className="btn-voltar" onClick={() => navigate("/paginaAdmin")}>
          ⬅ Voltar ao Gerenciamento
        </button>
      </div>

      {modalAberto && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editando ? "✏️ Editar Fornecedor" : "➕ Novo Fornecedor"}</h2>

            <div className="form-grid">
              <input
                type="text"
                placeholder="Nome do Fornecedor"
                value={form.nomeFornecedor || ""}
                onChange={(e) => handleChange("nomeFornecedor", e.target.value)}
              />
              <input
                type="email"
                placeholder="E-mail"
                value={form.emailFornecedor || ""}
                onChange={(e) => handleChange("emailFornecedor", e.target.value)}
              />
              <input
                type="text"
                placeholder="CPF"
                value={form.cpfFornecedor || ""}
                onChange={(e) => handleChange("cpfFornecedor", e.target.value)}
              />
              <input
                type="text"
                placeholder="CNPJ"
                value={form.cnpj || ""}
                onChange={(e) => handleChange("cnpj", e.target.value)}
              />
              <input
                type="text"
                placeholder="Telefone"
                value={form.telefoneFornecedor || ""}
                onChange={(e) => handleChange("telefoneFornecedor", e.target.value)}
              />
            </div>

            <div className="botoes-form">
              <button className="btn-salvar" onClick={handleSalvar}>
                {editando ? "Salvar Alterações" : "Cadastrar"}
              </button>
              <button className="btn-cancelar" onClick={fecharModal}>
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GerenciarFornecedores;
