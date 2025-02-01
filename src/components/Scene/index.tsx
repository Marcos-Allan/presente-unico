// import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
// import { Canvas } from '@react-three/fiber'
// import { Suspense } from 'react'
// import { RepeatWrapping } from 'three'
// import { useEffect } from 'react'
// import { MeshStandardMaterial } from 'three'

// const Model = () => {
//     const { scene } = useGLTF('/mug.glb') // Carrega o modelo
//     const texture = useTexture('https://up.yimg.com/ib/th?id=OIP.vbRm2t4DjuLrH9ujGNwYaAHaIl&pid=Api&rs=1&c=1&qlt=95&w=97&h=112')
//     // const texture2 = useTexture('https://tse4.mm.bing.net/th?id=OIP.ofJRphPWzZB3C8OAvcRKuAHaHZ&pid=Api&P=0&h=180')
//     const texture2 = useTexture('https://up.yimg.com/ib/th?id=OIP.SsaJxUmbEkEG-QFqbpNWlAHaKe&pid=Api&rs=1&c=1&qlt=95&w=81&h=115')
  
//     useEffect(() => {
//         console.log(scene)
//         texture.wrapS = texture.wrapT = RepeatWrapping
//         texture.wrapT = RepeatWrapping
//         texture.repeat.set(1, 1)// Aumenta ou diminui a repetição da textura
//         texture.offset.set(0, 0)

//         scene.traverse((obj:any) => {
//           if (obj.isMesh) {
//             obj.material = new MeshStandardMaterial({
//               map: texture2,
//               roughness: 0.1, // Ajuste de brilho
//             })
//           }
//         })
//       }, [scene, texture])
  
//     return <primitive object={scene} position={[0, -1, 0]} scale={4} />
//   }

// const Scene = () => {
//   return (
//     <Canvas
//         style={{ width: '100vw', height: '40vh', backgroundColor: '#FF0000' }}
//         // camera={{ position: [0, 1, 5], fov: 50 }}
//         camera={{ fov: 90, position: [0, 3, 8] }}
//     >
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[2, 2, 2]} />
//       <Suspense fallback={null}>
//         <Model />
//       </Suspense>
//       <OrbitControls />
//     </Canvas>
//   )
// }

// export default Scene

// const { scene } = useGLTF('/mug.glb') // Carrega o modelo
// const texture = useTexture('https://up.yimg.com/ib/th?id=OIP.vbRm2t4DjuLrH9ujGNwYaAHaIl&pid=Api&rs=1&c=1&qlt=95&w=97&h=112')
// const texture2 = useTexture('https://up.yimg.com/ib/th?id=OIP.SsaJxUmbEkEG-QFqbpNWlAHaKe&pid=Api&rs=1&c=1&qlt=95&w=81&h=115')

// src/components/Scene.tsx
import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

const Mug: React.FC<{
  decalqueUrl: string;
  decalX: number;
  decalY: number;
  decalWidth: number;
  decalHeight: number;
  repeatDecal: boolean; // Nova propriedade para habilitar/desabilitar a repetição do decalque
}> = ({ decalqueUrl, decalX, decalY, decalWidth, decalHeight, repeatDecal }) => {
  const { scene } = useGLTF('/mug.glb'); // Carrega o modelo
  const texture = useTexture(decalqueUrl); // Carrega a textura do decalque

  texture.encoding = THREE.sRGBEncoding;
  texture.anisotropy = 16;

  // Aplica o deslocamento e o tamanho da textura
  texture.offset.set(decalX, decalY);

  // Define a repetição, dependendo do estado repeatDecal
  if (repeatDecal) {
    texture.repeat.set(decalWidth, decalHeight); // Organiza o tamanho do decalque
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  } else {
    texture.repeat.set(1, 1); // Não repete o decalque
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      (child as THREE.Mesh).material.map = texture;
      (child as THREE.Mesh).material.needsUpdate = true;
    }
  });

  return <primitive object={scene} scale={[10, 10, 10]} position={[0, -4, 0]} />;
};

const ThreeDModel: React.FC = () => {
  const [decalqueUrl, setDecalqueUrl] = useState<string>(
    'https://up.yimg.com/ib/th?id=OIP.MTTN0KUW5YG9GZlf5wY7JwHaHa&pid=Api&rs=1&c=1&qlt=95&w=124&h=124'
  );
  const [decalX, setDecalX] = useState(0); // Controle horizontal
  const [decalY, setDecalY] = useState(0); // Controle vertical
  const [decalWidth, setDecalWidth] = useState(1); // Controle de tamanho horizontal do decalque
  const [decalHeight, setDecalHeight] = useState(1); // Controle de tamanho vertical do decalque
  const [decalWidthInput, setDecalWidthInput] = useState(1); // Input para controle de largura
  const [decalHeightInput, setDecalHeightInput] = useState(1); // Input para controle de altura
  const [repeatDecal, setRepeatDecal] = useState(false); // Controle para habilitar/desabilitar a repetição

  // Atualiza o tamanho do decalque
  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecalWidth(parseFloat(e.target.value));
    setDecalWidthInput(parseFloat(e.target.value));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecalHeight(parseFloat(e.target.value));
    setDecalHeightInput(parseFloat(e.target.value));
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/* Input da URL */}
      <input
        type="text"
        placeholder="Insira a URL do decalque"
        value={decalqueUrl}
        onChange={(e) => setDecalqueUrl(e.target.value)}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, padding: '5px', width: '300px' }}
      />

      {/* Sliders para posição do decalque */}
      <div style={{ position: 'absolute', top: 50, left: 10, zIndex: 10, background: '#fff', padding: '10px' }}>
        <label>Posição X: {decalX.toFixed(2)}</label>
        <input type="range" min="-5" max="4" step="0.01" value={decalX} onChange={(e) => setDecalX(parseFloat(e.target.value))} />

        <label>Posição Y: {decalY.toFixed(2)}</label>
        <input type="range" min="-5" max="4" step="0.01" value={decalY} onChange={(e) => setDecalY(parseFloat(e.target.value))} />

        <label>Tamanho do Decalque (X): {decalWidth.toFixed(2)}</label>
        <input
          type="range"
          min="-4"
          max="5"
          step="0.01"
          value={decalWidth}
          onChange={handleWidthChange}
        />
        <input
          type="number"
          value={decalWidthInput}
          onChange={handleWidthChange}
          style={{ marginLeft: '5px', width: '60px' }}
        />

        <label>Tamanho do Decalque (Y): {decalHeight.toFixed(2)}</label>
        <input
          type="range"
          min="-4"
          max="5"
          step="0.01"
          value={decalHeight}
          onChange={handleHeightChange}
        />
        <input
          type="number"
          value={decalHeightInput}
          onChange={handleHeightChange}
          style={{ marginLeft: '5px', width: '60px' }}
        />

        {/* Checkbox para repetição do decalque */}
        <label>
          Repetir decalque
          <input
            type="checkbox"
            checked={repeatDecal}
            onChange={() => setRepeatDecal(!repeatDecal)}
            style={{ marginLeft: '10px' }}
          />
        </label>
      </div>

      {/* Cena 3D */}
      <Canvas camera={{ position: [0, 6, 15], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Mug
          decalqueUrl={decalqueUrl}
          decalX={decalX}
          decalY={decalY}
          decalWidth={decalWidth}
          decalHeight={decalHeight}
          repeatDecal={repeatDecal} // Passa a propriedade para o Mug
        />
        <OrbitControls enableDamping={true} />
      </Canvas>
    </div>
  );
};

export default ThreeDModel;
