//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { motion } from "framer-motion";
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

    //UTILIZAÇÃO DO HOOK DE useState
    const [animatePop, setAnimatePop] = useState<boolean>(false)

    useEffect(() => {
        console.log(animatePop)
        if (cart.length > 0) {
            setAnimatePop(true);
            setTimeout(() => setAnimatePop(false), 500); // Reseta a animação após 300ms
        }
      }, [cart.length]);

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
                        className={`flex flex-col items-center justify-start pt-14 bg-[#ffffff] w-[300px] h-[250px] absolute right-[0px] mr-[6.3%] top-[36px] rounded-[12px] z-[60] pb-[250px]`}
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
                        <motion.span
                            key={cart.length}
                            initial={{ scale: 0 }}
                            animate={animatePop ? { scale: [1.4, 1] } : { scale: 1 }} // Aplica animação apenas quando necessário
                            transition={{ duration: 0.5, type: "spring", stiffness: 200 }}
                            className={`absolute top-[4px] right-[-3px] w-[18px] h-[18px] bg-my-primary rounded-[50%] flex items-center justify-center text-[10px] text-my-white`}
                        >
                            {cart.length}
                        </motion.span>

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
