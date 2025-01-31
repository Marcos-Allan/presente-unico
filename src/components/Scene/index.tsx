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

import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect } from 'react'
import { RepeatWrapping, MeshStandardMaterial } from 'three'
// Importando DecalGeometry corretamente
import { DecalGeometry } from 'three-stdlib';
import * as THREE from 'three';

const Model = () => {
  const { scene } = useGLTF('/mug.glb') // Carrega o modelo
  const texture = useTexture('https://up.yimg.com/ib/th?id=OIP.vbRm2t4DjuLrH9ujGNwYaAHaIl&pid=Api&rs=1&c=1&qlt=95&w=97&h=112')
  const texture2 = useTexture('https://up.yimg.com/ib/th?id=OIP.SsaJxUmbEkEG-QFqbpNWlAHaKe&pid=Api&rs=1&c=1&qlt=95&w=81&h=115')

  useEffect(() => {
    console.log(scene)

    // Define o decalque
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(1, 1) // Ajusta a repetição da textura
    texture.offset.set(0, 0)

    // Aqui vamos percorrer os meshes e aplicar o decalque
    scene.traverse((obj: any) => {
      if (obj.isMesh) {
        // Definir a textura para o modelo
        obj.material = new MeshStandardMaterial({
          map: texture2,
          roughness: 0.1,
        })
        
        // Criar o decalque
        const decalGeometry = new DecalGeometry(obj, new THREE.Vector3(0, 0, 0), new THREE.Euler(0, 0, 0), new THREE.Vector3(1, 1, 1))
        
        const decalMaterial = new MeshStandardMaterial({
          map: texture,
          transparent: true,
        })
        
        const decal = new THREE.Mesh(decalGeometry, decalMaterial)
        obj.add(decal) // Adiciona o decalque no modelo
      }
    })
  }, [scene, texture, texture2])

  return <primitive object={scene} position={[0, -1, 0]} scale={4} />
}

const Scene = () => {
  return (
    <Canvas
      style={{ width: '100vw', height: '40vh', backgroundColor: '#FF0000' }}
      camera={{ fov: 90, position: [0, 3, 8] }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[2, 2, 2]} />
      <Suspense fallback={null}>
        <Model />
      </Suspense>
      <OrbitControls />
    </Canvas>
  )
}

export default Scene