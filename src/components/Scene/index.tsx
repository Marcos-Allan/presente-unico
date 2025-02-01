import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF, useTexture } from '@react-three/drei';
import * as THREE from 'three';

//TIPAGEM DAS PROPS DO COMPONENTE
interface MugProps {
  decalqueUrl: string;
  decalX: number;
  decalY: number;
  decalWidth: number;
  decalHeight: number;
  repeatDecal: boolean;
}

//OBJETO 3D
const Mug: React.FC<MugProps> = ({ decalqueUrl, decalX, decalY, decalWidth, decalHeight, repeatDecal }) => {
  const { scene } = useGLTF('/mug.glb');
  const texture = useTexture(decalqueUrl);

  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 16;

  texture.offset.set(decalX, decalY);

  if (repeatDecal) {
    texture.repeat.set(decalWidth, decalHeight);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
  } else {
    texture.repeat.set(1, 1);
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
  }

  scene.traverse((child) => {
    if ((child as THREE.Mesh).isMesh) {
      const material = (child as THREE.Mesh).material;
      if (!Array.isArray(material) && material instanceof THREE.MeshStandardMaterial) {
        material.map = texture;
        material.needsUpdate = true;
      }
    }
  });

  // Criando o quadrado (decodificado) no qual a imagem será aplicada
  const planeGeometry = new THREE.PlaneGeometry(decalWidth, decalHeight);
  const planeMaterial = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 1,
    side: THREE.DoubleSide,
  });

  const decalMesh = new THREE.Mesh(planeGeometry, planeMaterial);
  decalMesh.position.set(decalX, decalY, 0); // ajusta a posição do quadrado conforme o decalque

  scene.add(decalMesh); // Adiciona o quadrado com decalque ao objeto

  return <primitive object={scene} scale={[10, 10, 10]} position={[0, -4, 0]} />;
};

const Scene: React.FC = () => {
  const [decalqueUrl, setDecalqueUrl] = useState<string>(
    'https://up.yimg.com/ib/th?id=OIP.MTTN0KUW5YG9GZlf5wY7JwHaHa&pid=Api&rs=1&c=1&qlt=95&w=124&h=124'
  );
  const [decalX, setDecalX] = useState(0);
  const [decalY, setDecalY] = useState(0);
  const [decalWidth, setDecalWidth] = useState(1);
  const [decalHeight, setDecalHeight] = useState(1);
  const [decalWidthInput, setDecalWidthInput] = useState(1);
  const [decalHeightInput, setDecalHeightInput] = useState(1);
  const [repeatDecal, setRepeatDecal] = useState(false);

  const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecalWidth(parseFloat(e.target.value));
    setDecalWidthInput(parseFloat(e.target.value));
  };

  const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecalHeight(parseFloat(e.target.value));
    setDecalHeightInput(parseFloat(e.target.value));
  };

  const handleXChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecalX(parseFloat(e.target.value));
  };

  const handleYChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDecalY(parseFloat(e.target.value));
  };

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <input
        type="text"
        placeholder="Insira a URL do decalque"
        value={decalqueUrl}
        onChange={(e) => setDecalqueUrl(e.target.value)}
        style={{ position: 'absolute', top: 10, left: 10, zIndex: 10, padding: '5px', width: '300px' }}
      />
      <div style={{ position: 'absolute', top: 50, left: 10, zIndex: 10, background: '#fff', padding: '10px' }}>
        <label>Posição X: {decalX.toFixed(2)}</label>
        <input type="range" min="-5" max="5" step="0.01" value={decalX} onChange={handleXChange} />

        <label>Posição Y: {decalY.toFixed(2)}</label>
        <input type="range" min="-5" max="5" step="0.01" value={decalY} onChange={handleYChange} />

        <label>Tamanho do Decalque (X): {decalWidth.toFixed(2)}</label>
        <input type="range" min="0.1" max="5" step="0.01" value={decalWidth} onChange={handleWidthChange} />
        <input type="number" value={decalWidthInput} onChange={handleWidthChange} style={{ marginLeft: '5px', width: '60px' }} />

        <label>Tamanho do Decalque (Y): {decalHeight.toFixed(2)}</label>
        <input type="range" min="0.1" max="5" step="0.01" value={decalHeight} onChange={handleHeightChange} />
        <input type="number" value={decalHeightInput} onChange={handleHeightChange} style={{ marginLeft: '5px', width: '60px' }} />

        <label>
          Repetir decalque
          <input type="checkbox" checked={repeatDecal} onChange={() => setRepeatDecal(!repeatDecal)} style={{ marginLeft: '10px' }} />
        </label>
      </div>
      <Canvas camera={{ position: [0, 6, 15], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[5, 5, 5]} intensity={1.5} />
        <Mug
          decalqueUrl={decalqueUrl}
          decalX={decalX}
          decalY={decalY}
          decalWidth={decalWidth}
          decalHeight={decalHeight}
          repeatDecal={repeatDecal}
        />
        <OrbitControls enableDamping={true} />
      </Canvas>
    </div>
  );
};

export default Scene;
