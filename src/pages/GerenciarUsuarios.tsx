import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { FaArrowLeft } from "react-icons/fa6";
import "./GerenciarUsuarios.css";
import ModalUsuario from "../components/ModalUsuario";

interface Endereco {
  idEndereco: number;
  cep: string;
  rua: string;
  bairro: string;
  numero: string;
  cidade: string;
  complemento?: string;
}

interface TipoUsuario {
  idTipoUsuario: number;
  nomeTipoUsuario: string;
}

interface Usuario {
  idUsuario: number;
  nomeUsuario: string;
  emailUsuario: string;
  cpfUsuario: string;
  telefoneUsuario: string;
  tipoUsuario: TipoUsuario;
  endereco: Endereco[];
}

export default function GerenciarUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [filtro, setFiltro] = useState("");
  const [modalUsuario, setModalUsuario] = useState(false);
  const [usuarioEdit, setUsuarioEdit] = useState<Usuario | null>(null);
  const [tiposUsuario, setTiposUsuario] = useState<TipoUsuario[]>([]);
  const [enderecos, setEnderecos] = useState<Endereco[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    carregarUsuarios();
    carregarTipos();
    carregarEnderecos();
  }, []);

  const carregarUsuarios = async () => {
    try {
      const res = await api.get("/usuario");
      setUsuarios(res.data);
    } catch (err) {
      console.error("Erro ao buscar usuários:", err);
    }
  };

  const carregarTipos = async () => {
    try {
      const res = await api.get("/tipos-usuario");
      setTiposUsuario(res.data);
    } catch (err) {
      console.error("Erro ao buscar tipos de usuário:", err);
    }
  };

  const carregarEnderecos = async () => {
    try {
      const res = await api.get("/enderecos");
      setEnderecos(res.data);
    } catch (err) {
      console.error("Erro ao buscar endereços:", err);
    }
  };

  const deletarUsuario = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este usuário?")) return;
    try {
      await api.delete(`/usuario/${id}`);
      setUsuarios(usuarios.filter((u) => u.idUsuario !== id));
      carregarUsuarios();
    } catch (err) {
      console.error("Erro ao excluir usuário:", err);
    }
  };

  const usuariosFiltrados = usuarios.filter((u) =>
    u.nomeUsuario.toLowerCase().includes(filtro.toLowerCase())
  );

  const formatTelefone = (telefone: string) => {
    if (!telefone) return "";
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1)$2-$3");
  };

  const formatCPF = (cpf: string) => {
    if (!cpf) return "";
    return cpf.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  return (
    <div className="gerenciar-usuarios-page">
      <div className="back-icon" onClick={() => navigate(-1)}>
        <FaArrowLeft />
      </div>
      <h1>Gerenciamento de Usuários</h1>

      <div className="bloco">
        <button
          className="btn-adicionar"
          onClick={() => {
            setUsuarioEdit(null);
            setModalUsuario(true);
          }}
        >
          Adicionar Usuário
        </button>
        <input
          type="text"
          placeholder="Filtrar por nome"
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
              <th>Telefone</th>
              <th>CEP</th>
              <th>Tipo</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length > 0 ? (
              usuariosFiltrados.map((u) => (
                <tr key={u.idUsuario}>
                  <td>{u.idUsuario}</td>
                  <td>{u.nomeUsuario}</td>
                  <td>{u.emailUsuario}</td>
                  <td>{formatCPF(u.cpfUsuario)}</td>
                  <td>{formatTelefone(u.telefoneUsuario)}</td>
                  <td>{u.endereco?.[0]?.cep || "—"}</td>
                  <td>{u.tipoUsuario?.nomeTipoUsuario || "—"}</td>
                  <td>
                    <button
                      className="btn-editar"
                      onClick={() => {
                        setUsuarioEdit(u);
                        setModalUsuario(true);
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-excluir"
                      onClick={() => deletarUsuario(u.idUsuario)}
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="vazio">
                  Nenhum usuário encontrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {modalUsuario && (
        <ModalUsuario
          usuarioEdit={usuarioEdit || undefined}
          tiposUsuario={tiposUsuario}
          enderecos={enderecos}
          fechar={() => setModalUsuario(false)}
          atualizar={carregarUsuarios}
        />
      )}
    </div>
  );
}
