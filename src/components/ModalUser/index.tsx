//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext } from 'react'
import { useNavigate } from 'react-router'

//IMPORTAÇÃO DOS ICONES
import { FaUser } from "react-icons/fa"

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function ModalUser() {
    //UTILIZAÇÃO DO HOOK DE NAVEGAÇÃO DO react-router-dom
    const navigate = useNavigate()
    
    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { openPerfil, setOpenPerfil, setLogoutModal, user }:any = useContext(GlobalContext);

    return(
        <>
            {openPerfil == true && (
                <div
                    className={`w-screen h-screen fixed top-0 left-0 bg-[#00000085]`}
                    onClick={() => {
                        //MUDA O MODAL PARA FECHADO
                        setOpenPerfil(false)
                    }}
                >
                    <div
                        className={`bg-[#ffffff] w-[270px] h-[250px] absolute right-[42px] top-[36px] rounded-[12px] z-[6] p-2 pt-10`}
                        onClick={(e) => {
                            //EVITA A PROPAGAÇÃO DOS EVENTOS DE CLIQUE DOS BOTÕES
                            e.stopPropagation()
                        }}
                    >
                        <FaUser
                            onClick={() => {
                                setOpenPerfil(false)
                            }}
                            className={`absolute top-0 right-0 text-[28px] text-my-secondary mt-[13px] mr-[6px]`}
                        />
                        <p onClick={() => {
                            navigate('/perfil')
                            setOpenPerfil(false)
                        }}
                        className={`font-bold capitalize text-my-secondary underline`}>perfil</p>
                        {user.logged == true && (
                            <p
                                className={`font-bold capitalize text-my-secondary underline`}
                                onClick={() => {
                                    setOpenPerfil(false)
                                    setLogoutModal(true)
                                }}
                            >Logout</p>
                        )}
                    </div>
                </div>
            )}
        </>
    )
}