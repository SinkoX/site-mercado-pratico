import React, { useEffect } from "react";
import "./EstoqueModal.css";

interface EstoqueModalProps {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

export const EstoqueModal: React.FC<EstoqueModalProps> = ({ title, onClose, children }) => {
  // Fecha com ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  // Fecha ao clicar fora
  const handleBackdropClick = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).classList.contains("estoque-modal-backdrop")) {
      onClose();
    }
  };

  return (
    <div className="estoque-modal-backdrop" onClick={handleBackdropClick}>
      <div className="estoque-modal-content">
        <div className="estoque-modal-header">
          <h3>{title}</h3>
          <button className="estoque-modal-close" onClick={onClose}>×</button>
        </div>
        <div className="estoque-modal-body">{children}</div>
      </div>
    </div>
  );
};

export default EstoqueModal;
