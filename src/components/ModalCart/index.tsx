//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'

//IMPORTAÇÃO DOS ICONES
import { FaCartPlus } from "react-icons/fa"

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

//IMPORTAÇÃO DOS ICONES
import { CiEdit } from 'react-icons/ci';

export default function ModalCart() {
    //UTILIZAÇÃO DO HOOK DE NAVEGAÇÃO DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { openCart, setOpenCart, cart, setProductSelectedEdit, toggleFinishBuy }:any = useContext(GlobalContext);

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREFGADA
    useEffect(() => {
        console.log(cart)
    },[cart])

    return(
        <>
            {openCart == true && (
                <div
                    className={`w-screen h-screen fixed top-0 left-0 bg-[#00000085]`}
                    onClick={() => {
                        //MUDA O MODAL PARA FECHADO
                        setOpenCart(false)
                    }}
                >
                    <div
                        className={`flex flex-col items-center justify-start pt-14 bg-[#ffffff] w-[300px] h-[250px] absolute right-[6px] top-[36px] rounded-[12px] z-[60] pb-[250px]`}
                        onClick={(e) => {
                            //VERIFICA SE O MODAL ESTÁ ABERTO E FECHA ELE
                            e.stopPropagation()
                        }}
                    >
                        <FaCartPlus
                            onClick={() => {
                                setOpenCart(false)
                            }}
                            className={`absolute top-0 right-0 text-[28px] text-my-secondary mt-[13px] mr-[6px]`}
                        />

                        <div className={`w-full min-h-[170px] overflow-y-scroll flex items-center justify-start flex-col overflow-x-hidden pt-[20px]`}>
                            
                            {cart != undefined && cart.length >= 1 && cart.map((item:any) => (
                                <div className={`w-[85%] bg-[#efefef] h-[80px] rounded-[8px] flex flex-row items-center justify-between mb-4 relative px-3`}>
                                    <div className={`absolute top-[-8px] left-[-8px] text-[12px] text-my-white bg-my-secondary rounded-[50%] w-[20px] text-center flex items-center justify-center h-[20px]`}>{item.quantity}</div>
                                    
                                    {item.estampa && (
                                        <img src={item.estampa} alt="" className={`w-[70px]`} />
                                    )}
                                    
                                    <div className={`flex-grow-[1] flex flex-row items-center justify-between`}>
                                        <img src={item.image} alt="" className={`w-[80px] h-[80px]`} />
                                        <div>
                                            <p className={`font-bold text-my-secondary text-[14px]`}>{item.name}</p>
                                            <p className={`font-bold text-my-primary text-[14px]`}>R${item.price} uni</p>
                                        </div>
                                        <div
                                            onClick={() => {
                                                setProductSelectedEdit({
                                                    id: item.id,
                                                    image: item.image,
                                                    name: item.name,
                                                    print: item.estampa,
                                                    size: item.size,
                                                    material: item.material,
                                                    quantity: item.quantity,
                                                    price: item.price,
                                                })

                                                navigate(`/cart/edit/${cart.name}`)
                                            }}
                                            className={`bg-my-secondary w-8 h-8 flex items-center justify-center absolute top-[-20px] right-[-20px] rounded-[50%]`}
                                        >
                                            <CiEdit className={`text-[24px] text-my-white`} />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className={`w-full absolute bottom-0 flex items-center justify-center bg-my-white py-3`}>
                            <div
                                onClick={() => {
                                    //MUDA O MODAL PARA FECHADO
                                    toggleFinishBuy()

                                    //MUDA O MODAL PARA FECHADO
                                    setOpenCart(false)
                                }}
                                className={`bg-my-primary py-[6px] w-[80%] text-center text-my-white rounded-[6px]`}
                            >Finalizar pedido</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}