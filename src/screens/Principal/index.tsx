//IMPORTAÇÃO DOS COMPONENTES
import Header from "../../components/Header"
import ProductCard from "../../components/ProductCard"
import Footer from "../../components/Footer"
import ModalCart from "../../components/ModalCart"
import ModalUser from "../../components/ModalUser"
import CarouselComponent from "../../components/Carrosel"
import ModalLogout from "../../components/ModalLogout"
import ModalFinishBuy from "../../components/ModalFinishBuy"

//IMPORTAÇÃO DAS IMAGENS
import img from '../../../public/carrossell1.jpg'
import img2 from '../../../public/carrossell1.png'
import camisa from '../../../public/Poliester.png'
import caneca from '../../../public/Caneca Plástica.png'
import caderno from '../../../public/Caderno A4.png'
import almofada from '../../../public/almofada.png'
import agenda from '../../../public/Agenda 17x9,4cm.png'
import azulejo from '../../../public/Azulejo 15x15cm.png'
import almochaveiro from '../../../public/Almochaveiro 7x7cm.png'

//IMPORTAÇÃO DAS BIBLIOTECAS DO FIREBASE
import { ref, getDownloadURL, listAll } from 'firebase/storage';
import { storage } from '../../utils/firebase';

//IMPORTAÃO DAS BIBLIOTECAS
import { useEffect, useContext } from "react";
import { useNavigate } from 'react-router'

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function Principal() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { user, setProductSelected }:any = useContext(GlobalContext);

    //FUNÇÃO RESPONSÁVEL POR PEGAR O PRODUTO SELECIONADO
    function selectProduct(image:string, name:string, price:string, materials:any) {
        setProductSelected({ image: image, name:name, price:price, materials:materials })
        navigate(`/product/${name.toLowerCase()}`)
    }

    //FUNÇÃO RESPONSÁVEL POR LISTAR OS AVATARES
    const fetchImages = async () => {
        //FAZ UMA REFERÊNCIA AO LOCAL DE AVATARES SALVOS NA NUVEM
        const storageRef = ref(storage, '/images/products');
        // const storageRef = ref(storage, '/images/icons-achievements');

        try {
            //PEGA AS IMAGENS DENTRO DA PASTA ESPECIFICADA
            const result = await listAll(storageRef);

            //PEGA A URL DOS AVATARES
            const urlPromises = result.items.map((imageRef:any) => getDownloadURL(imageRef));
            
            //ESPERA TODOS OS AVATARES SEREM 
            const urls = await Promise.all(urlPromises);
            
            //ESCREVE NO CONSOLE AS URLS DAS IMAGENS
            console.log(urls)
        } catch (error) {
            console.error('Erro ao listar imagens:', error);
        }
    };

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        if(user.logged == false) {
            navigate('/sign-in')
        }
    },[user])
    
    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        console.log(user.name)

        //CHAMA A FUNÇÃO QUE LISTA A URL DAS IMAGENS DOS PRODUTOS
        fetchImages()
    },[])

    return(
        <div
            className={`bg-my-white w-screen h-screen flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto scrollbar sm:px-0 scrollbar-thumb-my-secondary scrollbar-track-my-gray`}
        >
            <Header />
            
            <CarouselComponent images={[img, img2]} />
            
            <div className={`mt-6 w-[80%] flex items-center justify-center text-my-secondary font-bold font-inter max-w-[900px]`}>
                <div className="hidden sm:block flex-grow-[1] bg-my-secondary h-[3px]"></div>
                <p className="mr-2 sm:ml-2 text-[22px]">Produtos</p>
                <div className="flex-grow-[1] bg-my-secondary h-[3px]"></div>
            </div>

            <div className="flex items-start justify-center flex-wrap py-4 w-[80%] relative max-w-[900px]">

                <ProductCard
                    image={caneca}
                    name={'Caneca'}
                    price={'29,90'}
                    onClick={() => selectProduct(caneca, 'Caneca', '29,90', {materiais: ['poliester', 'algodão', 'sarja'], colors: ['red', 'green', 'blue']})}
                />
                <ProductCard
                    image={camisa}
                    name={'Camiseta'}
                    price={'39,90'}
                    onClick={() => selectProduct(camisa, 'Camiseta', '39,90', {materiais: ['poliester', 'algodão', 'sarja'], colors: ['red', 'green', 'blue']})}
                />
                <ProductCard
                    image={almofada}
                    name={'Almofada'}
                    price={'19,90'}
                    onClick={() => selectProduct(almofada, 'Almofada', '19,90', {materiais: ['poliester', 'algodão', 'sarja'], colors: ['red', 'green', 'blue']})}
                />
                <ProductCard
                    image={caderno}
                    name={'Caderno'}
                    price={'19,90'}
                    onClick={() => selectProduct(caderno, 'Caderno', '19,90', {materiais: ['poliester', 'algodão', 'sarja'], colors: ['red', 'green', 'blue']})}
                />
                <ProductCard
                    image={agenda}
                    name={'Agenda'}
                    price={'14,90'}
                    onClick={() => selectProduct(agenda, 'Agenda', '14,90', {materiais: ['poliester', 'algodão', 'sarja'], colors: ['red', 'green', 'blue']})}
                />
                <ProductCard
                    image={azulejo}
                    name={'Azulejo'}
                    price={'09,90'}
                    onClick={() => selectProduct(azulejo, 'Azulejo', '09,90', {materiais: ['poliester', 'algodão', 'sarja'], colors: ['red', 'green', 'blue']})}
                />
                <ProductCard
                    image={almochaveiro}
                    name={'Almochaveiro'}
                    price={'12,90'}
                    onClick={() => selectProduct(almochaveiro, 'Almochaveiro', '12,90', {materiais: ['poliester', 'algodão', 'sarja'], colors: ['red', 'green', 'blue']})}
                />
            </div>

            <Footer />
            <ModalCart />
            <ModalUser />
            <ModalLogout />
            <ModalFinishBuy />
        </div>
    )
}