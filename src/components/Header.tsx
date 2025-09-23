import React from "react";
import './Header.css'


function Header(){
  return(
        <header className="header">
            <div className="logo">
                <img src="" alt="logo" />
            </div>

            <div className="procura">
                <input type="text" placeholder="Buscar Produtos..." className="procura-input"/>
                <button type="submit" className="botao-procura"></button>
            </div>

            <div className="user">icone</div>
        </header>
  );
}

export default Header;