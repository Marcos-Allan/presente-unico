//IMPORTAÇÃO DA INICIALIZAÇÃO DA APLICAÇÃO E DOS SERVIÇOS DO FIREBASE
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, getRedirectResult, signInWithRedirect, signInWithPopup} from "firebase/auth";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyDxTGRt9-i0eB6o8uqivhxTBToiGtUKxgs",
  authDomain: "presentebd.firebaseapp.com",
  projectId: "presentebd",
  storageBucket: "presentebd.appspot.com",
  messagingSenderId: "567755857350",
  appId: "1:567755857350:web:c648f003fcfb377de4e6c7",
  measurementId: "G-WFFTBDDJZS"
};

//INICIA A APLICAÇÃO DO FIREBASE
const app = initializeApp(firebaseConfig);

//INICIA O SERVIÇO DE AUTENTICAÇÃO DO FIREBASE
const auth = getAuth(app);

//INICIA O PROVEDOR DO GOOGLE
const provider = new GoogleAuthProvider();

//INICIA O LOCAL DE SALVAMENTO
const storage = getStorage(app)

//EXPORTA AS FUNÇÕES CRIADAS ACIMA
export { signInWithRedirect, auth, provider, getRedirectResult, GoogleAuthProvider, storage, signInWithPopup }