//IMPORTAÇÃO DAS BIBLIOTECAS
import { Canvas } from "@react-three/fiber";
import { useState } from "react"
import { useNavigate } from 'react-router'

//IMPORTAÇÃO DAS BIBLIOTECAS
import { IoReturnDownBackOutline } from "react-icons/io5";

//IMPORTAÇÃO DOS COMPONENTES
import { Experience } from "../../components/Experience";

export default function Model3D() {
    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //UTILIZAÇÃO DO HOOK useState
    const [isHover, setIsHover] = useState<boolean>(false)

    //FUNÇÃO RESPONSÁVEL POR MUDAR O ESTADO DE FOCO DO BOTÃO
    function toggleHover(state:boolean){
        //MUDA O ESTADO DA VÁRIAVEL FOCUS
        setIsHover(state)
    }

    return (
        <>
            <Canvas shadows camera={{ position: [3, 3, 3], fov: 30 }} className={`w-[100vw] h-[100vh] flex items-center bg-red-600`}>
                <color attach="background" args={["#ececec"]} />
                <Experience />
                
            </Canvas>
            <div
                onClick={() => navigate(-1)}
                onMouseEnter={() => toggleHover(true)}
                onMouseLeave={() => toggleHover(false)}
                className={`
                    w-[50px] h-[50px] fixed top-0 left-0 bg-my-black z-[2] text-my-white flex items-center justify-center font-bold text-[28px] m-2 p-2 rounded-[6px] opacity-[0.4] hover:opacity-[0.8] cursor-pointer transition-all duration-[.2s]
                `}
            >
                <IoReturnDownBackOutline
                    className={`transition-all duration-[.3s] ${isHover == true ? 'scale-[1.3]' : 'scale-[1.0]'}`}
                />
            </div>
        </>
    )
}