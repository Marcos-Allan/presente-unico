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
            toggleUser(response.data._id, response.data.name, response.data.email, response.data.historico_pedido, response.data.cart, response.data.client_type, true)

            //MUDA O ESTADO DA APLICAÇÃO PARA false
            toggleLoading(false)

            //VERIFICA SE O TIPO RETORNADO DA REQUISIÇÃO É UM OBJETO
            if(typeof response.data === 'object'){

                toast.dismiss();
                //CHAMA O MODAL DE SUCESSO
                toast.success(`Bem vindo novamente ${response.data.name}`)

                //NAVEGA PARA A PRÓXIMA PÁGINA
                navigate('/principal')
            }else{
                toast.dismiss();
                //CHAMA O MODAL DE ERRO
                toast.error(response.data)
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
    
    function handlePasswordInput(e:ChangeEvent<HTMLInputElement>) {
        //SETA O ESTADO DO INPUT DE SENHA COM undefined
        setPasswordValid(undefined)

        //SETA A SENHA COM BASE NO TEXTO DIGITADO NO INPUT
        setPassword(e.target.value)

        //VERIFICA SE TEM TIMER ATIVO
        if (timeoutIdPassword) {
            //CANCELA O TIMER ANTERIOR
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
    
    function validatPasswordInput(password:string) {
        //USA REGEX PARA VERIFICAR O PADRÃO DA STRING
        const padraoPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

        //VERIFICA SE O EMAIL ESTÁ VAZIO
        if(password.length >= 0 && password.length < 6){
            setPasswordValid(undefined)
        }else{
            //VERIFICA SE O VALOR DO INPUT ESTÁ ENTRO DO PADRÃO DO REGEX
            if(padraoPassword.test(password) == true) {
                //SETA O ESTADO DO INPUT DE SENHA COMO true
                setPasswordValid(true)
            }else{
                //SETA O ESTADO DO INPUT DE SENHA COMO false
                setPasswordValid(false)
            }
        }
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //VERIFICA SE OS ESTADOS DDOS INPUTS ESTÃO CORRETOS
        if(emailValid == true && passwordValid == true){
            //SETA O ESTADO DO BOTÃO COMO true
            setBtnValid(true)
        }else{
            //SETA O ESTADO DO BOTÃO COMO false
            setBtnValid(false)
        }
    },[emailValid, passwordValid])

    return(
        <div className={`overflow-x-hidden`}>
            <Header />
            <div className={`w-screen min-h-[35vh] bg-my-white overflow-x-hidden px-10 sm:px-0 flex flex-col items-center`}>
                <h1 className={`mt-5 text-left w-full max-w-[700px] text-[26px] text-my-secondary font-inter font-bold mb-2`}>Faça login com sua conta</h1>
                <p className={`font-inter w-full text-left max-w-[700px] text-my-gray font-bold text-[16px] mb-6`}>È bom ter você novamente!</p>
                
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="w-full flex flex-col items-center"
                >
                    <Input
                        label={'Email'}
                        placeholder={'Coloque seu endereço de email'}
                        validate={emailValid}
                        value={email}
                        onChange={handleEmailInput}
                        ind={'email'}
                    />
                    
                    <Input
                        label={'Senha'}
                        placeholder={'Coloque sua senha'}
                        type={'password'}
                        validate={passwordValid}
                        value={password}
                        onChange={handlePasswordInput}
                        ind={'current-password'}
                    />

                    <Button text={'Login'} validate={btnValid} event={() => signIn()} />
                </form>
                <Divider />

                <GoogleLogin />

                <p className={`text-center max-w-[700px] mb-5 mt-12 font-bold text-my-secondary text-[17px]`}>
                    Não tem uma conta ainda?
                    <NavLink to={'/sign-up'} className={`ml-1 underline text-my-primary focus:outline-none hover:text-my-black focus:text-my-black`}>
                        Cadastre-se
                    </NavLink>
                </p>
                
                <p className={`text-center max-w-[700px] mb-12 font-bold text-my-secondary text-[17px]`}>
                    Esqueceu sua senha?
                    <NavLink to={'/forgout-password'} className={`ml-1 underline text-my-primary focus:outline-none hover:text-my-black focus:text-my-black`}>
                        Recupere
                    </NavLink>
                </p>
                <LoadingPage />
            </div>
            <Footer />
        </div>
    )
}