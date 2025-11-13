import React, { useState, useEffect } from "react";
import { Box, Grid, TextField, Button, Card, CardContent, CardActions, Typography, Dialog, DialogTitle, DialogContent, DialogActions, IconButton } from "@mui/material";
import { Add, Edit, Delete, ArrowBack } from "@mui/icons-material";
import { toast, ToastContainer } from "react-toastify";
import { api } from "../api"; // seu axios instance
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import './GerenciarFornecedores.css';

interface Fornecedor {
  idFornecedor: number;
  nomeFornecedor: string;
  emailFornecedor: string;
  cpfFornecedor: string;
  cnpj: string;
  telefoneFornecedor: string;
}

export default function GerenciarFornecedores() {
  const [fornecedores, setFornecedores] = useState<Fornecedor[]>([]);
  const [busca, setBusca] = useState("");
  const [modalAberto, setModalAberto] = useState(false);
  const [form, setForm] = useState<Partial<Fornecedor>>({});
  const [editando, setEditando] = useState(false);
  const navigate = useNavigate();

  const fetchFornecedores = async () => {
    try {
      const res = await api.get("/fornecedores");
      setFornecedores(res.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao carregar fornecedores");
    }
  };

  useEffect(() => {
    fetchFornecedores();
  }, []);

  const abrirModal = (f?: Fornecedor) => {
    setForm(f ?? {});
    setEditando(Boolean(f));
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
      const fornecedorLimpo = {
        ...form,
        cpfFornecedor: limparCpf(form.cpfFornecedor || ""),
        telefoneFornecedor: limparTelefone(form.telefoneFornecedor || ""),
        cnpj: limparCnpj(form.cnpj || ""),
      };

      if (editando && form.idFornecedor) {
        await api.put(`/fornecedores/${form.idFornecedor}`, fornecedorLimpo);
        toast.success("Fornecedor atualizado com sucesso!");
      } else {
        await api.post("/fornecedores", fornecedorLimpo);
        toast.success("🎉 Fornecedor cadastrado com sucesso!");
      }
      fecharModal();
      fetchFornecedores();
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao salvar fornecedor");
    }
  };

  const handleDeletar = async (id: number) => {
    if (!window.confirm("Tem certeza que deseja excluir este fornecedor?")) return;
    try {
      await api.delete(`/fornecedores/${id}`);
      toast.info("Fornecedor excluído com sucesso");
      fetchFornecedores();
    } catch (err) {
      console.error(err);
      toast.error("❌ Erro ao deletar fornecedor");
    }
  };

  // Funções de formatação ao digitar
  const handleCpfChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setForm({ ...form, cpfFornecedor: value });
  };

  const handleCnpjChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 14) value = value.slice(0, 14);
    value = value
      .replace(/^(\d{2})(\d)/, "$1.$2")
      .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
      .replace(/(\d{4})(\d{2})$/, "$1/$2")
      .replace(/(\d{4})\/(\d{2})(\d{2})$/, "$1/$2-$3");
    setForm({ ...form, cnpj: value });
  };

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "");
    if (value.length > 11) value = value.slice(0, 11);
    value = value
      .replace(/^(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2");
    setForm({ ...form, telefoneFornecedor: value });
  };

  // Funções de limpeza antes de enviar
  function limparCpf(cpf: string) {
    return cpf.replace(/\D/g, ""); // remove tudo que não for número
  }

  function limparTelefone(telefone: string) {
    return telefone.replace(/\D/g, ""); // remove tudo que não for número
  }

  function limparCnpj(cnpj: string) {
    return cnpj.replace(/\D/g, ""); // remove tudo que não for número
  }

  // Funções de formatação para visualização no card
  const formatarCpf = (cpf: string) => {
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  };

  const formatarTelefone = (telefone: string) => {
    return telefone.replace(/^(\d{2})(\d{5})(\d{4})$/, "($1) $2-$3");
  };

  const formatarCnpj = (cnpj: string) => {
    return cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");
  };

  return (
    <Box sx={{ bgcolor: "#f8f9fa", minHeight: "100vh", py: 6 }}>
      <ToastContainer position="top-right" autoClose={3000} />
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
          <IconButton color="primary" onClick={() => navigate("/paginaAdmin")}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h4" fontWeight="bold">
            Gerenciamento de Fornecedores
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="Pesquisar por nome, e-mail, CPF, CNPJ ou telefone..."
            variant="outlined"
            fullWidth
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
          <Button variant="contained" startIcon={<Add />} onClick={() => abrirModal()}>
            Novo
          </Button>
        </Box>

        <Grid container spacing={2}>
          {fornecedores.length === 0 ? (
            <Typography align="center" color="text.secondary">
              Nenhum fornecedor encontrado.
            </Typography>
          ) : (
            fornecedores.map((f) => (
              <Grid item component="div" xs={12} md={6} lg={4} key={f.idFornecedor}>
                <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
                  <CardContent>
                    <Typography variant="h6" fontWeight="bold">
                      {f.nomeFornecedor}
                    </Typography>
                    <Typography>Email: {f.emailFornecedor}</Typography>
                    <Typography>CPF: {formatarCpf(f.cpfFornecedor)}</Typography>
                    <Typography>CNPJ: {formatarCnpj(f.cnpj)}</Typography>
                    <Typography>Telefone: {formatarTelefone(f.telefoneFornecedor)}</Typography>
                  </CardContent>
                  <CardActions sx={{ justifyContent: "flex-end", gap: 1, pb: 2, pr: 2 }}>
                    <Button size="small" variant="outlined" startIcon={<Edit />} onClick={() => abrirModal(f)}>
                      Editar
                    </Button>
                    <Button size="small" variant="outlined" color="error" startIcon={<Delete />} onClick={() => handleDeletar(f.idFornecedor)}>
                      Excluir
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>

      {/* DIALOG / MODAL */}
      <Dialog open={modalAberto} onClose={fecharModal}>
        <DialogTitle>{editando ? "Editar Fornecedor" : "Cadastrar Fornecedor"}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            <TextField
              label="Nome do Fornecedor"
              value={form.nomeFornecedor ?? ""}
              onChange={(e) => handleChange("nomeFornecedor", e.target.value)}
              fullWidth
            />
            <TextField
              label="E-mail"
              value={form.emailFornecedor ?? ""}
              onChange={(e) => handleChange("emailFornecedor", e.target.value)}
              fullWidth
            />
            <TextField
              label="CPF"
              value={form.cpfFornecedor ?? ""}
              onChange={handleCpfChange} // Formata enquanto digita
              fullWidth
            />
            <TextField
              label="CNPJ"
              value={form.cnpj ?? ""}
              onChange={handleCnpjChange} // Formata enquanto digita
              fullWidth
            />
            <TextField
              label="Telefone"
              value={form.telefoneFornecedor ?? ""}
              onChange={handleTelefoneChange} // Formata enquanto digita
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={fecharModal} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSalvar} variant="contained" color="primary">
            {editando ? "Salvar Alterações" : "Cadastrar"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
