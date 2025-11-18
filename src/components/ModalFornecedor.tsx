import { useState, useEffect } from "react";
import { api } from "../api";
import "./ModalFornecedor.css";

interface Fornecedor {
  idFornecedor: number;
  nomeFornecedor: string;
  emailFornecedor: string;
  cpfFornecedor: string;
  cnpj: string;
  telefoneFornecedor: string;
}

interface ModalFornecedorProps {
  fornecedorEdit?: Fornecedor;
  fechar: () => void;
  atualizar: () => void;
}

export default function ModalFornecedor({
  fornecedorEdit,
  fechar,
  atualizar,
}: ModalFornecedorProps) {
  const [form, setForm] = useState<Partial<Fornecedor>>({
    nomeFornecedor: "",
    emailFornecedor: "",
    cpfFornecedor: "",
    cnpj: "",
    telefoneFornecedor: "",
  });

  useEffect(() => {
    if (fornecedorEdit) {
      setForm({
        nomeFornecedor: fornecedorEdit.nomeFornecedor,
        emailFornecedor: fornecedorEdit.emailFornecedor,
        cpfFornecedor: formatCPF(fornecedorEdit.cpfFornecedor),
        cnpj: formatCNPJ(fornecedorEdit.cnpj),
        telefoneFornecedor: formatTelefone(fornecedorEdit.telefoneFornecedor),
      });
    }
  }, [fornecedorEdit]);

  const limparFormatacao = (valor: string) => {
    return valor.replace(/\D/g, "");
  };

  const formatCPF = (cpf: string) => {
    const cleaned = limparFormatacao(cpf);
    return cleaned.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/, "$1.$2.$3-$4");
  };

  const formatCNPJ = (cnpj: string) => {
    const cleaned = limparFormatacao(cnpj);
    return cleaned.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  const formatTelefone = (telefone: string) => {
    const cleaned = limparFormatacao(telefone);
    return cleaned.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };

  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = limparFormatacao(e.target.value);
    if (value.length > 11) value = value.slice(0, 11);
    setForm({ ...form, cpfFornecedor: formatCPF(value) });
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = limparFormatacao(e.target.value);
    if (value.length > 14) value = value.slice(0, 14);
    setForm({ ...form, cnpj: formatCNPJ(value) });
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = limparFormatacao(e.target.value);
    if (value.length > 11) value = value.slice(0, 11);
    setForm({ ...form, telefoneFornecedor: formatTelefone(value) });
  };

  const handleSalvar = async () => {
    try {
      const fornecedorLimpo = {
        nomeFornecedor: form.nomeFornecedor,
        emailFornecedor: form.emailFornecedor,
        cpfFornecedor: limparFormatacao(form.cpfFornecedor || ""),
        cnpj: limparFormatacao(form.cnpj || ""),
        telefoneFornecedor: limparFormatacao(form.telefoneFornecedor || ""),
      };

      console.log(fornecedorLimpo);

      if (fornecedorEdit) {
        await api.put(`/fornecedores/${fornecedorEdit.idFornecedor}`, fornecedorLimpo);
        alert("Fornecedor atualizado com sucesso!");
      } else {
        await api.post("/fornecedores/cadastro", fornecedorLimpo);
        alert("Fornecedor cadastrado com sucesso!");
      }
      atualizar();
      fechar();
    } catch (err) {
      console.error("Erro ao salvar fornecedor:", err);
      alert("Erro ao salvar fornecedor");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>{fornecedorEdit ? "Editar Fornecedor" : "Cadastrar Fornecedor"}</h2>

        <div className="form-group">
          <label>Nome do Fornecedor</label>
          <input
            type="text"
            value={form.nomeFornecedor || ""}
            onChange={(e) => setForm({ ...form, nomeFornecedor: e.target.value })}
            placeholder="Nome completo"
          />
        </div>

        <div className="form-group">
          <label>E-mail</label>
          <input
            type="email"
            value={form.emailFornecedor || ""}
            onChange={(e) => setForm({ ...form, emailFornecedor: e.target.value })}
            placeholder="email@exemplo.com"
          />
        </div>

        <div className="form-group">
          <label>CPF</label>
          <input
            type="text"
            value={form.cpfFornecedor || ""}
            onChange={handleCpfChange}
            placeholder="000.000.000-00"
          />
        </div>

        <div className="form-group">
          <label>CNPJ</label>
          <input
            type="text"
            value={form.cnpj || ""}
            onChange={handleCnpjChange}
            placeholder="00.000.000/0000-00"
          />
        </div>

        <div className="form-group">
          <label>Telefone</label>
          <input
            type="text"
            value={form.telefoneFornecedor || ""}
            onChange={handleTelefoneChange}
            placeholder="(00) 00000-0000"
          />
        </div>

        <div className="modal-actions">
          <button className="btn-cancelar" onClick={fechar}>
            Cancelar
          </button>
          <button className="btn-salvar" onClick={handleSalvar}>
            {fornecedorEdit ? "Salvar Alterações" : "Cadastrar"}
          </button>
        </div>
      </div>
    </div>
  );
}