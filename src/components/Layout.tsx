import React, { useState, useMemo } from "react";
import Header from "./Header";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import "./Layout.css";

interface LayoutProps {
  children: React.ReactNode;
  onBuscarProduto?: (busca: string) => void;
  onSelecionarCategoria?: (categoria: string) => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  onBuscarProduto,
  onSelecionarCategoria,
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Collapsed by default on tablets (handled via CSS), open state for mobile overlay
  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  const layoutClasses = useMemo(() => {
    return [
      "layout",
      isSidebarOpen ? "layout--sidebar-open" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }, [isSidebarOpen]);

  return (
    <div className={layoutClasses}>
      <header className="layout__header">
        <Header onBuscarProduto={onBuscarProduto} onToggleSidebar={toggleSidebar} />
      </header>

      <aside className="layout__sidebar">
        <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} onSelecionarCategoria={onSelecionarCategoria} />
      </aside>

      <main className="layout__content">{children}</main>

      <footer className="layout__footer">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
