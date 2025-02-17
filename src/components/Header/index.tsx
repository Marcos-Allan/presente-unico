//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useEffect } from 'react'
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
    const { cart, openCart, setOpenCart, openPerfil, setOpenPerfil, user, setCartPosition }:any = useContext(GlobalContext);

    useEffect(() => {
        const updateCartPosition = () => {
          const cart = document.getElementById("cart-icon");
    
          if (cart) {
            const cartRect = cart.getBoundingClientRect();
            setCartPosition({
              x: cartRect.left + window.scrollX + cartRect.width / 2,
              y: cartRect.top + window.scrollY + cartRect.height / 2,
            });
          }
        };
    
        updateCartPosition();
        window.addEventListener("resize", updateCartPosition);
        window.addEventListener("scroll", updateCartPosition);
    
        return () => {
          window.removeEventListener("resize", updateCartPosition);
          window.removeEventListener("scroll", updateCartPosition);
        };
      }, [setCartPosition]);

    return(
        <div
            className={`
                fixed top-0 left-0 w-full bg-my-white flex items-center px-8 py-2 mb-2 sm:mb-5 z-[998]
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
            
            {user.logged == true && user.client_type !== 'client' && (
                <p className={`text-[16px] uppercase text-my-secondary px-3 font-bold`}>adm</p>
            )}

            {(location.pathname !== '/sign-in') && (location.pathname !== '/sign-up') && (location.pathname !== '/forgout-password') && (location.pathname !== '/verify-code') && (location.pathname !== '/switch-password') &&  (
                <div className={`flex items-center gap-2 text-[28px] text-my-secondary`}>
                    <div
                        onClick={() => {
                            setOpenPerfil(!openPerfil)
                        }}
                    >
                        <FaUser
                            className={`hover:scale-[1.3] transition-all duration-[.3s] cursor-pointer`}
                        />
                    </div>
                    <div
                        className='relative'
                        onClick={() => {
                            setOpenCart(!openCart)
                        }}
                    >
                        <FaCartPlus
                            id="cart-icon"
                            className={`hover:scale-[1.3] transition-all duration-[.3s] cursor-pointer`}
                        />
                        {cart != undefined && cart.length >= 1 && (
                            <div className={`absolute top-[-9px] right-[-9px] w-[18px] h-[18px] bg-my-primary rounded-[50%] flex items-center justify-center text-[10px] text-my-white`}>
                                {cart.length}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}