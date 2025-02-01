//IMPORTAÇÃO DAS BIBILIOTECAS NECESSÁRIAS PARA RODAR A APLICAÇÃO
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

//IMPORTAÇÃO DO ESTILO GLOBAL DA PÁGINA
import './index.css'

//IMPORTAÇÃO DO COMPONENTE DE MODAL
import { ToastContainer } from 'react-toastify';

//IMPORTAÇÃO DO ESTILO DA BIBLIOTECA DE MODAL
import 'react-toastify/dist/ReactToastify.css';

//IMPORTAÇÃO DAS PÁGINAS DA APLICAÇÃO
import CustomProduct from './screens/CustomProduct';
import EditProductCart from './screens/EditProductCart';
import Home from './screens/Home';
import Perfil from './screens/Perfil';
import Principal from './screens/Principal';
import Product from './screens/Product';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import Visualization from './screens/Visualization'
import Model3D from './screens/Model3D'

//IMPORTAÇÃP DO PROVEDOR DE ESTADOS GLOBAIS
import { GlobalProvider } from './provider/provider';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GlobalProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<>Erro</>} />
          <Route path="/" element={<Home />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/principal" element={<Principal />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="product/:product" element={<Product />} />
          <Route path="custom/:product" element={<CustomProduct />} />
          <Route path="cart/edit/:product" element={<EditProductCart />} />
          <Route path="/visualization" element={<Visualization />} />
          <Route path="/model" element={<Model3D />} />
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </GlobalProvider>
  </StrictMode>,
)
