import "./ModalExclusaoProduto.css";

interface ModalConfirmarExclusaoProps {
  nomeProduto: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ModalConfirmarExclusao({
  nomeProduto,
  onConfirm,
  onCancel
}: ModalConfirmarExclusaoProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-confirm">
        <h2>Confirmar exclusão</h2>

        <p>
          Você está prestes a excluir o produto <strong>{nomeProduto}</strong>.
        </p>

        <p className="aviso">
          ⚠ Ao excluir este produto, <b>todo o estoque relacionado será removido
          automaticamente</b>. Tem certeza que deseja continuar?
        </p>

        <div className="modal-buttons">
          <button className="btn-cancelar" onClick={onCancel}>
            Cancelar
          </button>

          <button className="btn-confirmar" onClick={onConfirm}>
            Sim, excluir
          </button>
        </div>
      </div>
    </div>
  );
}
