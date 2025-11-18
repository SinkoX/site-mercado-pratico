import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FaArrowLeft } from "react-icons/fa6";
import "./GerenciarFornecedores.css";
import ModalFornecedor from "../components/ModalFornecedor";
import ModalFornecimento from "../components/ModalFornecimento";

interface Produto {
  idProduto: number;
  nomeProduto: string;
  precoProduto: number;
}

interface Fornecedor {
  idFornecedor: number;
  nomeFornecedor: string;
  emailFornecedor: string;
  cpfFornecedor: string;
  cnpj: string;
  telefoneFornecedor: string;
  produtos?: Produto[];
}

export default function GerenciarFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [filtro, setFiltro] = useState("");
  const [modalFornecedor, setModalFornecedor] = useState(false);
  const [fornecedorEdit, setFornecedorEdit] = useState<Fornecedor | null>(null);
  const [modalFornecimento, setModalFornecimento] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    carregarFornecedores();
  }, []);

  const carregarFornecedores = async () => {
    try {
      const res = await api.get("/fornecedores");
      console.log("RETORNO API:", res.data); // <-- veja o formato real
      setFornecedores(res.data);
    } catch (err) {
      console.error("Erro ao buscar fornecedores:", err);
    }
  };

  const deletarFornecedor = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este fornecedor?"))
      return;
    try {
      await api.delete(`/fornecedores/${id}`);
      setFornecedores(fornecedores.filter((f) => f.idFornecedor !== id));
    } catch (err) {
      console.error("Erro ao excluir fornecedor:", err);
    }
  };

  const fornecedoresFiltrados = fornecedores.filter(
    (f) =>
      f.nomeFornecedor.toLowerCase().includes(filtro.toLowerCase()) ||
      f.emailFornecedor.toLowerCase().includes(filtro.toLowerCase()) ||
      f.cpfFornecedor.includes(filtro) ||
      f.cnpj.includes(filtro) ||
      f.telefoneFornecedor.includes(filtro)
  );

  const formatTelefone = (telefone: string) => {
    if (!telefone) return "";
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return "";
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  const formatCNPJ = (cnpj: string) => {
    if (!cnpj) return "";
    return cnpj.replace(
      /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
      "$1.$2.$3/$4-$5"
    );
  };

  return (
    <div className="gerenciar-fornecedores-page">
      <div className="back-icon" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </div>
      <h1>Gerenciamento de Fornecedores</h1>

      <div className="bloco">
        <button
          className="btn-adicionar"
          onClick={() => {
            setFornecedorEdit(null);
            setModalFornecedor(true);
          }}
        >
          Adicionar Fornecedor
        </button>
        <button
          className="btn-adicionar"
          onClick={() => {
            setModalFornecimento(true);
          }}
        >
          Novo Fornecimento
        </button>
        <input
          type="text"
          placeholder="Filtrar por nome, e-mail, CPF, CNPJ ou telefone"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
          className="input-filtro"
        />

        <table className="tabela">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nome</th>
              <th>Email</th>
              <th>CPF</th>
              <th>CNPJ</th>
              <th>Telefone</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {fornecedoresFiltrados.length > 0 ? (
              fornecedoresFiltrados.map((f) => (
                <tr key={f.idFornecedor}>
                  <td>{f.idFornecedor}</td>
                  <td>{f.nomeFornecedor}</td>
                  <td>{f.emailFornecedor}</td>
                  <td>{formatCPF(f.cpfFornecedor)}</td>
                  <td>{formatCNPJ(f.cnpj)}</td>
                  <td>{formatTelefone(f.telefoneFornecedor)}</td>
                  <td>
                    <button
                      className="btn editar"
                      onClick={() => {
                        setFornecedorEdit(f);
                        setModalFornecedor(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn excluir"
                      onClick={() => deletarFornecedor(f.idFornecedor)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="vazio">
                  Nenhum fornecedor encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalFornecedor && (
        <ModalFornecedor
          fornecedorEdit={fornecedorEdit || undefined}
          fechar={() => {
            setModalFornecedor(false);
            setFornecedorEdit(null);
          }}
          atualizar={carregarFornecedores}
        />
      )}

      {modalFornecimento && (
        <ModalFornecimento
          fechar={() => setModalFornecimento(false)}
          atualizar={carregarFornecedores}
        />
      )}
    </div>
  );
}
