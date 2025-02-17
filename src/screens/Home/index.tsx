//IMPORTAÇÃO DAS BIBLIOTECAS
import { useNavigate } from 'react-router'

//IMPORTAÇÃO DAS IMAGENS
import img from '../../../public/logo titulo lateral.png'
import Button from '../../components/Button'

export default function Home() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    return(
        <div className={`overflow-x-hidden`}>
            <div    
                className={`
                    w-full h-[100dvh] overflow-x-hidden sm:px-0 flex flex-col items-center justify-center
                `}
            >
                <img src={img} className={`max-w-[280px]`} alt="" />
                <div className={`flex-grow-[1] w-[80%]`}>
                    <p className={`text-my-black text-[30px] text-center mb-8`}>
                        Bem vindo a nossa loja de presentes personalizados
                    </p>
                    <p className={`text-my-black text-[30px] text-center mb-8`}>
                        Aqui você consegue modificar o modelo e a estampa de seu produto.
                    </p>
                </div>
                <div className={`w-[85%] pb-3 flex flex-col items-center`}>
                    <Button text={'Continuar'} validate={true} event={() => navigate('/sign-in')} />
                </div>
            </div>
        </div>
    )
}