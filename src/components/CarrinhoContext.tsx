import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "../api";
import { useAuth } from "../hooks/useAuth";

export interface ItemCarrinhoDTO {
  idItemCarrinho: number;
  nomeProduto: string;
  quantidade: number;
  subTotal: number;
}

export interface CarrinhoDTO {
  idCarrinho: number;
  quantidadeTotal: number;
  valorTotal: number;
  itens: ItemCarrinhoDTO[];
}

interface CarrinhoContextProps {
  carrinho: CarrinhoDTO | null;
  adicionarProduto: (idProduto: number, quantidade: number) => Promise<void>;
  removerProduto: (idProduto: number) => Promise<void>;
  limparCarrinho: () => Promise<void>;
  atualizarCarrinho: () => Promise<void>;
}

const CarrinhoContext = createContext<CarrinhoContextProps>({} as CarrinhoContextProps);

export const CarrinhoProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const [carrinho, setCarrinho] = useState<CarrinhoDTO | null>(null);

  const atualizarCarrinho = async () => {
    if (!user) return;
    try {
      const response = await api.get<CarrinhoDTO>(`/carrinho/${user.idUsuario}`);
      setCarrinho(response.data);
    } catch (error) {
      console.error("Erro ao buscar carrinho:", error);
    }
  };

  const adicionarProduto = async (idProduto: number, quantidade: number) => {
    if (!user) return;
    try {
      const response = await api.post<CarrinhoDTO>(
        `/carrinho/${user.idUsuario}/adicionar/${idProduto}?quantidade=${quantidade}`
      );
      setCarrinho(response.data); // Atualiza em tempo real
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  const removerProduto = async (idProduto: number) => {
    if (!user) return;
    try {
      const response = await api.delete<CarrinhoDTO>(
        `/carrinho/${user.idUsuario}/remover/${idProduto}`
      );
      setCarrinho(response.data); // Atualiza em tempo real
    } catch (error) {
      console.error("Erro ao remover produto:", error);
    }
  };

  const limparCarrinho = async () => {
    if (!user) return;
    try {
      const response = await api.delete<CarrinhoDTO>(`/carrinho/${user.idUsuario}/limpar`);
      setCarrinho(response.data); // Atualiza em tempo real
    } catch (error) {
      console.error("Erro ao limpar carrinho:", error);
    }
  };

  // Busca inicial do carrinho ao logar
  useEffect(() => {
    atualizarCarrinho();
  }, [user]);

  return (
    <CarrinhoContext.Provider
      value={{ carrinho, adicionarProduto, removerProduto, limparCarrinho, atualizarCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  );
};

export const useCarrinho = () => useContext(CarrinhoContext);
