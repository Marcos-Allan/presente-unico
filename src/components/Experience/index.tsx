//IMPORTAÇÃO DAS BIBLIOTECAS
import {
    ContactShadows,
    Environment,
    Float,
    OrbitControls,
  } from "@react-three/drei";

  //IMPORTAÇÃO DOS COMPONENTES
  import { Mug } from "../Mug/";
  // import { MugC } from "../Mug-c/";
  
  export const Experience = () => {
    return (
      <>
        <OrbitControls />
        <Float>
          <Mug />
          {/* <MugC /> */}
        </Float>
        <ContactShadows position-y={-0.5} opacity={0.4} blur={2} />
        <Environment preset="sunset" background blur={4} />
      </>
    );
  };