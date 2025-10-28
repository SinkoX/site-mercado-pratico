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

  const toggleSidebar = () => setIsSidebarOpen((s) => !s);
  const closeSidebar = () => setIsSidebarOpen(false);

  const layotClasses = useMemo(() => {
    return ["layout", isSidebarOpen ? "layout--sidebar-open" : ""]
      .filter(Boolean)
      .join("");
  }, [isSidebarOpen]);

  return (
    <div className={layotClasses}>
      <header className="layout_header">
        <Header
          onBuscarProduto={onBuscarProduto}
          onToggleSidebar={toggleSidebar}
        ></Header>
      </header>

      <aside className="layout_sidebar">
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={closeSidebar}
          onSelecionarCategoria={onSelecionarCategoria}
        ></Sidebar>
      </aside>

      <main className="layout_content">{children}</main>

      <footer className="layout_footer">
        <Footer />
      </footer>
    </div>
  );
};

export default Layout;
