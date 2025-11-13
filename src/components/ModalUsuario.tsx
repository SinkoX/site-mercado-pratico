import React, { useState, useEffect, ChangeEvent } from "react";
import { api } from "../api";

interface TipoUsuario {
  idTipoUsuario: number;
  nomeTipoUsuario: string;
}

interface Endereco {
  idEndereco: number;
  cep: string;
  rua: string;
  numero: string;
  bairro: string;
  cidade: string;
  complemento?: string;
}

interface Usuario {
  idUsuario: number;
  nomeUsuario: string;
  emailUsuario: string;
  senhaUsuario: string;
  cpfUsuario: string;
  telefoneUsuario: string;
  tipoUsuario: TipoUsuario;
  endereco: Endereco[];
}

interface ModalUsuarioProps {
  usuarioEdit?: Usuario;
  tiposUsuario: TipoUsuario[];
  enderecos: Endereco[];
  fechar: () => void;
  atualizar: () => void;
}

export default function ModalUsuario({
  usuarioEdit,
  tiposUsuario,
  enderecos,
  fechar,
  atualizar,
}: ModalUsuarioProps) {
  const [nomeUsuario, setNomeUsuario] = useState<string>("");
  const [emailUsuario, setEmailUsuario] = useState<string>("");
  const [senhaUsuario, setSenhaUsuario] = useState<string>("");
  const [cpfUsuario, setCpfUsuario] = useState<string>("");
  const [telefoneUsuario, setTelefoneUsuario] = useState<string>("");
  const [tipoUsuarioId, setTipoUsuarioId] = useState<number | string>("");
  const [enderecoId, setEnderecoId] = useState<number | string>("");

  useEffect(() => {
    if (usuarioEdit) {
      setNomeUsuario(usuarioEdit.nomeUsuario || "");
      setEmailUsuario(usuarioEdit.emailUsuario || "");
      setSenhaUsuario(usuarioEdit.senhaUsuario || "");
      setCpfUsuario(usuarioEdit.cpfUsuario || "");
      setTelefoneUsuario(usuarioEdit.telefoneUsuario || "");
      setTipoUsuarioId(usuarioEdit.tipoUsuario?.idTipoUsuario || "");
      setEnderecoId(usuarioEdit.endereco?.[0]?.idEndereco || "");
    }
  }, [usuarioEdit]);

  const handleChange =
    (setter: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setter(e.target.value);

  const salvar = async () => {
    if (!nomeUsuario.trim()) return alert("Informe o nome do usuário.");
    if (!emailUsuario.trim()) return alert("Informe o email do usuário.");
    if (!senhaUsuario.trim()) return alert("Informe a senha do usuário.");
    if (!cpfUsuario.trim()) return alert("Informe o CPF do usuário.");
    if (!telefoneUsuario.trim()) return alert("Informe o telefone do usuário.");
    if (!tipoUsuarioId) return alert("Selecione o tipo de usuário.");
    if (!enderecoId) return alert("Selecione um endereço.");

    const usuario = {
      nomeUsuario: nomeUsuario.trim(),
      emailUsuario: emailUsuario.trim(),
      senhaUsuario: senhaUsuario.trim(),
      cpfUsuario: cpfUsuario.trim(),
      telefoneUsuario: telefoneUsuario.trim(),
      tipoUsuario: { idTipoUsuario: Number(tipoUsuarioId) },
      endereco: [{ idEndereco: Number(enderecoId) }],
    };

    try {
      if (usuarioEdit?.idUsuario) {
        await api.put(`/usuario/${usuarioEdit.idUsuario}`, usuario);
      } else {
        await api.post("/usuario/cadastro", usuario);
      }
      atualizar();
      fechar();
      alert("Usuário salvo com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar usuário. Verifique os dados.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-conteudo">
        <h2>{usuarioEdit ? "Editar Usuário" : "Novo Usuário"}</h2>

        <label>Nome</label>
        <input
          type="text"
          placeholder="Nome"
          value={nomeUsuario}
          onChange={handleChange(setNomeUsuario)}
        />

        <label>Email</label>
        <input
          type="email"
          placeholder="Email"
          value={emailUsuario}
          onChange={handleChange(setEmailUsuario)}
        />

        <label>Senha</label>
        <input
          type="text"
          placeholder="Senha"
          value={senhaUsuario}
          onChange={handleChange(setSenhaUsuario)}
        />

        <label>CPF</label>
        <input
          type="text"
          placeholder="CPF"
          value={cpfUsuario}
          onChange={handleChange(setCpfUsuario)}
        />

        <label>Telefone</label>
        <input
          type="text"
          placeholder="Telefone"
          value={telefoneUsuario}
          onChange={handleChange(setTelefoneUsuario)}
        />

        <label>Tipo de Usuário</label>
        <select value={tipoUsuarioId} onChange={handleChange(setTipoUsuarioId)}>
          <option value="">Selecione um tipo de usuário</option>
          {tiposUsuario.map((tipo) => (
            <option key={tipo.idTipoUsuario} value={tipo.idTipoUsuario}>
              {tipo.nomeTipoUsuario}
            </option>
          ))}
        </select>

        <label>Endereço</label>
        <select value={enderecoId} onChange={handleChange(setEnderecoId)}>
          <option value="">Selecione um endereço</option>
          {enderecos.map((e) => (
            <option key={e.idEndereco} value={e.idEndereco}>
              {`${e.rua}, ${e.numero} - ${e.cidade}`}
            </option>
          ))}
        </select>

        <div className="botoes">
          <button onClick={salvar}>Salvar</button>
          <button onClick={fechar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
