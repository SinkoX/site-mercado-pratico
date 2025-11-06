import React, { useState, useEffect } from "react";
import axios from "axios";

interface ModalCategoriaProps {
  categoriaEdit?: any;
  fechar: () => void;
  atualizar: () => void;
}

export default function ModalCategoria({ categoriaEdit, fechar, atualizar }: ModalCategoriaProps) {
  const [nome, setNome] = useState("");

  useEffect(() => {
    if (categoriaEdit) setNome(categoriaEdit.nomeCategoria);
  }, [categoriaEdit]);

  const salvar = async () => {
    if (categoriaEdit) {
      await axios.put(`http://localhost:8080/categorias/${categoriaEdit.idCategoria}`, {
        nomeCategoria: nome,
      });
    } else {
      await axios.post("http://localhost:8080/categorias", { nomeCategoria: nome });
    }
    atualizar();
    fechar();
  };

  return (
    <div className="modal">
      <div className="modal-conteudo">
        <h2>{categoriaEdit ? "Editar Categoria" : "Nova Categoria"}</h2>
        <input
          type="text"
          placeholder="Nome da categoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <div className="botoes">
          <button onClick={salvar}>Salvar</button>
          <button onClick={fechar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
