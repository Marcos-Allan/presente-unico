//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify';

//IMPORTAÇÃO DOS COMPONENTES
import CartCardProduct from '../CartCardProduct';

//IMPORTAÇÃO DOS ICONES
import { FaCartPlus } from "react-icons/fa"

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";


export default function ModalCart() {
    //UTILIZAÇÃO DO HOOK DE NAVEGAÇÃO DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIÁVEIS DE ESTADO GLOBAL
    const { openCart, setOpenCart, cart, setProductSelectedEdit, toggleFinishBuy, user, setCart, toggleUser }: any = useContext(GlobalContext);

    //FUNÇÃO RESPONSÁVEL POR REMOVER ITEM DO CARRINHO
    function removeItem(itemId: any) {
        axios.delete('https://back-tcc-murilo.onrender.com/remove-carrinho', {
            data: {
                userId: user.id,
                itemId: itemId,
            }
        })
        .then(function (response) {
            //ATUALIZA O CARRINHO PARA 
            setCart(response.data.cart)

            toast.dismiss();
            //COLOCA ALERT NA TELA
            toast.success('Item removido do carrinho')

            //SETA AS VARIÁVEIS DENTRO NO FRONTEND DA APLICAÇÃO
            toggleUser(user.id, user.name, user.email, user.history, response.data.cart, user.client_type, true)
        })
        .catch(function (error) {
            //ESCREVE O ERRO OCORRIDO NO CONSOLE
            console.log(error)
        })
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        console.log(cart)
    }, [cart])

    return (
        <>
            {openCart == true && (
                <div
                    className={`w-screen h-screen fixed top-0 left-0 bg-[#00000085] z-[999]`}
                    onClick={() => {
                        //MUDA O MODAL PARA FECHADO
                        setOpenCart(false)
                    }}
                >
                    <div
                        className={`flex flex-col items-center justify-start pt-14 bg-[#ffffff] w-[300px] h-[250px] absolute right-[0px] mr-[6.3%] top-[36px] overflow-hidden rounded-[12px] z-[60] pb-[250px]`}
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

                        <div className={`w-full flex-grow-[1] min-h-[200px] overflow-y-scroll flex items-center justify-start flex-col overflow-x-hidden pt-[20px]`}>
                            {cart != undefined && cart.length >= 1 && cart.map((item: any) => (
                                <CartCardProduct
                                    key={item.id}
                                    item={item}
                                    setProductSelectedEdit={setProductSelectedEdit}
                                    removeItem={removeItem}
                                    navigate={navigate}
                                />
                            ))}
                        </div>
                        <div className={`w-full absolute bottom-0 flex items-center justify-center bg-my-white pt-3 pb-2`}>
                            <div
                                onClick={() => {
                                    //MUDA O MODAL PARA FECHADO
                                    toggleFinishBuy()

                                    //MUDA O MODAL PARA FECHADO
                                    setOpenCart(false)
                                }}
                                className={`bg-my-primary py-[6px] w-[90%] text-center text-my-white rounded-[6px]`}
                            >Finalizar pedido</div>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}
