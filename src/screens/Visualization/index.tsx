import { Canvas } from '@react-three/fiber';
import { Suspense, useMemo } from 'react';
import { TextureLoader } from 'three';
import { OrbitControls } from '@react-three/drei';

import Scene from '../../components/Scene'

export default function Visualization() {
    // const estampaUrl = "https://www.estampacanecas.com.br/PicEstampas/uploads/1/112/sdxbywl0ydsge67y.jpeg";
    const estampaUrl = "https://up.yimg.com/ib/th?id=OIP.vbRm2t4DjuLrH9ujGNwYaAHaIl&pid=Api&rs=1&c=1&qlt=95&w=97&h=112";
    // const estampaUrl = "https://tse4.mm.bing.net/th?id=OIP.ofJRphPWzZB3C8OAvcRKuAHaHZ&pid=Api&P=0&h=180";

  // Carregar a textura da estampa usando TextureLoader
  const estampa = useMemo(() => new TextureLoader().load(estampaUrl), [estampaUrl]);

  return (
    <div className={`w-full px-10 bg-green-600 min-h-screen flex flex-col items-center justify-center`}>
      <Scene />
      <Suspense fallback={null}>
        <Canvas>
          <ambientLight intensity={0.5} />
          <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
          
          {/* Permitir a rotação do objeto */}
          <OrbitControls />

          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[1, 1, 2, 32]} />
            <meshStandardMaterial map={estampa} />
          </mesh>
        </Canvas>
      </Suspense>
    </div>
  );
}