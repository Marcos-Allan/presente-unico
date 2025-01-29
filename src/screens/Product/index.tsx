//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router';
import axios from 'axios'

//IMPORTAÇÃO DOS COMPONENTES
import Header from "../../components/Header"
import Footer from "../../components/Footer";
import ModalUser from '../../components/ModalUser';
import ModalCart from '../../components/ModalCart';
import ModalLogout from '../../components/ModalLogout';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";
import ModalFinishBuy from '../../components/ModalFinishBuy';
import ChoiceQuantityCard from '../../components/ChoiceQuantityCard';

//IMPORTAÇÃO DOS ICONES
import { FaPlus } from "react-icons/fa"

export default function Product() {
    //UTILIZAÇÃO DO HOOK DE NAVEGAÇÃO DO react-router-dom
    const navigate = useNavigate()

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
            //AGENDA
            material: '',
            customArea: '',
            optionsCustom: {
                sizes: '',
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
        }
    },[])

    //FUNÇÃO RESPONSÁVEL POR PEGAR OS PRODUTOS DO BACK-END
    function getProducts() {
        axios.get('https://back-tcc-murilo.onrender.com/all-products')
        .then(function (response) {
            console.log(response.data)
            
            setProducts(response.data)

            console.log(response.data)
            console.log(response.data[0].colors[productID])
            console.log(response.data[0].prices[productID])
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
            className={`bg-my-white w-screen h-screen flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto scrollbar sm:px-0 scrollbar-thumb-my-secondary scrollbar-track-my-gray`}
        >
            <Header />
            <div className={`bg-my-white rounded-[16px] mt-5 flex items-center justify-center p-2 w-[80%] min-h-[400px] max-w-[900px]`}>
                {products && (
                    <img
                        src={products[typeInd].img[productID]}
                        alt=""
                        className={`w-[330px]`}
                    />
                )}
            </div>
            
            <div className={`w-full flex flex-row justify-around overflow-x-scroll scrollbar min-h-[180px] mt-3 max-w-[900px] scrollbar-none`}>
            {products && products.length >= 1 && (
                <>
                    {products[typeInd].type && products[typeInd].type.map((sla:any, i:number) => (
                        <div
                            key={i} // Adicione uma key se estiver usando React
                            id={sla}
                            onClick={() => {
                                setProductID(i);
                            }}
                            className="w-auto mx-2 bg-my-white min-w-[120px] text-[12px] flex flex-col items-center justify-center py-2 px-4 rounded-[4px]"
                        >
                            <img
                                src={products[typeInd].img[i]}
                                className="w-[120px]"
                            />
                            <p className="mt-1 font-bold text-my-secondary">{products[typeInd].type[i]}</p>
                        </div>
                    ))}
                </>
            )}
            </div>


            <p
                className={`mt-6 text-my-secondary font-inter capitalize font-bold text-[32px] max-w-[900px]`}
            >{productSelected.name}</p>

            <p className={`text-[20px] text-my-primary font-inter max-w-[900px]`}>a partir de </p>
            
            {products && (
                <p className={`text-[36px] text-my-primary font-inter font-bold mb-4 max-w-[900px]`}>R$
                    <span className="text-[48px]">
                        {String(Number(products[typeInd].prices[productID])).split('.')[0]}
                    </span>,
                    <span>{String(String(Number(products[typeInd].prices[productID]).toFixed(2))).replace('.', ',').split(',')[1]}</span>
                </p>
            )}

                <div className={`w-[90%] flex flex-row flex-wrap bg-my-white p-3 rounded-[12px] justify-center mb-5 max-w-[900px]`}>
                    <h1 className={`w-full text-left text-[18px] font-bold capitalize text-my-secondary mb-4`}>Quantidade</h1>
                    {products && (
                        <>
                            <ChoiceQuantityCard
                                priceProductQuantity={String(products[typeInd].prices[productID]).replace(',','.')}
                                priceProduct={String(products[typeInd].prices[productID]).replace(',','.')}
                                quantity={1}
                                active={quantity == 1 ? true : false}
                                onClick={() => selectQuantity(1)}
                            />
                            <ChoiceQuantityCard 
                                priceProductQuantity={String(products[typeInd].prices[productID]).replace(',','.')}
                                priceProduct={String(Number(Number(products[typeInd].prices[productID].replace(',','.')) * 10).toFixed(2))}
                                quantity={10}
                                active={quantity == 10 ? true : false}
                                onClick={() => selectQuantity(10)}
                            />
                            <ChoiceQuantityCard
                                priceProductQuantity={String(products[typeInd].prices[productID]).replace(',','.')}
                                priceProduct={String(Number(Number(products[typeInd].prices[productID].replace(',','.')) * 15).toFixed(2))}
                                quantity={15}
                                active={quantity == 15 ? true : false}
                                onClick={() => selectQuantity(15)}
                            />
                            <ChoiceQuantityCard
                                priceProductQuantity={String(products[typeInd].prices[productID]).replace(',','.')}
                                priceProduct={String(Number(Number(products[typeInd].prices[productID].replace(',','.')) * 20).toFixed(2))}
                                quantity={20}
                                active={quantity == 20 ? true : false}
                                onClick={() => selectQuantity(20)}
                            />
                            <ChoiceQuantityCard
                                priceProductQuantity={String(products[typeInd].prices[productID]).replace(',','.')}
                                priceProduct={String(Number(Number(products[typeInd].prices[productID].replace(',','.')) * 50).toFixed(2))}
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
                        className={`w-[30.8%] mb-2 bg-my-gray flex items-center flex-col justify-between mr-2 rounded-[8px] p-2`}
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
                        products[typeInd].img[productID],
                        `${productSelected.name}`,
                        `${String(Number(products[typeInd].prices[productID]))}`,
                        {materiais: products[typeInd].type, colors: products[typeInd].colors[productID]},
                        products[typeInd].type[productID]
                        )
                    toggleProduct({
                        image: products[typeInd].img[productID],
                        teste: 2,
                        name: `${productSelected.name}`,
                        prices: `${String(Number(products[typeInd].prices[productID]))}`,
                        materials: {materiais: products[typeInd].type, colors: products[typeInd].colors[productID]},
                        quantity: quantity,
                        material: products[typeInd].type[productID],
                    })
                }}
                className={`mt-6 mb-2 text-my-white bg-my-primary w-[70%] rounded-[16px] py-4 text-[20px] font-inter font-bold max-w-[900px]`}
            >
                Personalize seu produto!
            </button>
            
            <h1 className={`w-[80%] text-my-secondary my-4 font-inter font-bold capitalize text-[24px] max-w-[900px]`}>descrição</h1>

            <div className={`flex flex-col items-start justify-start w-[80%] bg-my-white p-4 rounded-[8px] mb-8 max-w-[900px]`}>
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
                        <input
                            type="number"
                            value={quantity}
                            onChange={(e) => {
                                if(Number(e.target.value) <= 0){
                                    setQuantity(1)
                                }else{
                                    setQuantity(Number(e.target.value))
                                }
                            }}
                            className={`text-[24px] outline-none w-full border-[1px] py-3 pl-2 border-my-secondary rounded-[6px] mb-2`}
                        />
                        <input
                            onClick={(e) => {
                                e.preventDefault()
                                setModalQuantity(false)  
                            }}
                            type="submit"
                            value="confirmar"
                            className={`border-none outline-none uppercase w-full py-4 text-[18px] bg-my-secondary rounded-[6px] text-my-white`}
                        />
                    </div>
                </div>
            )}
        </div>        
    )
}