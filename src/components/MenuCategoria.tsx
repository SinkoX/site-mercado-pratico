import { useState } from 'react';
import './MenuCategoria.css';

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

export default MenuCategoria;