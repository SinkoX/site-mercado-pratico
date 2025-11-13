import React, { useState, useEffect } from "react";
import { api } from "../api";

interface ModalSubcategoriaProps {
  subcategoriaEdit?: any;
  categorias: any[];
  fechar: () => void;
  atualizar: () => void;
}

export default function ModalSubcategoria({
  subcategoriaEdit,
  categorias,
  fechar,
  atualizar,
}: ModalSubcategoriaProps) {
  const [nome, setNome] = useState("");
  const [categoriaId, setCategoriaId] = useState("");

  useEffect(() => {
    if (subcategoriaEdit) {
      setNome(subcategoriaEdit.nomeSubcategoria);
      setCategoriaId(subcategoriaEdit.categoria?.idCategoria || "");
    }
  }, [subcategoriaEdit]);

  const salvar = async () => {
    if (subcategoriaEdit) {
      await api.put(
        `/subcategorias/${subcategoriaEdit.idSubcategoria}`,
        {
          nomeSubcategoria: nome,
          categoria: { idCategoria: categoriaId },
        }
      );
    } else {
      await api.post("/subcategorias", {
        nomeSubcategoria: nome,
        categoria: { idCategoria: categoriaId },
      });
    }
    atualizar();
    fechar();
  };

  return (
    <div className="modal">
      <div className="modal-conteudo">
        <h2>
          {subcategoriaEdit ? "Editar Subcategoria" : "Nova Subcategoria"}
        </h2>
        <input
          type="text"
          placeholder="Nome da subcategoria"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <select
          value={categoriaId}
          onChange={(e) => setCategoriaId(e.target.value)}
        >
          <option value="">Selecione uma categoria</option>
          {categorias.map((c) => (
            <option key={c.idCategoria} value={c.idCategoria}>
              {c.nomeCategoria}
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
