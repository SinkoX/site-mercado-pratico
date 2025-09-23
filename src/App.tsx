import React, { useState } from "react";
import './components/MenuCategoria.css';
import Header from "./components/Header";
import Image from "./components/Image";

const MenuCategoria = () => {
    const [categoriaAtiva, setCategoriaAtiva] = useState('Super Ofertas');

    const categorias = [
        'Super Ofertas',
        'Hortifruti',
        'Mercearia',
        'Limpeza'
    ];

    return (
        <div className='categoria-menu'>
            {categorias.map(categoria => (
                <button 
                    key={categoria} 
                    className={`categoria-btn ${categoriaAtiva === categoria ? 'ativo' : ''}`} 
                    onClick={() => setCategoriaAtiva(categoria)}
                >
                    {categoria}
                </button>
            ))}
        </div>
    );
};

const CategoriasHome = () => {
    const [categorias] = useState([
        {
            id: 1,
            nome: 'Super Ofertas',
            imagem: '',
        },
        {
            id: 2,
            nome: 'Hortifruti',
            imagem: '',
        },
        {
            id: 3,
            nome: 'Bebidas',
            imagem: '',
        },
        {
            id: 4,
            nome: 'Mercearia',
            imagem: '',
        },
        {
            id: 5,
            nome: 'Limpeza',
            imagem: '',
        },
        {
            id: 6,
            nome: 'Açougue',
            imagem: '',
        }
    ]);

    return (
        <div className="categorias-home">
            <h2>Categorias em Destaque</h2>
            <div className="categorias-container">
                {categorias.map(categoria => (
                    <div key={categoria.id} className="categoria-card">
                        <h3>{categoria.nome}</h3>
                        <p>{categoria.descricao}</p>
                        <span>{categoria.produtos} produtos</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

// Componente App separado
function App() {
    return (
        <div className="App">
            <Header />
            <MenuCategoria />
            <Image />
            <CategoriasHome />
        </div>
    );
}

export default App;