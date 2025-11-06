import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";
import ModalCategoria from "../components/ModalCategoria";
import ModalSubcategoria from "../components/ModalSubcategoria";
import "./GerenciarCategorias.css";

interface Subcategoria {
  idSubcategoria: number;
  nomeSubcategoria: string;
}

interface Categoria {
  idCategoria: number;
  nomeCategoria: string;
  subcategorias: Subcategoria[];
}

export default function GerenciarCategorias() {
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [busca, setBusca] = useState("");
  const [modalCategoria, setModalCategoria] = useState(false);
  const [modalSubcategoria, setModalSubcategoria] = useState(false);
  const [categoriaEdit, setCategoriaEdit] = useState<Categoria | null>(null);
  const [subcategoriaEdit, setSubcategoriaEdit] = useState<Subcategoria | null>(
    null
  );
  const [expandido, setExpandido] = useState<number[]>([]);

  useEffect(() => {
    carregarCategorias();
  }, []);

  const carregarCategorias = async () => {
    const res = await axios.get("http://localhost:8080/categorias");
    setCategorias(res.data);
  };

  const excluirCategoria = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta categoria?")) {
      await axios.delete(`http://localhost:8080/categorias/${id}`);
      carregarCategorias();
    }
  };

  const excluirSubcategoria = async (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta subcategoria?")) {
      await axios.delete(`http://localhost:8080/subcategorias/${id}`);
      carregarCategorias();
    }
  };

  const toggleExpandir = (id: number) => {
    setExpandido((atual) =>
      atual.includes(id) ? atual.filter((c) => c !== id) : [...atual, id]
    );
  };

  const categoriasFiltradas = categorias.filter(
    (cat) =>
      cat.nomeCategoria.toLowerCase().includes(busca.toLowerCase()) ||
      cat.subcategorias.some((sub) =>
        sub.nomeSubcategoria.toLowerCase().includes(busca.toLowerCase())
      )
  );

  return (
    <div className="container-categorias">
      <header className="filtro-header">
        <input
          type="text"
          placeholder="Buscar categoria ou subcategoria..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />

        <div className="botoes-add">
          <button
            className="btn-add"
            onClick={() => setModalCategoria(true)}
          >
            <FaPlus /> Nova Categoria
          </button>
          <button
            className="btn-add sub"
            onClick={() => setModalSubcategoria(true)}
          >
            <FaPlus /> Nova Subcategoria
          </button>
        </div>
      </header>

      <div className="lista-categorias">
        {categoriasFiltradas.map((cat) => (
          <div key={cat.idCategoria} className="card-categoria">
            <div className="header-categoria">
              <h3>{cat.nomeCategoria}</h3>
              <div className="acoes">
                <button
                  className="btn-icon"
                  onClick={() => toggleExpandir(cat.idCategoria)}
                >
                  {expandido.includes(cat.idCategoria) ? (
                    <FaChevronUp />
                  ) : (
                    <FaChevronDown />
                  )}
                </button>
                <button
                  className="btn-icon"
                  onClick={() => {
                    setCategoriaEdit(cat);
                    setModalCategoria(true);
                  }}
                >
                  <FaEdit />
                </button>
                <button
                  className="btn-icon excluir"
                  onClick={() => excluirCategoria(cat.idCategoria)}
                >
                  <FaTrash />
                </button>
              </div>
            </div>

            {expandido.includes(cat.idCategoria) && (
              <div className="subcategorias-container">
                {cat.subcategorias.length > 0 ? (
                  cat.subcategorias.map((sub) => (
                    <div key={sub.idSubcategoria} className="subcategoria-item">
                      <span>{sub.nomeSubcategoria}</span>
                      <div>
                        <button
                          className="btn-icon"
                          onClick={() => {
                            setSubcategoriaEdit(sub);
                            setModalSubcategoria(true);
                          }}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn-icon excluir"
                          onClick={() => excluirSubcategoria(sub.idSubcategoria)}
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="sem-sub">Nenhuma subcategoria cadastrada</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {modalCategoria && (
        <ModalCategoria
          categoriaEdit={categoriaEdit}
          fechar={() => {
            setModalCategoria(false);
            setCategoriaEdit(null);
          }}
          atualizar={carregarCategorias}
        />
      )}

      {modalSubcategoria && (
        <ModalSubcategoria
          categorias={categorias}
          subcategoriaEdit={subcategoriaEdit}
          fechar={() => {
            setModalSubcategoria(false);
            setSubcategoriaEdit(null);
          }}
          atualizar={carregarCategorias}
        />
      )}
    </div>
  );
}
