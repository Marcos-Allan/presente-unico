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

//IMPORTAÃO DAS BIBLIOTECAS
import { useEffect, useContext, useState } from "react";
import { useNavigate } from 'react-router'
import axios from 'axios'

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function Principal() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { user, setProductSelected }:any = useContext(GlobalContext);

    //UTILIZAÇÃO DO HOOK useState
    const [products, setProducts] = useState<any>(undefined)

    //FUNÇÃO RESPONSÁVEL POR PEGAR O PRODUTO SELECIONADO
    function selectProduct(image:string, name:string, price:string, materials:any) {
        //SETA O PRODUTO SELECIONADO NA VARIAVEL GLOBAL DE EDIÇÃO DE PRODUTO
        setProductSelected({ image: image, name:name, price:price, materials:materials })
        
        //REDIRECIONA O USUÁRIO PARA A PÁGINA DO PRODUTO
        navigate(`/product/${name.toLowerCase()}`)
    }

    //FUNÇÃO RESPONSÁVEL POR LISTAR OS PRODUTOS
    function getProducts() {
        axios.get('https://back-tcc-murilo.onrender.com/all-products')
        .then(function (response) {
            setProducts(response.data)
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //VERIFICA SE O USUÁRIO ESTÁ LOGADO
        if(user.logged == false) {
            //NAVEGA PARA A PÁGINA DE LOGIN
            navigate('/sign-in')
        }
    },[user])
    
    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        console.log(user.name)

        //CHAMA A FUNÇÃO QUE PEGA OS PRODUTOS DO BD
        getProducts()
    },[])

    return(
        <div
            className={`bg-my-white w-screen h-screen flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto sm:scrollbar sm:px-0`}
        >
            <Header />
            
            <CarouselComponent images={[img, img2]} />
            
            <div className={`w-[80%] flex items-center justify-center text-my-secondary font-bold font-inter max-w-[900px]`}>
                <div className="hidden sm:block flex-grow-[1] bg-my-secondary h-[3px]"></div>
                <p className="mr-2 sm:ml-2 text-[22px]">Produtos</p>
                <div className="flex-grow-[1] bg-my-secondary h-[3px]"></div>
            </div>

            <div className="flex items-start justify-center flex-wrap py-4 w-[100%] relative max-w-[900px]">
                {products != undefined && products.length >= 1 && products.map((product:any, i:number) => (
                    <ProductCard
                        key={i}
                        image={product.img[0]}
                        name={product.name}
                        price={product.prices[0].split('.')[0] <= 9 ? `0${product.prices[0].replace('.', ',')}` : `${product.prices[0].replace('.', ',')}`}
                        onClick={() => {
                            selectProduct(product.img[0], product.name, product.prices[0], {materiais: ['poliester', 'algodão', 'sarja'], colors: product.colors[0]})
                        }}
                    />
                ))}
            </div>

            <Footer />
            <ModalCart />
            <ModalUser />
            <ModalLogout />
            <ModalFinishBuy />
        </div>
    )
}