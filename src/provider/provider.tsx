//IMPORTAÇÃO DAS BIBLIOTECAS
import { useState } from "react";

//IMPORTAÇÃO DOS CONTEXTOS
import { GlobalContext } from "./context";

export const GlobalProvider = ({ children }: { children: React.ReactNode }) => {
    //RESGATA O VALOR DO LOCALSTORAGE
    const userLS = localStorage.getItem('userculturalPassport')

    //UTILIZAÇÃO DO HOOK useState
    const [user, setUser] = useState<any>(
        {
            id: userLS !== null ? JSON.parse(userLS).id : 0,
            name: userLS !== null ? JSON.parse(userLS).name : "MA",
            email: userLS !== null ? JSON.parse(userLS).email : "allanmenezes880@gmail.com",
            history: userLS !== null ? JSON.parse(userLS).history : [
                { data: '9/10/2024', name: 'Caneca Porcelana', img: 'undefined', price: 19.90, quantity: 2, estampa: '', },
                { data: '24/08/2024', name: 'Caneca Mágica', img: 'undefined', price: 24.75, quantity: 4, estampa: '', }
            ],
            logged: userLS !== null ? JSON.parse(userLS).logged : false,
        }
    );
    const [openCart, setOpenCart] = useState<boolean>(false)
    const [openPerfil, setOpenPerfil] = useState<boolean>(false)

    const [productSelected, setProductSelected] = useState<any>(localStorage.getItem('productPU') !== null
        ? JSON.parse(localStorage.getItem('productPU') as any)
        : { image: 'undefined', name:'undefined', price:'undefined', materials:['n', 'p'] })

    const [productSelectedEdit, setProductSelectedEdit] = useState<any>({ image: 'undefined', name:'undefined', price:'undefined', materials:['n', 'p']  })
    const [cart, setCart] = useState<any[]>(userLS !== null
        ? JSON.parse(userLS).cart
        : []
    );
    const [loading, setLoading] = useState<boolean>(false);
    const [logoutModal, setLogoutModal] = useState<boolean>(false);
    const [finishBuy, setFinishBuy] = useState<boolean>(false);

    //FUNÇÃO RESPONSÁVEL POR ATUALIZAR OS ITENS DO PRODUTO SELECIONADO
    function toggleProduct(product:any) {
        localStorage.setItem('productPU', JSON.stringify(product))
        setProductSelected(product)
    }

    //FUNÇÃO RESPONSÁVEL POR ADICIONAR NOVO ITEM NO CARRINHO
    function addToCart(newItem: any) {
        //RETORNA true SE O ITEM ESTIVR NO CARRINHO E false SE NÃO ESTIVER
        const existingItem = cart.find((item: any) => item.id === newItem.id);

        //VERIFICA SE O ITEM JA ESTÁ NO CARRINHO OU NÃO
        if (existingItem) {
            //ADICIONA MAIS NA QUANTIDADE DO PRODUTO
            setCart(
                cart.map((item: any) =>
                    item.id === newItem.id
                    ? { ...item, quantity: item.quantity + newItem.quantity }
                    : item
                )
            );
        }else {
            //COLOCA O ITEM NO CARRINHO MAIS NA QUANTIDADE DO PRODUTO
            setCart([...cart, { ...newItem, quantity: newItem.quantity }]);

            //SALVA OS DADOS DO USUÁRIO NO localStorage
            localStorage.setItem('userculturalPassport', JSON.stringify({ id: user.id, name: user.name, email: user.email, history: user.history, cart: [...cart, { ...newItem, quantity: newItem.quantity }], logged: true }))
        }
    }

    //FUNÇÃO RESPONSÁVEL POR MUDAR O ESTADO DE CARREGAMENTO DA PÁGINA
    function toggleLoading(state:boolean) {
        setLoading(state)
    }

    //FUNÇÃO RESPONSÁVEL POR ATUALIZAR OS DADOS DO USUÁRIO
    function toggleUser(id:any, name:string, email:string, history:any, cart:any, logged:boolean) {
        //SALVA OS DADOS DO USUÁRIO NO localStorage
        localStorage.setItem('userculturalPassport', JSON.stringify({ id: id, name: name, email: email, history: history, cart: cart, logged: logged }))
        
        //SALVA OS DADOS NO FRONTEND DA APLICAÇÃO
        setUser({ id: id, name: name, email: email, history: history, logged: logged })

        //PEGA O CARRINHO DO USUÁRIO
        setCart(cart)
    }

    //FUNÇÃO RESPONSÁVEL POR COLOCAR O MODAL NA TELA
    function toggleLogoutUser() {
        //SALVA OS DADOS DO USUÁRIO NO localStorage
        localStorage.removeItem('userculturalPassport')
        
        //SALVA OS DADOS NO FRONTEND DA APLICAÇÃO
        setUser({ id: 0, name: "MA", email: "allanmenezes880@gmail.com", logged: false, history: [
            { data: '9/10/2024', name: 'Caneca Porcelana', img: 'undefined', price: 19.90, quantity: 2, estampa: '', },
            { data: '24/08/2024', name: 'Caneca Mágica', img: 'undefined', price: 24.75, quantity: 4, estampa: '', },
        ] })

        setCart([])
    }

    //FUNÇÃO RESPONSÁVEL POR ATUALIZAR O CARRRINHO NO FRONTEND
    const updateItemsCart = (id:any, novosDados:any) => {
        //PERCORRE O ARRAY DO CARRINHO
        setCart(prevCart =>
            prevCart.map(item =>
                //VERIFICA SE O ID DO PRODUTO QUE VAI SER ATUALIZADO É IGUAL AO ID DO PRODUTO E ATUALIZA ELE
                item.id === id ? { ...item, ...novosDados } : item
            )
        );
    };

    //FUNÇÃO RESPONSÁVEL POR ATIVAR O MODAL DE FINALIZAR COMPRA
    function toggleFinishBuy() {
        setFinishBuy(!finishBuy)
    }

    return (
        <GlobalContext.Provider value={{ user, setUser, openCart, setOpenCart, openPerfil, setOpenPerfil, productSelected, setProductSelected, toggleProduct, cart, setCart, addToCart, loading, toggleLoading, toggleUser, logoutModal, setLogoutModal, toggleLogoutUser, productSelectedEdit, setProductSelectedEdit, updateItemsCart, finishBuy, toggleFinishBuy } as any}>
            {children}
        </GlobalContext.Provider>
    );
};
