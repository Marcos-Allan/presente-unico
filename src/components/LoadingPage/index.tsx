//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext } from 'react'

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

export default function LoadingPage() {

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { loading }:any = useContext(GlobalContext);

    return(
        <>
            {loading == true && (
                <div className={`w-screen h-screen fixed top-0 left-0 bg-[#000000de] flex items-center justify-center`}>
                    <p className={`text-my-white capitalize font-bold`}>loading...</p>
                </div>
            )}
        </>
    )
}