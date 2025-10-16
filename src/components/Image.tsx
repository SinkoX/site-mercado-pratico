import React from 'react';
import './Image.css';

interface ImageProps {
    src: string;
    alt?: string;
}

const Image: React.FC<ImageProps> = ({ src, alt })=> {
    return(
        <div className='slide'>
            <img src={src} alt={alt} className='imagem-slide'/>
        </div>
    );
};

export default Image;