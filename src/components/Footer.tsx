import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="infos">
        <div className="info info1">
          <h1>Mercado D'Tereza</h1>
          <p>
            Seu mercado de confiança há mais de .... anos. Produtos frescos e
            qualidade garantida.
          </p>
        </div>

        <div className="info info2">
          <h1>Links Rápidos</h1>
          <p>Super Ofertas</p>
          <p>Hortifruti</p>
          <p>Bebidas</p>
          <p>Mercearia</p>
          <p>Limpeza</p>
          <p>Açougue</p>
        </div>

        <div className="info info3">
          <h1>Contato</h1>
          <p>(11) 9999-9999</p>
          <p>contato@gmail.com</p>
          <p>Rua do Mercado 123 — Araçoiaba</p>
        </div>

        <div className="info info4">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3658.1247!2d-47.5846622!3d-23.470167!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94c5f38b5179f1ed%3A0x859ab2572caa8b17!2sMercado%20D&#39;%20Tereza!5e0!3m2!1spt-BR!2sbr!4v1697567396111!5m2!1spt-BR!2sbr"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Localização Mercado D'Tereza"
          ></iframe>
        </div>
      </div>

      <div className="direitos">
        <hr />
        <p>© 2025 Mercado D'Tereza. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
