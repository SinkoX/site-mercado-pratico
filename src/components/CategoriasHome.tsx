import { useState } from 'react';
import './CategoriasHome.css';

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
                        <img src={categoria.imagem} className='img-card'/>
                        <h3>{categoria.nome}</h3>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CategoriasHome;