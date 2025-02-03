//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext } from 'react'
import { useNavigate, useLocation } from 'react-router';

//IMPORTAÇÃO DAS IMAGENS
import present from '../../../public/logosemtexto.png'
import presentText from '../../../public/TEXTO.png'

//IMPORTAÇÃO DOS ICONES
import { FaUser, FaCartPlus } from "react-icons/fa"

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function Header() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //UTILIZAÇÃ ODO HOOK DE PEGAR A URL ATUAL
    const location = useLocation();

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { openCart, setOpenCart, openPerfil, setOpenPerfil }:any = useContext(GlobalContext);

    return(
        <div
            style={{ boxShadow: "0px 0px 1px 0px rgba(0, 0, 0, 0.5)" }}
            className={`
                w-full bg-my-white flex items-center px-8 py-2 mb-2 sm:mb-5
                ${(location.pathname !== '/sign-in') && (location.pathname !== '/sign-up') && (location.pathname !== '/forgout-password') && (location.pathname !== '/verify-code') && (location.pathname !== '/switch-password') ? 'justify-between' : 'justify-center'}
            `}
        >
            <div
                className={`w-full flex items-center justify-start cursor-pointer text-my-secondary sm:justify-start hover:scale-[1.07] hover:pl-[28px] transition-all duration-[.3s]`}
                onClick={() => navigate('/principal')}
            >
                <img
                    src={present}
                    alt=""
                    className={`w-[60px]`}
                />
                <img
                    src={presentText}
                    alt=""
                    className={`w-[110px]`}
                />
            </div>
            {(location.pathname !== '/sign-in') && (location.pathname !== '/sign-up') && (location.pathname !== '/forgout-password') && (location.pathname !== '/verify-code') && (location.pathname !== '/switch-password') &&  (
                <div className={`flex items-center gap-2 text-[28px] text-my-secondary`}>
                    <FaUser
                        className={`hover:scale-[1.3] transition-all duration-[.3s] cursor-pointer`}
                        onClick={() => {
                            setOpenPerfil(!openPerfil)
                        }}
                    />
                    <FaCartPlus
                        className={`hover:scale-[1.3] transition-all duration-[.3s] cursor-pointer`}
                        onClick={() => {
                            setOpenCart(!openCart)
                        }}
                    />
                </div>
            )}
        </div>
    )
}