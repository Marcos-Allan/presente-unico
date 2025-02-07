//IMPORTAÇÃO DAS BIBLIOTECAS
import { useEffect, useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

//IMPORTAÇÃO DOS COMPONENTES
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ModalCart from '../../components/ModalCart';
import ModalUser from '../../components/ModalUser';
import ModalLogout from '../../components/ModalLogout';
import ModalFinishBuy from '../../components/ModalFinishBuy';

//IMPORTAÇÃO DAS BIBLIOTECAS DO FIREBASE
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../../utils/firebase';

//IMPORTAÇÃO DOS ICONES
import { AiFillPicture } from "react-icons/ai"
import { FaTrashCan } from "react-icons/fa6";

export default function Administer() {
    //FAZ REFERENCIA A UM ELEMENTO
    const inputFileRef = useRef<HTMLInputElement | null>(null)

    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { user }:any = useContext(GlobalContext);

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        if(user.logged == true && user.client_type == 'client') {
            navigate('/principal')
        }
    },[user])

    //UTILIZA O HOOK useState
    const [imgURLs, setImgURLs] = useState<string[]>([])
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [btnActive, setBtnActive] = useState<boolean>(false)
    const [isHover, setIsHover] = useState<boolean[]>([])

    // FUNÇÃO PARA PEGAR A IMAGEM DO INPUT
    const handleFileIMG = () => {
        const files = inputFileRef.current?.files;
        if (files) {
            const newFiles = Array.from(files);
            setSelectedFiles((prev) => [...prev, ...newFiles]);

            newFiles.forEach((file) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setImgURLs((prev) => [...prev, reader.result as string]);
                    setIsHover((prev) => [...prev, false]);
                };
                reader.readAsDataURL(file);
            });
        }
    };

    // FUNÇÃO PARA FAZER UPLOAD DAS IMAGENS PARA O FIREBASE
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Nenhuma imagem selecionada para upload.");
            return;
        }

        try {
            const uploadPromises = selectedFiles.map((file) => {
                return new Promise<string>((resolve, reject) => {
                    const storageRef = ref(storage, `images/pre-estampas/${Date.now()}-${file.name}`);
                    const uploadTask = uploadBytesResumable(storageRef, file);

                    uploadTask.on(
                        "state_changed",
                        (snapshot) => {
                            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                            console.log(`Upload de ${file.name}: ${progress.toFixed(2)}%`);
                        },
                        (error) => {
                            console.error("Erro ao fazer upload:", error);
                            toast.error("Erro ao fazer upload da imagem.");
                            reject(error);
                        },
                        async () => {
                            const url = await getDownloadURL(uploadTask.snapshot.ref);
                            console.log("Imagem salva:", url);
                            resolve(url);
                        }
                    );
                });
            });

            const uploadedURLs = await Promise.all(uploadPromises);
            console.log("Todas as imagens foram enviadas com sucesso:", uploadedURLs);

            //LIMPA O ESTADO APÓS O UPLOAD
            setSelectedFiles([]);
            setImgURLs([]);

            toast.success("Imagens enviadas com sucesso!");
        } catch (error) {
            console.error("Erro ao fazer upload das imagens:", error);
        }
    };

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //VERIFICA SE O USUÁRIO DEFINIU TODAS AS OPÇÕES
        if(imgURLs.length >= 1){
            //MUDA O ESTADO do btnActiv PARA true
            setBtnActive(true)
        }else{
            //MUDA O ESTADO do btnActiv PARA false
            setBtnActive(false)
        }
    },[imgURLs])

    //FUNÇÃO RESPONSÁVEL POR TROCAR O ESTADO DE isHover
    function toggleHover(index: number, state: boolean) {
        setIsHover((prev) => prev.map((item, i) => (i === index ? state : item)));
    }

    //FUNÇÃO RESPONSÁVEL POR REMOVER A IMAGEM
    const removeImage = (index: number) => {
        setImgURLs((prev) => prev.filter((_, i) => i !== index));
        setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
    };

    //FUNÇÃO RESPONSÁVEL POR CHAMAR O MODAL
    const notifySucess = (message:string) => toast.success(message);

    return(
        <div className={`bg-my-white min-h-[35vh] flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto sm:scrollbar sm:px-0`}
        >
            <Header />
            <div className={`bg-my-white w-[80%] flex flex-col items-center justify-start rounded-[12px] max-w-[900px]`}>
                <label
                    htmlFor="estampa"
                    className={`bg-[#efefef] w-full flex items-center mb-3 flex-col transition-all duration-[.3s] border-transparent justify-between mr-2 p-1 rounded-[8px] border-[1px] cursor-pointer hover:bg-transparent hover:border-my-secondary py-4`}
                >
                    <p className={`text-[18px] font-bold text-my-secondary text-center`}>Adicione mais estampas</p>
                    <AiFillPicture className={`mt-2 text-my-secondary text-[48px]`}/>
                </label>

                <input multiple={true} ref={inputFileRef} type="file" name="estampa" id="estampa" className={`hidden`} onChange={handleFileIMG} />

                <div className={`w-full flex items-center justify-center flex-wrap gap-1`}>
                    {imgURLs.map((url:string, index:number) => (
                        <div
                            onMouseEnter={() => toggleHover(index, true)}
                            onMouseLeave={() => toggleHover(index, false)}
                            className={`w-full max-w-[300px] h-auto rounded-[6px] overflow-hidden relative cursor-pointer`}
                        >
                            <div className={`absolute top-0 left-0 w-full h-full bg-[#efefef] transition-all duration-[650ms] ${isHover[index] == true ? 'opacity-[0]' : 'opacity-[0.7]'} flex items-center justify-center text-[38px] text-my-white`}>
                                <FaTrashCan
                                    onClick={() => removeImage(index)}
                                    className={`transition-all duration-[.3s] ${isHover[index] == true ? 'scale-[1.4] rotate-[360deg]' : 'scale-[1.0] rotate-[0deg]'}`}
                                />
                            </div>
                            <img
                                key={index}
                                src={url}
                                alt={`Imagem ${index + 1}`} 
                                className='min-w-full object-cover'
                            />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => {
                        //COLOCA O MODAL
                        notifySucess(`Estampas salvas com sucesso!!`)
                        
                        //CHAMA A FUNÇÃO QUE DA UPLOAD NAS IMAGENS
                        handleUpload()
                    }}
                    className={`
                        mt-3 text-white py-4 rounded-[8px] w-full mb-10 text-[20px] font-bold max-w-[900px] border-[1px] focus:outline-none focus:bg-transparent hover:bg-transparent transition-all duration-[.3s] cursor-pointer
                        ${btnActive == true
                            ? 'bg-my-primary focus:text-my-primary hover:text-my-primary border-my-primary'
                            : 'bg-[#efefef] focus:text-[#efefef] hover:text-[#efefef] border-[#efefef]'
                        }
                    `}
                >
                    Adicionar estampas
                </button>
            </div>

            <Footer />
            <ModalCart />
            <ModalUser />
            <ModalLogout />
            <ModalFinishBuy />
        </div>
    )
}