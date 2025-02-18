//IMPORTAÇÃO DAS BIBLIOTECAS
import { ChangeEvent, useState, useEffect, useContext } from 'react'
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
                toast.dismiss();
                //CHAMA O MODAL DE ERRO
                toast.error(response.data)
                
                // MUDA O ESTADO DA APLICAÇÃO PARA false
                toggleLoading(false)
            }else{
                toast.dismiss();
                //CHAMA O MODAL DE SUCESSO
                toast.success(`Código correto`)
                
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
            <div className={`w-screen min-h-[35vh] bg-my-white overflow-x-hidden px-10 pb-10 sm:px-0 flex flex-col items-center`}>
                <h1 className={`mt-5 text-left w-full max-w-[700px] text-[28px] text-my-secondary font-inter font-bold mb-2`}>Confirme o código</h1>
                <p className={`font-inter w-full text-left max-w-[700px] text-my-gray font-bold text-[16px] mb-6`}>Informe o código</p>
                
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="w-full flex flex-col items-center"
                >
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

                
                <LoadingPage />
            </div>
            <Footer />
        </div>
    )
}