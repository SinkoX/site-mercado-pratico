import { useState, useEffect, ChangeEvent } from "react";
import { api } from "../api";
import "./Modal.css";

interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
}

interface Subcategoria {
  idSubcategoria: number;
  nomeSubcategoria: string;
}

interface ModalProdutoProps {
  produtoEdit?: any;
  categorias: Categoria[];
  fechar: () => void;
  atualizar: () => void;
}

export default function ModalProduto({
  produtoEdit,
  categorias,
  fechar,
  atualizar,
}: ModalProdutoProps) {
  const [nomeProduto, setNomeProduto] = useState<string>("");
  const [imgUrl, setImgUrl] = useState<string>("");
  const [imagemProduto, setImagemProduto] = useState<string>("");
  const [descricaoProduto, setDescricaoProduto] = useState<string>("");
  const [precoProduto, setPrecoProduto] = useState<number | string>("");
  const [categoriaId, setCategoriaId] = useState<number | string>("");
  const [subCategoriaId, setSubcategoriaId] = useState<number | string>("");
  const [subCategorias, setSubCategorias] = useState<Subcategoria[]>([]);

  // 🔹 Carregar dados ao editar produto
  useEffect(() => {
    if (produtoEdit) {
      setNomeProduto(produtoEdit.nomeProduto || "");
      setImgUrl(produtoEdit.imgUrl || "");
      setDescricaoProduto(produtoEdit.descricaoProduto || "");
      setPrecoProduto(produtoEdit.precoProduto || "");
      setCategoriaId(produtoEdit.categoria?.idCategoria || "");
      setSubcategoriaId(produtoEdit.subCategoria?.idSubcategoria || "");
      setImagemProduto(produtoEdit.imagemProdutoBase64 || "");
    }
  }, [produtoEdit]);

  // 🔹 Buscar subcategorias ao mudar categoria
  useEffect(() => {
    if (!categoriaId || categoriaId === "-1") {
      setSubCategorias([]);
      return;
    }

    api
      .get(`/categorias/id/${encodeURIComponent(categoriaId)}`)
      .then((res) => {
        console.log("Subcategorias carregadas:", res.data);
        setSubCategorias(res.data);
      })
      .catch((err) => console.error("Erro ao buscar subcategorias:", err));
  }, [categoriaId]);

  // 🔹 Manipular campos genéricos
  const handleChange =
    (setter: (value: string) => void) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setter(e.target.value);

  // 🔹 Upload da imagem (base64)
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagemProduto(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // 🔹 Salvar (PUT ou POST)
  const salvar = async () => {
    if (!nomeProduto.trim()) return alert("Informe o nome do produto.");
    if (!precoProduto || Number(precoProduto) <= 0)
      return alert("Informe um preço válido.");
    if (!categoriaId) return alert("Selecione uma categoria.");
    if (!subCategoriaId) return alert("Selecione uma subcategoria.");
    if (!descricaoProduto.trim()) return alert("Informe a descrição.");

    const produto = {
      nomeProduto: nomeProduto.trim(),
      imgUrl: imgUrl.trim() || null,
      imagemProdutoBase64: imagemProduto || null,
      descricaoProduto: descricaoProduto.trim(),
      precoProduto: Number(precoProduto),
      categoria: { idCategoria: parseInt(categoriaId as string) },
      subCategoria: { idSubcategoria: parseInt(subCategoriaId as string) },
    };

    try {
      if (produtoEdit?.idProduto) {
        await api.put(`/produto/${produtoEdit.idProduto}`, produto);
      } else {
        await api.post("/produto/cadastro", produto);
      }

      atualizar();
      fechar();
      alert("Produto salvo com sucesso!");
    } catch (err) {
      console.error(err);
      alert("Erro ao salvar produto. Verifique os dados.");
    }
  };

  return (
    <div className="modal">
      <div className="modal-conteudo">
        <h2>{produtoEdit ? "Editar Produto" : "Novo Produto"}</h2>

        <input
          type="text"
          placeholder="Nome do produto"
          value={nomeProduto}
          onChange={handleChange(setNomeProduto)}
        />
        <input
          type="text"
          placeholder="URL da imagem (opcional)"
          value={imgUrl}
          onChange={handleChange(setImgUrl)}
        />
        <input type="file" onChange={handleFileChange} />

        <input
          type="text"
          placeholder="Descrição do produto"
          value={descricaoProduto}
          onChange={handleChange(setDescricaoProduto)}
        />
        <input
          type="number"
          placeholder="Preço"
          value={precoProduto}
          onChange={handleChange(setPrecoProduto as any)}
        />

        <select value={categoriaId} onChange={handleChange(setCategoriaId)}>
          <option value="-1">Selecione uma categoria</option>
          {categorias.map((c) => (
            <option key={c.idCategoria} value={c.idCategoria}>
              {c.nomeCategoria}
            </option>
          ))}
        </select>

        <select
          value={subCategoriaId}
          onChange={handleChange(setSubcategoriaId)}
        >
          <option value="">Selecione uma subcategoria</option>
          {subCategorias.map((s) => (
            <option key={s.idSubcategoria} value={s.idSubcategoria}>
              {s.nomeSubcategoria}
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
