//IMPORTAÇÃO DAS BIBLIOTECAS
import { ChangeEvent, useState, useEffect, useContext } from 'react'
import { NavLink } from "react-router";
import { useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify';

//IMPORTAÇÃO DOS COMPONENTES
import Input from "../../components/Input";
import GoogleLogin from "../../components/GoogleLogin";
import Button from "../../components/Button";
import Divider from "../../components/Divider";
import LoadingPage from '../../components/LoadingPage';
import Header from '../../components/Header';
import Footer from '../../components/Footer';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function SignIn() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { toggleLoading, toggleUser }:any = useContext(GlobalContext);

    //UTILIZAÇÃO DO HOOK useState
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    
    const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined)
    const [passwordValid, setPasswordValid] = useState<boolean | undefined>(undefined)
    
    const [btnValid, setBtnValid] = useState<boolean>(false)

    const [timeoutIdEmail, setTimeoutIdEmail] = useState<NodeJS.Timeout | null>(null);
    const [timeoutIdPassword, setTimeoutIdPassword] = useState<NodeJS.Timeout | null>(null);
    
    //FUNÇÃO RESPONSÁVEL POR CHAMAR O MODAL
    const notifySucess = (message:string) => toast.success(message);
    const notifyError = (message:string) => toast.error(message);

    //FUNÇÃO RESPONÁVEL POR FAZER LOGIN
    function signIn() {
        //MUDA O ESTADO DA APLICAÇÃO PARA true
        toggleLoading(true)

        axios.post(`https://back-tcc-murilo.onrender.com/login`, {
            email: email,
            password: password,
        })
        .then(function (response) {
            //RETORNA A RESPOSTA DA REQUISIÇÃO PRO USUÁRIO
            console.log('rd'+response.data)

            //COLOCA OS DADOS DO BACKEND DO USUÁRIO NO FRONTEND
            toggleUser(response.data._id, response.data.name, response.data.email, response.data.historico_pedido, response.data.cart, true)

            //MUDA O ESTADO DA APLICAÇÃO PARA false
            toggleLoading(false)

            if(typeof response.data === 'object'){

                //CHAMA O MODAL DE SUCESSO
                notifySucess(`Bem vindo novamente ${response.data.name}`)

                //NAVEGA PARA A PRÓXIMA PÁGINA
                navigate('/principal')
            }else{
                //CHAMA O MODAL DE ERRO
                notifyError(response.data)
            }

        })
        .catch(function (error) {
            console.log(error)
        })
    }

    //FUNÇÃO RESPONSÁVEL POR SALVAR  O VALOR DO INPUT   
    function handleEmailInput(e:ChangeEvent<HTMLInputElement>) {
        setEmailValid(undefined)
        setEmail(e.target.value)

        //CANCELA O TIMER ANTERIOR
        if (timeoutIdEmail) {
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
    
    function handlePasswordInput(e:ChangeEvent<HTMLInputElement>) {
        setPasswordValid(undefined)
        setPassword(e.target.value)

        //CANCELA O TIMER ANTERIOR
        if (timeoutIdPassword) {
            clearTimeout(timeoutIdPassword);
        }

        //DEFINE UM NOVO TIMER PARA VALIDAR O INPUT
        const newTimeoutId = setTimeout(() => {
            //CHAMA A FUNÇÃO QUE VALIDA O INPUT
            validatPasswordInput(e.target.value)
        }, 350);

        //SETA UM NOVO TIMER
        setTimeoutIdPassword(newTimeoutId);
    }

    //FUNÇÃO RESPONSÁVEL POR VALIDAR CAMPO DP INPUT
    function validatEmailInput(email:string) {
        //USA REGEX PARA VERIFICAR O PADRÃO DA STRING
        const padraoEmail = /^[\w._-]+@[\w._-]+\.[\w]{2,}/i

        //VERIFICA SE O EMAIL ESTÁ VAZIO
        if(email.length >= 0 && email.length < 16){
            setEmailValid(undefined)
        }else{
            //VERIFICA SE O VALOR DO INPUT ESTÁ ENTRO DO PADRÃO DO REGEX
            if(padraoEmail.test(email) == true) {
                setEmailValid(true)
            }else{
                setEmailValid(false)
            }
        }
    }
    
    function validatPasswordInput(password:string) {
        //USA REGEX PARA VERIFICAR O PADRÃO DA STRING
        const padraoPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

        //VERIFICA SE O EMAIL ESTÁ VAZIO
        if(password.length >= 0 && password.length < 6){
            setPasswordValid(undefined)
        }else{
            //VERIFICA SE O VALOR DO INPUT ESTÁ ENTRO DO PADRÃO DO REGEX
            if(padraoPassword.test(password) == true) {
                setPasswordValid(true)
            }else{
                setPasswordValid(false)
            }
        }
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //VERIFICA SE OS ESTADOS DDOS INPUTS ESTÃO CORRETOS
        if(emailValid == true && passwordValid == true){
            setBtnValid(true)
        }else{
            setBtnValid(false)
        }
    },[emailValid, passwordValid])

    return(
        <div className={`overflow-x-hidden`}>
            <div className={`w-screen min-h-screen bg-my-white overflow-x-hidden px-10 sm:px-0 flex flex-col items-center`}>
                <Header />
                <h1 className={`mt-5 text-left w-full max-w-[700px] text-[28px] text-my-secondary font-inter font-bold mb-2`}>Faça login com sua conta</h1>
                <p className={`font-inter w-full text-left max-w-[700px] text-my-gray font-bold text-[16px] mb-6`}>È bom ter você novamente!</p>
                
                <Input
                    label={'Email'}
                    placeholder={'Coloque seu endereço de email'}
                    validate={emailValid}
                    value={email}
                    onChange={handleEmailInput}
                />
                
                <Input
                    label={'Senha'}
                    placeholder={'Coloque sua senha'}
                    type={'password'}
                    validate={passwordValid}
                    value={password}
                    onChange={handlePasswordInput}
                />

                <Button text={'Login'} validate={btnValid} event={() => signIn()} />

                <Divider />

                <GoogleLogin />

                <p className={`text-center max-w-[700px] mb-5 mt-20 font-bold text-my-secondary text-[18px]`}>
                    Não tem uma conta ainda?
                    <NavLink to={'/sign-up'} className={`ml-2 underline text-my-primary`}>
                        Cadastre-se
                    </NavLink>
                </p>
                
                <p className={`text-center max-w-[700px] mb-20 font-bold text-my-secondary text-[18px]`}>
                    Esqueceu sua senha?
                    <NavLink to={'/forgout-password'} className={`ml-2 underline text-my-primary`}>
                        Recupere
                    </NavLink>
                </p>
                <LoadingPage />
            </div>
            <Footer />
        </div>
    )
}