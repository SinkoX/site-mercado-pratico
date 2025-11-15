import { useState } from "react";
import Carrinho from "./Carrinho";
import MeusPedidos from "./MeusPedidos";
import "./PainelCompras.css";

export default function PainelCompras() {
  const [abaAtiva, setAbaAtiva] = useState<"carrinho" | "pedidos">("carrinho");

  return (
    <div className="painel-container">
      <div className="abas-navegacao">
        <button
          className={`aba-btn ${abaAtiva === "carrinho" ? "ativa" : ""}`}
          onClick={() => setAbaAtiva("carrinho")}
        >
          Meu Carrinho
        </button>

        <button
          className={`aba-btn ${abaAtiva === "pedidos" ? "ativa" : ""}`}
          onClick={() => setAbaAtiva("pedidos")}
        >
          Minhas Compras
        </button>
      </div>

      <div className="conteudo-aba">
        {abaAtiva === "carrinho" && <Carrinho />}
        {abaAtiva === "pedidos" && <MeusPedidos />}
      </div>
    </div>
  );
}
