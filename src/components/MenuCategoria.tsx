// MenuCategoria.tsx
import { useState } from 'react';
import './MenuCategoria.css';

interface MenuCategoriaProps {
    onSelecionarCategoria?: (categoria: string) => void;
}

const MenuCategoria: React.FC<MenuCategoriaProps> = ({ onSelecionarCategoria }) => {
    const [categoriaAtiva, setCategoriaAtiva] = useState('Super Ofertas');

    const categorias = [
        'Super Ofertas',
        'Hortifruti',
        'Mercearia',
        'Limpeza'
    ];

    const handleClick = (categoria: string) => {
        setCategoriaAtiva(categoria);
        if (onSelecionarCategoria) {
            onSelecionarCategoria(categoria); // avisa o App da nova categoria
        }
    };

    return (
        <div className='categoria-menu'>
            {categorias.map(categoria => (
                <button 
                    key={categoria} 
                    className={`categoria-btn ${categoriaAtiva === categoria ? 'ativo' : ''}`} 
                    onClick={() => handleClick(categoria)}
                >
                    {categoria}
                </button>
            ))}
        </div>
    );
};

export default MenuCategoria;
