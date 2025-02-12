//IMPORTAÇÃO DAS BIBLIOTECAS
import { useEffect, useState, useContext, useRef } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify';
import axios from 'axios'

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

//IMPORTAÇÃO DOS COMPONENTES
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import ModalCart from '../../components/ModalCart';
import ModalUser from '../../components/ModalUser';
import ModalLogout from '../../components/ModalLogout';
import ModalFinishBuy from '../../components/ModalFinishBuy';

//IMPORTAÇÃO DOS ICONES
import { AiFillPicture } from "react-icons/ai"
import { FaTrashCan, FaGift } from "react-icons/fa6";
import { FaImage, FaTrashAlt } from "react-icons/fa";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { IoMdAdd } from "react-icons/io";

export default function Administer() {
    //FAZ REFERENCIA A UM ELEMENTO
    const inputFileRef = useRef<HTMLInputElement | null>(null)
    const inputFileRefProduct = useRef<HTMLInputElement | null>(null)

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
    const [selectedFilesProduct, setSelectedFilesProduct] = useState<File[]>([]);
    const [btnActive, setBtnActive] = useState<boolean>(false)
    const [isHover, setIsHover] = useState<boolean[]>([])
    const [typeScreen, setTypeScreen] = useState<string | undefined>(undefined)

    const [nameProduct, setNameProduct] = useState<string>("")
    const [imgsProduct, setImgsProduct] = useState<string[]>([
        "https://tse2.mm.bing.net/th?id=OIP.sWCvltMZF_s3mjA5sL-RdgHaE8&pid=Api&P=0&h=180"
    ])
    const [typesProduct, setTypesProduct] = useState<string[]>([
        "",
    ])
    const [colorsProduct, setColorsProduct] = useState<string[][]>([
        ['#000000'],
    ])
    const [pricesProduct, setPricesProduct] = useState<string[]>([
        "",
    ])

    //FUNÇÃO RESPONSÁVEL POR SETAR O CAMPO DE NOME DO PRODUTO
    function handlenNameProduct(e:React.ChangeEvent<HTMLInputElement>) {
        setNameProduct(e.target.value)
    }
    
    //FUNÇÃO RESPONSÁVEL POR SETAR O CAMPO DE NOME DO PRODUTO
    function handlenPriceProduct(e:React.ChangeEvent<HTMLInputElement>, i:number) {
        setPricesProduct((prevPrices) => {
            const newPrices = [...prevPrices]
            newPrices[i] = e.target.value
            return newPrices
        })
    }
    
    //FUNÇÃO RESPONSÁVEL POR SETAR O CAMPO DE TIPO DO PRODUTO
    function handlenTypeProduct(e:React.ChangeEvent<HTMLInputElement>, i:number) {
        setTypesProduct((prevTypes) => {
            const newTypes = [...prevTypes]
            newTypes[i] = e.target.value
            return newTypes
        })
    }
    
    //FUNÇÃO RESPONSÁVEL POR SETAR O CAMPO DE CORES DO PRODUTO
    function handlenColorsProduct(e:React.ChangeEvent<HTMLInputElement>, i:number, i2:number) {
        setColorsProduct((prevColors) => {
            const newColors = [...prevColors]
            newColors[i][i2] = e.target.value
            return newColors
        })
    }

    //FUNÇÃO RESPOSÁVEL POR GERAR COR AEATÓRIA
    function randomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0")}`
    }
    //FUNÇÃO RESPONSÁVEL POR ADICIONAR MAIS UMA COR AO ARRAY
    function addColorProduct(color:string, i:number) {
        setColorsProduct((prevArray) => {
            const newArray = [...prevArray]
            newArray[i] = [... newArray[i], color]
            return newArray
        })
        
    }
    
    //FUNÇÃO RESPONSÁVEL POR REMOVER UMA COR DO ARRAY
    function removeColorProduct(i:number, i2:number) {
        if(colorsProduct[i].length == 1){
            toast.error('Necessário ter ao menos cor')
            return
        }

        setColorsProduct((prevArray) => {
            const newArray = [...prevArray]
            newArray[i] = newArray[i].filter((_, a) => a !== i2)
            return newArray
        })
        
    }

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
    
    //FUNÇÃO RESPONSÁVEL POR PEGAR A IMAGEM DOS ARQUIVOS DO USUÁRIO
    const handleFileIMGProduct = (event: React.ChangeEvent<HTMLInputElement>, i: number) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
        const reader = new FileReader();
        reader.onloadend = () => {
            const imageUrl = reader.result as string;
    
            // Atualiza corretamente sem afetar outros índices
            setImgsProduct((prevImgs) => {
                const newImgs = [...prevImgs]; // Clona o array para evitar mutação direta
                newImgs[i] = imageUrl; // Atualiza apenas o índice correto
                return newImgs;
            });
    
            setSelectedFilesProduct((prevFiles) => {
                const newFiles = [...prevFiles]; // Clona o array
                newFiles[i] = file; // Atualiza apenas o índice correto
                return newFiles;
            });
        };
    
        reader.readAsDataURL(file);
    };
    

    // FUNÇÃO PARA FAZER UPLOAD DAS IMAGENS PARA O FIREBASE
    const handleUpload = async () => {
        if (selectedFiles.length === 0) {
            toast.error("Nenhuma imagem selecionada para upload.")
            return
        }

        try {
            const uploadPromises = selectedFiles.map((file) => {
                return new Promise<string>(() => {
                    //GERA UM ID ALEATÓRIO
                    const id = Math.floor(Math.random() * 99999)
                    
                    const formData = new FormData();
                    formData.append('file', file);
                    formData.append('upload_preset', 'present');
                    formData.append('cloud_name', 'dgvxpeu0a');
                    formData.append('folder', 'images/pre-estampas');
                    formData.append('public_id', String(id));
                    

                    axios.post('https://api.cloudinary.com/v1_1/dgvxpeu0a/image/upload', formData)
                    .then(response => {
                        if (response.data.secure_url) {

                            const url = response.data.secure_url;

                            //ESCREVE A URL DA IMAGEM NO CONSOLE
                            console.log('imagem salva: '+ url)
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao fazer upload:', error);
                    });

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
    
    // FUNÇÃO PARA FAZER UPLOAD DAS IMAGENS PARA O CLOUDINARY
    const handleUploadProducts = async () => {
    console.log(selectedFilesProduct);
    if (selectedFilesProduct.length === 0) {
        toast.error("Nenhuma imagem selecionada para upload.");
        return;  // Se não houver arquivos, não continue o processo
    }

    try {
        // Cria uma lista de promessas de upload
        const uploadPromises = selectedFilesProduct.map((file) => {
            return new Promise<string>((resolve, reject) => {
                const id = Math.floor(Math.random() * 99999);

                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'present');
                formData.append('cloud_name', 'dgvxpeu0a');
                formData.append('folder', 'images/products');
                formData.append('public_id', String(id));

                axios.post('https://api.cloudinary.com/v1_1/dgvxpeu0a/image/upload', formData)
                    .then(response => {
                        if (response.data.secure_url) {
                            const url = response.data.secure_url;
                            console.log('Imagem salva: ' + url);

                            resolve(url); // Resolve a promessa com a URL da imagem
                        } else {
                            reject('Erro ao obter URL da imagem');
                        }
                    })
                    .catch(error => {
                        console.error('Erro ao fazer upload:', error);
                        reject(error);
                    });
            });
        });

        // Aguarda todas as promessas de upload serem concluídas
        const uploadedURLs = await Promise.all(uploadPromises);
        console.log("Todas as imagens foram enviadas com sucesso:", uploadedURLs);

        // Atualiza o estado imgsProduct com todas as URLs de uma vez
        setImgsProduct(uploadedURLs); // Atualiza o estado após todas as imagens serem carregadas

        // Agora que as imagens estão carregadas e o estado foi atualizado, podemos enviar o produto para o banco de dados
        addProduct(uploadedURLs); // Passe as URLs para a função que lida com o banco de dados

        // Limpa o estado de arquivos selecionados após o upload
        setSelectedFilesProduct([]);

        toast.success("Imagens enviadas com sucesso!");
    } catch (error) {
        console.error("Erro ao fazer upload das imagens:", error);
        toast.error("Erro ao enviar imagens.");
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

    //FUNÇÃO RESPONSÁVEL POR TROCAR A TELA DE ADM
    function toggleADMScren(screen:string) {
        //SETA A VARIAVEL typeScreen COM BASE NOS PARAMETROS DA FUNÇÃO
        setTypeScreen(screen)
    }

    //FUNÇÃO RESPONSÁVEL POR REMOVER O TIPO DO PRODUTO
    function removeType(i:number) {
        setImgsProduct((prevImgs) => prevImgs.filter((_, index) => index !== i))
        setTypesProduct((prevTypes) => prevTypes.filter((_, index) => index !== i))
        setPricesProduct((prevPrices) => prevPrices.filter((_, index) => index !== i))
        setColorsProduct((prevColors) => prevColors.filter((_, index) => index !== i))
    }
    
    //FUNÇÃO RESPONSÁVEL POR REMOVER O TIPO DO PRODUTO
    function addType() {
        setImgsProduct([...imgsProduct, "https://tse2.mm.bing.net/th?id=OIP.sWCvltMZF_s3mjA5sL-RdgHaE8&pid=Api&P=0&h=180"])
        setTypesProduct([...typesProduct, "Desconhecido"])
        setPricesProduct([...pricesProduct, "00.00"])
        setColorsProduct([...colorsProduct, ["#000000"]])
    }

    //FUNÇÃO RESPONSÁVEL POR ADICIONAR UM NOVO PRODUTO
    async function addProduct(uploadedURLs:string[]) {
        axios.post(`https://back-tcc-murilo.onrender.com/add-product`, {
            materials: {
                name: nameProduct,
                img: uploadedURLs,
                type: typesProduct,
                colors: colorsProduct,
                prices: pricesProduct,
            }
        })
        .then(function (response) {
            console.log(response.data)
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    //FUNÇÃO RESPONSÁVEL POR CHAMAR O MODAL
    const notifySucess = (message:string) => toast.success(message);

    return(
        <div className={`bg-my-white min-h-[35vh] flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto sm:scrollbar sm:px-0`}
        >
            <Header />

            {typeScreen != undefined && (
                <div className={`w-[80%] flex items-center justify-start pt-2 pb-4`}>
                    <div
                        onClick={() => setTypeScreen(undefined)}
                        className={`bg-my-secondary p-[7px] rounded-[4px] flex flex-row`}
                    >
                        <IoReturnDownBackOutline className={`text-my-white font-bold text-[24px]`} />
                    </div>
                </div>
            )}

            {typeScreen == undefined && (
                <div className={`bg-my-white w-[80%] flex flex-col items-center justify-center rounded-[12px] max-w-[900px] mb-3 gap-4`}>
                    
                    <h1 className={`text-my-secondary font-bold text-[18px] mt-4 mb-1 text-center`}>O quê vamos administrar hoje?</h1>

                    <div className={`w-full flex flex-row items-center justify-center gap-4`}>
                        <div
                            onClick={() => toggleADMScren('adm-produto')}
                            className={`border-[2px] border-my-secondary w-[47%] flex items-center justify-between rounded-[6px] flex-col`}
                        >
                            <FaGift className={`text-my-secondary text-[48px] my-8`} />
                            <p className={`capitalize text-my-secondary font-bold border-t-[2px] border- w-full text-center py-1`}>Adicionar produto</p>
                        </div>

                        <div 
                            onClick={() => toggleADMScren('adm-estampas')}
                            className={`border-[2px] border-my-secondary w-[47%] flex items-center justify-between rounded-[6px] flex-col`}
                        >
                            <FaImage className={`text-my-secondary text-[48px] my-8`} />
                            <p className={`capitalize text-my-secondary font-bold border-t-[2px] border- w-full text-center py-1`}>Adicionar Estampa</p>
                        </div>
                    </div>
                </div>
            )}
            
            {typeScreen == 'adm-estampas' && (
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
                                key={index}
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
            )}

            {typeScreen == 'adm-produto' && (
                <div className={`bg-my-white w-[80%] flex flex-col flex-wrap items-start justify-center rounded-[12px] max-w-[900px]`}>
                    
                    <div className={`w-full flex flex-row items-center justiify-between gap-2`}>
                        <input
                            placeholder={`Nome: `}
                            className={`flex-grow-[1] border-[1px] py-1 px-2 text-[14px] rounded-[8px]`}
                            onChange={handlenNameProduct}
                            value={nameProduct}
                        />
                    </div>

                    {typesProduct.map((type, i) => (
                        <div
                            key={i}
                            className={`relative w-full border-[1px] rounded-[6px] overflow-hidden my-2 flex flex-row flex-wrap items-start justify-start`}
                        >
                            <div
                                onClick={() => removeType(i)}
                                className={`absolute top-0 right-0 bg-my-red text-my-white p-3 rounded-bl-[4px] z-[2]`}
                            >
                                <FaTrashAlt />
                            </div>
                            
                            <label
                                htmlFor={`estampaProduct-${i}`}
                                className={`bg-my-white p-3 rounded-[8px] flex items-center flex-col relative cursor-pointer`}
                            >
                                <img src={imgsProduct[i]} className={`w-full max-w-[300px] mx-auto`} />
                            </label>

                            <input ref={inputFileRefProduct} type="file" name={`estampaProduct-${i}`} id={`estampaProduct-${i}`} className={`hidden`} onChange={(event) => handleFileIMGProduct(event, i)} />

                            <div className={`flex flex-col items-center justify-center flex-grow-[1] h-[200px] sm:h-[300px] font-bold`}>
                                <input
                                    onChange={(e) => handlenTypeProduct(e, i)}
                                    className={`w-full items-center justify-center border-[1px] flex flex-grow-[1] text-center`}
                                    value={type}
                                    placeholder={`Tipo do Produto`}
                                />
                                <input
                                    onChange={(e) => handlenPriceProduct(e, i)}
                                    className={`w-full items-center justify-center border-[1px] flex flex-grow-[1] text-center`}
                                    value={`${pricesProduct[i].replace(",", ".")}`}
                                    placeholder={`Preço do Tipo do Produto`}
                                />
                            </div>
                            <div className={`w-full`}>
                                {colorsProduct[i].map((color, i2) => (
                                    <>
                                        <div
                                            key={i2}
                                            className={`relative w-full flex flex-col items-start justify-center`}
                                        >
                                            {i2 == 0 && (
                                                <div className={`bg-my-primary absolute z-[2] top-[0px] p-2 rounded-br-[6px]`}>
                                                    <IoMdAdd
                                                        onClick={() => addColorProduct(randomColor(), i)}
                                                        className={`text-my-white`}
                                                    />
                                                </div>
                                            )}
                                            <input
                                                onChange={(e) => handlenColorsProduct(e, i, i2)}
                                                style={{ backgroundColor: `${color}` }}
                                                className={`w-full uppercase font-bold text-center px-3 py-3 border-[1px] text-my-white`}
                                                value={color}
                                            />
                                            <div
                                                onClick={() => removeColorProduct(i, i2)}
                                                className={`bg-my-red absolute z-[2] right-[10px] p-2 rounded-[6px]`}
                                            >
                                                <FaTrashAlt
                                                    className={`text-[20px] text-my-white`}
                                                />
                                            </div>
                                        </div>
                                    </>
                                ))}
                            </div>
                        </div>
                    ))}

                    <div
                        onClick={() => addType()}
                        className={`w-full bg-my-gray py-4 rounded-[6px] text-center text-my-white font-bold capitalize mb-6 mt-0`}
                    >
                        adicionar tipo
                    </div>

                    <div
                        onClick={() => {
                            handleUploadProducts()
                        }}
                        className={`w-full bg-my-primary py-4 rounded-[6px] flex items-center justify-center text-center mx-auto mb-2 mt-4 font-bold text-my-white`}
                    >
                        Adicionar produto
                    </div>
                </div>
            )}

            <Footer />
            <ModalCart />
            <ModalUser />
            <ModalLogout />
            <ModalFinishBuy />
        </div>
    )
}