//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useEffect } from 'react'
import { useNavigate } from 'react-router'

//IMPORTAÇÃO DOS COMPONENTES
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ModalCart from '../../components/ModalCart';
import ModalUser from '../../components/ModalUser';
import ModalLogout from '../../components/ModalLogout';
import ModalFinishBuy from '../../components/ModalFinishBuy';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function Perfil() {
    //UTILIZAÇÃO DO HOOK DE NAVEGAÇÃO DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { user }:any = useContext(GlobalContext);

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //VERIFICA SE O USUÁRIO ESTÁ LOGADO
        if(user.logged == false) {
            //REDIRECIONA O USUÁRIO PARA A PÁGINA DE LOGIN
            navigate('/sign-in')
        }
    },[user])

    return(
        <div className={`pt-[126px] bg-my-white w-screen min-h-[35vh] flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto sm:scrollbar sm:px-0`}>
            <Header />
            <div className='w-full px-2 py-5 max-w-[900px]'>
                <p>Nome: <span className={`font-bold`}>{user.name}</span></p>
                <p>Email: <span className={`font-bold`}>{user.email}</span></p>
                <p className={`font-bold`}>Histórico de compras:</p>
                
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