import React, { useEffect } from "react";
import "./EstoqueModal.css";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  onConfirm,
  title,
  children,
}: ModalProps) {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>

        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-body">{children}</div>

        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancelar
          </button>
          <button className="btn confirm" onClick={onConfirm}>
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
}
