import "./Footer.css";

const Footer = () => {
  return (
    <div className="footer">
      <div className="infos">
        <div className="info1">
          <h1>Mercado do Bairro</h1>
          <p>
            Seu mercado de confiança há mais de .... anos. Produtos frescos e
            qualidade garantida.
          </p>
        </div>
        <div className="info2">
          <h1>Links Rápidos</h1>
          <p>Super Ofertas</p>
          <p>Hortifruti</p>
          <p>Bebidas</p>
          <p>Mercearia</p>
          <p>Limpeza</p>
          <p>Açogue</p>
        </div>
        <div className="info3">
          <h1>Contato</h1>
          <p>(11)9999-9999</p>
          <p>contato@gmail.com</p>
          <p>Rua do Mercado 123-Araçoiaba</p>
        </div>
        <div className="info4">
          <img src="" alt="" className="imagem"/>
        </div>
      </div>
      <div className="direitos">
        <hr />
        <p>© 2025 MercadoPratico. Todos os direitos reservados.</p>
      </div>
    </div>
  );
};

export default Footer;
