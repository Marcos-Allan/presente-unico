//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'

//IMPORTAÇÃO DOS COMPONENTES
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ModalCart from '../../components/ModalCart';
import ModalUser from '../../components/ModalUser';
import ModalLogout from '../../components/ModalLogout';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";
import ModalFinishBuy from '../../components/ModalFinishBuy';

export default function Perfil() {
    //UTILIZAÇÃO DO HOOK DE NAVEGAÇÃO DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { user }:any = useContext(GlobalContext);

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        if(user.logged == false) {
            navigate('/sign-in')
        }
    },[user])

    return(
        <div className={`bg-my-white w-screen h-screen flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto scrollbar sm:px-0 scrollbar-thumb-my-secondary scrollbar-track-my-gray`}>
            <Header />
            <div className='w-full px-2 py-5 max-w-[900px]'>
                <p>Nome do usuário: <span className={`font-bold`}>{user.name}</span></p>
                <p>Email do usuário: <span className={`font-bold`}>{user.email}</span></p>
                <p className={`font-bold`}>Histórico de compras do usuário:</p>
                
                {user.history.map((compra:any) => (
                    <div className={`flex flex-row items-center justify-between bg-my-white my-2 w-[90%] mx-auto p-2 rounded-[8px] relative`}>
                        <img src={compra.image} className={`w-[90px] h-[60px]`}/>
                        <img src={compra.estampa} className={`w-[90px] h-[60px]`}/>
                        <div className={`flex flex-col items-center justify-start gap-2`}>
                            <p className={`font-bold text-[18px] text-my-secondary`}>{compra.name}</p>
                            <p className={`font-bold text-[18px] text-my-primary`}>R$ {Number(Number(String(compra.price).replace(',', '.')) * compra.quantity).toFixed(2)} {compra.quantity}/un
                            </p>
                        </div>
                    </div>
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