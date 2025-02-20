//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify';

//IMPORTAÇÃO DOS ICONES
import { FaWhatsapp } from "react-icons/fa"
import { MdOutlineEmail } from "react-icons/md"

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function ModalFinishBuy() {

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { finishBuy, toggleFinishBuy, cart, user, toggleUser, setCart }:any = useContext(GlobalContext);
    
    //TIPAGEM DAS VARIÁVEIS
    let numeroTelefone:string | undefined = undefined
    let mensagemCodificada:any | undefined = undefined
    let linkWhatsApp:any | undefined = undefined
    
    //FUNÇÃO RESPONSÁVEL POR ENVIAR MENSAGEM PARA O USUÁRIO
    function sendMessage() {

        //SETA UM ARRAY DE MENSAGENS COMO VAZIO
        const messages:any = []
        
        //PERCORRE TODOS OS ITENS DO CARRINHO
        cart.map((item:any) => {

            //CRIA A MENSAGEM
            const message = `${item.quantity} ${Number(item.quantity) <= 1 ? `${item.name}` : `${item.name}s`} ${item.material} de estampa "${item.estampa}" na cor ${item.color} ${item.name == 'Camiseta' ? `no tamanho ${item.size} ` : ''}no valor de R$${String(Number(Number(item.price) * Number(item.quantity)).toFixed(2)).replace('.', ',')}`

            //JOGA A MENSGAGEM CRIADA NO ARRAY DE MENSAGENS
            messages.push(message)
        })

        //SETA O NÚMERO DE TELEFONE DO WHATSAPP
        numeroTelefone = "5511939460815";
        
        //CRIA O CORPO DA MENSAGEM PELA QUANTIDADE DE ITENS DE CADA PRODUTO NO CARRINHO
        mensagemCodificada = encodeURIComponent(`Olá tudo bom eu gostaria de pedir ${messages.length >= 1 ? `${messages},` : `${messages}.`}`);
        
        //LINK DO WHATSAPP COM O NÚMERO INFORMADO E MENSAGEM DE CADA PRODUTO
        linkWhatsApp = `https://wa.me/${numeroTelefone}?text=${mensagemCodificada}`;

        //ABRE O WHATSAPP EM UMA NOVA ABA
        window.open(linkWhatsApp, '_blank')
    }

    //FUNÇÃO RESPONSÁVEL POR FINALIZAR O PEDIDO
    function finishOrder() {
        axios.post('https://back-tcc-murilo.onrender.com/finalizar-compra', {
            userId: user.id
        })
        .then(function (response) {
            console.log(response.data.historico_pedido)
            //COLOCA O HISTÓRICO DO PEDIDO NO FRONT-END DA APLICAÇÃO
            toggleUser(user.id, user.name, user.email, response.data.historico_pedido, user.client_type, true)
            
            //LIMPA O ARRAY DE CARRINHO
            setCart([])

            toast.dismiss();
            //COLOCA O ALERT DE SUCESSO NA TELA
            toast.success('compra finalizada com sucesso')
        })
        .catch(function (error) {
            toast.dismiss();
            //COLOCA O ALERT DE SUCESSO NA TELA
            toast.error('compra finalizada com sucesso')

            //ESCREVE NO CONSOLE O ERRO
            console.log(error)
        })
    }

    return(
        <>
            {finishBuy == true && (
                <div
                    className={`w-screen h-screen fixed top-0 left-0 bg-[#00000085] flex items-center justify-center z-[999]`}
                    onClick={() => {
                        //MUDA O MODAL PARA FECHADO
                        toggleFinishBuy()
                    }}
                >
                    <div
                        onClick={(e) => {
                            //VERIFICA SE O MODAL ESTÁ ABERTO E FECHA ELE
                            e.stopPropagation()
                        }}
                        className={`flex items-center justify-between bg-my-white px-6 py-4 gap-5 rounded-[8px]`}
                    >
                        {/* <a href={linkWhatsApp} target='_blank'> */}
                            <FaWhatsapp
                                className={`text-[60px] text-my-secondary`}
                                onClick={() => {
                                    sendMessage()
                                    toggleFinishBuy()
                                    finishOrder()
                                }}
                            />
                        {/* </a> */}
                        <MdOutlineEmail
                            className={`text-[60px] text-my-secondary`}
                            onClick={() => {
                                toggleFinishBuy()
                            }}
                        />
                    </div>
                </div>  
            )}
        </>
    )
}