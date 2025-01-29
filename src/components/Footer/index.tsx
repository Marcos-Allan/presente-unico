//IMPORTAÇÃO DOS ICONES
import { FaFacebook, FaInstagram } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

//IMPORTAÇÃO DAS IMAGENS
import image from '../../../public/Logo texto com fundo.png'

export default function Footer() {
    return(
        <>
            <div className={`w-full flex flex-col items-center bg-my-terciary text-my-white font-inter py-6`}>
                <h1  className={`text-[20px] font-bold mb-2`}>Venha nos visitar</h1>
                <p className={`mb-2`}>Rio Acima, Jundiaí - State of São Paulo, 13215-841</p>
                <h2 className={`text-[20px] font-bold mb-3`}>Contatos</h2>
                <div className={`flex gap-3 items-center justify-center text-[34px] mb-3`}>
                    <FaFacebook className={`cursor-pointer hover:scale-[1.07] transition-all duration-[.3s]`} />
                    <FaInstagram className={`cursor-pointer hover:scale-[1.07] transition-all duration-[.3s]`} />
                    <MdEmail className={`cursor-pointer hover:scale-[1.07] transition-all duration-[.3s]`} />
                </div>
                <p className="mb-3">Está com duvidas?</p>
                <p>Clique <a className={`text-my-primary underline font-bold`} href="#">aqui</a> e tentaremos te ajudar!</p>
            </div>
            <div className={`w-full flex flex-col items-center justify-center bg-my-white py-3`}>
                <img
                    src={image}
                    alt=""
                    className={`w-[200px]`}
                />
            </div>
        </>
    )
}