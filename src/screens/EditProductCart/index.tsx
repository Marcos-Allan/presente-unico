//IMPORTAÇÃO DAS BIBLIOTECAS
import { useContext, useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router'
import axios from 'axios'
import { toast } from 'react-toastify';
import { Link } from 'react-router'

//IMPORTAÇÃO DOS COMPONENTES
import Header from "../../components/Header";
import Footer from '../../components/Footer';
import ModalCart from '../../components/ModalCart';
import ModalUser from '../../components/ModalUser';
import ModalLogout from '../../components/ModalLogout';
import LoadingPage from '../../components/LoadingPage';
import ModalFinishBuy from '../../components/ModalFinishBuy';

//IMPORTAÇÃO DO PROVEDOR DOS ESTADOS GLOBAIS
import { GlobalContext } from "../../provider/context";

//IMPORTAÇÃO DOS ÍCONES
import { FaTrashAlt } from "react-icons/fa";
import { FaCheck } from "react-icons/fa6";
import { FaEye } from "react-icons/fa";
import { FaRegImage } from "react-icons/fa6";

export default function EditProductCart() {
    //FAZ REFERENCIA A UM ELEMENTO
    const inputFileRef = useRef<HTMLInputElement | null>(null)

    //UTILIZAÇÃO DO HOOK DE NAVEGAÇÃO DO react-router-dom
    const navigate = useNavigate()

    //IMPORTAÇÃO DAS VARIAVEIS DE ESTADO GLOBAL
    const { productSelectedEdit, setProductSelectedEdit, user, toggleLoading, setCart, toggleUser }:any = useContext(GlobalContext);

    //VARIÁVEIS IMUTÁVEIS
    const myName:any = productSelectedEdit.name
    const [myPrice, setMyPrice] = useState<any>(productSelectedEdit.price)
    
    //UTILIZAÇÃO DO HOOK useState
    const [myEstampa, setMyEstampa] = useState<any>("https://res.cloudinary.com/dgvxpeu0a/image/upload/v1738601083/images/estampas/34818.jpg")
    const [myMaterial, setMyMaterial] = useState<any>(productSelectedEdit.material)
    const [myQuantity, setMyQuantity] = useState<any>(productSelectedEdit.quantity)
    const [mySize, setMySize] = useState<any>(productSelectedEdit.size)
    const [productID, setProductID] = useState<number>(0)
    const [img, setImg] = useState<string>('')
    const [image, setImage] = useState<any>('')
    const [isHover, setIsHover] = useState<boolean>(false)

    //ARRAY DE POSSIBILIDADES DAS PROPS DO PRODUTOS
    const [sizes, setSizes] = useState<any>([productSelectedEdit.types])
    const [materiais, setMateriais] = useState<any>()
    
    const [products, setProducts] = useState<any>()
    const [typeInd, setTypeInd] = useState<number>(0)

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        if(user.logged == false) {
            navigate('/sign-in')
        }
    },[user])
    
    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        localStorage.setItem('estampa-visu3d', myEstampa)
    },[myEstampa])

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        console.log(productSelectedEdit.name)
        if(productSelectedEdit.name == "Caneca"){
            setTypeInd(0)
            setMateriais(['porcelana', 'plástica', 'mágica', 'de colher'])
            setSizes(productSelectedEdit.types)
        }else if(productSelectedEdit.name == "Camiseta"){
            setTypeInd(1)
            setMateriais(['poliester'])
            setSizes(['pp', 'p', 'm', 'g', 'gg', 'xg'])
        }else if(productSelectedEdit.name == "Almofada"){
            setTypeInd(2)
            setMateriais(['dois lados 28x20cm', 'dois lados 40x28cm', 'cubo 15x15cm', 'cubo 20x20cm'])
            setSizes(['pp'])
        }else if(productSelectedEdit.name == "Caderno"){
            setTypeInd(3)
            setMateriais(['A4'])
            setSizes(['pp'])
        }else if(productSelectedEdit.name == "Agenda"){
            setTypeInd(4)
            setMateriais(['17x9,4cm'])
            setSizes(['pp'])
        }else if(productSelectedEdit.name == "Azulejo"){
            setTypeInd(5)
            setMateriais(['15x15cm', '10x10cm'])
            setSizes(['pp'])
        }else if(productSelectedEdit.name == "Almochaveiro"){
            setTypeInd(6)
            setMateriais(['7x7cm'])
            setSizes(['pp'])
        }
    },[productSelectedEdit])

    //FUNÇÃO RESPONSÁVEL POR TROCAR O ESTADO DE isHover
    function toggleHover(state:boolean) {
        setIsHover(state)
    }

    //FUNÇÃO RESPONSÁVEL POR REMOVER ITEM DO CARRINHO
    function removeItem() {
        axios.delete('https://back-tcc-murilo.onrender.com/remove-carrinho', {
            data: {
                userId: user.id,
                itemId: productSelectedEdit.id,
            }
        })
        .then(function (response) {
            //ATUALIZA O CARRINHO PARA 
            setCart(response.data.cart)

            //COLOCA ALERT NA TELA
            notifySucess('item deletado com sucesso')

            //SETA AS VARIÁVEIS DENTRO NO FRONTEND DA APLICAÇÃO
            toggleUser(user.id, user.name, user.email, user.history, response.data.cart, true)

            //NAVEGA PARA A PÁGINA PRINCIPAL
            navigate('/perfil')
        })
        .catch(function (error)  {
            //ESCREVE O ERRO OCORRIDO NO CONSOLE
            console.log(error)
        })

    }

    //FUNÇÃO RESPONSÁEL POR PEGAR O INDICE DO PRODUTO
    function getIndice() {
        switch (productSelectedEdit.material) {
            case 'porcelana':
                setProductID(0)
                console.log(0)
                break;
                
            case 'plástica':
                setProductID(1)
                console.log(1)
            break;
                
            case 'mágica':
                setProductID(2)
                console.log(2)
            break;
                    
            case 'de colher':
                setProductID(3)
                console.log(3)
            break;
        
            default:
                break;
        }
    }

    //FUNÇÃO RESPONSÁVEL POR PEGAR OS PRODUTOS DO BACK-END
    function getProducts() {
        //CHAMA A FUNÇÃO QUE PEGA OS ITEMS ATUAIS
        getIndice()
        
        axios.get('https://back-tcc-murilo.onrender.com/all-products')
        .then(function (response) {
            
            //PEGA O PRODUTO ESCOLHIDO
            setProducts(response.data)
        })
        .catch(function (error) {
            console.log(error)
        })
    }
    
    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //CHAMA A FUNÇÃO RESPONSÁVEL POR PEGAR OS PRODUTOS DO BACK-END
        getProducts()

        //CHAMA A FUNÇÃO QUE PEGA O ID DO PRODUTO
        getIndice()

        //SETA A IMAGEM COMO VAZIA PARA NÃO DAR ERRO NO DEPLOY
        setImg('')

        //VERIFICA SE O PRODUTO FOI SELECIONADO
        if(productSelectedEdit.name == "undefined") {
            navigate('/principal')
        }
    },[])

    //FUNÇÃO CHAMADA TODA VEZ QUE A PÁGINA É RECARREGADA
    useEffect(() => {
        //MUDA AS PROPS DO PRODUTO
        setMyEstampa(productSelectedEdit.print)
        setMyMaterial(productSelectedEdit.material)
        setMyQuantity(productSelectedEdit.quantity)
        setMySize(productSelectedEdit.size)
        setImage(productSelectedEdit.image)
        // setImage(products[typeInd].img[materiais.indexOf(productSelectedEdit.material)])
    },[productSelectedEdit])

    const handleSize = () => {
        //VERIFICA SE O ARRAY 'sizes NÃO ESTÁ VAZIO
        if (sizes.length === 0) {
            console.error("O array de tamanhos está vazio!");
            return;
        }
    
        //OBTÉM O ÍNDICE ATUAL DE 'mySize' NO ARRAY 'sizes
        const currentIndex = sizes.indexOf(mySize);
    
        //SE O ÍNDICE ATUAL FOR INVÁLIDO (-1), DEFINE O PRÓXIMO COMO O PRIMEIRO
        const nextIndex = currentIndex === -1 || currentIndex === sizes.length - 1
            ? 0 //VOLTA PARA O PRIMEIRO ÍNDICE
            : currentIndex + 1;
    
        //ATUALIZA O ESTADO PARA O PRÓXIMO TAMANHO
        setMySize(sizes[nextIndex]);
    };
    
    const handleMaterial = () => {
        //OBTÉM O ÍNDICE ATUAL DA ESCOLHA
        const currentIndex = materiais.indexOf(myMaterial);
    
        //CALCULA O PRÓXIMO ÍNDICE (VOLTA AO INÍCIO SE FOR O ÚLTIMO)
        const nextIndex = (currentIndex + 1) % materiais.length;
    
        //ATUALIZA O ESTADO COM O PRÓXIMO MATERIAL E DEFINE O productID
        setMyMaterial(materiais[nextIndex]);

        //ATUALIZA O PREÇO DO PRODUTO COM BASE NO productID
        setMyPrice(products[typeInd].prices[nextIndex])
        
        //ATUALIZA A IMAGEM DO PRODUTO COM BASE NO productID
        setImage(products[typeInd].img[nextIndex])

        //ATUALIZA O INDICE DO PRODUTO
        setProductID(nextIndex);
    };

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
                setMyEstampa(reader.result as string)
            }
            //LÊ A URL DO ARQUIVO
            reader.readAsDataURL(file)
        }
    }

    // FUNÇÃO RESPONSÁVEL POR DAR UPLOAD NA IMAGEM
    async function handleUpload() {

        //MUDA O ESTADO DA APLICAÇÃO PARA true
        toggleLoading(true)

        //CRIA UMA PROMISSE 
        return new Promise((resolve, reject) => {
            //PEGA O ARQUIVO QUE FOI SELECIONADO
            const file = inputFileRef.current?.files?.[0];
            
            //VERIFICA SE NÃO TEM IMAGEM
            if (!file) {
                //RESOLVE A PROMISSE PASSANDO A IMAGEM COMO PARÂMETRO
                resolve(img);
                
                //MUDA O ESTADO DA APLICAÇÃO PARA false
                toggleLoading(false)

                //ROTA DE ATUALIZAÇÃO DO ITEM DO CARRINHO
                axios.put('https://back-tcc-murilo.onrender.com/update-carrinho', {
                    userId: user.id,
                    itemId: productSelectedEdit.id,
                    novosDados: {
                        id: productSelectedEdit.id,
                        image: products[typeInd].img[productID],
                        material: myMaterial,
                        name: myName,
                        price: myPrice,
                        estampa: myEstampa,
                        quantity: myQuantity,
                        size: mySize,
                    }
                })
                .then(function (response) {
                    //ATUALIZA OS DADOS DOD USUÁRIO
                    toggleUser(user.id, user.name, user.email, user.history, response.data.cart, true)

                    //ATUALIZA O CARRINHO
                    setCart(response.data.cart)

                    //COLOCA ALERT NA TELA
                    notifySucess('item atualizado com sucesso')

                    //SALVA O ITEM A EDITAR NO LOCALSTORAGE DO NAVEGADOR
                    localStorage.setItem('productPUE', JSON.stringify({
                        id: productSelectedEdit.id,
                        image: products[typeInd].img[productID],
                        name: myName,
                        print: myEstampa,
                        size: mySize,
                        material: myMaterial,
                        quantity: myQuantity,
                        price: myPrice,})
                    )

                    //SALVA O ITEM A EDITAR NO FRONTEND DA APLICAÇÃO
                    setProductSelectedEdit({
                        id: productSelectedEdit.id,
                        image: products[typeInd].img[productID],
                        name: myName,
                        print: myEstampa,
                        size: mySize,
                        material: myMaterial,
                        quantity: myQuantity,
                        price: myPrice,
                    })
                })
                .catch(function (error) {
                    console.log(error)
                })
            } else {
                
                //GERA UM ID ALEATÓRIO
                const id = Math.floor(Math.random() * 99999)
                
                const formData = new FormData();
                formData.append('file', file);
                formData.append('upload_preset', 'present'); //presente-unico
                formData.append('cloud_name', 'dgvxpeu0a'); //dgvxpeu0a
                formData.append('folder', 'images/estampas'); // Exemplo de pasta
                formData.append('public_id', String(id)); // Exemplo de public ID
                
                //ROTA DE UPLOAD DE IMAGEM NO CLOUDNARY
                axios.post('https://api.cloudinary.com/v1_1/dgvxpeu0a/image/upload', formData)
                .then(response => {
                    if (response.data.secure_url) {
                        //PEGA A URL FORNECIDA PELO CLOUDNARY
                        const url = response.data.secure_url;

                        //SETA NO localStorage A ESTAMPA DO CLOUDNARY
                        localStorage.setItem('estampa-visu3d', url)

                        //SETA A URL DA IMAGEM
                        setMyEstampa(url);
                                
                        //ESCREVE A URL DA IMAGEM NO CONSOLE
                        console.log('imagem salva: '+ url)

                        //PEGA A URL DA IMAGEM
                        setImg(url);

                        //ATUALIZA A URL DO PRODUTO A SER EDITADO COM A URL DO CLOUDNARY
                        setProductSelectedEdit({
                            id: productSelectedEdit.id,
                            image: productSelectedEdit.image,
                            name: productSelectedEdit.name,
                            print: response.data.secure_url,
                            size: productSelectedEdit.size,
                            material: productSelectedEdit.material,
                            quantity: productSelectedEdit.quantity,
                            price: productSelectedEdit.price,
                        })

                        //ROTA DE ATUALIZAÇÃO DO ITEM DO CARRINHO
                        axios.put('https://back-tcc-murilo.onrender.com/update-carrinho', {
                            userId: user.id,
                            itemId: productSelectedEdit.id,
                            novosDados: {
                                id: productSelectedEdit.id,
                                image:  products[typeInd].img[productID],
                                material: myMaterial,
                                name: myName,
                                price: myPrice,
                                estampa: response.data.secure_url,
                                quantity: myQuantity,
                                size: mySize,
                            }
                        })
                        .then(function (response) {
                            //ATUALIZA OS DADOS DO USUÁRIO
                            toggleUser(user.id, user.name, user.email, user.history, response.data.cart, true)
                            
                            //ATUALIZA O CARRINHO
                            setCart(response.data.cart)

                            //COLOCA ALERT NA TELA
                            notifySucess('item atualizado com sucesso')
                        })
                        .catch(function (error) {
                            console.log(error)
                        })

                        //MUDA O ESTADO DA APLICAÇÃO PARA false
                        toggleLoading(false)

                        //RESOLVE A PROMESSA PASSANDO A IMAGEM COMO PARÂMETRO
                        resolve(url);
                    }
                })
                .catch(error => {
                    //ESCREVE O ERRO NO CONSOLE
                    console.error('Erro ao fazer upload:', error);

                    //REJEITA O ERRO OCORRIDO
                    reject(error)
                });
            }
        });
    }

    //FUNÇÃO RESPONSÁVEL POR MUDAR A QUANTIDADE DO PRODUTO
    function handleQuantity(e:any) {
        //VERIFICA SE A QUANTIDADE DO PRODUTO É MENOR OU IGUAL A 0
        if(Number(e.target.value) <= 0){
            //SETA A QUANTIDADE DE PRODUTO COMO 0
            setMyQuantity(0)
        }else{
            //SETA A QUANTIDADE DE PRODUTO COM BASE NO QUE ELE DIGITA NO INPUT
            setMyQuantity(e.target.value)
        }
    }

    //FUNÇÃO RESPONSÁVEL POR CHAMAR O MODAL
    const notifySucess = (message:string) => toast.success(message);

    return(
        <div className={`overflow-x-hidden`}>
            <div className={`bg-my-white w-screen min-h-screen flex flex-col items-center justify-start overflow-y-scroll overflow-x-hidden mx-auto scrollbar sm:px-0 scrollbar-thumb-my-secondary scrollbar-track-[#efefef]`}>
                <Header />
                <div className={`relative p-3 w-[80%] bg-[#efefef] flex items-center justify-center mt-4 rounded-[12px] max-w-[400px]`}>
                    <Link
                        to={'/model'}
                        className={`absolute top-[-10px] right-[-10px] text-my-white bg-my-secondary rounded-[50%] p-2 text-[20px] border-[1px] hover:bg-my-white border-my-secondary hover:text-my-secondary transition-all duration-[.2s]`}
                    >
                        <FaEye/>
                    </Link>

                    <img src={image} className={`w-full`} />
                </div>
                <p className={`underline text-my-secondary font-bold text-[24px] my-4 max-w-[700px]`}>{myName}</p>
                
                <div className={`w-[80%] flex flex-row justify-between mt-4 max-w-[700px]`}>
                    
                    <label
                        htmlFor="estampa"
                        className={`${productSelectedEdit.name !== 'Camiseta' ? 'w-[100%]' : 'w-[47%]'} bg-my-white p-3 rounded-[8px] flex items-center flex-col relative cursor-pointer`}
                        onMouseEnter={() => toggleHover(true)}
                        onMouseLeave={() => toggleHover(false)}
                    >
                        <p className={`absolute top-0 capitalize font-bold text-my-secondary text-center`}>estampa</p>
                        <div className='relative mt-5 rounded-[8px] overflow-hidden'>
                            <div className={`absolute top-0 left-0 w-full h-full bg-[#efefef] transition-all duration-[650ms] ${isHover == true ? 'opacity-[0]' : 'opacity-[0.7]'} flex items-center justify-center text-[38px] text-my-white`}>
                                <FaRegImage
                                    className={`transition-all duration-[.3s] ${isHover == true ? 'scale-[1.4] rotate-[360deg]' : 'scale-[1.0] rotate-[0deg]'}`}
                                />
                            </div>
                            <img src={myEstampa} alt="" className='min-w-full' />
                        </div>
                    </label>

                    <input ref={inputFileRef} type="file" name="estampa" id="estampa" className={`hidden`} onChange={handleFileIMG} />

                    {productSelectedEdit.name == 'Camiseta' && (
                        <div
                            className={`w-[47%] bg-[#efefef] p-3 items-center justify-center rounded-[8px] flex flex-col max-w-[700px] relative`}
                        >
                            <p className={`absolute top-0 capitalize font-bold text-my-secondary text-center mb-1`}>tamanho</p>
                            <p
                                onClick={() => {
                                    handleSize()
                                }}
                                className={`text-center text-my-secondary text-[34px] uppercase font-bold`}
                            >{mySize}</p>
                        </div>
                    )}
                </div>

                <div
                    className={`w-[80%] flex flex-row bg-[#efefef] p-3 rounded-[6px] mt-3 items-center justify-between font-bold capitalize max-w-[700px]`}
                >
                    <p className={`text-my-secondary font-bold capitalize text-[20px]`}>material</p>
                    <button
                        onClick={() => {
                            handleMaterial()
                        }}
                        className='text-my-primary text-[18px] bg-my-white py-2 w-[130px] rounded-[6px] text-center capitalize cursor-pointer'
                    >{myMaterial}</button>
                </div>
                
                <div className={`w-[80%] flex flex-row bg-[#efefef] p-3 rounded-[6px] mt-3 items-center justify-between font-bold max-w-[700px]`}>
                    <p className={`text-my-secondary font-bold capitalize text-[20px]`}>quantidade</p>
                    <input
                        type='number'
                        value={myQuantity}
                        onChange={handleQuantity}
                        className='text-my-primary text-[18px] text-center bg-my-white border-[1px] border-my-white py-2 w-[130px] focus:outline-none focus:text-my-secondary focus:border-my-secondary'
                    />
                </div>
                
                <div className={`w-[90%] flex flex-row bg-[#efefef] p-4 rounded-[6px] my-6 items-center justify-between font-bold max-w-[700px]`}>
                    <p className={`text-my-secondary font-bold capitalize text-[22px]`}>valor</p>
                    <p className='text-my-primary text-[20px]'>R$ {String(Number(Number(String(myPrice).replace(',', '.')) * Number(myQuantity)).toFixed(2)).replace('.', ',')}</p>
                </div>

                <button
                    onClick={() => {
                        navigate('/principal')
                    }}
                    className={`text-my-white font-bold bg-my-primary uppercase rounded-[8px] mt-2 px-5 py-[14px] w-[90%] border-[1px] border-my-primary flex items-center justify-around cursor-pointer transition-all duration-[.3s] focus:outline-none focus:bg-transparent focus:text-my-primary hover:outline-none hover:bg-transparent hover:text-my-primary
                    `}
                >
                    <p className={`flex-grow-[1]`}>continuar comprando</p>
                </button>
                <button
                    onClick={() => {
                        //CHAMA A FUNÇÃO QUE TROCA A IMAGEM E SALVA NO BD
                        handleUpload()
                    }}
                    className={`text-my-white font-bold bg-my-secondary uppercase rounded-[8px] mt-2 mb-5 py-3 w-[90%] border-[1px] border-my-secondary flex items-center justify-around cursor-pointer transition-all duration-[.3s]
                    focus:outline-none
                    focus:bg-transparent
                    focus:text-my-secondary
                    hover:bg-transparent
                    hover:text-my-secondary
                    `}
                >
                    <p className={`flex-grow-[1]`}>atualizar</p>
                    <FaCheck
                        className={`pr-3 text-[28px]`}
                    />
                </button>
                
                <button
                    onClick={() => {
                        //CHAMA A FUNÇÃO QUE REMOVE O ITEM DO CARRINHO
                        removeItem()
                    }}
                    className={`text-my-white bg-my-red uppercase font-bold py-3 my-2 rounded-[8px] mb-6 w-[90%] focus:outline-none border-[1px] border-my-red flex items-center justify-around cursor-pointer transition-all duration-[.3s]
                    focus:bg-transparent 
                    focus:text-my-red
                    hover:bg-transparent 
                    hover:text-my-red
                    `}
                >
                    <p className={`flex-grow-[1]`}>remover</p>
                    <FaTrashAlt
                        className={`pr-3 text-[28px]`}
                    />
                </button>

                <ModalCart />
                <ModalUser />
                <ModalLogout />
                <LoadingPage />
                <ModalFinishBuy />
            </div>
            <Footer />
        </div>
    )
}