//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useState, useEffect, useRef } from 'react'
import { toast } from 'react-toastify';
import axios from 'axios'
import { useNavigate, useParams } from 'react-router'

//IMPORTAÇÃO DOS COMPONENTES
import Footer from "../../components/Footer";
import Header from "../../components/Header";
import ModalUser from '../../components/ModalUser';
import ModalCart from '../../components/ModalCart';
import ChoiceSizeCard from '../../components/ChoiceSizeCard';
import ModalLogout from '../../components/ModalLogout';
import ModalFinishBuy from '../../components/ModalFinishBuy';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

//IMPORTAÇÃO DOS ICONES
import { AiFillPicture, AiFillFileImage } from "react-icons/ai"
import { FaCaretLeft, FaCaretRight } from "react-icons/fa6";

export default function CustomProduct() {
    //FAZ REFERENCIA A UM ELEMENTO
    const inputFileRef = useRef<HTMLInputElement | null>(null)

    //UTILIZAÇÃO DO HOOKE DE NAVEGAÇÃO ENTRE PÁGINAS DO react-router-dom
    const navigate = useNavigate()

    //UTILIZAÇÃO DO HOOKE DE PARÂMETROS DO react-router-dom
    const { product } = useParams()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { productSelected, toggleUser, setCart, user }:any = useContext(GlobalContext);

    //UTILIZAÇÃO DO HOOK useState
    const [arrayEstampas, setArrayEstampas] = useState<string[]>([])
    const [indPreEstampa, setIndPreEstampa] = useState<number>(0)
    const [isHoverMyPrint, setIsHoverMyPrint] = useState<boolean>(false)
    const [isHoverPrint, setIsHoverPrint] = useState<boolean>(false)

    //FUNÇÃO RESPONSÁVEL POR TROCAR O ESTADO DE isHoverMyPrint
    function toggleHoverMyPrint(state:boolean) {
        setIsHoverMyPrint(state)
    }
    
    //FUNÇÃO RESPONSÁVEL POR TROCAR O ESTADO DE isHoverPrint
    function toggleHoverPrint(state:boolean) {
        setIsHoverPrint(state)
    }

    //FUNÇÃO RESPONSÁVEL POR LISTAR AS ESTAMPAS PRÉ-PRONTAS
    const fetchEstampas = async () => {
        axios.get("https://back-tcc-murilo.onrender.com/get-images")
        .then(function (response) {
            console.log(response.data)
            //COLOCA AS ESTAMPAS NO ARRAY DE ESTAMPAS
            setArrayEstampas(response.data)
        })
        .catch(function (error) {
            console.log(error)
        })
      };

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        if(user.logged == false) {
            navigate('/sign-in')
        }
    },[user])

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        console.log(productSelected)

        //CHAMA A FUNÇÃO QUE PEGA AS IMAGENS DAS ESTAMPAS
        fetchEstampas()

        //VERIFICA SE TEM ITEM ESCOLHIDO
        if(productSelected.name == 'undefined') {
            //NAVEGA PARA A PÁGINA INICIAL
            navigate('/principal')
        }
    },[])

    //UTILIZA O HOOK useState
    const [size, setSize] = useState<string | undefined>('pp')
    const [color, setColor] = useState<string | undefined>('')
    const [print, setPrint] = useState<string | undefined>(undefined)
    const [btnActive, setBtnActive] = useState<boolean>(false)
    const [products, setProducts] = useState<any>()
    const [productID, setProductID] = useState<number>(0)
    const [img, setImg] = useState<string>('')
    const [imgURL, setImgURL] = useState<string | undefined>(undefined)

    //FUNÇÃO RESPONSÁEL POR PEGAR O INDICE DO PRODUTO
    function getIndice() {
        console.log(productSelected.material)
        switch (productSelected.material) {
            case 'porcelana':
                setProductID(0)
            break;
                
            case 'plástica':
                setProductID(1)
            break;
            
            case 'mágica':
                setProductID(2)
            break;
            
            case 'de colher':
                setProductID(3)
                break;
                
            case 'Sem fio':
                setProductID(1)
            break;

            default:
                break;
        }
    }

    //FUNÇÃO RESPONSÁVEL POR COLOCAR A COR DO PRIMEIRO ÍNDICE
    useEffect(() => {
        //VERIFICA SE JÁ TEM PRODUTOS CADASTRADOS
        if(products && products.colors){
            console.log("CORES: "+products.colors[productID][0])
            setColor(products.colors[productID][0])
        }
    },[products, productID])

    //FUNÇÃO RESPONSÁVEL POR PEGAR OS PRODUTOS DO BACK-END
    function getProducts() {
        getIndice()
        axios.get(`https://back-tcc-murilo.onrender.com/get-product/${product}`)
        .then(function (response) {
            
            //PEGA O PRODUTO
            setProducts(response.data)
            
            console.log(response.data.colors[productID])
            console.log(response.data.type[productID])
            console.log(response.data.prices[productID])
            console.log("COLOR: "+response.data.colors[productID][0])
            setColor(response.data.colors[productID][0])
        })
        .catch(function (error) {
            console.log(error)
        })
    }

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //VERIFICA SE O USUÁRIO DEFINIU TODAS AS OPÇÕES
        if(size !== undefined && color !== undefined){
            //MUDA O ESTADO do btnActiv PARA true
            setBtnActive(true)
        }else{
            //MUDA O ESTADO do btnActiv PARA false
            setBtnActive(false)
        }
    },[size , color, print, img])

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //CHAMA A FUNÇÃO RESPONSÁVEL POR PEGAR OS PRODUTOS DO BACK-END
        getProducts()
    },[])

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        console.log(productSelected.type)
        //VERIFICA SE O PRODUTO FOI SELECIONADO
        if(productSelected.name == "undefined") {
            navigate('/principal')
        }
    },[])

    //FUNÇÃO RESPONSÁVEL POR PEGAR A IMAGEM DOS ARQUIVOS DO USUÁRIO
    const handleFileIMG = () => {

        //PEGA O ARQUIVO ESCOLHIDO
        const file = inputFileRef.current?.files?.[0]

        //VERIFICA SE TEM ARQUIVO
        if(file){
            //LÊ O ARQUIVO ESCOLHIDO
            const reader = new FileReader()

            //EXECUTA A FUNÇÃO ASSIM QUE O ARQUIVO É CARREGADO
            reader.onloadend = () => {
                //SETA AS IMAGENS COMO URL
                setImg(reader.result as string)
                
                //SETA AS IMAGENS COMO URL
                setImgURL(reader.result as string)
            }
            //LÊ A URL DO ARQUIVO
            reader.readAsDataURL(file)
        }
    }

     // FUNÇÃO RESPONSÁVEL POR DAR UPLOAD NA IMAGEM
     async function handleUpload() {
        
        //CRIA UMA PROMISSE 
        return new Promise((resolve, reject) => {
            //PEGA O ARQUIVO QUE FOI SELECIONADO
            const file = inputFileRef.current?.files?.[0];

            //VERIFICA SE NÃO TEM IMAGEM
            if (!file) {
                //RESOLVE A PROMEISSE PASSANDO A IMAGEM COMO PARÂMETRO
                resolve(img);

                //GERA UM ID ALEATÓRIO
                const id = Math.floor(Math.random() * 99999)

                //FAZ A REQUISIÇÃO QUE ATUALIZA O HISTORICO DE PEDIDOS NO BANCO DE DADOS DO USUÁRIO
                axios.put('https://back-tcc-murilo.onrender.com/add-carrinho', {
                    userId: user.id,
                    produto: {
                        id: id,
                        image: productSelected.image,
                        name: productSelected.name,
                        price: Number(productSelected.prices),
                        quantity: productSelected.quantity,
                        estampa: imgURL,
                        size: size,
                        material: productSelected.material,
                        color: color,
                        colors: products.colors[productID],
                        types: products.type
                    }
                })
                .then(function (response) {
                    //ESCREVE NO CONSOLE O HISTORICO DE PEDIDOS DO CLIENTE
                    console.log(response.data)

                    toggleUser(user.id, user.name, user.email, user.history, response.data.cart, user.client_type, true)
                    setCart(response.data.cart)
                    // id:any, name:string, email:string, history:any, cart:any, logged:boolean)
                })
                .catch(function (error) {
                    console.log('erro: ', error)
                })
            } else {
                //CÓDIGO CLOUDINARY
                
                //GERA UM ID ALEATÓRIO
                const id = Math.floor(Math.random() * 99999)
                
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'present'); //presente-unico
                formData.append('cloud_name', 'dgvxpeu0a'); //dgvxpeu0a
                formData.append('folder', 'images/estampas'); // Exemplo de pasta
                formData.append('public_id', String(id)); // Exemplo de public ID
                

                axios.post('https://api.cloudinary.com/v1_1/dgvxpeu0a/image/upload', formData)
                .then(response => {
                    if (response.data.secure_url) {

                        const url = response.data.secure_url;

                        localStorage.setItem('estampa-visu3d', url)

                        //SETA A URL DA IMAGEM
                        setImgURL(url);
                                
                        //ESCREVE A URL DA IMAGEM NO CONSOLE
                        console.log('imagem salva: '+ url)

                        //PEGA A URL DA IMAGEM
                        setImg(url);

                        //FAZ A REQUISIÇÃO QUE ATUALIZA O HISTORICO DE PEDIDOS NO BANCO DE DADOS DO USUÁRIO
                        axios.put('https://back-tcc-murilo.onrender.com/add-carrinho', {
                            userId: user.id,
                            produto: {
                                id: id,
                                image: productSelected.image,
                                name: productSelected.name,
                                price: Number(productSelected.prices),
                                quantity: productSelected.quantity,
                                estampa: url,
                                size: size,
                                material: productSelected.material,
                                color: color,
                                colors: products.colors[productID],
                                types: products.type
                            }
                        })
                        .then(function (response) {
                            //ESCREVE NO CONSOLE O HISTORICO DE PEDIDOS DO CLIENTE
                            console.log(response.data)

                            toggleUser(user.id, user.name, user.email, user.history, response.data.cart, user.client_type, true)
                            setCart(response.data.cart)
                            // id:any, name:string, email:string, history:any, cart:any, logged:boolean)
                        })
                        .catch(function (error) {
                            console.log('erro: ', error)
                        })
                    }
                })
                .catch(error => {
                    console.error('Erro ao fazer upload:', error);
                    reject(error)
                });
            }
        });
    }

    //FUNÇÃO RESPONSÁVEL POR SELECIONAR O TAMANHO
    function selectSize(choiceSize:string) {
        setSize(choiceSize)
    }

    //FUNÇÃO RESPONSÁVEL POR CHAMAR O MODAL
    const notifySucess = (message:string) => toast.success(message);

    return(
        <div className={`bg-my-white min-h-[35vh] flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto sm:scrollbar sm:px-0`}
        >
            <Header />
            <div className={`bg-[#efefef] w-[95%] flex flex-col items-center justify-start rounded-[12px] max-w-[900px]`}>
                <h1 className={`mt-5 text-[20px] font-bold text-my-secondary`}>Vamos criar sua {productSelected && productSelected.name}</h1>
                
                <div className={`mt-3 mb-5 w-[80%] h-[3px] bg-my-secondary`}></div>

                <div className={`w-[90%] flex flex-row flex-wrap bg-my-white p-3 rounded-[12px] justify-between mb-5`}>
                    <h1 className={`w-full text-left text-[18px] font-bold capitalize text-my-secondary mb-4`}>estampa</h1>

                    <label
                        onMouseEnter={() => toggleHoverMyPrint(true)}
                        onMouseLeave={() => toggleHoverMyPrint(false)}
                        onClick={() => setPrint('my')}
                        htmlFor="estampa"
                        className={`w-[47.5%] bg-[#efefef] flex items-center flex-col justify-between mr-2 p-1 rounded-[8px] border-[1px] cursor-pointer ${print == 'my' ? 'border-my-primary' : 'border-transparent'}`}
                    >
                        <p className={`text-[18px] font-bold text-my-secondary text-center`}>Escolha sua estampa</p>
                        <AiFillPicture className={`
                            mt-2 text-my-secondary text-[48px] transition-all duration-[.5s]
                                ${isHoverMyPrint == true ? `rotate-[360deg]` : `rotae[0deg]`}
                            `}/>
                    </label>

                    <input ref={inputFileRef} type="file" name="estampa" id="estampa" className={`hidden`} onChange={handleFileIMG} />

                    <button
                        onMouseEnter={() => toggleHoverPrint(true)}
                        onMouseLeave={() => toggleHoverPrint(false)}
                        onClick={() => {
                            setImgURL(arrayEstampas[indPreEstampa])
                            setPrint('other')
                        }}
                        className={`w-[47.5%] bg-[#efefef] flex items-center flex-col justify-between ml-2 p-1 rounded-[8px] border-[1px] cursor-pointer ${print == 'other' ? 'border-my-primary' : 'border-transparent'}`}
                    >
                        <p className={`text-[18px] font-bold text-my-secondary text-center`}>Estampa pré pronta</p>
                        <AiFillFileImage className={`
                                mt-2 text-my-secondary text-[48px] transition-all duration-[.5s]
                                ${isHoverPrint == true ? `rotate-[360deg]` : `rotae[0deg]`}
                            `}
                        />
                    </button>

                    {imgURL !== undefined && (
                        <div className={`w-full flex items-center justify-center my-4`}>
                            {print == 'other' && (
                                <FaCaretLeft
                                    className={`text-[32px] text-my-secondary`}
                                    onClick={() => {
                                        if(indPreEstampa == 0){
                                            setIndPreEstampa(arrayEstampas.length - 1)
                                        }else{
                                            setIndPreEstampa(indPreEstampa - 1)
                                        }
                                        setImgURL(arrayEstampas[indPreEstampa])
                                    }}
                                />
                            )}
                            <img src={imgURL} alt="" className={`w-[200px] h-[150px]`} />
                            {print == 'other' && (
                                <FaCaretRight
                                    className={`text-[32px] text-my-secondary`}
                                    onClick={() => {
                                        if(indPreEstampa == Number(arrayEstampas.length - 1)){
                                            setIndPreEstampa(0)
                                        }else{
                                            setIndPreEstampa(indPreEstampa + 1)
                                        }
                                        setImgURL(arrayEstampas[indPreEstampa])
                                    }}
                                />
                            )}
                        </div>
                    )}
                </div>

                {productSelected.name == 'Camiseta' && (
                    <div className={`w-[90%] flex flex-row flex-wrap bg-my-white p-3 rounded-[12px] justify-center mb-5`}>
                        <h1 className={`w-full text-left text-[18px] font-bold capitalize text-my-secondary mb-4`}>tamanhos</h1>
                        <ChoiceSizeCard active={size == 'pp' ? true : false} size={'pp'} onClick={() => selectSize('pp')} />
                        <ChoiceSizeCard active={size == 'p' ? true : false} size={'p'} onClick={() => selectSize('p')} />
                        <ChoiceSizeCard active={size == 'm' ? true : false} size={'m'} onClick={() => selectSize('m')} />
                        <ChoiceSizeCard active={size == 'g' ? true : false} size={'g'} onClick={() => selectSize('g')} />
                        <ChoiceSizeCard active={size == 'gg' ? true : false} size={'gg'} onClick={() => selectSize('gg')} />
                        <ChoiceSizeCard active={size == 'xg' ? true : false} size={'xg'} onClick={() => selectSize('xg')} />
                    </div>
                )}

                <div className={`w-[90%] flex flex-row flex-wrap bg-my-white p-3 rounded-[12px] justify-start gap-4 mb-5`}>
                    <h1 className={`w-full text-left text-[18px] font-bold text-my-secondary`}>Selecione a cor</h1>

                    {products && products.colors[productID].map((materialColor:string, i:number) => (
                        <div
                            key={i}
                            onClick={() => setColor(materialColor)}
                            style={{ backgroundColor: materialColor }}
                            className={`w-[60px] h-[60px] rounded-[6px] ${color == materialColor && 'scale-[1.2]'} border-[1px] border-my-black cursor-pointer transition-all duration-[.3s] hover:scale-[0.9]`}
                        >
                        </div>

                    ))}
                </div>
                
            </div>
            <div className={`my-5 w-[90%] bg-[#efefef] p-4 font-bold rounded-[8px] max-w-[900px]`}>
                {products && (
                    <p className={`text-my-secondary text-[24px]`}>Valor <span className={`text-my-primary`}>R${String(Number(Number(productSelected.prices.replace(',','.')) * productSelected.quantity).toFixed(2)).replace('.', ',')}</span></p>
                )}
            </div>
            <button
                onClick={() => {
                    //COLOCA O MODAL
                    notifySucess(`Item adicionado ao carrinho`)
                    
                    handleUpload()
                }}
                className={`
                    ${btnActive == true ? 'bg-my-primary' : 'bg-[#efefef]'}
                    text-white py-4 rounded-[8px] w-[90%] mb-10 text-[20px] font-bold max-w-[900px]
                    hover:text-my-primary hover:bg-transparent transition-all duration-[.3s] border-[1px] border-my-primary cursor-pointer
                `}
            >
                Adicionar ao carrinho
            </button>
            <Footer />
            <ModalCart />
            <ModalUser />
            <ModalLogout />
            <ModalFinishBuy />
        </div>
    )
}