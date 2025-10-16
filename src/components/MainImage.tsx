import './MainImage.css';
import bannerPrincipal1 from "../assets/images/banner/bannerPrincipal1.png"

const Image = () => {
    return(
        <div className='imagem'>
            <img src={bannerPrincipal1} alt="Imagem principal" className='tela-inteira1'/>
        </div>
    );
};

export default Image;