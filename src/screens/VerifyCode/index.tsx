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

export default function VerifyCode() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { toggleLoading }:any = useContext(GlobalContext);

    //UTILIZAÇÃO DO HOOK useState
    const [code, setCode] = useState<string>('')
    
    const [codeValid, setCodeValid] = useState<boolean | undefined>(undefined)
    
    const [btnValid, setBtnValid] = useState<boolean>(false)

    const [timeoutIdCode, setTimeoutIdCode] = useState<NodeJS.Timeout | null>(null);
    
    //FUNÇÃO RESPONSÁVEL POR CHAMAR O MODAL
    const notifySucess = (message:string) => toast.success(message);
    const notifyError = (message:string) => toast.error(message);

    //FUNÇÃO RESPONÁVEL POR FAZER LOGIN
    function forgoutPassword() {
        //MUDA O ESTADO DA APLICAÇÃO PARA true
        toggleLoading(true)

        axios.get(`https://back-tcc-murilo.onrender.com/verify-code/${code}`)
        .then(function (response) {
            //RETORNA A RESPOSTA DA REQUISIÇÃO PRO USUÁRIO
            console.log(response.data)
            
            //VERIFICA SE O TIPO RETORNADO DA REQUISIÇÃO É UMA STRING
            if(response.data == 'Código de verificação errado'){
                //CHAMA O MODAL DE ERRO
                notifyError(response.data)
                
                // MUDA O ESTADO DA APLICAÇÃO PARA false
                toggleLoading(false)
            }else{
                //CHAMA O MODAL DE SUCESSO
                notifySucess(`Código correto`)
                
                // MUDA O ESTADO DA APLICAÇÃO PARA false
                toggleLoading(false)

                //NAVEGA PARA A PRÓXIMA PÁGINA
                navigate('/switch-password')
            }

        })
        .catch(function (error) {
            //ESCREVE O ERRO NO CONSOLE
            console.log(error)
        })
    }

    //FUNÇÃO RESPONSÁVEL POR SALVAR  O VALOR DO INPUT   
    function handleCodeInput(e:ChangeEvent<HTMLInputElement>) {
        //SETA O ESTADO DO INPUT DE CODE COMO undefined
        setCodeValid(undefined)

        //SETA O CODE COM BASE NO TEXTO DIGITADO NO INPUT
        setCode(e.target.value)

        //VERIFICA SE TEM TIMER ATIVO
        if (timeoutIdCode) {
            //CANCELA O TIMER ANTERIOR
            clearTimeout(timeoutIdCode);
        }

        //DEFINE UM NOVO TIMER PARA VALIDAR O INPUT
        const newTimeoutId = setTimeout(() => {
            //CHAMA A FUNÇÃO QUE VALIDA O INPUT
            validatEmailInput(e.target.value)
        }, 350);

        //SETA UM NOVO TIMER
        setTimeoutIdCode(newTimeoutId);
    }

    //FUNÇÃO RESPONSÁVEL POR VALIDAR CAMPO DP INPUT
    function validatEmailInput(code:string) {
        //USA REGEX PARA VERIFICAR O PADRÃO DA STRING
        const padraoCode = /^\d{3}-\d{3}$/

        //VERIFICA SE O code ESTÁ VAZIO
        if(code.length >= 0 && code.length < 7){
            //SETA O ESTADO DO INPUT DE CODE COMO undefined
            setCodeValid(undefined)
        }else{
            //VERIFICA SE O VALOR DO INPUT ESTÁ ENTRO DO PADRÃO DO REGEX
            if(padraoCode.test(code) == true) {
                //SETA O ESTADO DO INPUT DE CODE COMO true
                setCodeValid(true)
            }else{
                //SETA O ESTADO DO INPUT DE CODE COMO false
                setCodeValid(false)
            }
        }
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //VERIFICA SE OS ESTADOS DDOS INPUTS ESTÃO CORRETOS
        if(codeValid == true){
            //SETA O ESTADO DO BOTÃO COMO true
            setBtnValid(true)
        }else{
            //SETA O ESTADO DO BOTÃO COMO false
            setBtnValid(false)
        }
    },[codeValid])

    return(
        <div className={`overflow-x-hidden`}>
            <Header />
            <div className={`w-screen min-h-[35vh] bg-my-white overflow-x-hidden px-10 sm:px-0 flex flex-col items-center`}>
                <h1 className={`mt-5 text-left w-full max-w-[700px] text-[28px] text-my-secondary font-inter font-bold mb-2`}>Confirme o código</h1>
                <p className={`font-inter w-full text-left max-w-[700px] text-my-gray font-bold text-[16px] mb-6`}>Informe o código</p>
                
                <form className="w-full">
                    <Input
                        label={'Código'}
                        placeholder={'Digite o código'}
                        validate={codeValid}
                        value={code}
                        onChange={handleCodeInput}
                        ind='off'
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