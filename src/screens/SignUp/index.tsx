//IMPORTAÇÃO DAS BIBLIOTECAS
import { ChangeEvent, useState, useEffect, useContext } from 'react'
import { Link, useNavigate } from 'react-router'
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

export default function SignUp() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { toggleLoading, toggleUser }:any = useContext(GlobalContext);

    //UTILIZAÇÃO DO HOOK useState
    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    
    const [nameValid, setNameValid] = useState<boolean | undefined>(undefined)
    const [emailValid, setEmailValid] = useState<boolean | undefined>(undefined)
    const [passwordValid, setPasswordValid] = useState<boolean | undefined>(undefined)
    
    const [btnValid, setBtnValid] = useState<boolean>(false)

    const [timeoutIdName, setTimeoutIdName] = useState<NodeJS.Timeout | null>(null);
    const [timeoutIdEmail, setTimeoutIdEmail] = useState<NodeJS.Timeout | null>(null);
    const [timeoutIdPassword, setTimeoutIdPassword] = useState<NodeJS.Timeout | null>(null);

    //FUNÇÃO RESPONSÁVEL POR CHAMAR O MODAL
    const notifySucess = (message:string) => toast.success(message);
    const notifyError = (message:string) => toast.error(message);

    //FUNÇÃO RESPONÁVEL POR FAZER LOGIN
    function signUp() {
        //MUDA O ESTADO DA APLICAÇÃO PARA true
        toggleLoading(true)

        axios.post(`https://back-tcc-murilo.onrender.com/register`, {
            name: name,
            email: email,
            password: password,
        })
        .then(function (response) {
            //RETORNA A RESPOSTA DA REQUISIÇÃO PRO USUÁRIO
            console.log(response.data)

            //MUDA O ESTADO DA APLICAÇÃO PARA false
            toggleLoading(false)

            if(typeof response.data === 'object'){
                //CHAMA O MODAL DE SUCESSO
                notifySucess(`Seja muito bem vindo ${response.data.name}`)

                //COLOCA OS DADOS DO BACKEND DO USUÁRIO NO FRONTEND
                toggleUser(response.data._id, response.data.name, response.data.email, response.data.historico_pedido, true)
                
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
    function handleNameInput(e:ChangeEvent<HTMLInputElement>) {
        setNameValid(undefined)
        setName(e.target.value)

        //CANCELA O TIMER ANTERIOR
        if (timeoutIdName) {
            clearTimeout(timeoutIdName);
        }

        //DEFINE UM NOVO TIMER PARA VALIDAR O INPUT
        const newTimeoutId = setTimeout(() => {
            //CHAMA A FUNÇÃO QUE VALIDA O INPUT
            validatNameInput(e.target.value)
        }, 350);
        
        //SETA UM NOVO TIMER
        setTimeoutIdName(newTimeoutId);
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
    function validatNameInput(name:string) {
        //USA REGEX PARA VERIFICAR O PADRÃO DA STRING
        const padraoName = /^[a-zA-Z\s]{2,}$/
        
        //VERIFICA SE O NOME ESTÁ VAZIO
        if(name.length >= 0 && name.length < 3){
            setNameValid(undefined)
        }else{
            //VERIFICA SE O VALOR DO INPUT ESTÁ ENTRO DO PADRÃO DO REGEX
            if(padraoName.test(name) == true) {
                setNameValid(true)
            }else{
                setNameValid(false)
            }
        }

        console.log(name, nameValid)
    }

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
        if(emailValid == true && passwordValid == true && nameValid == true){
            setBtnValid(true)
        }else{
            setBtnValid(false)
        }
    },[emailValid, passwordValid, nameValid])

    return(
        <div className={`overflow-x-hidden`}>
            <Header />
            <div className={`w-screen min-h-screen bg-my-white overflow-x-hidden px-10 sm:px-0 flex flex-col items-center`}>
                <h1 className={`mt-5 text-left w-full max-w-[700px] text-[28px] text-my-secondary font-inter font-bold mb-2`}>Crie sua conta</h1>
                <p className={`font-inter w-full text-left max-w-[700px] text-my-gray font-bold text-[16px] mb-6`}>Vamos criar sua conta</p>

                <Input
                    label={'Nome completo'}
                    placeholder={'Coloque seu nome completo'}
                    validate={nameValid}
                    value={name}
                    onChange={handleNameInput}
                />
                
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

                <p className={`text-my-black text-left font-bold font-inter text-[14px]`}>Ao cadastrar-se você está concordando com nossos <span className={`text-my-primary underline font-inter`}>Termos, Privacidade, Política</span> e uso de Cookies</p>

                <Button text={'Crie sua conta'} validate={btnValid} event={() => signUp()} />

                <Divider />

                <GoogleLogin />

                <p className={`text-center max-w-[700px] mb-5 mt-20 font-bold text-my-secondary text-[18px]`}>
                    Já tem uma conta?
                    <Link to={'/sign-in'} className={`ml-2 underline text-my-primary focus:outline-none hover:text-my-black focus:text-my-black`}>
                        Entre
                    </Link>
                </p>
                
                <p className={`text-center max-w-[700px] mb-20 font-bold text-my-secondary text-[18px]`}>
                    Esqueceu sua senha?
                    <Link to={'/forgout-password'} className={`ml-2 underline text-my-primary focus:outline-none hover:text-my-black focus:text-my-black`}>
                        Recupere
                    </Link>
                </p>
                <LoadingPage />
            </div>
            <Footer />
        </div>
    )
}