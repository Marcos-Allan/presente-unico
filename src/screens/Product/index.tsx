//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router';
import axios from 'axios'

//IMPORTAÇÃO DOS COMPONENTES
import Header from "../../components/Header"
import Footer from "../../components/Footer";
import ModalUser from '../../components/ModalUser';
import ModalCart from '../../components/ModalCart';
import ModalLogout from '../../components/ModalLogout';
import ModalFinishBuy from '../../components/ModalFinishBuy';
import ChoiceQuantityCard from '../../components/ChoiceQuantityCard';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

//IMPORTAÇÃO DOS ICONES
import { FaPlus } from "react-icons/fa"

export default function Product() {
    //UTILIZAÇÃO DO HOOK DE NAVEGAÇÃO DO react-router-dom
    const navigate = useNavigate()

    //UTILIZAÇÃO DO HOOKE DE PARÂMETROS DO react-router-dom
    const { product } = useParams()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { productSelected, setProductSelected, toggleProduct, user }:any = useContext(GlobalContext);

    //UTILIZAÇÃO DO HOOK useState
    const [products, setProducts] = useState<any>()
    const [productID, setProductID] = useState<number>(0)
    const [quantity, setQuantity] = useState<number>(1)
    const [typeInd, setTypeInd] = useState<number>(0)
    const [modalQuantity, setModalQuantity] = useState<boolean>(false)
    const descriptions = [
        {
            //CANECA
            material: 'Cerâmica de alta qualidade, resistente a micro-ondas e lava-louças.',
            customArea: 'Área externa da caneca.',
            optionsCustom: {
                sizes: 'Porcelana, plástico, mágica, colher',
                colors: 'Preto/vermelho(Mágica) Vermelho/Azul(Colher)'
            }
        },
        {
            //CAMISA
            material: 'Tecido 100% poliéster, macio e confortável.',
            customArea: 'Frente da camisa tamanho A4',
            optionsCustom: {
                sizes: 'Tamanhos: P, M, G, GG',
                colors: 'Branco, Preto, Verde, Vermelho, Azul, Amarelo'
            }
        },
        {
            //ALMOFADA
            material: 'Tecido macio e enchimento de fibra siliconada antialérgica.',
            customArea: 'Frente da almofada.',
            optionsCustom: {
                sizes: '',
                colors: ''
            }
        },
        {
            //CADERNO
            material: '',
            customArea: '',
            optionsCustom: {
                sizes: '',
                colors: ''
            }
        },
        {
            //AZULEJO
            material: '',
            customArea: '',
            optionsCustom: {
                sizes: '',
                colors: ''
            }
        },
        {
            //AGENDA
            material: 'Capa dura, 50 folhas, 17x9,4 centimetros',
            customArea: 'Capa e contra capa',
            optionsCustom: {
                sizes: '17x9,4cm',
                colors: ''
            }
        },
        {
            //CHAVEIRO
            material: 'Tecido macio e enchimento de fibra siliconada antialérgica',
            customArea: 'Frente e verso da almofada',
            optionsCustom: {
                sizes: '',
                colors: ''
            }
        },
        {
            //CONTROLE
            material: 'Controle de alta compatibilidade com dispositivos bluetooth e via cabo USB',
            customArea: 'Frente e verso do controle',
            optionsCustom: {
                sizes: '',
                colors: ''
            }
        }
    ]

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        if(user.logged == false) {
            navigate('/sign-in')
        }
    },[user])

    //FUNÇÃO RESPONSÁVEL POR PEGAR O ÍNDICE DO PRODUTO
    useEffect(() => {
        if(productSelected.name == "Caneca"){
            setTypeInd(0)
        }else if(productSelected.name == "Camiseta"){
            setTypeInd(1)
        }else if(productSelected.name == "Almofada"){
            setTypeInd(2)
        }else if(productSelected.name == "Caderno"){
            setTypeInd(3)
        }else if(productSelected.name == "Agenda"){
            setTypeInd(4)
        }else if(productSelected.name == "Azulejo"){
            setTypeInd(5)
        }else if(productSelected.name == "Almochaveiro"){
            setTypeInd(6)
        }else if(productSelected.name == "Controle"){
            setTypeInd(7)
        }
    },[])

    //FUNÇÃO RESPONSÁVEL POR PEGAR OS PRODUTOS DO BACK-END
    function getProducts() {
        axios.get(`https://back-tcc-murilo.onrender.com/get-product/${product}`)
        .then(function (response) {
            console.log(response.data)
            
            setProducts(response.data)

            response.data.type.map((mk:any, i:any) => {
                console.log(`${i}° ${mk}`)
            })
            console.log(response.data.colors[productID])
            console.log(response.data.img[productID])
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    //FUNÇÃO RESPONSÁVEL POR PEGAR O PRODUTO SELECIONADO
    function selectProduct(image:string, name:string, price:string, materials:any, material:string) {
        setProductSelected({ image: image, name:name, price:price, materials:materials, material:material })
        navigate(`/custom/${productSelected.name}`)
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //CHAMA A FUNÇÃO RESPONSÁVEL POR PEGAR OS PRODUTOS DO BACK-END
        getProducts()
    },[])

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        console.log(productSelected.materials[1])
        //VERIFICA SE O PRODUTO FOI SELECIONADO
        if(productSelected.name == "undefined") {
            navigate('/principal')
        }
    },[])

    //FUNÇÃO RESPONSÁVEL POR SELECIONAR A QUANTIDADE
    function selectQuantity(choiceQuantity:number) {
        setQuantity(choiceQuantity)
    }

    return(
        <div
            className={`pt-[126px] bg-my-white w-screen min-h-[35vh] flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto sm:scrollbar sm:px-0`}
        >
            <Header />
            <div className={`bg-[#efefef] rounded-[16px] mt-5 flex items-center justify-center p-2 w-[80%] min-h-[400px] max-w-[900px]`}>
                {products && (
                    <img
                        src={products.img[productID]}
                        alt=""
                        className={`w-[330px]`}
                    />
                )}
            </div>
            
            <div className={`w-[80%] flex items-center justify-center text-my-secondary font-bold font-inter max-w-[900px] mt-6 mb-4`}>
                <div className="hidden sm:block flex-grow-[1] bg-my-secondary h-[3px]"></div>
                <p className="mr-2 sm:ml-2 capitalize text-[24px]">tipos</p>
                <div className="flex-grow-[1] bg-my-secondary h-[3px]"></div>
            </div>

            <div className={`w-[85%] flex flex-row justify-around overflow-x-scroll scrollbar scrollbar-none min-h-[180px] mt-3 max-w-[900px]`}>
                {products && products.type.map((sla:any, i:number) => (
                    <div
                        key={i}
                        id={String(sla)}
                        onClick={() => {
                            setProductID(i);
                            console.log(products.colors[i])
                        }}
                        className={`overflow-hidden w-auto mx-2 bg-[#efefef] min-w-[120px] text-[12px] capitalize flex flex-col items-center justify-center rounded-[6px] cursor-pointer transition-all duration-[.3s] border-[2px] border-[#efefef] hover:border-my-secondary ${productID == i && 'border-my-secondary'}`}
                    >
                        <div className={`flex-grow-[1] flex items-center justify-center`}>
                            <img
                                src={products.img[i]}
                                className="w-[120px] p-1"
                            />
                        </div>
                        <p className="mt-1 w-full text-center py-[10px] font-bold text-my-white flex items-center justify-center bg-my-secondary">{products.type[i]}</p>
                    </div>
                ))}
            </div>


            <p
                className={`mt-6 text-my-secondary font-inter capitalize font-bold text-[32px] max-w-[900px]`}
            >{productSelected.name}</p>

            <p className={`text-[20px] text-my-primary font-inter max-w-[900px]`}>a partir de </p>
            
            {products && (
                <p className={`text-[36px] text-my-primary font-inter font-bold mb-4 max-w-[900px]`}>R$
                    <span className="text-[48px]">
                        {String(Number(products.prices[productID])).split('.')[0]}
                    </span>,
                    <span>{String(String(Number(products.prices[productID]).toFixed(2))).replace('.', ',').split(',')[1]}</span>
                </p>
            )}

                <div className={`w-[90%] flex flex-row flex-wrap bg-my-white p-3 rounded-[12px] justify-center mb-5 max-w-[900px]`}>
                    <h1 className={`w-full ml-2 text-left text-[18px] font-bold capitalize text-my-secondary mb-4`}>Quantidade <span className={`text-my-primary text-[32px]`}>{quantity}</span><span className={`text-my-primary text-[24px]`}>x</span></h1>
                    {products && (
                        <>
                            <ChoiceQuantityCard
                                priceProductQuantity={String(products.prices[productID]).replace(',','.')}
                                priceProduct={String(products.prices[productID]).replace(',','.')}
                                quantity={1}
                                active={quantity == 1 ? true : false}
                                onClick={() => selectQuantity(1)}
                            />
                            <ChoiceQuantityCard 
                                priceProductQuantity={String(products.prices[productID]).replace(',','.')}
                                priceProduct={String(Number(Number(products.prices[productID].replace(',','.')) * 10).toFixed(2))}
                                quantity={10}
                                active={quantity == 10 ? true : false}
                                onClick={() => selectQuantity(10)}
                            />
                            <ChoiceQuantityCard
                                priceProductQuantity={String(products.prices[productID]).replace(',','.')}
                                priceProduct={String(Number(Number(products.prices[productID].replace(',','.')) * 15).toFixed(2))}
                                quantity={15}
                                active={quantity == 15 ? true : false}
                                onClick={() => selectQuantity(15)}
                            />
                            <ChoiceQuantityCard
                                priceProductQuantity={String(products.prices[productID]).replace(',','.')}
                                priceProduct={String(Number(Number(products.prices[productID].replace(',','.')) * 20).toFixed(2))}
                                quantity={20}
                                active={quantity == 20 ? true : false}
                                onClick={() => selectQuantity(20)}
                            />
                            <ChoiceQuantityCard
                                priceProductQuantity={String(products.prices[productID]).replace(',','.')}
                                priceProduct={String(Number(Number(products.prices[productID].replace(',','.')) * 50).toFixed(2))}
                                quantity={50}
                                active={quantity == 50 ? true : false}
                                onClick={() => selectQuantity(50)}
                            />
                        </>
                    )}
                    <button
                        onClick={() => {
                            setModalQuantity(true)
                        }}
                        className={`w-[30.8%] mb-2 bg-[#efefef] flex items-center flex-col justify-between mr-2 rounded-[8px] p-2 border-[1px] border-[#efefef] hover:border-my-secondary cursor-pointer transition-all duration-[.3s]
                            ${
                                quantity != 1 &&
                                quantity != 10 &&
                                quantity != 15 &&
                                quantity != 20 &&
                                quantity != 50 && 'border-my-primary'
                            }
                        `}
                    >
                        <div className={`rounded-[50%] border-[2px] border-my-secondary p-2`}>
                            <FaPlus className={`text-my-secondary`} />
                        </div>
                        <p className={`font-bold text-[14px] text-my-secondary text-center`}>Adicionar quantidade</p>
                    </button>
                </div>

            <button
                onClick={() => {
                    selectProduct(
                        products.img[productID],
                        `${productSelected.name}`,
                        `${String(Number(products.prices[productID]))}`,
                        {materiais: products.type, colors: products.colors[productID]},
                        products.type[productID]
                        )
                    toggleProduct({
                        image: products.img[productID],
                        teste: 2,
                        name: `${productSelected.name}`,
                        prices: `${String(Number(products.prices[productID]))}`,
                        materials: {materiais: products.type, colors: products.colors[productID]},
                        quantity: quantity,
                        material: products.type[productID],
                    })
                }}
                className={`mt-1 mb-2 text-my-white bg-my-primary w-[80%] rounded-[8px] py-4 text-[20px] font-inter font-bold max-w-[900px] transition-all duration-[.3s] border-[1px] border-my-primary hover:text-my-primary hover:bg-transparent cursor-pointer`}
            >
                Personalize seu produto!
            </button>
            
            <h1 className={`w-[80%] text-my-secondary my-4 font-inter font-bold capitalize text-[24px] max-w-[900px]`}>descrição</h1>

            <div className={`flex flex-col items-start justify-start w-[80%] bg-[#efefef] p-4 pt-0 rounded-[8px] mb-8 max-w-[900px]`}>
                <>
                    <p className={`mt-4 font-bold`}>Material:</p>
                    <p>{descriptions[typeInd].material}</p>
                    
                    <p className={`mt-4 font-bold`}>Àrea de customização:</p>
                    <p>{descriptions[typeInd].customArea}</p>
                    
                    <p className={`mt-4 font-bold`}>Opções de configuração:</p>
                    <ul className={`list-disc list-inside pl-4`}>
                        {descriptions[typeInd].optionsCustom.sizes !== "" && <li>{descriptions[typeInd].optionsCustom.sizes}</li>}
                        {descriptions[typeInd].optionsCustom.colors !== "" && <li>{descriptions[typeInd].optionsCustom.colors}</li>}
                    </ul>
                </>
            </div>
            <Footer />
            <ModalUser />
            <ModalCart />
            <ModalLogout />
            <ModalFinishBuy />

            {modalQuantity == true && (
                <div className={`fixed top-0 left-0 w-screen h-screen bg-[#000000ac] flex items-center justify-center`}>
                    <div className={`flex flex-col max-w-[80%] w-[900px] bg-my-white rounded-[8px] p-5 justify-center items-center relative`}>
                        <h1 className={`w-full text-my-secondary text-center mb-3 text-[24px] font-bold`}>Escolha a quantidade</h1>
                        <form
                            onSubmit={(e) => e.preventDefault()}
                            className={`w-full`}
                        >
                            <input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                    setQuantity(Number(e.target.value))
                                }}
                                className={`text-[24px] outline-none w-full border-[1px] py-3 pl-2 border-my-secondary rounded-[6px] mb-2`}
                            />
                            <input
                                onClick={(e) => {
                                    e.preventDefault()
                                    if(Number(quantity) <= 0){
                                        setQuantity(1)
                                    }
                                    setModalQuantity(false)  
                                }}
                                type="submit"
                                value="confirmar"
                                className={`
                                    outline-none uppercase w-full py-4 text-[18px] bg-my-secondary rounded-[6px] text-my-white border-[1px] border-my-secondary transition-all duration-[.3s] cursor-pointer
                                    hover:bg-transparent
                                    hover:text-my-secondary
                                    focus:bg-transparent
                                    focus:text-my-secondary
                                `}
                            />
                        </form>
                    </div>
                </div>
            )}
        </div>        
    )
}