import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GerenciarFornecedores() {
  return (
    <div>
      <Header />
      <main style={{ padding: "40px", textAlign: "center" }}>
        <h1>Gerenciar Fornecedores</h1>
        <p>Aqui você poderá cadastrar, editar e visualizar fornecedores cadastrados.</p>
      </main>
      <Footer />
    </div>
  );
}
