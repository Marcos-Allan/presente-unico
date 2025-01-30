import { OrbitControls, useGLTF, useTexture } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'
import { RepeatWrapping } from 'three'
import { useEffect } from 'react'
import { MeshStandardMaterial } from 'three'

const Model = () => {
    const { scene } = useGLTF('/caneca.glb') // Carrega o modelo
    const texture = useTexture('https://up.yimg.com/ib/th?id=OIP.vbRm2t4DjuLrH9ujGNwYaAHaIl&pid=Api&rs=1&c=1&qlt=95&w=97&h=112')
    const texture2 = useTexture('https://tse4.mm.bing.net/th?id=OIP.ofJRphPWzZB3C8OAvcRKuAHaHZ&pid=Api&P=0&h=180')
  
    useEffect(() => {
        console.log(scene)
        texture.wrapS = texture.wrapT = RepeatWrapping
        texture.wrapT = RepeatWrapping
        texture.repeat.set(3, 3)// Aumenta ou diminui a repetição da textura
        texture.offset.set(0, 0)

        scene.traverse((obj:any) => {
          if (obj.isMesh) {
            obj.material = new MeshStandardMaterial({
              map: texture2,
              roughness: 0.1, // Ajuste de brilho
            })
          }

          if (obj.isMesh && obj.name === 'caneca_verde') {
            obj.material.map = texture
          }
          if (obj.isMesh && obj.name === 'caneca_azul') {
            obj.material.map = texture
          }
          if (obj.isMesh && obj.name === 'caneca_amarela') {
            obj.material.map = texture
          }
        })
      }, [scene, texture])
  
    return <primitive object={scene} position={[0, -1, 0]} scale={1} />
  }

const Scene = () => {
  return (
    <Canvas
        style={{ width: '100vw', height: '40vh', backgroundColor: '#FF0000' }}
        // camera={{ position: [0, 1, 5], fov: 50 }}
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
