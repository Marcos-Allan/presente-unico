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

export default function SiwtchPassword() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { toggleLoading, toggleUser, user }:any = useContext(GlobalContext);

    //UTILIZAÇÃO DO HOOK useState
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    
    const [passwordValid, setPasswordValid] = useState<boolean | undefined>(undefined)
    const [confirmPasswordValid, setConfirmPasswordValid] = useState<boolean | undefined>(undefined)
    
    const [btnValid, setBtnValid] = useState<boolean>(false)

    const [timeoutIdPassword, setTimeoutIdPassword] = useState<NodeJS.Timeout | null>(null);
    const [timeoutIdConfirmPassword, setTimeoutIdConfirmPassword] = useState<NodeJS.Timeout | null>(null);

    //FUNÇÃO RESPONÁVEL POR FAZER LOGIN
    function updateUser() {
        //MUDA O ESTADO DA APLICAÇÃO PARA true
        toggleLoading(true)

        axios.put(`https://back-tcc-murilo.onrender.com/update-user/${user.id}`, {
            password: password,
        })
        .then(function (response) {
            //RETORNA A RESPOSTA DA REQUISIÇÃO PRO USUÁRIO
            console.log(response.data)

            //MUDA O ESTADO DA APLICAÇÃO PARA false
            toggleLoading(false)

            //VERIFICA SE O TIPO RETORNADO DA REQUISIÇÃO É UM OBJETO
            if(typeof response.data === 'object'){
                toast.dismiss();
                //CHAMA O MODAL DE SUCESSO
                toast.success(`Senha alterada com sucesso!`)

                //COLOCA OS DADOS DO BACKEND DO USUÁRIO NO FRONTEND
                toggleUser(response.data._id, response.data.name, response.data.email, response.data.historico_pedido, response.data.client_type, true)
                
                //NAVEGA PARA A PRÓXIMA PÁGINA
                navigate('/sign-in')
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
    function handlePasswordInput(e:ChangeEvent<HTMLInputElement>) {
        //SETA O ESTADO DO INPUT DE SENHA COMO undefined
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
    
    //FUNÇÃO RESPONSÁVEL POR SALVAR  O VALOR DO INPUT
    function handleConfirmPasswordInput(e:ChangeEvent<HTMLInputElement>) {
        //SETA O ESTADO DO INPUT DE CONFIRMAR SENHA COMO undefined
        setConfirmPasswordValid(undefined)
        
        //SETA A CONFIRMAÇÃO DA SENHA COM BASE NO TEXTO DIGITADO NO INPUT
        setConfirmPassword(e.target.value)

        //VERIFICA SE TEM TIMER ATIVO
        if (timeoutIdConfirmPassword) {
            //CANCELA O TIMER ANTERIOR
            clearTimeout(timeoutIdConfirmPassword);
        }

        //DEFINE UM NOVO TIMER PARA VALIDAR O INPUT
        const newTimeoutId = setTimeout(() => {
            //CHAMA A FUNÇÃO QUE VALIDA O INPUT
            validatConfirmPasswordInput(e.target.value)
        }, 350);

        //SETA UM NOVO TIMER
        setTimeoutIdConfirmPassword(newTimeoutId);
    }

    //FUNÇÃO RESPONSÁVEL POR VALIDAR CAMPO DP INPUT
    function validatPasswordInput(password:string) {
        //USA REGEX PARA VERIFICAR O PADRÃO DA STRING
        const padraoPassword = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/

        //VERIFICA SE O EMAIL ESTÁ VAZIO
        if(password.length >= 0 && password.length < 6){
            //SETA O ESTADO DO INPUT DE SENHA COMO undefined
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
    
    function validatConfirmPasswordInput(confirmPassword:string) {
        //USA REGEX PARA VERIFICAR O PADRÃO DA STRING
        const padraoConfirmPassword = new RegExp(`^${password}$`)

        //VERIFICA SE O EMAIL ESTÁ VAZIO
        if(confirmPassword.length >= 0 && confirmPassword.length < 6){
            //SETA O ESTADO DO INPUT DE CONFIRMAR A SENHA COMO undefined
            setConfirmPasswordValid(undefined)
        }else{
            //VERIFICA SE O VALOR DO INPUT ESTÁ ENTRO DO PADRÃO DO REGEX
            if(padraoConfirmPassword.test(confirmPassword) == true) {
                //SETA O ESTADO DO INPUT DE CONFIRMAR A SENHA COMO true
                setConfirmPasswordValid(true)
            }else{
                //SETA O ESTADO DO INPUT DE CONFIRMAR A SENHA COMO false
                setConfirmPasswordValid(false)
            }
        }
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //VERIFICA SE OS ESTADOS DDOS INPUTS ESTÃO CORRETOS
        if(passwordValid == true && confirmPasswordValid == true){
            //SETA O ESTADO DO BOTÃO COMO true
            setBtnValid(true)
        }else{
            //SETA O ESTADO DO BOTÃO COMO false
            setBtnValid(false)
        }
    },[passwordValid, confirmPasswordValid])

    return(
        <div className={`overflow-x-hidden`}>
            <Header />
            <div className={`pt-[126px] w-screen min-h-[35vh] pb-10 bg-my-white overflow-x-hidden px-10 sm:px-0 flex flex-col items-center`}>
                <h1 className={`mt-5 text-left w-full max-w-[700px] text-[28px] text-my-secondary font-inter font-bold mb-2`}>Troque sua senha</h1>
                <p className={`font-inter w-full text-left max-w-[700px] text-my-gray font-bold text-[16px] mb-6`}>Crie sua nova senha</p>
                
                <form
                    onSubmit={(e) => e.preventDefault()}
                    className="w-full flex flex-col items-center"
                >
                    <Input
                        label={'Senha'}
                        placeholder={'Coloque sua senha'}
                        type={'password'}
                        validate={passwordValid}
                        value={password}
                        onChange={handlePasswordInput}
                        ind='new-password'
                    />
                    
                    <Input
                        label={'Confirmar senha'}
                        placeholder={'Confirme a senha'}
                        type={'password'}
                        validate={confirmPasswordValid}
                        value={confirmPassword}
                        onChange={handleConfirmPasswordInput}
                        ind='current-password'
                    />

                    <Button text={'Trocar'} validate={btnValid} event={() => updateUser()} />
                </form>

                <LoadingPage />
            </div>
            <Footer />
        </div>
    )
}