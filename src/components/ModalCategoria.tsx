import React, { useState, useEffect } from "react";
import { api } from "../api";

interface ModalCategoriaProps {
  categoriaEdit?: any;
  fechar: () => void;
  atualizar: () => void;
}

export default function ModalCategoria({
  categoriaEdit,
  fechar,
  atualizar,
}: ModalCategoriaProps) {
  const [nomeCategoria, setNomeCategoria] = useState("");
  const [imgUrl, setImgUrl] = useState("");

  useEffect(() => {
    if (categoriaEdit) {
      setNomeCategoria(categoriaEdit.nomeCategoria);
      setImgUrl(categoriaEdit.imgUrl)
    }
  }, [categoriaEdit]);

  const salvar = async () => {
    if (categoriaEdit) {
      await api.put(
        `/categorias/${categoriaEdit.idCategoria}`,
        {
          nomeCategoria: nomeCategoria,
          imgUrl: imgUrl,
        }
      );
    } else {
      await api.post(
  "/categorias",
  {
    nomeCategoria,
    imgUrl,
  },
  {
    headers: { "Content-Type": "application/json" }
  }
);

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
          value={nomeCategoria}
          onChange={(e) => setNomeCategoria(e.target.value)}
        />
        <input
          type="text"
          placeholder="Img URL"
          value={imgUrl}
          onChange={(e) => setImgUrl(e.target.value)}
        />
        <div className="botoes">
          <button onClick={salvar}>Salvar</button>
          <button onClick={fechar}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}
