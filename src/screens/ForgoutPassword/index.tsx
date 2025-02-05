//IMPORTAÇÃO DAS BIBLIOTECAS
import { ChangeEvent, useState, useEffect, useContext } from 'react'
import { NavLink } from "react-router";
import { useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify';

//IMPORTAÇÃO DOS COMPONENTES
import Input from "../../components/Input";
import Button from "../../components/Button";
import LoadingPage from '../../components/LoadingPage';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function ForgoutPassword() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { toggleLoading, user, toggleUser }:any = useContext(GlobalContext);

    //UTILIZAÇÃO DO HOOK useState
    const [email, setEmail] = useState<string>('')
    
    const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined)
    
    const [btnValid, setBtnValid] = useState<boolean>(false)

    const [timeoutIdEmail, setTimeoutIdEmail] = useState<NodeJS.Timeout | null>(null);
    
    //FUNÇÃO RESPONSÁVEL POR CHAMAR O MODAL
    const notifySucess = (message:string) => toast.success(message);
    const notifyError = (message:string) => toast.error(message);

    //FUNÇÃO RESPONÁVEL POR FAZER LOGIN
    function forgoutPassword() {
        //MUDA O ESTADO DA APLICAÇÃO PARA true
        toggleLoading(true)

        axios.get(`https://back-tcc-murilo.onrender.com/forgout-password/${email}`)
        .then(function (response) {
            //RETORNA A RESPOSTA DA REQUISIÇÃO PRO USUÁRIO
            console.log(response.data)
            
            if(response.data == 'Usuário não cadastrado com esse email'){
                //CHAMA O MODAL DE ERRO
                notifyError(response.data)
                
                // MUDA O ESTADO DA APLICAÇÃO PARA false
                toggleLoading(false)
            }else{
                //CHAMA O MODAL DE SUCESSO
                notifySucess(`Email enviado para ${email}`)

                //SETA OS DADOS DO USUÁRIO NO FRONTEND DA APLICAÇÃO
                toggleUser(response.data.user._id, user.name, user.email, user.history, user.cart, user.logged )
                
                // MUDA O ESTADO DA APLICAÇÃO PARA false
                toggleLoading(false)

                //NAVEGA PARA A PRÓXIMA PÁGINA
                navigate('/verify-code')
            }

        })
        .catch(function (error) {
            //ESCREVE O ERRO NO CONSOLE
            console.log(error)
        })
    }

    //FUNÇÃO RESPONSÁVEL POR SALVAR  O VALOR DO INPUT   
    function handleEmailInput(e:ChangeEvent<HTMLInputElement>) {
        
        //SETA O ESTADO DO INPUT DE EMAIL COM undefined
        setEmailValid(undefined)
        
        //SETA O EMAIL COM BASE NO TEXTO DIGITADO NO INPUT
        setEmail(e.target.value)

        //VERIFICA SE TEM TIMER ATIVO
        if (timeoutIdEmail) {
            //CANCELA O TIMER ANTERIOR
            clearTimeout(timeoutIdEmail);
        }

        //DEFINE UM NOVO TIMER PARA VALIDAR O INPUT
        const newTimeoutId = setTimeout(() => {
            //CHAMA A FUNÇÃO QUE VALIDA O INPUT
            validatEmailInput(e.target.value)
        }, 350);

        //SETA UM NOVO TIMER
        setTimeoutIdEmail(newTimeoutId);
    }

    //FUNÇÃO RESPONSÁVEL POR VALIDAR CAMPO DP INPUT
    function validatEmailInput(email:string) {
        //USA REGEX PARA VERIFICAR O PADRÃO DA STRING
        const padraoEmail = /^[\w._-]+@[\w._-]+\.[\w]{2,}/i

        //VERIFICA SE O EMAIL ESTÁ VAZIO
        if(email.length >= 0 && email.length < 16){
            //SETA O ESTADO DO INPUT DE EMAIL COMO undefined
            setEmailValid(undefined)
        }else{
            //VERIFICA SE O VALOR DO INPUT ESTÁ ENTRO DO PADRÃO DO REGEX
            if(padraoEmail.test(email) == true) {
                //SETA O ESTADO DO INPUT DE EMAIL COMO true
                setEmailValid(true)
            }else{
                //SETA O ESTADO DO INPUT DE EMAIL COMO false
                setEmailValid(false)
            }
        }
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //VERIFICA SE OS ESTADOS DDOS INPUTS ESTÃO CORRETOS
        if(emailValid == true){
            //SETA O ESTADO DO BOTÃO COMO true
            setBtnValid(true)
        }else{
            //SETA O ESTADO DO BOTÃO COMO false
            setBtnValid(false)
        }
    },[emailValid])

    return(
        <div className={`overflow-x-hidden`}>
            <Header />
            <div className={`w-screen min-h-[35vh] bg-my-white overflow-x-hidden px-10 sm:px-0 flex flex-col items-center`}>
                <h1 className={`mt-5 text-left w-full max-w-[700px] text-[28px] text-my-secondary font-inter font-bold mb-2`}>Recupere sua conta</h1>
                <p className={`font-inter w-full text-left max-w-[700px] text-my-gray font-bold text-[16px] mb-6`}>Informe o seu email</p>
                
                <form className="w-full flex flex-col items-center">
                    <Input
                        label={'Email'}
                        placeholder={'Coloque seu endereço de email'}
                        validate={emailValid}
                        value={email}
                        onChange={handleEmailInput}
                        ind="email"
                    />

                    <Button text={'Enviar'} validate={btnValid} event={() => forgoutPassword()} />
                </form>

                <p className={`text-center max-w-[700px] mb-5 mt-20 font-bold text-my-secondary text-[18px]`}>
                    Já tem uma conta?
                    <NavLink to={'/sign-in'} className={`ml-2 underline text-my-primary  focus:outline-none hover:text-my-black focus:text-my-black`}>
                        Entre
                    </NavLink>
                </p>

                <p className={`text-center max-w-[700px] font-bold text-my-secondary text-[18px] mb-10`}>
                    Não tem uma conta ainda?
                    <NavLink to={'/sign-up'} className={`ml-2 underline text-my-primary  focus:outline-none hover:text-my-black focus:text-my-black`}>
                        Cadastre-se
                    </NavLink>
                </p>
                <LoadingPage />
            </div>
            <Footer />
        </div>
    )
}