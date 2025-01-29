//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext } from 'react'
import { toast } from 'react-toastify';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function ModalLogout() {

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { logoutModal, setLogoutModal, toggleLogoutUser }:any = useContext(GlobalContext);

    //FUNÇÃO RESPONSÁVEL POR CHAMAR O MODAL
    const notifySucess = (message:string) => toast.success(message);

    return(
        <>
            {logoutModal == true && (
                <div
                    className={`w-screen h-screen flex items-center justify-center bg-[#00000085] z-[999] fixed top-0 left-0`}
                    onClick={() => {
                        setLogoutModal(false)
                    }}
                >
                    <div
                        className={`bg-my-white rounded-[6px]`}
                        onClick={(e) => {
                            //EVITA A PROPAGAÇÃO DOS EVENTOS DE CLIQUE DOS BOTÕES
                            e.stopPropagation()
                        }}
                    >
                        <p className={`px-6 pt-4 pb-2`}>Deseja mesmo fazer logout?</p>
                        <div className={`w-full flex mt-4`}>
                            <button
                                className={`flex-grow-[1] flex items-center justify-center text-my-white bg-my-secondary uppercase py-2 px-3 rounded-bl-[6px]`}
                                onClick={() => {
                                    setLogoutModal(false)
                                }}
                            >cancelar</button>
                            <button
                                className={`flex-grow-[1] flex items-center justify-center text-my-white bg-my-primary uppercase py-2 px-3 rounded-br-[6px]`}
                                onClick={() => {
                                    toggleLogoutUser()
                                    notifySucess('Conta deslogada com sucesso')
                                    setLogoutModal(false)
                                }}
                            >logout</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}