//TIPAGEM DAS PROPS DO COMPONENTE
interface Props {
  images: string[];
}

//IMPORTAÇÃO DAS BIBLIOTECAS
import AliceCarousel from 'react-alice-carousel';

//IMPORTAÇÃO DOS ESTILOS DA BIBLIOTECA
import 'react-alice-carousel/lib/alice-carousel.css';

//IMPORTAÇÃO DOS ÍCONES
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

export default function CarouselComponent({ images }: Props) {
    //FUNÇÃO RESPONSÁVEL POR FAZER O SROLL DA IMAGEM
    const handleDragStart = (e:any) => e.preventDefault();
    
    //ARRAY DE IMAGENS
    const items = [
        <div
            style={{ backgroundImage:`url("${images[0]}")` }}
            className={`bg-my-gray w-full sm:w-[80%] mx-auto min-h-[350px] max-h-[500px] bg-center bg-cover sm:rounded-[12px]`}
            onDragStart={handleDragStart}
            role="presentation"
        />,
        <div
            style={{ backgroundImage:`url("${images[1]}")` }}
            className={`bg-my-gray w-full sm:w-[80%] mx-auto min-h-[350px] max-h-[500px] bg-center bg-cover sm:rounded-[12px]`}
            onDragStart={handleDragStart}
            role="presentation"
        />,
    ];

    return (
        <AliceCarousel
            mouseTracking
            items={items}
            autoPlay={true}
            animationType="slide"
            autoPlayInterval={5000}
            infinite={true}
            renderPrevButton={() => (
                <button className={`absolute left-0 ml-2 top-[50%] -translate-y-[100%] bg-my-gray opacity-[0.8] text-white p-4 rounded-l cursor-pointer hover:scale-[1.1] transition-all duration-[.3s] focus:outline-none`}>
                    {<IoIosArrowBack />}
                </button>
            )}
            renderNextButton={() => (
                <button className={`absolute right-0 mr-2 top-1/2 -translate-y-[100%] bg-my-gray opacity-[0.8] text-white p-4 rounded-r cursor-pointer hover:scale-[1.1] transition-all duration-[.3s] focus:outline-none`}>
                    {<IoIosArrowForward />}
                </button>
            )}
        />
    )
}